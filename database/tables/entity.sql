/*************************************************************************
 *************************************************************************
 **
 ** File:         entity.sql
 ** Project:      Muse Systems xTuple Super Characteristics
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
                                  AND table_name = 'entity') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.entity (
                     entity_id    bigserial    NOT NULL    PRIMARY KEY
                    ,entity_schema  text         NOT NULL
                    ,entity_table   text         NOT NULL
                    ,entity_pk_column text       NOT NULL
                    ,entity_display_name   text         NOT NULL
                    ,entity_data_table text NOT NULL
                    ,entity_is_system_locked boolean      NOT NULL   DEFAULT false
                    ,UNIQUE(entity_schema, entity_table)
                );
                
                ALTER TABLE musesuperchar.entity OWNER TO admin;    

                REVOKE ALL ON TABLE musesuperchar.entity FROM public;
                GRANT ALL ON TABLE musesuperchar.entity TO admin;
                GRANT ALL ON TABLE musesuperchar.entity TO xtrole;
                
                COMMENT ON TABLE musesuperchar.entity 
                    IS $DOC$Keeps track of what tables (entity) to which we can associate Super Characteristics.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.entity.entity_id IS
                    $DOC$The primary key and unique identifier of the record.$DOC$;

                COMMENT ON COLUMN musesuperchar.entity.entity_schema IS
                    $DOC$The name of the schema in which the table is defined.$DOC$;

                COMMENT ON COLUMN musesuperchar.entity.entity_table IS
                    $DOC$The name of the table itself.$DOC$;

                COMMENT ON COLUMN musesuperchar.entity.entity_pk_column IS
                    $DOC$The name of the entity table's primary key column. We expect this to be a single column, surrogate key for the entity table.$DOC$;

                COMMENT ON COLUMN musesuperchar.entity.entity_display_name IS
                    $DOC$A non-technical name to display in user interfaces.$DOC$;

                COMMENT ON COLUMN musesuperchar.entity.entity_is_system_locked IS
                    $DOC$When this value is true, this entity is not managable via the user interface.  It must be managed via its installing package (see entity_package for the managing package).$DOC$;


                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'entity'
                                                                ,'entity_date_created'
                                                                ,'entity_role_created'
                                                                ,'entity_date_deactivated'
                                                                ,'entity_role_deactivated' 
                                                                ,'entity_date_modified'
                                                                ,'entity_wallclock_modified'
                                                                ,'entity_role_modified'
                                                                ,'entity_row_version_number'
                                                                ,'entity_is_active');
                
                -- Add the trigger to the target table(s).
                DROP TRIGGER IF EXISTS a10_trig_a_id_manage_sc_entity_tables ON musesuperchar.entity;
                
                CREATE TRIGGER a10_trig_a_id_manage_sc_entity_tables AFTER INSERT OR DELETE
                    ON musesuperchar.entity FOR EACH ROW 
                    EXECUTE PROCEDURE musesuperchar.trig_a_id_manage_sc_entity_tables();
                
                
            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
            

        END;
    $BODY$;
