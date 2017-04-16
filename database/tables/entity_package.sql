/*************************************************************************
 *************************************************************************
 **
 ** File:         entity_package.sql
 ** Project:      Muse Systems xTuple Super Characteristic
 ** Author:       Steven C. Buttgereit
 **
 ** (C) 2017 Lima Buttgereit Holdings LLC d/b/a Muse Systems
 **
 ** Contact:
 ** muse.information@musesystems.com  :: https://muse.systems
 ** 
 ** Licensing restrictions apply.  Please refer to your Master Services
 ** Agreement or governing Statement of Work for complete terms and 
 ** conditions.
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
                                  AND table_name = 'entity_package') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.entity_package (
                     entity_package_id    bigserial    NOT NULL    PRIMARY KEY
                    ,entity_package_pkghead_id integer NOT NULL     REFERENCES public.pkghead (pkghead_id)
                    ,entity_package_entity_id bigint NOT NULL   REFERENCES musesuperchar.entity (entity_id)
                );
                
                ALTER TABLE  musesuperchar.entity_package OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.entity_package FROM public;
                GRANT ALL ON TABLE musesuperchar.entity_package TO admin;
                GRANT ALL ON TABLE musesuperchar.entity_package TO xtrole;
                
                COMMENT ON TABLE musesuperchar.entity_package 
                    IS $DOC$Since an entity can be required by multiple packages, this table ensures that that each package can be properly represented as requiring the entity entry.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.entity_package.entity_package_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                

                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'entity_package'
                                                                ,'entity_package_date_created'
                                                                ,'entity_package_role_created'
                                                                ,'entity_package_date_deactivated'
                                                                ,'entity_package_role_deactivated' 
                                                                ,'entity_package_date_modified'
                                                                ,'entity_package_wallclock_modified'
                                                                ,'entity_package_role_modified'
                                                                ,'entity_package_row_version_number'
                                                                ,'entity_package_is_active');
                

            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
            

        END;
    $BODY$;
