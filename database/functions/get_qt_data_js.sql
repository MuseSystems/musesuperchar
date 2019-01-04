-- File:        get_qt_data_js.sql
-- Location:    musesuperchar/database/functions
-- Project:     Muse Systems Super Characteristics for xTuple ERP
--
-- Licensed to Lima Buttgereit Holdings LLC (d/b/a Muse Systems) under one or
-- more agreements.  Muse Systems licenses this file to you under the Apache
-- License, Version 2.0.
--
-- See the LICENSE file in the project root for license terms and conditions.
-- See the NOTICE file in the project root for copyright ownership information.
--
-- muse.information@musesystems.com  :: https://muse.systems


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
                vDataColumns text[];
                vCurrDataColumn text;
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

                SELECT array_agg(data_column) INTO vDataColumns
                FROM
                    (SELECT  1 AS seq, vbc.column_name AS data_column
                     FROM musextputils.v_basic_catalog vbc
                     WHERE table_schema_name = 'musesuperchar'
                         AND table_name = vEntityDataTable
                         AND column_name ~ vEntityDataTable
                         AND column_ordinal > 0
                     UNION
                     SELECT  2 AS seq, scdef_internal_name AS data_column
                     FROM musesuperchar.v_superchar_entities
                     WHERE entity_data_table = vEntityDataTable
                     ORDER BY seq, data_column) q;

                FOR vCurrDataColumn IN SELECT * FROM unnest(vDataColumns) LOOP
                    vStructFields := vStructFields ||
                        format(E'                 "%1$s": null,\n',
                            vCurrDataColumn);
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

