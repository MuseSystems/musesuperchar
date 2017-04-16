/*************************************************************************
 *************************************************************************
 **
 ** File:         validation_rule.sql
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
                                  AND table_name = 'validation_rule') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.validation_rule (
                     validation_rule_id    bigserial    NOT NULL    PRIMARY KEY
                    ,validation_rule_subject_sc_def_id bigint NOT NULL REFERENCES musesuperchar.sc_def (sc_def_id)
                    ,validation_rule_object_sc_def_id bigint NOT NULL REFERENCES musesuperchar.sc_def (sc_def_id)
                    ,validation_rule_disallow_if_not_exists boolean NOT NULL DEFAULT false
                    ,validation_rule_require_if_exists boolean NOT NULL DEFAULT false
                    ,validation_rule_require_if_validator_type_id bigint REFERENCES musesuperchar.validator_type (validator_type_id)
                    ,validation_rule_require_if_validator_regexp text
                    ,validation_rule_require_if_validator_numrange numrange
                    ,validation_rule_require_if_validator_daterange daterange
                    ,validation_rule_pkghead_id integer REFERENCES public.pkghead (pkghead_id)
                    ,validation_rule_is_system_locked boolean DEFAULT false
                );
                
                ALTER TABLE  musesuperchar.validation_rule OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.validation_rule FROM public;
                GRANT ALL ON TABLE musesuperchar.validation_rule TO admin;
                GRANT ALL ON TABLE musesuperchar.validation_rule TO xtrole;
                
                COMMENT ON TABLE musesuperchar.validation_rule 
                    IS $DOC$Defines that a validation rule for a super characteristic exists.  Specifically it defines whether or not $DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.validation_rule.validation_rule_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_rule.validation_rule_subject_sc_def_id IS
                $DOC$The subject characteristic of the validation process in which this rule is being evaluated.  In other words this is the characteristic that is valid, not valid, required, disallowed, etc.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_rule.validation_rule_object_sc_def_id IS
                $DOC$The object characteristic, whose state may cause the subject characteristic to be required, disallowed, valid, or not valid.  Note that the subject and object may be the same; in those cases where the subject and object are the same, then the rule is simply a value validation.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_rule.validation_rule_disallow_if_not_exists IS
                $DOC$When the object characteristic is not present on a record, disallow the addition of the subject characteristic to the record.  This expresses that the subject characteristic is dependent on the object characteristic and cannot exist without it. Removing the object characteristic from a record via the UI will automatically remove the subject characteristic from the UI, losing the value of the subject characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_rule.validation_rule_require_if_exists IS
                $DOC$When the object characteristic is present, require that the subject characteristic is also present.  Note that this does flag being true does not mean that the subject characteristic has a value, only that it is an added characteristic.  Value validation is handled through the validation rules.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_rule.validation_rule_require_if_validator_type_id IS
                $DOC$This allows us to apply a true/false validation check on the object characteristic and, if true, require that the subject characteristic be added to the record in question.  This requirement does not mean that the subject characteristic have any specific value (or any value).$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_rule.validation_rule_require_if_validator_regexp IS
                $DOC$If the validator is of a generally text type the validation is a regular expression.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_rule.validation_rule_require_if_validator_numrange IS
                $DOC$If the validator is of a generally numeric type the validation is by inclusion/exclusion in a PostgreSQL numeric range type.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_rule.validation_rule_require_if_validator_daterange IS
                $DOC$If the validator is of a generally date type the validation is by inclusion/exclusion of a PostgreSQL date range type.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_rule.validation_rule_pkghead_id IS 
                $DOC$If the validation rule is system managed (via an extension package), the id of the managing package appears here.$DOC$;

                COMMENT ON COLUMN musesuperchar.validation_rule.validation_rule_is_system_locked IS
                $DOC$If true, then this rule is not managable outside of the managing package.$DOC$;


                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'validation_rule'
                                                                ,'validation_rule_date_created'
                                                                ,'validation_rule_role_created'
                                                                ,'validation_rule_date_deactivated'
                                                                ,'validation_rule_role_deactivated' 
                                                                ,'validation_rule_date_modified'
                                                                ,'validation_rule_wallclock_modified'
                                                                ,'validation_rule_role_modified'
                                                                ,'validation_rule_row_version_number'
                                                                ,'validation_rule_is_active');
                

            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
            

        END;
    $BODY$;
