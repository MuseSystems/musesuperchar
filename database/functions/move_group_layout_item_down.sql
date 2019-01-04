-- File:        move_group_layout_item_down.sql
-- Location:    musesuperchar/database/functions
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
-- Moves a Group Layout Item down in the onscreen layout.  This function should
-- be used as to preserve the sequence integrity as disrupting it will cause the
-- UI to behave badly.
--

CREATE OR REPLACE FUNCTION musesuperchar.move_group_layout_item_down(pGroupLayoutItemId bigint)
    RETURNS integer AS
        $BODY$
            DECLARE
                vCurrGli musesuperchar.scdef_scgrp_ass;
            BEGIN

                IF NOT EXISTS(SELECT true
                                FROM musesuperchar.scdef_scgrp_ass
                                WHERE scdef_scgrp_ass_id = pGroupLayoutItemId) THEN
                    RAISE EXCEPTION 'We must have a valid Group Layout Item ID in order to reorder such a record downward in the layout.  (FUNC: musesuperchar.move_group_layout_item_down) (pGroupLayoutItemId: %)',pGroupLayoutItemId;
                END IF;

                SELECT  * INTO vCurrGli
                FROM    musesuperchar.scdef_scgrp_ass
                WHERE   scdef_scgrp_ass_id = pGroupLayoutItemId;

                IF vCurrGli.scdef_scgrp_ass_sequence =
                        (SELECT max(scdef_scgrp_ass_sequence)
                         FROM musesuperchar.scdef_scgrp_ass
                         WHERE scdef_scgrp_ass_scgrp_id =
                                vCurrGli.scdef_scgrp_ass_scgrp_id) THEN
                    RETURN vCurrGli.scdef_scgrp_ass_sequence;
                ELSE
                    UPDATE  musesuperchar.scdef_scgrp_ass
                        SET scdef_scgrp_ass_sequence = scdef_scgrp_ass_sequence - 1
                    WHERE   scdef_scgrp_ass_scgrp_id = vCurrGli.scdef_scgrp_ass_scgrp_id
                        AND scdef_scgrp_ass_sequence = vCurrGli.scdef_scgrp_ass_sequence + 1;

                    UPDATE  musesuperchar.scdef_scgrp_ass
                        SET scdef_scgrp_ass_sequence = scdef_scgrp_ass_sequence + 1
                    WHERE   scdef_scgrp_ass_id = pGroupLayoutItemId;

                    RETURN vCurrGli.scdef_scgrp_ass_sequence + 1;
                END IF;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION musesuperchar.move_group_layout_item_down(pGroupLayoutItemId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.move_group_layout_item_down(pGroupLayoutItemId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.move_group_layout_item_down(pGroupLayoutItemId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.move_group_layout_item_down(pGroupLayoutItemId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.move_group_layout_item_down(pGroupLayoutItemId bigint)
    IS $DOC$Moves a Group Layout Item down in the onscreen layout.  This function should be used as to preserve the sequence integrity as disrupting it will cause the UI to behave badly.$DOC$;
