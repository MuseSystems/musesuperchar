/*************************************************************************
 *************************************************************************
 **
 ** File:         update_entity_qt_data_js_files.sql
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
 *************************************************************************/
 
 CREATE OR REPLACE FUNCTION musesuperchar.update_entity_qt_data_js_files(pEntityId bigint)
    RETURNS void AS 
        $BODY$
            DECLARE
                vCfgPfx text := musextputils.get_musemetric('musesuperchar','widgetPrefix',null::text);
                vEntityDataTable text;
                vEntityObjectName text;
                vEntityDisplayName text;
            BEGIN

                SELECT   replace(
                            initcap(
                                replace(entity_data_table, '_', ' ')), ' ', '')
                        ,entity_data_table
                        ,entity_display_name
                    INTO vEntityObjectName, ,vEntityDataTable, vEntityDisplayName
                FROM musesuperchar.entity 
                WHERE entity_id = pEntityId;

                IF vEntityObjectName IS NULL THEN

                    RAISE EXCEPTION 'We require a valid Entity ID in order to process the Qt related data management file. (FUNC: musesuperchar.update_entity_qt_data_js_files)(pEntityId: %)',pEntityId;

                END IF;

                ALTER TABLE musesuperchar.pkgscript
                    DISABLE TRIGGER pkgscriptaftertrigger;  
                ALTER TABLE musesuperchar.pkgscript
                    DISABLE TRIGGER pkgscriptaltertrigger;  
                ALTER TABLE musesuperchar.pkgscript
                    DISABLE TRIGGER pkgscriptbeforetrigger; 

                -- We do different things depending on if we have Super
                -- Characteristics that are resolvable to the given entity or
                -- not.  If we have no such relationship, we delete the MetaSQL
                -- files (there is nothing in practice for them to act upon).
                IF NOT EXISTS (SELECT true
                                FROM musesuperchar.v_superchar_entities 
                                WHERE entity_id = pEntityId) THEN
                    DELETE FROM musesuperchar.pkgscript
                        WHERE script_name = vCfgPfx || '_' || vEntityDataTable
                            AND script_order = 0;
                ELSE

                    WITH upd AS (
                        UPDATE musesuperchar.pkgscript 
                            SET  script_name = vCfgPfx || '_' || vEntityDataTable   
                                ,script_order = 0
                                ,script_enabled = true
                                ,script_source = musesuperchar.get_qt_data_js(pEntityId)
                                ,script_notes = 'Super Characteristic ' || 
                                    vEntityDisplayName || 
                                    ' Data Library Script; Autoupdated on ' || now()
                        WHERE script_name = vCfgPfx || '_' || vEntityDataTable
                            AND script_order = 0
                        RETURNING script_id
                        )
                    INSERT INTO musesuperchar.pkgscript
                        ( script_name
                         ,script_order
                         ,script_enabled
                         ,script_source
                         ,script_notes)
                    SELECT   vCfgPfx || '_' || vEntityDataTable   
                            ,0
                            ,true
                            ,musesuperchar.get_qt_data_js(pEntityId)
                            ,'Super Characteristic ' || vEntityDisplayName || 
                                ' Data Library Script; Autocreated on ' || now()
                    WHERE NOT EXISTS(SELECT script_id FROM upd);
                END IF;


                ALTER TABLE musesuperchar.pkgscript
                    ENABLE TRIGGER pkgscriptaftertrigger;  
                ALTER TABLE musesuperchar.pkgscript
                    ENABLE TRIGGER pkgscriptaltertrigger;  
                ALTER TABLE musesuperchar.pkgscript
                    ENABLE TRIGGER pkgscriptbeforetrigger; 
               
            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION musesuperchar.update_entity_qt_data_js_files(pEntityId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.update_entity_qt_data_js_files(pEntityId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.update_entity_qt_data_js_files(pEntityId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.update_entity_qt_data_js_files(pEntityId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.update_entity_qt_data_js_files(pEntityId bigint) 
    IS $DOC$Updates the Qt JavasScript file responsible for managing data elements associated with an entity.$DOC$;