/*************************************************************************
 *************************************************************************
 **
 ** File:         trig_b_iu_conditional_validation_rule_violation_check.sql
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

--
-- Performs checks to proposed conditional validation rule to see if they would
-- create validator violations.  A validator violation is a case where the rule
-- can never evaluate to true due to a subject characteristic being unable to
-- access its object characteristic.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_b_iu_conditional_validation_rule_violation_check() 
    RETURNS trigger AS
        $BODY$
            DECLARE
                vViolations jsonb;
            BEGIN
                -- If the conditional validation rule has matching subject and
                -- object characteristics (self-validating) then we just 
                -- return NEW as these never create a violation.
                IF NEW.conditional_validation_rule_subject_sc_def_id =
                    NEW.conditional_validation_rule_object_sc_def_id THEN

                    RETURN NEW;

                END IF;

                -- Check for violations
                vViolations := 
                    musesuperchar.get_superchar_non_overlapping_entities(
                        NEW.conditional_validation_rule_subject_sc_def_id,
                        NEW.conditional_validation_rule_object_sc_def_id);

                -- If we have 0 violations then return NEW.
                IF (vViolations ->> 'non_overlapping_count')::integer = 0 THEN 
                    RETURN NEW;
                END IF;

                -- If we have more than 0 violations or we can't tell if we have
                -- violations or not: stop the world.
                RAISE EXCEPTION 'The proposed conditional validation rule would not be able to be satisfied in some circumstances. (FUNC: musesuperchar.trig_b_iu_conditional_validation_rule_violation_check) (%)',vViolations;
                

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION musesuperchar.trig_b_iu_conditional_validation_rule_violation_check()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_b_iu_conditional_validation_rule_violation_check() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_b_iu_conditional_validation_rule_violation_check() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_b_iu_conditional_validation_rule_violation_check() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_b_iu_conditional_validation_rule_violation_check() 
    IS $DOC$Performs checks to proposed conditional validation rule to see if they would create validator violations.  A validator violation is a case where the rule can never evaluate to true due to a subject characteristic being unable to access its object characteristic.$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS a01_trig_b_iu_conditional_validation_rule_violation_check ON musesuperchar.conditional_validation_rule;

CREATE TRIGGER a01_trig_b_iu_conditional_validation_rule_violation_check BEFORE INSERT OR UPDATE
    ON musesuperchar.conditional_validation_rule FOR EACH ROW 
    EXECUTE PROCEDURE musesuperchar.trig_b_iu_conditional_validation_rule_violation_check();