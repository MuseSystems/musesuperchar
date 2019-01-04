-- File:        condvalrule.init.sql
-- Location:    musesuperchar/database/tables
-- Project:     Muse Systems Super Characteristics for xTuple ERP
--
-- Licensed to Lima Buttgereit Holdings LLC (d/b/a Muse Systems) under one or
-- more agreements.  Muse Systems licenses this file to you under the Apache
-- License, Version 2.0.
--
-- See the LICENSE file in the project root for license terms and conditions.
-- See the NOTICE file in the project root for copyright ownership information.
--
-- muse.information@musesystems.com  :: https://muse.systems


DO
    $BODY$
        DECLARE

        BEGIN

            -- Create the table if it does not exist.  Apply deltas if it does and it's needed.
            IF NOT EXISTS(SELECT     true
                          FROM         musextputils.v_basic_catalog
                          WHERE     table_schema_name = 'musesuperchar'
                                  AND table_name = 'condvalrule') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.condvalrule (
                     condvalrule_id    bigserial    NOT NULL    PRIMARY KEY
                    ,condvalrule_subject_scdef_id bigint NOT NULL REFERENCES musesuperchar.scdef (scdef_id) ON DELETE CASCADE
                    ,condvalrule_object_scdef_id bigint NOT NULL REFERENCES musesuperchar.scdef (scdef_id) ON DELETE CASCADE
                    ,condvalrule_if_valtype_id bigint NOT NULL REFERENCES musesuperchar.valtype (valtype_id)
                    ,condvalrule_ifval_regexp text
                    ,condvalrule_ifval_numrange numrange
                    ,condvalrule_ifval_daterange daterange
                    ,condvalrule_then_valtype_id bigint NOT NULL REFERENCES musesuperchar.valtype (valtype_id)
                    ,condvalrule_thenval_regexp text
                    ,condvalrule_thenval_numrange numrange
                    ,condvalrule_thenval_daterange daterange
                    ,condvalrule_fails_message_text text NOT NULL
                    ,condvalrule_is_system_locked boolean NOT NULL DEFAULT false
                    ,condvalrule_pkghead_id integer REFERENCES public.pkghead (pkghead_id)
                );

                ALTER TABLE  musesuperchar.condvalrule OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.condvalrule FROM public;
                GRANT ALL ON TABLE musesuperchar.condvalrule TO admin;
                GRANT ALL ON TABLE musesuperchar.condvalrule TO xtrole;

                COMMENT ON TABLE musesuperchar.condvalrule
                    IS $DOC$Defines one or more conditional validation rule to apply.  Depending on the values of the object characteristic in the owning musesuperchar.validation_rule table, we can validate the values of the subject characteristic.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_subject_scdef_id IS
                $DOC$Identifies the super characteristic to for whose benefit this rule will be evaluated.  Any action taken due to a validation rule will be applied to the subject characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_object_scdef_id IS
                $DOC$Identifies a characteristic which will be evaluated in order to know what must happen in regards to the subject characteristic.  The object is not the characteristic on which any action will be applied, but rather whose state will determine what must happen with the subject characteristic.  An object characteristic can also be the subject characteristic, such as requiring the characteristic to have a certain value.$DOC$;

                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_if_valtype_id IS
                $DOC$The type of validation to perform on the object characteristic to see if the "then" validation should be performed on the the subject characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_ifval_regexp IS
                $DOC$If the "if" validator is a text type this is the regular expression which to apply to the object characteristic value.$DOC$;

                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_ifval_numrange IS
                $DOC$If the "if" validator is a numeric type this is the regular expression which to apply to the object characteristic value.$DOC$;

                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_ifval_daterange IS
                $DOC$If the "if" validator is a date type this is the regular expression which to apply to the object characteristic value.$DOC$;

                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_then_valtype_id IS
                $DOC$The type of validation to apply to the subject characteristic if the "if" test performed on the object characteristic is true.$DOC$;

                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_thenval_regexp IS
                $DOC$If the "if" test performed on the object characteristic evaluates true and the validation type is a text type, this validation should be performed on the subject characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_thenval_numrange IS
                $DOC$If the "if" test performed on the object characteristic evaluates true and the validation type is a numeric type, this validation should be performed on the subject characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_thenval_daterange IS
                $DOC$If the "if" test performed on the object characteristic evaluates true and the validation type is a date type, this validation should be performed on the subject characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_fails_message_text IS
                $DOC$If the validation is applied to the subject characteristic and fails, this value is the message displayed to the end user.  This message should typically appear on an aborted save.$DOC$;

                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_is_system_locked IS
                $DOC$If true, the validation rule is managed by the system (most likely an extension package).  If false, the validation is consider user manageable.$DOC$;

                COMMENT ON COLUMN musesuperchar.condvalrule.condvalrule_pkghead_id IS
                $DOC$If the validation rule is system managed it is most likely managed via an extension package and this is a reference to the managing package.$DOC$;


                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'condvalrule'
                                                                ,'condvalrule_date_created'
                                                                ,'condvalrule_role_created'
                                                                ,'condvalrule_date_deactivated'
                                                                ,'condvalrule_role_deactivated'
                                                                ,'condvalrule_date_modified'
                                                                ,'condvalrule_wallclock_modified'
                                                                ,'condvalrule_role_modified'
                                                                ,'condvalrule_row_version_number'
                                                                ,'condvalrule_is_active');

            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
        END;
    $BODY$;
