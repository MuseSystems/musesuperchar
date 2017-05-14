/*************************************************************************
 *************************************************************************
 **
 ** File:         conditional_validation_rule.sql
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
                                  AND table_name = 'conditional_validation_rule') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.conditional_validation_rule (
                     conditional_validation_rule_id    bigserial    NOT NULL    PRIMARY KEY
                    ,conditional_validation_rule_subject_sc_def_id bigint NOT NULL REFERENCES musesuperchar.sc_def (sc_def_id)
                    ,conditional_validation_rule_object_sc_def_id bigint NOT NULL REFERENCES musesuperchar.sc_def (sc_def_id)
                    ,conditional_validation_rule_if_validator_type_id bigint NOT NULL REFERENCES musesuperchar.validator_type (validator_type_id)
                    ,conditional_validation_rule_if_validator_regexp text 
                    ,conditional_validation_rule_if_validator_numrange numrange
                    ,conditional_validation_rule_if_validator_daterange daterange 
                    ,conditional_validation_rule_then_validator_type_id bigint NOT NULL REFERENCES musesuperchar.validator_type (validator_type_id) 
                    ,conditional_validation_rule_then_validator_regexp text
                    ,conditional_validation_rule_then_validator_numrange numrange
                    ,conditional_validation_rule_then_validator_daterange daterange
                    ,conditional_validation_rule_fails_message_text text NOT NULL
                    ,conditional_validation_rule_is_system_locked boolean NOT NULL DEFAULT false 
                    ,conditional_validation_rule_pkghead_id integer REFERENCES public.pkghead (pkghead_id)
                );
                
                ALTER TABLE  musesuperchar.conditional_validation_rule OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.conditional_validation_rule FROM public;
                GRANT ALL ON TABLE musesuperchar.conditional_validation_rule TO admin;
                GRANT ALL ON TABLE musesuperchar.conditional_validation_rule TO xtrole;
                
                COMMENT ON TABLE musesuperchar.conditional_validation_rule 
                    IS $DOC$Defines one or more conditional validation rule to apply.  Depending on the values of the object characteristic in the owning musesuperchar.validation_rule table, we can validate the values of the subject characteristic.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_subject_sc_def_id IS
                $DOC$Identifies the super characteristic to for whose benefit this rule will be evaluated.  Any action taken due to a validation rule will be applied to the subject characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_object_sc_def_id IS
                $DOC$Identifies a characteristic which will be evaluated in order to know what must happen in regards to the subject characteristic.  The object is not the characteristic on which any action will be applied, but rather whose state will determine what must happen with the subject characteristic.  An object characteristic can also be the subject characteristic, such as requiring the characteristic to have a certain value.$DOC$;

                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_if_validator_type_id IS
                $DOC$The type of validation to perform on the object characteristic to see if the "then" validation should be performed on the the subject characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_if_validator_regexp IS
                $DOC$If the "if" validator is a text type this is the regular expression which to apply to the object characteristic value.$DOC$;

                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_if_validator_numrange IS
                $DOC$If the "if" validator is a numeric type this is the regular expression which to apply to the object characteristic value.$DOC$;

                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_if_validator_daterange IS
                $DOC$If the "if" validator is a date type this is the regular expression which to apply to the object characteristic value.$DOC$;

                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_then_validator_type_id IS
                $DOC$The type of validation to apply to the subject characteristic if the "if" test performed on the object characteristic is true.$DOC$;

                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_then_validator_regexp IS
                $DOC$If the "if" test performed on the object characteristic evaluates true and the validation type is a text type, this validation should be performed on the subject characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_then_validator_numrange IS
                $DOC$If the "if" test performed on the object characteristic evaluates true and the validation type is a numeric type, this validation should be performed on the subject characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_then_validator_daterange IS
                $DOC$If the "if" test performed on the object characteristic evaluates true and the validation type is a date type, this validation should be performed on the subject characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_fails_message_text IS
                $DOC$If the validation is applied to the subject characteristic and fails, this value is the message displayed to the end user.  This message should typically appear on an aborted save.$DOC$;

                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_is_system_locked IS 
                $DOC$If true, the validation rule is managed by the system (most likely an extension package).  If false, the validation is consider user manageable.$DOC$;

                COMMENT ON COLUMN musesuperchar.conditional_validation_rule.conditional_validation_rule_pkghead_id IS 
                $DOC$If the validation rule is system managed it is most likely managed via an extension package and this is a reference to the managing package.$DOC$;


                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'conditional_validation_rule'
                                                                ,'conditional_validation_rule_date_created'
                                                                ,'conditional_validation_rule_role_created'
                                                                ,'conditional_validation_rule_date_deactivated'
                                                                ,'conditional_validation_rule_role_deactivated' 
                                                                ,'conditional_validation_rule_date_modified'
                                                                ,'conditional_validation_rule_wallclock_modified'
                                                                ,'conditional_validation_rule_role_modified'
                                                                ,'conditional_validation_rule_row_version_number'
                                                                ,'conditional_validation_rule_is_active');
                
            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
        END;
    $BODY$;
