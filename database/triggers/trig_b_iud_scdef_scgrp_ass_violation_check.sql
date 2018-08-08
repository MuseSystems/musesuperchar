/*************************************************************************
 *************************************************************************
 **
 ** File:         trig_b_iud_scdef_scgrp_ass_violation_check.sql
 ** Project:      Muse Systems Super Characteristic for xTuple ERP
 ** Author:       Steven C. Buttgereit
 **
 ** (C) 2017-2018 Lima Buttgereit Holdings LLC d/b/a Muse Systems
 **
 ** Contact:
 ** muse.information@musesystems.com  :: https://muse.systems
 **
 ** License: MIT License. See LICENSE.md for complete licensing details.
 **
 *************************************************************************
 ************************************************************************/

--
-- Ensures that changes in the characteristic/group relationships do not induce
-- a validator validation.  We also prevent changes in associations made via
-- UPDATE statements as that is not easily resolvable.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_b_iud_scdef_scgrp_ass_violation_check()
    RETURNS trigger AS
        $BODY$
            DECLARE
                vViolations jsonb;
            BEGIN

                IF TG_OP = 'INSERT' THEN
                    -- Need to make sure the new association doesn't cause an
                    -- issue.
                    vViolations :=
                        musesuperchar.get_superchar_group_add_violations(
                            NEW.scdef_scgrp_ass_scdef_id,
                            NEW.scdef_scgrp_ass_scgrp_id);

                    IF (vViolations ->> 'violation_count')::integer = 0 THEN
                        RETURN NEW;
                    END IF;

                    RAISE EXCEPTION 'The assignment of the requested super characteristic would create an unresolvable validation rules violation (FUNC: musesuperchar.trig_b_iud_scdef_scgrp_ass_violation_check), (%)',vViolations;


                ELSIF TG_OP = 'UPDATE'
                        AND (   NEW.scdef_scgrp_ass_scdef_id =
                                    OLD.scdef_scgrp_ass_scdef_id
                            OR  NEW.scdef_scgrp_ass_scgrp_id =
                                    OLD.scdef_scgrp_ass_scgrp_id) THEN

                        RETURN NEW;

                ELSIF TG_OP = 'UPDATE'
                        AND (   NEW.scdef_scgrp_ass_scdef_id !=
                                    OLD.scdef_scgrp_ass_scdef_id
                            OR  NEW.scdef_scgrp_ass_scgrp_id !=
                                    OLD.scdef_scgrp_ass_scgrp_id) THEN

                    RAISE EXCEPTION 'We do not support reassignment via updating an existing record.  Please delete the association you want to change and add a new association for your desired final state. (FUNC: musesuperchar.trig_b_iud_scdef_scgrp_ass_violation_check). (Old: %, New: %)',OLD::json, NEW::json;

                ELSIF TG_OP = 'DELETE' THEN

                    vViolations :=
                        musesuperchar.get_superchar_group_remove_violations(
                            OLD.scdef_scgrp_ass_scdef_id,
                            OLD.scdef_scgrp_ass_scgrp_id);

                    IF (vViolations ->> 'violation_count')::integer = 0 THEN
                        RETURN OLD;
                    END IF;

                    RAISE EXCEPTION 'The unassignment of the requested super characteristic would create an unresolvable validation rules violation (FUNC: musesuperchar.trig_b_iud_scdef_scgrp_ass_violation_check), (%)',vViolations;
                ELSE
                    RAISE EXCEPTION 'We got to a place we should never get.(FUNC: musesuperchar.trig_b_iud_scdef_scgrp_ass_violation_check) (%)',TG_OP;
                END IF;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

ALTER FUNCTION musesuperchar.trig_b_iud_scdef_scgrp_ass_violation_check()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_b_iud_scdef_scgrp_ass_violation_check() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_b_iud_scdef_scgrp_ass_violation_check() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_b_iud_scdef_scgrp_ass_violation_check() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_b_iud_scdef_scgrp_ass_violation_check()
    IS $DOC$Ensures that changes in the characteristic/group relationships do not induce a validator validation.  We also prevent changes in associations made via UPDATE statements as that is not easily resolvable.$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS a01_trig_b_iud_scdef_scgrp_ass_violation_check ON musesuperchar.scdef_scgrp_ass;

CREATE TRIGGER a01_trig_b_iud_scdef_scgrp_ass_violation_check BEFORE INSERT OR UPDATE OR DELETE
    ON musesuperchar.scdef_scgrp_ass FOR EACH ROW
    EXECUTE PROCEDURE musesuperchar.trig_b_iud_scdef_scgrp_ass_violation_check();
