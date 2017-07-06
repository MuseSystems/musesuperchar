/*************************************************************************
 *************************************************************************
 **
 ** File:         trig_a_iud_scdef_scgrp_ass_qt_ui_maint.sql
 ** Project:      Muse Systems Super Charateristics for xTuple ERP
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
-- Updates the Qt UI related xml form and JavaScript backing script.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_a_iud_scdef_scgrp_ass_qt_ui_maint() 
    RETURNS trigger AS
        $BODY$
            DECLARE

            BEGIN

                -- Open block to handle common INSERT and UPDATE tasks
                -- Wrappers independent INSERT and UPDATE IF blocks. 
                IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
                    -- Common INSERT/UPDATE opening tasks
                    PERFORM musesuperchar.update_scgrp_qt_ui_files(
                        NEW.scdef_scgrp_ass_scgrp_id);
                    -- Finally return NEW
                    RETURN NEW;
                
                END IF;

                IF TG_OP = 'DELETE' THEN
                    CASE 
                        WHEN EXISTS(SELECT true 
                                  FROM musesuperchar.scgrp 
                                  WHERE scgrp_id = 
                                            OLD.scdef_scgrp_ass_scgrp_id) THEN

                            PERFORM musesuperchar.update_scgrp_qt_ui_files(
                                OLD.scdef_scgrp_ass_scgrp_id);
                    ELSE

                        null;

                    END CASE;

                    RETURN OLD;
                END IF;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

ALTER FUNCTION musesuperchar.trig_a_iud_scdef_scgrp_ass_qt_ui_maint()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_a_iud_scdef_scgrp_ass_qt_ui_maint() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_iud_scdef_scgrp_ass_qt_ui_maint() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_iud_scdef_scgrp_ass_qt_ui_maint() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_a_iud_scdef_scgrp_ass_qt_ui_maint() 
    IS $DOC$Updates the Qt UI related xml form and JavaScript backing script.$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS 
    z10_trig_a_iud_scdef_scgrp_ass_qt_ui_maint ON musesuperchar.scdef_scgrp_ass;

CREATE TRIGGER z10_trig_a_iud_scdef_scgrp_ass_qt_ui_maint 
    AFTER INSERT OR UPDATE OR DELETE
    ON musesuperchar.scdef_scgrp_ass FOR EACH ROW 
    EXECUTE PROCEDURE musesuperchar.trig_a_iud_scdef_scgrp_ass_qt_ui_maint();

