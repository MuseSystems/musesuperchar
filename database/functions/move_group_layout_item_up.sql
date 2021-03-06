-- File:        move_group_layout_item_up.sql
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
-- Moves a given Group Layout Item up in the layout while ensuring that the
-- sequence remains intact.  This function should be used to ensure that
-- sequencing is consistent.
--

CREATE OR REPLACE FUNCTION musesuperchar.move_group_layout_item_up(pGroupLayoutItemId bigint)
    RETURNS integer AS
        $BODY$
            DECLARE
                vCurrGli musesuperchar.scdef_scgrp_ass;
            BEGIN
                IF NOT EXISTS(SELECT true
                                FROM musesuperchar.scdef_scgrp_ass
                                WHERE scdef_scgrp_ass_id = pGroupLayoutItemId) THEN
                    RAISE EXCEPTION 'We must have a valid Group Layout Item ID in order to reorder such a record upward in the layout.  (FUNC: musesuperchar.move_group_layout_item_up) (pGroupLayoutItemId: %)',pGroupLayoutItemId;
                END IF;

                SELECT  * INTO vCurrGli
                FROM    musesuperchar.scdef_scgrp_ass
                WHERE   scdef_scgrp_ass_id = pGroupLayoutItemId;

                IF vCurrGli.scdef_scgrp_ass_sequence = 1 THEN
                    RETURN 1;
                ELSE
                    UPDATE  musesuperchar.scdef_scgrp_ass
                        SET scdef_scgrp_ass_sequence = scdef_scgrp_ass_sequence + 1
                    WHERE   scdef_scgrp_ass_scgrp_id = vCurrGli.scdef_scgrp_ass_scgrp_id
                        AND scdef_scgrp_ass_sequence = vCurrGli.scdef_scgrp_ass_sequence - 1;

                    UPDATE  musesuperchar.scdef_scgrp_ass
                        SET scdef_scgrp_ass_sequence = scdef_scgrp_ass_sequence - 1
                    WHERE   scdef_scgrp_ass_id = pGroupLayoutItemId;

                    RETURN vCurrGli.scdef_scgrp_ass_sequence - 1;
                END IF;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION musesuperchar.move_group_layout_item_up(pGroupLayoutItemId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.move_group_layout_item_up(pGroupLayoutItemId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.move_group_layout_item_up(pGroupLayoutItemId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.move_group_layout_item_up(pGroupLayoutItemId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.move_group_layout_item_up(pGroupLayoutItemId bigint)
    IS $DOC$Moves a given Group Layout Item up in the layout while ensuring that the sequence remains intact.  This function should be used to ensure that sequencing is consistent.$DOC$;
