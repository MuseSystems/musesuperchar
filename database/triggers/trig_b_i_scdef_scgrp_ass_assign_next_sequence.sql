-- File:        trig_b_i_scdef_scgrp_ass_assign_next_sequence.sql
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
-- Sets the sequence number of a new record to be sequentially after the last
-- Group Layout Item in the group.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_b_i_scdef_scgrp_ass_assign_next_sequence()
    RETURNS trigger AS
        $BODY$
            DECLARE

            BEGIN

                NEW.scdef_scgrp_ass_sequence :=
                    musesuperchar.get_group_layout_item_next_sequence(
                        NEW.scdef_scgrp_ass_scgrp_id);

                RETURN NEW;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

ALTER FUNCTION musesuperchar.trig_b_i_scdef_scgrp_ass_assign_next_sequence()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_b_i_scdef_scgrp_ass_assign_next_sequence() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_b_i_scdef_scgrp_ass_assign_next_sequence() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_b_i_scdef_scgrp_ass_assign_next_sequence() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_b_i_scdef_scgrp_ass_assign_next_sequence()
    IS $DOC$Sets the sequence number of a new record to be sequentially after the last Group Layout Item in the group.$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS a01_trig_b_i_scdef_scgrp_ass_assign_next_sequence ON musesuperchar.scdef_scgrp_ass;

CREATE TRIGGER a01_trig_b_i_scdef_scgrp_ass_assign_next_sequence BEFORE INSERT
    ON musesuperchar.scdef_scgrp_ass FOR EACH ROW
    EXECUTE PROCEDURE musesuperchar.trig_b_i_scdef_scgrp_ass_assign_next_sequence();

