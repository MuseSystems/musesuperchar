-- File:        trig_a_d_scdef_scgrp_ass_sequence_maint.sql
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
-- Ensures the that sequence for any given group is numerically sequential in
-- the case of a record being deleted.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_a_d_scdef_scgrp_ass_sequence_maint()
    RETURNS trigger AS
        $BODY$
            DECLARE

            BEGIN

                UPDATE musesuperchar.scdef_scgrp_ass
                    SET scdef_scgrp_ass_sequence = scdef_scgrp_ass_sequence - 1
                WHERE scdef_scgrp_ass_scgrp_id = OLD.scdef_scgrp_ass_scgrp_id
                    AND scdef_scgrp_ass_sequence > OLD.scdef_scgrp_ass_sequence;

                RETURN OLD;
            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

ALTER FUNCTION musesuperchar.trig_a_d_scdef_scgrp_ass_sequence_maint()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_a_d_scdef_scgrp_ass_sequence_maint() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_d_scdef_scgrp_ass_sequence_maint() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_d_scdef_scgrp_ass_sequence_maint() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_a_d_scdef_scgrp_ass_sequence_maint()
    IS $DOC$Ensures the that sequence for any given group is numerically sequential in the case of a record being deleted.$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS a01_trig_a_d_scdef_scgrp_ass_sequence_maint ON musesuperchar.scdef_scgrp_ass;

CREATE TRIGGER a01_trig_a_d_scdef_scgrp_ass_sequence_maint AFTER DELETE
    ON musesuperchar.scdef_scgrp_ass FOR EACH ROW
    EXECUTE PROCEDURE musesuperchar.trig_a_d_scdef_scgrp_ass_sequence_maint();

