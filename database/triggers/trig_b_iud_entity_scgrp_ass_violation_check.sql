/*************************************************************************
 *************************************************************************
 **
 ** File:         trig_b_iud_entity_scgrp_ass_violation_check.sql
 ** Project:      Muse Systems Super Characteristics for xTuple ERP
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
-- Checks proprosed changes in associations between entities and groups.  Also
-- disallows new associations from being made via update statements (not
-- supported).
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_b_iud_entity_scgrp_ass_violation_check()
    RETURNS trigger AS
        $BODY$
            DECLARE
                vViolations jsonb;
            BEGIN

                IF TG_OP = 'INSERT' THEN
                    -- Need to make sure the new association doesn't cause an
                    -- issue.
                    vViolations :=
                        musesuperchar.get_group_entity_add_violations(
                            NEW.entity_scgrp_ass_scgrp_id,
                            NEW.entity_scgrp_ass_entity_id);

                    IF (vViolations ->> 'violation_count')::integer = 0 THEN
                        RETURN NEW;
                    END IF;

                    RAISE EXCEPTION 'The assignment of the requested group to the requested entity would create an unresolvable validation rules violation (FUNC: musesuperchar.trig_b_iud_entity_scgrp_ass_violation_check), (%)',vViolations;


                ELSIF TG_OP = 'UPDATE'
                        AND (   NEW.entity_scgrp_ass_scgrp_id =
                                    OLD.entity_scgrp_ass_scgrp_id
                            OR  NEW.entity_scgrp_ass_entity_id =
                                    OLD.entity_scgrp_ass_entity_id) THEN

                        RETURN NEW;

                ELSIF TG_OP = 'UPDATE'
                        AND (   NEW.entity_scgrp_ass_scgrp_id !=
                                    OLD.entity_scgrp_ass_scgrp_id
                            OR  NEW.entity_scgrp_ass_entity_id !=
                                    OLD.entity_scgrp_ass_entity_id) THEN

                    RAISE EXCEPTION 'We do not support reassignment via updating an existing record.  Please delete the association you want to change and add a new association for your desired final state. (FUNC: musesuperchar.trig_b_iud_entity_scgrp_ass_violation_check). (Old: %, New: %)',OLD::json, NEW::json;

                ELSIF TG_OP = 'DELETE' THEN

                    vViolations :=
                        musesuperchar.get_group_entity_remove_violations(
                            OLD.entity_scgrp_ass_scgrp_id,
                            OLD.entity_scgrp_ass_entity_id);

                    IF (vViolations ->> 'violation_count')::integer = 0 THEN
                        RETURN OLD;
                    END IF;

                    RAISE EXCEPTION 'The unassignment of the requested group to the requested entity would create an unresolvable validation rules violation (FUNC: musesuperchar.trig_b_iud_entity_scgrp_ass_violation_check), (%)',vViolations;
                ELSE
                    RAISE EXCEPTION 'We got to a place we should never get.(FUNC: musesuperchar.trig_b_iud_entity_scgrp_ass_violation_check) (%)',TG_OP;
                END IF;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

ALTER FUNCTION musesuperchar.trig_b_iud_entity_scgrp_ass_violation_check()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_b_iud_entity_scgrp_ass_violation_check() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_b_iud_entity_scgrp_ass_violation_check() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_b_iud_entity_scgrp_ass_violation_check() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_b_iud_entity_scgrp_ass_violation_check()
    IS $DOC$Checks proprosed changes in associations between entities and groups.  Also disallows new associations from being made via update statements (not supported).$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS a01_trig_b_iud_entity_scgrp_ass_violation_check ON musesuperchar.entity_scgrp_ass;

CREATE TRIGGER a01_trig_b_iud_entity_scgrp_ass_violation_check BEFORE INSERT OR UPDATE OR DELETE
    ON musesuperchar.entity_scgrp_ass FOR EACH ROW
    EXECUTE PROCEDURE musesuperchar.trig_b_iud_entity_scgrp_ass_violation_check(params);
