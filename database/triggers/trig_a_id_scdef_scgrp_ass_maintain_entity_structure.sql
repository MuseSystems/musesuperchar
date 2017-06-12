/*************************************************************************
 *************************************************************************
 **
 ** File:         trig_a_id_scdef_scgrp_ass_maintain_entity_structure.sql
 ** Project:      Muse Systems Super Characteristics for xTuple ERP
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
    LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_entity_structure()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_entity_structure() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_entity_structure() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_entity_structure() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_entity_structure() 
    IS $DOC$Ensures the that entity data structure is in sync with the group/super characteristic definition.$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS z99_trig_a_id_scdef_scgrp_ass_maintain_entity_structure ON musesuperchar.scdef_scgrp_ass;

CREATE TRIGGER z99_trig_a_id_scdef_scgrp_ass_maintain_entity_structure AFTER INSERT OR DELETE
    ON musesuperchar.scdef_scgrp_ass FOR EACH ROW 
    EXECUTE PROCEDURE musesuperchar.trig_a_id_scdef_scgrp_ass_maintain_entity_structure();

