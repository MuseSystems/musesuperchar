-- File:        trig_a_id_scdef_scgrp_ass_maintain_qt_entity_recs.sql
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
-- Maintains the Qt MetaSQL & Data JavaScript entity support records.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_qt_entity_recs()
    RETURNS trigger AS
        $BODY$
            DECLARE
                vGroupId bigint;
            BEGIN

                -- Open block to handle common INSERT and UPDATE tasks
                -- Wrappers independent INSERT and UPDATE IF blocks.
                IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
                    -- Common INSERT/UPDATE opening tasks
                    vGroupId := NEW.scdef_scgrp_ass_scgrp_id;
                ELSE
                    vGroupId := OLD.scdef_scgrp_ass_scgrp_id;
                END IF;

                PERFORM musesuperchar.update_entity_qt_data_metasql_files(
                            entity_scgrp_ass_entity_id),
                        musesuperchar.update_entity_qt_data_js_files(
                            entity_scgrp_ass_entity_id)
                FROM musesuperchar.entity_scgrp_ass
                WHERE entity_scgrp_ass_scgrp_id = vGroupId;



                RETURN null;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_qt_entity_recs()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_qt_entity_recs() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_qt_entity_recs() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_qt_entity_recs() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_qt_entity_recs()
    IS $DOC$Maintains the Qt MetaSQL & Data JavaScript entity support records.$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS d97_trig_a_id_scdef_scgrp_ass_maintain_qt_entity_recs ON musesuperchar.scdef_scgrp_ass;

CREATE TRIGGER d97_trig_a_id_scdef_scgrp_ass_maintain_qt_entity_recs AFTER INSERT OR DELETE
    ON musesuperchar.scdef_scgrp_ass FOR EACH ROW
    EXECUTE PROCEDURE musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_qt_entity_recs();
