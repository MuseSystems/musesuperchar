-- File:        trig_a_u_scgrp_qt_ui_maint.sql
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
-- When UI related fields of a given group are changed, we need to update the
-- associated Qt UI XML to reflect the changes.  This should only be necessary
-- on an update as an insert won't have UI relevance until other associations,
-- which themselves will trigger a Qt UI XML generation event, exist.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_a_u_scgrp_qt_ui_maint()
    RETURNS trigger AS
        $BODY$
            DECLARE

            BEGIN


                IF TG_OP = 'UPDATE' THEN
                    PERFORM musesuperchar.update_scgrp_qt_ui_files(NEW.scgrp_id);

                    -- Finally return NEW
                    RETURN NEW;

                END IF;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION musesuperchar.trig_a_u_scgrp_qt_ui_maint()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_a_u_scgrp_qt_ui_maint() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_u_scgrp_qt_ui_maint() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_u_scgrp_qt_ui_maint() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_a_u_scgrp_qt_ui_maint()
    IS $DOC$When UI related fields of a given group are changed, we need to update the associated Qt UI XML to reflect the changes.  This should only be necessary on an update as an insert won't have UI relevance until other associations, which themselves will trigger a Qt UI XML generation event, exist. $DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS c10_trig_a_u_scgrp_qt_ui_maint ON musesuperchar.scgrp;

CREATE TRIGGER c10_trig_a_u_scgrp_qt_ui_maint AFTER UPDATE
    ON musesuperchar.scgrp FOR EACH ROW
    WHEN (
        NEW.scgrp_min_columns != OLD.scgrp_min_columns OR
        NEW.scgrp_is_space_conserved != OLD.scgrp_is_space_conserved OR
        NEW.scgrp_is_row_expansion_allowed != OLD.scgrp_is_row_expansion_allowed
        )
    EXECUTE PROCEDURE musesuperchar.trig_a_u_scgrp_qt_ui_maint();

