/*************************************************************************
 *************************************************************************
 **
 ** File:         entitypkg.sql
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

DO
    $BODY$
        DECLARE
            
        BEGIN

            -- Create the table if it does not exist.  Apply deltas if it does and it's needed.
            IF NOT EXISTS(SELECT     true 
                          FROM         musextputils.v_basic_catalog 
                          WHERE     table_schema_name = 'musesuperchar' 
                                  AND table_name = 'entitypkg') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.entitypkg (
                     entitypkg_id    bigserial    NOT NULL    PRIMARY KEY
                    ,entitypkg_pkghead_id integer NOT NULL     REFERENCES public.pkghead (pkghead_id)
                    ,entitypkg_entity_id bigint NOT NULL   REFERENCES musesuperchar.entity (entity_id)
                );
                
                ALTER TABLE  musesuperchar.entitypkg OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.entitypkg FROM public;
                GRANT ALL ON TABLE musesuperchar.entitypkg TO admin;
                GRANT ALL ON TABLE musesuperchar.entitypkg TO xtrole;
                
                COMMENT ON TABLE musesuperchar.entitypkg 
                    IS $DOC$Since an entity can be required by multiple packages, this table ensures that that each package can be properly represented as requiring the entity entry.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.entitypkg.entitypkg_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                

                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'entitypkg'
                                                                ,'entitypkg_date_created'
                                                                ,'entitypkg_role_created'
                                                                ,'entitypkg_date_deactivated'
                                                                ,'entitypkg_role_deactivated' 
                                                                ,'entitypkg_date_modified'
                                                                ,'entitypkg_wallclock_modified'
                                                                ,'entitypkg_role_modified'
                                                                ,'entitypkg_row_version_number'
                                                                ,'entitypkg_is_active');
                

            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
        END;
    $BODY$;
