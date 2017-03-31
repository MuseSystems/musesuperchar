/*************************************************************************
 *************************************************************************
 **
 ** File:         entities.sql
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
                                  AND table_name = 'entities') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.entities (
                     entities_id    bigserial    NOT NULL    PRIMARY KEY
                    ,entity_schema  text         NOT NULL
                    ,entity_table   text         NOT NULL
                    ,display_name   text         NOT NULL
                    ,is_system      boolean      NOT NULL   DEFAULT false
                    ,UNIQUE(entity_schema, entity_table)
                );
                
                ALTER TABLE musesuperchar.entities OWNER TO admin;    

                REVOKE ALL ON TABLE musesuperchar.entities FROM public;
                GRANT ALL ON TABLE musesuperchar.entities TO admin;
                GRANT ALL ON TABLE musesuperchar.entities TO xtrole;
                
                COMMENT ON TABLE musesuperchar.entities 
                    IS $DOC$Keeps track of what tables (entities) to which we can associate Super Characteristics.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.entities.entities_id IS
                    $DOC$The primary key and unique identifier of the record.$DOC$;

                COMMENT ON COLUMN musesuperchar.entities.entity_schema IS
                    $DOC$The name of the schema in which the table is defined.$DOC$;

                COMMENT ON COLUMN musesuperchar.entities.entity_table IS
                    $DOC$The name of the table itself.$DOC$;

                COMMENT ON COLUMN musesuperchar.entities.display_name IS
                    $DOC$A non-technical name to display in user interfaces.$DOC$;

                COMMENT ON COLUMN musesuperchar.entities.is_system IS
                    $DOC$If the entity is programatically added, such as via an extension package, we set this flag to true.  The goal is to know which entities are expected to exist to support system functionality; one might consider this the difference between the entity being added via an installer program as part of an extension package vs. something that a DBA might manage ad hoc.$DOC$;


                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'entities'
                                                                ,'entities_date_created'
                                                                ,'entities_role_created'
                                                                ,'entities_date_deactivated'
                                                                ,'entities_role_deactivated' 
                                                                ,'entities_date_modified'
                                                                ,'entities_wallclock_modified'
                                                                ,'entities_role_modified'
                                                                ,'entities_row_version_number'
                                                                ,'entities_is_active');
                

            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
            

        END;
    $BODY$;
