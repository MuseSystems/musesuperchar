/*************************************************************************
 *************************************************************************
 **
 ** File:         create_entity.sql
 ** Project:      Muse Systems xTuple Super Characteristics
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
-- Safely adds musesuperchar.entity records for tables in the database.  Since a
-- reference to a table can only appear once in the entity table, we check first
-- before inserting and if we're called for a package, we add that to the
-- managing packages list if the entity already exists.  Naturally, if the
-- entity does not exist, we create that record.
--

CREATE OR REPLACE FUNCTION musesuperchar.create_entity(pSchema text, pTable text, pDisplayName text, pPkColumnName text, pPackageName text DEFAULT null, pIsSystemLocked boolean DEFAULT false) 
    RETURNS bigint AS
        $BODY$
            DECLARE
                vEntityId bigint;
            BEGIN

                -- Validate that we have minimum & sane parameters.
                IF NOT EXISTS(SELECT true 
                                FROM musextputils.v_basic_catalog
                               WHERE table_schema_name = pSchema
                                    AND table_name = pTable
                                    AND column_name = pPkColumnName
                                    AND table_kind = 'TABLE'
                                    AND is_required) THEN 
                    RAISE EXCEPTION 'We require a valid database schema, database table, and an xTuple standard primary key column. (FUNC: musesuperchar.create_entity) (pSchema: %, pTable: %, pDisplayName: %, pPkColumnName: %, pPackageName: %, pIsSystemLocked: %)',pSchema,pTable,pDisplayName,pPkColumnName,pPackageName,pIsSystemLocked;
                    
                ELSIF pPackageName IS NOT NULL 
                    AND NOT EXISTS(SELECT true 
                                   FROM public.pkghead 
                                  WHERE pkghead_name = pPackageName) THEN
                    RAISE EXCEPTION 'If a package is specified, it must exist in the system. (FUNC: musesuperchar.create_entity) (pSchema: %, pTable: %, pDisplayName: %, pPkColumnName: %, pPackageName: %, pIsSystemLocked: %)',pSchema,pTable,pDisplayName,pPkColumnName,pPackageName,pIsSystemLocked;
                END IF;

                -- Get the id of the entity record if it already exists.
                SELECT  entity_id INTO vEntityId
                FROM    musesuperchar.entity
                WHERE   entity_schema = pSchema
                    AND enityt_table = pTable;

                -- No matter what we'll insert the entity record if it needs it.
                IF vEntityId IS NULL THEN
                    INSERT INTO musesuperchar.entity (
                             entity_schema          
                            ,entity_table           
                            ,entity_pk_column       
                            ,entity_display_name
                            ,entity_is_system_locked)
                        VALUES (
                             pSchema
                            ,pTable
                            ,pPkColumnName
                            ,coalesce(pDisplayName, pSchema || '.' || pTable)
                            ,pIsSystemLocked AND pPackageName IS NOT NULL)
                        RETURNING entity_id INTO vEntityId; 
                END IF;

                IF pPackageName IS NOT NULL THEN
                    -- Make sure that the system locked flag reflects that the
                    -- entity is now managed if it's not already locked.
                    UPDATE musesuperchar.entity
                        SET entity_is_system_locked = pIsSystemLocked
                        WHERE entity_id = vEntityId
                            AND NOT entity_is_system_locked;

                    -- If we have a package name, make sure it's in the
                    -- entity_package table.
                    INSERT INTO musesuperchar.entity_package (
                             entity_package_pkghead_id
                            ,entity_package_entity_id)
                        SELECT   pkghead_id
                                ,vEntityId
                        FROM    public.pkghead
                            LEFT OUTER JOIN musesuperchar.entity_package
                                ON entity_package_pkghead_id = pkghead_id
                                    AND entity_package_entity_id = vEntityId
                        WHERE   pkghead_name = pPackageName
                            AND entity_package_id IS NULL;
                END IF;

                RETURN vEntityId;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION musesuperchar.create_entity(pSchema text, pTable text, pDisplayName text, pPkColumnName text, pPackageName text, pIsSystemLocked boolean)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.create_entity(pSchema text, pTable text, pDisplayName text, pPkColumnName text, pPackageName text, pIsSystemLocked boolean) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.create_entity(pSchema text, pTable text, pDisplayName text, pPkColumnName text, pPackageName text, pIsSystemLocked boolean) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.create_entity(pSchema text, pTable text, pDisplayName text, pPkColumnName text, pPackageName text, pIsSystemLocked boolean) TO xtrole;


COMMENT ON FUNCTION musesuperchar.create_entity(pSchema text, pTable text, pDisplayName text, pPkColumnName text, pPackageName text, pIsSystemLocked boolean) 
    IS $DOC$Safely adds musesuperchar.entity records for tables in the database.  Since a reference to a table can only appear once in the entity table, we check first before inserting and if we're called for a package, we add that to the managing packages list if the entity already exists.  Naturally, if the entity does not exist, we create that record.$DOC$;
