-- File:        trig_b_iu_condvalrule_violation_check.sql
-- Location:    musesuperchar/database/triggers
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


--
-- Performs checks to proposed conditional validation rule to see if they would
-- create validator violations.  A validator violation is a case where the rule
-- can never evaluate to true due to a subject characteristic being unable to
-- access its object characteristic.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_b_iu_condvalrule_violation_check()
    RETURNS trigger AS
        $BODY$
            DECLARE
                vViolations jsonb;
            BEGIN
                -- If the conditional validation rule has matching subject and
                -- object characteristics (self-validating) then we just
                -- return NEW as these never create a violation.
                IF NEW.condvalrule_subject_scdef_id =
                    NEW.condvalrule_object_scdef_id THEN

                    RETURN NEW;

                END IF;

                -- Check for violations
                vViolations :=
                    musesuperchar.get_superchar_non_overlapping_entities(
                        NEW.condvalrule_subject_scdef_id,
                        NEW.condvalrule_object_scdef_id);

                -- If we have 0 violations then return NEW.
                IF (vViolations ->> 'non_overlapping_count')::integer = 0 THEN
                    RETURN NEW;
                END IF;

                -- If we have more than 0 violations or we can't tell if we have
                -- violations or not: stop the world.
                RAISE EXCEPTION 'The proposed conditional validation rule would not be able to be satisfied in some circumstances. (FUNC: musesuperchar.trig_b_iu_condvalrule_violation_check) (%)',vViolations;


            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

ALTER FUNCTION musesuperchar.trig_b_iu_condvalrule_violation_check()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_b_iu_condvalrule_violation_check() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_b_iu_condvalrule_violation_check() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_b_iu_condvalrule_violation_check() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_b_iu_condvalrule_violation_check()
    IS $DOC$Performs checks to proposed conditional validation rule to see if they would create validator violations.  A validator violation is a case where the rule can never evaluate to true due to a subject characteristic being unable to access its object characteristic.$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS a01_trig_b_iu_condvalrule_violation_check ON musesuperchar.condvalrule;

CREATE TRIGGER a01_trig_b_iu_condvalrule_violation_check BEFORE INSERT OR UPDATE
    ON musesuperchar.condvalrule FOR EACH ROW
    EXECUTE PROCEDURE musesuperchar.trig_b_iu_condvalrule_violation_check();