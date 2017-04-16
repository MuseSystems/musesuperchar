/*************************************************************************
 *************************************************************************
 **
 ** File:         validator_type.sql
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
                                  AND table_name = 'validator_type') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.validator_type (
                     validator_type_id    bigserial    NOT NULL    PRIMARY KEY
                    ,validator_type_internal_name text NOT NULL    UNIQUE 
                    ,validator_type_display_name text NOT NULL UNIQUE
                    ,validator_type_description text NOT NULL
                    ,validator_type_is_user_visible boolean NOT NULL DEFAULT true
                    ,validator_type_is_text boolean NOT NULL DEFAULT false
                    ,validator_type_is_numeric boolean NOT NULL DEFAULT false
                    ,validator_type_is_date boolean NOT NULL DEFAULT false
                    ,validator_type_display_order integer NOT NULL DEFAULT 99999
                );
                
                ALTER TABLE  musesuperchar.validator_type OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.validator_type FROM public;
                GRANT ALL ON TABLE musesuperchar.validator_type TO admin;
                GRANT ALL ON TABLE musesuperchar.validator_type TO xtrole;
                
                COMMENT ON TABLE musesuperchar.validator_type 
                    IS $DOC$Enumerates the known validation types.  This table is not intended to be user maintainable and as inferred in the first sentence, is a glorified, self-documenting enumeration.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.validator_type.validator_type_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                COMMENT ON COLUMN musesuperchar.validator_type.validator_type_internal_name IS
                $DOC$The computer friendly naturaly key of the validation type.  This is the value that should be referenced programmatically.$DOC$;

                COMMENT ON COLUMN musesuperchar.validator_type.validator_type_display_name IS
                $DOC$A name for the validation which appears to end users in the user interface.$DOC$;

                COMMENT ON COLUMN musesuperchar.validator_type.validator_type_description IS
                $DOC$Brief, tool-tip style help to aid in understanding how to use the validation type.$DOC$;

                COMMENT ON COLUMN musesuperchar.validator_type.validator_type_is_user_visible IS
                $DOC$If true, the validation will appear in user interfaces as a selectable option for appropriate types.$DOC$;

                COMMENT ON COLUMN musesuperchar.validator_type.validator_type_is_text IS
                $DOC$If true, this validator is appropriate for data types which can generalize meaningfully to text data.$DOC$;

                COMMENT ON COLUMN musesuperchar.validator_type.validator_type_is_numeric IS
                $DOC$If true, this validator is appropriate for data types which can generalize meaningfully to numeric data.$DOC$;

                COMMENT ON COLUMN musesuperchar.validator_type.validator_type_is_date IS
                $DOC$If true, this validator is appropriate for data types which can generalize meaningfully to date data.$DOC$;

                COMMENT ON COLUMN musesuperchar.validator_type.validator_type_display_order IS 
                $DOC$The display order in the user interface with lower numbers appearing first.$DOC$;

                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'validator_type'
                                                                ,'validator_type_date_created'
                                                                ,'validator_type_role_created'
                                                                ,'validator_type_date_deactivated'
                                                                ,'validator_type_role_deactivated' 
                                                                ,'validator_type_date_modified'
                                                                ,'validator_type_wallclock_modified'
                                                                ,'validator_type_role_modified'
                                                                ,'validator_type_row_version_number'
                                                                ,'validator_type_is_active');
                

            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
            

        END;
    $BODY$;
