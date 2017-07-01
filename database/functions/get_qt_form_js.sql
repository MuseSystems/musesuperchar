/*************************************************************************
 *************************************************************************
 **
 ** File:         get_qt_form_js.sql
 ** Project:      Muse Systems Super Characteristics for xTuple ERP
 ** Author:       Steven C. Buttgereit
 **
 ** (C) 2017 Lima Buttgereit Holdings LLC d/b/a Muse Systems
 **
 ** Contact:
 ** muse.information@musesystems.com  :: https://muse.systems
 ** 
 ** License: MIT License. See LICENSE.md for complete licensing details.
 **
 *************************************************************************
 ************************************************************************/

--
-- Returns the Qt JavaScript for managing a group user interface form.
--

CREATE OR REPLACE FUNCTION musesuperchar.get_qt_form_js(pGroupId bigint, pQtUiXml xml) 
    RETURNS text AS
        $BODY$
            DECLARE
                vCfgPfx text := musextputils.get_musemetric('musesuperchar','widgetPrefix',null::text);
                vScGrp musesuperchar.scgrp;
                vFormName text;
                vCurrScDefIntName text;
                vCurrScDefDataType text;
                vScDefTypeList text := ''::text;
                vSections jsonb;
                vCurrSection text;
                vSecList text := ''::text;
                vWidgets jsonb;
                vCurrWidget text;
                vWidgetList text := ''::text;
                vLabels jsonb;
                vCurrLabel text;
                vLabelList text := ''::text;
                vGuiManipList text := ''::text;
                vConnectList text := ''::text;
                vLovQueryStr text;
            BEGIN

                SELECT * INTO vScGrp
                FROM musesuperchar.scgrp
                WHERE scgrp_id = pGroupId;

                IF vScGrp IS NULL THEN
                    RAISE EXCEPTION 'We require a valid Group ID in order to generate its backing JS.  (FUNC: musesuperchar.get_qt_form_js)(pGroupId: %)',pGroupId;
                END IF;

                -- Get form name
                vFormName := replace(
                    initcap(
                        replace(
                            vScGrp.scgrp_internal_name, '_', ' ')), ' ', '');

                vSections := musesuperchar.get_qt_groupboxes_from_ui_xml(
                    pQtUiXml);
                vWidgets := musesuperchar.get_qt_widgets_from_ui_xml(
                    pQtUiXml);
                vLabels := musesuperchar.get_qt_labels_from_ui_xml(
                    pQtUiXml);
                
                -- Build sections text
                FOR vCurrSection IN SELECT jsonb_object_keys(vSections) LOOP
                    vSecList := vSecList || 
                        ('            "' ||
                            substring(vCurrSection ,E'^'||vCfgPfx||E'_(.+)_qgroupbox$') ||
                            '": mywindow.findChild("' || vCurrSection || E'"),\n');
                END LOOP;


                -- Now loop through the group's super chars and build the 
                -- type map, widgets and labels lists.
                <<superchar>>
                FOR vCurrScDefIntName, vCurrScDefDataType IN
                    SELECT   scdef_internal_name ,datatype_internal_name
                    FROM    musesuperchar.scdef_scgrp_ass ssa
                        JOIN musesuperchar.scdef sd 
                            ON ssa.scdef_scgrp_ass_scdef_id = sd.scdef_id 
                        JOIN musesuperchar.datatype dt
                            ON sd.scdef_datatype_id = dt.datatype_id
                    WHERE ssa.scdef_scgrp_ass_scgrp_id = pGroupId
                LOOP
                    -- We assume that every SC in the group actually is part of
                    -- the UI with a data type, widget, and label.
                    vScDefTypeList := vScDefTypeList || 
                        ('            ' || vCurrScDefIntName || ': "' || 
                            vCurrScDefDataType || E'",\n');

                    vWidgetList := vWidgetList ||
                        ('            ' || vCurrScDefIntName || 
                            ': mywindow.findChild("' || 
                            (SELECT key
                                FROM jsonb_each_text(vWidgets)
                                WHERE key = vCfgPfx||'_'||
                                    vScGrp.scgrp_internal_name||
                                    '_'||vCurrScDefIntName||
                                    '_'||lower(value)) || 
                            E'"),\n');

                    vLabelList := vLabelList ||
                        ('            ' || vCurrScDefIntName || 
                            ': mywindow.findChild("' || 
                            (SELECT key
                                FROM jsonb_each_text(vLabels)
                                WHERE key = vCfgPfx||'_'||
                                    vScGrp.scgrp_internal_name||
                                    '_'||vCurrScDefIntName||
                                    '_'||lower(value)) || 
                            E'"),\n');

                    -- The next section processes based on the superchar data
                    -- type as we have specific code in these various cases.
                    CASE vCurrScDefDataType
                        WHEN 'textfield' THEN
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["editingFinished()"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.text);\n' ||
                                    E'            });\n\n');
                        WHEN 'textarea' THEN
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["textChanged()"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.toPlainText());\n' ||
                                    E'            });\n\n');
                        WHEN 'datecluster' THEN
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["newDate(const QDate &)"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.date);\n' ||
                                    E'            });\n\n');
                        WHEN 'checkbox' THEN
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["stateChanged(int)"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.checked);\n' ||
                                    E'            });\n\n');
                        WHEN 'combobox' THEN
                            vGuiManipList := vGuiManipList ||
                                (E'    widgets.'||vCurrScDefIntName||E'.allowNull = true;\n' ||
                                    E'    widgets.'||vCurrScDefIntName||E'.nullStr = "-- Please Select --";\n');
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["currentIndexChanged(int)"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.code);\n' ||
                                    E'            });\n\n'); 
                        WHEN 'wholenumber' THEN
                            vGuiManipList := vGuiManipList || 
                                (E'    MuseUtils.numericLineEdit(widgets.'||vCurrScDefIntName||E',0);\n\n');
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["editingFinished()"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.getNumericValue());\n' ||
                                    E'            });\n\n');
                        WHEN 'decimalnumber' THEN
                            vGuiManipList := vGuiManipList || 
                                (E'    MuseUtils.numericLineEdit(widgets.'||vCurrScDefIntName||E',8);\n\n'); 
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["editingFinished()"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.getNumericValue());\n' ||
                                    E'            });\n\n'); 
                        WHEN 'qty' THEN
                            vGuiManipList := vGuiManipList || 
                                (E'    MuseUtils.numericLineEdit(widgets.'||vCurrScDefIntName||E',toolbox.decimalPlaces("qty"));\n\n'); 
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["editingFinished()"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.getNumericValue());\n' ||
                                    E'            });\n\n'); 
                        WHEN 'cost' THEN
                            vGuiManipList := vGuiManipList || 
                                (E'    MuseUtils.numericLineEdit(widgets.'||vCurrScDefIntName||E',toolbox.decimalPlaces("cost"));\n\n'); 
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["editingFinished()"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.getNumericValue());\n' ||
                                    E'            });\n\n'); 
                        WHEN 'purchprice' THEN
                            vGuiManipList := vGuiManipList || 
                                (E'    MuseUtils.numericLineEdit(widgets.'||vCurrScDefIntName||E',toolbox.decimalPlaces("purchprice"));\n\n'); 
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["editingFinished()"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.getNumericValue());\n' ||
                                    E'            });\n\n'); 
                        WHEN 'salesprice' THEN
                            vGuiManipList := vGuiManipList || 
                                (E'    MuseUtils.numericLineEdit(widgets.'||vCurrScDefIntName||E',toolbox.decimalPlaces("salesprice"));\n\n'); 
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["editingFinished()"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.getNumericValue());\n' ||
                                    E'            });\n\n'); 
                        WHEN 'extprice' THEN
                            vGuiManipList := vGuiManipList || 
                                (E'    MuseUtils.numericLineEdit(widgets.'||vCurrScDefIntName||E',toolbox.decimalPlaces("extprice"));\n\n'); 
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["editingFinished()"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.getNumericValue());\n' ||
                                    E'            });\n\n'); 
                        WHEN 'weight' THEN
                            vGuiManipList := vGuiManipList || 
                                (E'    MuseUtils.numericLineEdit(widgets.'||vCurrScDefIntName||E',toolbox.decimalPlaces("weight"));\n\n'); 
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["editingFinished()"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.getNumericValue());\n' ||
                                    E'            });\n\n'); 
                        WHEN 'percent' THEN
                            vGuiManipList := vGuiManipList || 
                                (E'    MuseUtils.numericLineEdit(widgets.'||vCurrScDefIntName||E',toolbox.decimalPlaces("percent"));\n\n'); 
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["editingFinished()"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.getNumericValue());\n' ||
                                    E'            });\n\n'); 
                        WHEN 'filecluster' THEN
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["editingFinished()"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.text);\n' ||
                                    E'            });\n\n'); 
                        WHEN 'imagecluster' THEN
                            vConnectList := vConnectList || 
                                (E'        widgets.' || vCurrScDefIntName || 
                                    E'["newId(int)"].connect(\n' ||
                                    E'            function() {\n' ||
                                    E'                setDataValue("'||vCurrScDefIntName||E'", widgets.'||vCurrScDefIntName||E'.id());\n' ||
                                    E'            });\n\n'); 
                        ELSE
                            RAISE EXCEPTION 'We encountered an unknown Super Characteristic data type. (FUNC: musesuperchar.get_qt_form_js) (pGroupId: %, pQtUiXml: %)',pGroupId,pQtUiXml;
                    END CASE;
                END LOOP superchar;

                RETURN 
                    format(musesuperchar.get_qt_form_js_template(), 
                        vScDefTypeList,vFormName,vSecList,vLabelList,vWidgetList,
                        vGuiManipList,vConnectList,vCfgPfx,vFormName,now());


            END;
        $BODY$
    LANGUAGE plpgsql STABLE;

ALTER FUNCTION musesuperchar.get_qt_form_js(pGroupId bigint, pQtUiXml xml)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_qt_form_js(pGroupId bigint, pQtUiXml xml) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_form_js(pGroupId bigint, pQtUiXml xml) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_form_js(pGroupId bigint, pQtUiXml xml) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_qt_form_js(pGroupId bigint, pQtUiXml xml) 
    IS $DOC$Returns the Qt JavaScript for managing a group user interface form.$DOC$;