-- File:        trig_a_d_scgrp_delete_saved_layouts.sql
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
-- Ensures that any saved layouts are deleted when the owning group is deleted.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_a_d_scgrp_delete_saved_layouts()
    RETURNS trigger AS
        $BODY$
            DECLARE
                vCfgPfx text := musextputils.get_musemetric('musesuperchar','widgetPrefix',null::text);
            BEGIN

                IF TG_OP = 'DELETE' THEN
                    -- Delete the Qt UI form from the musesuperchar package
                    DELETE FROM musesuperchar.pkguiform
                        WHERE uiform_name = vCfgPfx||'_'||OLD.scgrp_internal_name
                            AND uiform_order = 0;

                    DELETE FROM musesuperchar.pkgscript
                        WHERE script_name = vCfgPfx||'_'||OLD.scgrp_internal_name
                            AND script_order = 0;

                    RETURN OLD;
                END IF;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

ALTER FUNCTION musesuperchar.trig_a_d_scgrp_delete_saved_layouts()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_a_d_scgrp_delete_saved_layouts() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_d_scgrp_delete_saved_layouts() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_d_scgrp_delete_saved_layouts() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_a_d_scgrp_delete_saved_layouts()
    IS $DOC$Ensures that any saved layouts are deleted when the owning group is deleted.$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS b10_trig_a_d_scgrp_delete_saved_layouts ON musesuperchar.scgrp;

CREATE TRIGGER b10_trig_a_d_scgrp_delete_saved_layouts AFTER DELETE
    ON musesuperchar.scgrp FOR EACH ROW
    EXECUTE PROCEDURE musesuperchar.trig_a_d_scgrp_delete_saved_layouts();

