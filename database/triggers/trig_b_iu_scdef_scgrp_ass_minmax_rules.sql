-- File:        trig_b_iu_scdef_scgrp_ass_minmax_rules.sql
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
-- Checks the validity of width/height min/max parameters and established a rule
-- for any violations.  Specifically, if a non-zero min value is greater than a
-- non-zero max value, set the min value to be the same as the max value.  This
-- way we move forward (no error), and we are likely to have too much space for
-- the information rather than too little space for the information.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_b_iu_scdef_scgrp_ass_minmax_rules()
    RETURNS trigger AS
        $BODY$
            DECLARE
                vMaxWidth integer;
                vMinWidth integer;
                vMaxHeight integer;
                vMinHeight integer;
            BEGIN

                -- Open block to handle common INSERT and UPDATE tasks
                -- Wrappers independent INSERT and UPDATE IF blocks.
                IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
                    vMinWidth := coalesce(NEW.scdef_scgrp_ass_width, 0);
                    vMaxWidth := coalesce(NEW.scdef_scgrp_ass_max_width, 0);
                    vMinHeight := coalesce(NEW.scdef_scgrp_ass_height, 0);
                    vMaxHeight := coalesce(NEW.scdef_scgrp_ass_max_height, 0);

                    IF vMaxWidth > 0 AND vMaxWidth < vMinWidth THEN
                        NEW.scdef_scgrp_ass_width := vMaxWidth;
                    END IF;

                    IF vMaxHeight > 0 AND vMaxHeight < vMinHeight THEN
                        NEW.scdef_scgrp_ass_height := vMaxHeight;
                    END IF;

                    IF vMinWidth < 1 THEN
                        NEW.scdef_scgrp_ass_width := null;
                    END IF;

                    IF vMaxWidth < 1 THEN
                        NEW.scdef_scgrp_ass_max_width := null;
                    END IF;

                    IF vMinHeight < 1 THEN
                        NEW.scdef_scgrp_ass_height := null;
                    END IF;

                    IF vMaxHeight < 1 THEN
                        NEW.scdef_scgrp_ass_max_height := null;
                    END IF;

                    RETURN NEW;

                END IF;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION musesuperchar.trig_b_iu_scdef_scgrp_ass_minmax_rules()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_b_iu_scdef_scgrp_ass_minmax_rules() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_b_iu_scdef_scgrp_ass_minmax_rules() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_b_iu_scdef_scgrp_ass_minmax_rules() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_b_iu_scdef_scgrp_ass_minmax_rules()
    IS $DOC$Checks the validity of width/height min/max parameters and established a rule for any violations.  Specifically, if a non-zero min value is greater than a non-zero max value, set the min value to be the same as the max value.  This way we move forward (no error), and we are likely to have too much space for the information rather than too little space for the information. $DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS a15_trig_b_iu_scdef_scgrp_ass_minmax_rules ON musesuperchar.scdef_scgrp_ass;

CREATE TRIGGER a15_trig_b_iu_scdef_scgrp_ass_minmax_rules BEFORE INSERT OR UPDATE
    ON musesuperchar.scdef_scgrp_ass FOR EACH ROW
    EXECUTE PROCEDURE musesuperchar.trig_b_iu_scdef_scgrp_ass_minmax_rules();

