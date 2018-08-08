/*************************************************************************
 *************************************************************************
 **
 ** File:         trig_a_id_entity_scgrp_ass_maintain_qt_entity_recs.sql
 ** Project:      Muse Systems Super Characteristics
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
-- Manages the changes to Qt MetaSQL & Data JavaScript records when an entity structure changes.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_a_id_entity_scgrp_ass_maintain_qt_entity_recs()
    RETURNS trigger AS
        $BODY$
            DECLARE

            BEGIN

                -- Open block to handle common INSERT and UPDATE tasks
                -- Wrappers independent INSERT and UPDATE IF blocks.
                IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
                    -- Common INSERT/UPDATE opening tasks
                    PERFORM musesuperchar.update_entity_qt_data_metasql_files(
                                NEW.entity_scgrp_ass_entity_id),
                            musesuperchar.update_entity_qt_data_js_files(
                                NEW.entity_scgrp_ass_entity_id);
                ELSE
                    PERFORM musesuperchar.update_entity_qt_data_metasql_files(
                                OLD.entity_scgrp_ass_entity_id),
                            musesuperchar.update_entity_qt_data_js_files(
                                OLD.entity_scgrp_ass_entity_id);
                END IF;

                RETURN null;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

ALTER FUNCTION musesuperchar.trig_a_id_entity_scgrp_ass_maintain_qt_entity_recs()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_a_id_entity_scgrp_ass_maintain_qt_entity_recs() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_id_entity_scgrp_ass_maintain_qt_entity_recs() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_id_entity_scgrp_ass_maintain_qt_entity_recs() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_a_id_entity_scgrp_ass_maintain_qt_entity_recs()
    IS $DOC$Manages the changes to Qt MetaSQL & Data JavaScript records when an entity structure changes.$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS d97_trig_a_id_entity_scgrp_ass_maintain_qt_entity_recs ON musesuperchar.entity_scgrp_ass;

CREATE TRIGGER d97_trig_a_id_entity_scgrp_ass_maintain_qt_entity_recs AFTER INSERT OR DELETE
    ON musesuperchar.entity_scgrp_ass FOR EACH ROW
    EXECUTE PROCEDURE musesuperchar.trig_a_id_entity_scgrp_ass_maintain_qt_entity_recs();

