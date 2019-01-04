-- File:        trig_a_id_scdef_scgrp_ass_maintain_entity_structure.sql
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
-- Ensures the that entity data structure is in sync with the group/super
-- characteristic definition.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_entity_structure()
    RETURNS trigger AS
        $BODY$
            DECLARE

            BEGIN

                PERFORM musesuperchar.update_entity_data_structure();
                RETURN NULL;
            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

ALTER FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_entity_structure()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_entity_structure() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_entity_structure() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_entity_structure() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_entity_structure()
    IS $DOC$Ensures the that entity data structure is in sync with the group/super characteristic definition.$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS d95_trig_a_id_scdef_scgrp_ass_maintain_entity_structure ON musesuperchar.scdef_scgrp_ass;

CREATE TRIGGER d95_trig_a_id_scdef_scgrp_ass_maintain_entity_structure AFTER INSERT OR DELETE
    ON musesuperchar.scdef_scgrp_ass FOR EACH ROW
    EXECUTE PROCEDURE musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_entity_structure();

