/*************************************************************************
 *************************************************************************
 **
 ** File:         get_qt_ui_xml.sql
 ** Project:      Muse Systems Super Characteristics for xTuple ERP
 ** Author:       Steven C. Buttgereit
 **
 ** (C) 2017-2018 Lima Buttgereit Holdings LLC d/b/a Muse Systems
 **
 ** Contact:
 ** muse.information@musesystems.com  :: https://muse.systems
 **
 ** License: MIT License. See LICENSE.md for complete licensing details.
 **
 *************************************************************************
 ************************************************************************/

--
-- Generates a Qt UI XML document based on the Group Layout Items for the
-- given layout structure.
--

CREATE OR REPLACE FUNCTION musesuperchar.get_qt_ui_xml(pStructure jsonb)
    RETURNS xml AS
        $BODY$
            DECLARE
                vCfgPfx text := musextputils.get_musemetric('musesuperchar','widgetPrefix',null::text);
                vObjPfx text := vCfgPfx||'_'||(pStructure #>> '{group, scgrp_internal_name}');
                vIsRowExp boolean := coalesce((pStructure #>> '{group, scgrp_is_row_expansion_allowed}')::boolean, true);
                vHSizePol text;
                vGroupsRows xml[] := '{}'::xml[]; -- an array of rows
                vCurrRow jsonb;
                vSections xml[] := '{}'::xml[]; -- an array of sections for one row
                vCurrSection jsonb;
                vColumns xml[] := '{}'::xml[]; -- an array of columns for one section
                vCurrColumn jsonb;
                vFields xml[] := '{}'::xml[]; -- an array of fields for one column
                vCurrField jsonb;
                vCurrfieldWidget xml[];
                vReturnVal xml;
                vTabOrder text[] := '{}'::text[];
                vCustomWidgets xml[] := '{}'::xml[];
                vScDefIntName text;

            BEGIN
                IF vIsRowExp THEN
                    vHSizePol := 'MinimumExpanding';
                ELSE
                    vHSizePol := 'Maximum';
                END IF;

                <<row>>
                FOR vCurrRow IN SELECT jsonb_array_elements(pStructure #> '{group, group_rows}') LOOP
                    vSections := '{}'::xml[];
                    <<section>>
                    FOR vCurrSection IN SELECT jsonb_array_elements(vCurrRow -> 'row_sections') LOOP
                        vColumns := '{}'::xml[];
                        <<column>>
                        FOR vCurrColumn IN SELECT jsonb_array_elements(vCurrSection -> 'section_columns') LOOP
                            vFields := '{}'::xml[];
                            <<field>>
                            FOR vCurrField IN SELECT jsonb_array_elements(vCurrColumn -> 'column_fields') LOOP
                                IF (vCurrField ->> 'datatype_internal_name') IN ('emptyspace', 'horizontalline') THEN
                                    vScDefIntName := (vCurrField ->> 'scdef_internal_name') || coalesce(array_length(vFields, 1),0) + 1;
                                ELSE
                                    vScDefIntName :=  (vCurrField ->> 'scdef_internal_name');
                                END IF;
                                vCurrfieldWidget := musesuperchar.get_qt_ui_widget_for_datatype(
                                                        vObjPfx,
                                                        vScDefIntName,
                                                        vCurrField ->> 'datatype_internal_name',
                                                        (vCurrField ->> 'scdef_scgrp_ass_height')::integer,
                                                        (vCurrField ->> 'scdef_scgrp_ass_width')::integer,
                                                        (vCurrField ->> 'scdef_scgrp_ass_max_height')::integer,
                                                        (vCurrField ->> 'scdef_scgrp_ass_max_width')::integer,
                                                        (vCurrField ->> 'scdef_is_display_only')::boolean);
                                vTabOrder := vTabOrder ||
                                    (xpath('string(/widget/@name)',
                                        vCurrfieldWidget[1]))[1]::text;
                                -- This is a bit of a hack, but should work
                                -- since we're controlling generation in this
                                -- process.
                                IF vCurrfieldWidget[2] IS NOT NULL
                                    AND array_position(vCustomWidgets::text[],
                                    vCurrfieldWidget[2]::text) IS NULL THEN
                                    vCustomWidgets := vCustomWidgets ||
                                        vCurrfieldWidget[2];
                                END IF;

                                vFields := vFields ||
                                    xmlconcat(
                                        xmlelement(name item,xmlattributes('0' as column, vCurrField ->> 'column_row_number' as row),
                                            xmlelement(name widget, xmlattributes('XLabel' as class, vObjPfx||'_'||vScDefIntName||'_xlabel' as name),
                                                xmlelement(name property,xmlattributes('text' AS name),
                                                    xmlelement(name string,(vCurrField->>'scdef_display_name'))))),
                                        xmlelement(name item,xmlattributes('1' as column, vCurrField ->> 'column_row_number' AS row),
                                            vCurrfieldWidget[1]));
                            END LOOP field;
                            vColumns := vColumns ||
                                xmlelement(name layout, xmlattributes('QFormLayout' as class, vObjPfx||'_'||(vCurrColumn ->> 'column_internal_name')||'_qformlayout' as name),
                                    (SELECT xmlagg(q) FROM unnest(vFields) q));
                        END LOOP column;
                        vSections := vSections ||
                            xmlelement(name widget, xmlattributes('QGroupBox' as class, vObjPfx||'_'||(vCurrSection ->> 'section_internal_name')||'_qgroupbox' as name),
                                xmlelement(name property, xmlattributes('sizePolicy' as name),
                                    xmlelement(name sizepolicy,xmlattributes(vHSizePol as hsizetype, 'MinimumExpanding' as vsizetype),
                                        xmlelement(name horstretch, '0'),
                                        xmlelement(name verstretch, '0'))),
                                xmlelement(name property, xmlattributes('title' as name),
                                    xmlelement(name string, vCurrSection ->> 'section_display_name')),
                                CASE WHEN array_length(vColumns,1) > 1 THEN
                                        xmlelement(name layout, xmlattributes('QHBoxLayout' as class, vObjPfx||'_'||(vCurrSection->>'section_internal_name')||'_qhboxlayout' AS name),
                                            (SELECT xmlagg(xmlelement(name item,q)) FROM unnest(vColumns) q))
                                     WHEN array_length(vColumns,1) = 1 THEN
                                        vColumns[1]
                                    ELSE
                                        null
                                END);
                    END LOOP section;
                    vGroupsRows := vGroupsRows ||
                        CASE WHEN array_length(vSections,1) > 1 AND NOT vIsRowExp THEN
                                xmlelement(name layout, xmlattributes('QHBoxLayout' as class, vObjPfx||'_'||(vCurrRow->>'row_internal_name')||'_qhboxlayout' AS name),
                                    (SELECT xmlagg(xmlelement(name item,q)) FROM unnest(vSections) q),
                                    xmlelement(name item,
                                        xmlelement(name spacer, xmlattributes(vObjPfx||'_'||(vCurrRow->>'row_internal_name')||'_rightspacer' AS name),
                                            xmlelement(name property, xmlattributes('orientation' AS name),
                                                xmlelement(name enum, null, 'Qt::Horizontal')),
                                            xmlelement(name property, xmlattributes('sizeHint' AS name, '0' AS stdset),
                                                xmlelement(name size,null,
                                                    xmlelement(name width, null, '0'),
                                                    xmlelement(name height, null, '20'))))))
                            WHEN array_length(vSections,1) > 1 AND vIsRowExp THEN
                                xmlelement(name layout, xmlattributes('QHBoxLayout' as class, vObjPfx||'_'||(vCurrRow->>'row_internal_name')||'_qhboxlayout' AS name),
                                    (SELECT xmlagg(xmlelement(name item,q)) FROM unnest(vSections) q))
                            WHEN array_length(vSections,1) = 1 THEN
                                vSections[1]
                            ELSE
                                null
                        END;
                END LOOP row;

                SELECT
                    xmlelement(name ui, xmlattributes('4.0' AS version),
                        xmlelement(name comment, 'Super Characteristic Group Form: '||(pStructure #>> '{group,scgrp_display_name}')||' updated on '|| now()),
                        xmlelement(name class, vObjPfx),
                        xmlelement(name widget, xmlattributes('QWidget' AS class, vObjPfx AS name),
                            xmlelement(name property, xmlattributes('windowTitle' AS name),
                                xmlelement(name string, pStructure #>> '{group,scgrp_display_name}')),
                            xmlelement(name layout,xmlattributes('QVBoxLayout' AS class, vObjPfx||'_'||(pStructure #>> '{group, scgrp_internal_name}') ||'_vboxlayout' AS name),
                                (SELECT xmlagg(xmlelement(name item,q)) FROM unnest(vGroupsRows) q))),
                        xmlelement(name customwidgets,
                            (SELECT xmlagg(q) FROM unnest(vCustomWidgets) q)),
                        xmlelement(name tabstops,
                            (SELECT xmlagg(xmlelement(name tabstop, q)) FROM unnest(vTabOrder) q)))
                    INTO vReturnVal;

                RETURN vReturnVal;
            END;
        $BODY$
    LANGUAGE plpgsql STABLE;

ALTER FUNCTION musesuperchar.get_qt_ui_xml(pStructure jsonb)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_qt_ui_xml(pStructure jsonb) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_ui_xml(pStructure jsonb) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_ui_xml(pStructure jsonb) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_qt_ui_xml(pStructure jsonb)
    IS $DOC$Generates a Qt UI XML document based on the Group Layout Items for the layout structure.$DOC$;
