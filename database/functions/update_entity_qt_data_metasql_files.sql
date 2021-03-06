-- File:        update_entity_qt_data_metasql_files.sql
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
-- A function which calls MetaSQL generating functions for a given entity and
-- saves those MetaSQL texts to their corresponding records in the metasql
-- table.
--

CREATE OR REPLACE FUNCTION musesuperchar.update_entity_qt_data_metasql_files(pEntityId bigint)
    RETURNS void AS
        $BODY$
            DECLARE
                vCfgPfx text := musextputils.get_musemetric('musesuperchar','widgetPrefix',null::text);
                vEntityDataTable text;
                vMetaSqlInsert text;
                vMetaSqlUpdate text;
                vMetaSqlDelete text;
                vMetaSqlSelect text;
                vMetaSqlBaseName text;
                vMetaSqlInsertName text;
                vMetaSqlUpdateName text;
                vMetaSqlDeleteName text;
                vMetaSqlSelectName text;
            BEGIN

                SELECT entity_data_table INTO vEntityDataTable
                FROM musesuperchar.entity
                WHERE entity_id = pEntityId;

                IF vEntityDataTable IS NULL THEN
                    RAISE EXCEPTION 'We require a valid Entity ID in order to update its Qt MetaSQL related files. (FUNC: musesuperchar.update_entity_qt_data_metasql_files) (pEntityId: %)',pEntityId;
                END IF;

                ALTER TABLE musesuperchar.pkgmetasql
                    DISABLE TRIGGER pkgmetasqlaftertrigger;
                ALTER TABLE musesuperchar.pkgmetasql
                    DISABLE TRIGGER pkgmetasqlaltertrigger;
                ALTER TABLE musesuperchar.pkgmetasql
                    DISABLE TRIGGER pkgmetasqlbeforetrigger;

                vMetaSqlBaseName := vCfgPfx||'_'||vEntityDataTable;
                vMetaSqlInsertName := vMetaSqlBaseName || '_insert';
                vMetaSqlUpdateName := vMetaSqlBaseName || '_update';
                vMetaSqlDeleteName := vMetaSqlBaseName || '_delete';
                vMetaSqlSelectName := vMetaSqlBaseName || '_select';

                -- We do different things depending on if we have Super
                -- Characteristics that are resolvable to the given entity or
                -- not.  If we have no such relationship, we delete the MetaSQL
                -- files (there is nothing in practice for them to act upon).
                IF NOT EXISTS (SELECT true
                                FROM musesuperchar.v_superchar_entities
                                WHERE entity_id = pEntityId) THEN
                    DELETE FROM musesuperchar.pkgmetasql
                        WHERE metasql_name ~ (vMetaSqlBaseName || '_.+')
                            AND metasql_grade = 0;
                ELSE
                    vMetaSqlInsert :=
                        musesuperchar.get_qt_insert_metasql(pEntityId);
                    vMetaSqlUpdate :=
                        musesuperchar.get_qt_update_metasql(pEntityId);
                    vMetaSqlDelete :=
                        musesuperchar.get_qt_delete_metasql(pEntityId);
                    vMetaSqlSelect :=
                        musesuperchar.get_qt_select_metasql(pEntityId);

                    -- Now we either insert or update the files; would love to
                    -- do INSERT ON CONFLICT, but our required keys are not
                    -- unique indexed :-(
                    IF NOT EXISTS (SELECT true
                                   FROM musesuperchar.pkgmetasql
                                   WHERE metasql_name = vMetaSqlInsertName
                                        AND metasql_grade = 0) THEN
                        INSERT INTO musesuperchar.pkgmetasql
                            (metasql_name
                            ,metasql_grade
                            ,metasql_group
                            ,metasql_query
                            ,metasql_notes)
                        VALUES
                            (vMetaSqlInsertName
                            ,0
                            ,'musesuperchar'
                            ,vMetaSqlInsert
                            ,'Autogenerated Super Charateristics MetaSQL, Last Updated: '||
                                now());
                    ELSE
                        UPDATE   musesuperchar.pkgmetasql
                           SET   metasql_query = vMetaSqlInsert
                                ,metasql_notes =
                                    'Autogenerated Super Charateristics Form, Last Updated: '||
                                    now()
                        WHERE    metasql_name = vMetaSqlInsertName
                            AND  metasql_grade = 0;
                    END IF;

                    IF NOT EXISTS (SELECT true
                                   FROM musesuperchar.pkgmetasql
                                   WHERE metasql_name = vMetaSqlUpdateName
                                        AND metasql_grade = 0) THEN
                        INSERT INTO musesuperchar.pkgmetasql
                            (metasql_name
                            ,metasql_grade
                            ,metasql_group
                            ,metasql_query
                            ,metasql_notes)
                        VALUES
                            (vMetaSqlUpdateName
                            ,0
                            ,'musesuperchar'
                            ,vMetaSqlUpdate
                            ,'Autogenerated Super Charateristics MetaSQL, Last Updated: '||
                                now());
                    ELSE
                        UPDATE   musesuperchar.pkgmetasql
                           SET   metasql_query = vMetaSqlUpdate
                                ,metasql_notes =
                                    'Autogenerated Super Charateristics Form, Last Updated: '||
                                    now()
                        WHERE    metasql_name = vMetaSqlUpdateName
                            AND  metasql_grade = 0;
                    END IF;

                    IF NOT EXISTS (SELECT true
                                   FROM musesuperchar.pkgmetasql
                                   WHERE metasql_name = vMetaSqlDeleteName
                                        AND metasql_grade = 0) THEN
                        INSERT INTO musesuperchar.pkgmetasql
                            (metasql_name
                            ,metasql_grade
                            ,metasql_group
                            ,metasql_query
                            ,metasql_notes)
                        VALUES
                            (vMetaSqlDeleteName
                            ,0
                            ,'musesuperchar'
                            ,vMetaSqlDelete
                            ,'Autogenerated Super Charateristics MetaSQL, Last Updated: '||
                                now());
                    ELSE
                        UPDATE   musesuperchar.pkgmetasql
                           SET   metasql_query = vMetaSqlDelete
                                ,metasql_notes =
                                    'Autogenerated Super Charateristics Form, Last Updated: '||
                                    now()
                        WHERE    metasql_name = vMetaSqlDeleteName
                            AND  metasql_grade = 0;
                    END IF;

                    IF NOT EXISTS (SELECT true
                                   FROM musesuperchar.pkgmetasql
                                   WHERE metasql_name = vMetaSqlSelectName
                                        AND metasql_grade = 0) THEN
                        INSERT INTO musesuperchar.pkgmetasql
                            (metasql_name
                            ,metasql_grade
                            ,metasql_group
                            ,metasql_query
                            ,metasql_notes)
                        VALUES
                            (vMetaSqlSelectName
                            ,0
                            ,'musesuperchar'
                            ,vMetaSqlSelect
                            ,'Autogenerated Super Charateristics MetaSQL, Last Updated: '||
                                now());
                    ELSE
                        UPDATE   musesuperchar.pkgmetasql
                           SET   metasql_query = vMetaSqlSelect
                                ,metasql_notes =
                                    'Autogenerated Super Charateristics Form, Last Updated: '||
                                    now()
                        WHERE    metasql_name = vMetaSqlSelectName
                            AND  metasql_grade = 0;
                    END IF;

                END IF;

                ALTER TABLE musesuperchar.pkgmetasql
                    ENABLE TRIGGER pkgmetasqlaftertrigger;
                ALTER TABLE musesuperchar.pkgmetasql
                    ENABLE TRIGGER pkgmetasqlaltertrigger;
                ALTER TABLE musesuperchar.pkgmetasql
                    ENABLE TRIGGER pkgmetasqlbeforetrigger;
            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

ALTER FUNCTION musesuperchar.update_entity_qt_data_metasql_files(pEntityId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.update_entity_qt_data_metasql_files(pEntityId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.update_entity_qt_data_metasql_files(pEntityId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.update_entity_qt_data_metasql_files(pEntityId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.update_entity_qt_data_metasql_files(pEntityId bigint)
    IS $DOC$A function which calls MetaSQL generating functions for a given entity and saves those MetaSQL texts to their corresponding records in the metasql table.$DOC$;
