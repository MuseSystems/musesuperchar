/*************************************************************************
 *************************************************************************
 **
 ** File:         validation_type.sql
 ** Project:      Muse Systems xTuple Super Charateristics
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
                                  AND table_name = 'validation_type') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.validation_type (
                     validation_type_id    bigserial    NOT NULL    PRIMARY KEY
                    ,validation_type_internal_name text NOT NULL    UNIQUE 
                    ,validation_type_display_name text NOT NULL UNIQUE
                    ,validation_type_description text NOT NULL
                    ,validation_type_is_user_visible boolean NOT NULL DEFAULT true
                    ,validation_type_is_text boolean NOT NULL DEFAULT false
                    ,validation_type_is_numeric boolean NOT NULL DEFAULT false
                    ,validation_type_is_date boolean NOT NULL DEFAULT false
                );
                
                ALTER TABLE  musesuperchar.validation_type OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.validation_type FROM public;
                GRANT ALL ON TABLE musesuperchar.validation_type TO admin;
                GRANT ALL ON TABLE musesuperchar.validation_type TO xtrole;
                
                COMMENT ON TABLE musesuperchar.validation_type 
                    IS $DOC$Enumerates the known validation types.  This table is not intended to be user maintainable and as inferred in the first sentence, is a glorified, self-documenting enumeration.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.validation_type.validation_type_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_type.validation_type_internal_name IS
                $DOC$The computer friendly naturaly key of the validation type.  This is the value that should be referenced programmatically.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_type.validation_type_display_name IS
                $DOC$A name for the validation which appears to end users in the user interface.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_type.validation_type_description IS
                $DOC$Brief, tool-tip style help to aid in understanding how to use the validation type.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_type.validation_type_is_user_visible IS
                $DOC$If true, the validation will appear in user interfaces as a selectable option for appropriate types.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_type.validation_type_is_text IS
                $DOC$If true, this validator is appropriate for data types which can generalize meaningfully to text data.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_type.validation_type_is_numeric IS
                $DOC$If true, this validator is appropriate for data types which can generalize meaningfully to numeric data.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_type.validation_type_is_date IS
                $DOC$If true, this validator is appropriate for data types which can generalize meaningfully to date data.$DOC$;


                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'validation_type'
                                                                ,'validation_type_date_created'
                                                                ,'validation_type_role_created'
                                                                ,'validation_type_date_deactivated'
                                                                ,'validation_type_role_deactivated' 
                                                                ,'validation_type_date_modified'
                                                                ,'validation_type_wallclock_modified'
                                                                ,'validation_type_role_modified'
                                                                ,'validation_type_row_version_number'
                                                                ,'validation_type_is_active');
                

            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
            

        END;
    $BODY$;
