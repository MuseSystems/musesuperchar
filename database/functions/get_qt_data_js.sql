/*************************************************************************
 *************************************************************************
 **
 ** File:         get_qt_data_js.sql
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
-- Returns the Qt JavaScript for managing entity data.
--

CREATE OR REPLACE FUNCTION musesuperchar.get_qt_data_js(pEntityId bigint)
    RETURNS text AS
        $BODY$
            DECLARE
                vCfgPfx text :=
                    musextputils.get_musemetric('musesuperchar', 'widgetPrefix',
                        null::text);
                vRecords musextputils.v_basic_catalog[];
                vCurrRecord musextputils.v_basic_catalog;
                vEntitySchema text;
                vEntityTable text;
                vEntityDisplayName text;
                vEntityDataTable text;
                vEntityObjectName text;
                vStructFields text := '';
            BEGIN

                -- Snake Case to Camel Case inspired by http://www.postgresonline.com/journal/archives/170-Of-Camels-and-People-Converting-back-and-forth-from-Camel-Case,-Pascal-Case-to-underscore-lower-case.html
                SELECT   entity_schema
                        ,entity_table
                        ,entity_display_name
                        ,entity_data_table

                        ,replace(
                            initcap(
                                replace(entity_data_table, '_', ' ')), ' ', '')
                    INTO vEntitySchema
                        ,vEntityTable
                        ,vEntityDisplayName
                        ,vEntityDataTable
                        ,vEntityObjectName
                FROM musesuperchar.entity
                WHERE entity_id = pEntityId;

                IF vEntityDataTable IS NULL THEN
                    RAISE EXCEPTION 'We must have a valid entity id in order to generate a Qt Data Script (FUNC: musesuperchar.get_qt_data_js) (%)',pEntityId;
                END IF;


                SELECT array_agg(vbc) INTO vRecords
                FROM musextputils.v_basic_catalog vbc
                WHERE table_schema_name = 'musesuperchar'
                    AND table_name = vEntityDataTable
                    AND column_ordinal > 0;

                FOR vCurrRecord IN SELECT * FROM unnest(vRecords) LOOP
                    vStructFields := vStructFields ||
                        format(E'                 "%1$s": null,\n',
                            vCurrRecord.column_name);
                END LOOP;

                RETURN
                    format(musesuperchar.get_qt_data_js_template(),vStructFields,
                        vEntitySchema,vEntityTable,vEntityDisplayName,
                        vEntityObjectName,vEntityDataTable,vCfgPfx,now());
            END;
        $BODY$
    LANGUAGE plpgsql STABLE;

ALTER FUNCTION musesuperchar.get_qt_data_js(pEntityId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_qt_data_js(pEntityId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_data_js(pEntityId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_data_js(pEntityId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_qt_data_js(pEntityId bigint)
    IS $DOC$Returns the Qt JavaScript for managing entity data.$DOC$;

