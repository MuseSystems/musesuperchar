-- File:        get_group_layout_item_max_sequence.sql
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
-- Returns the current max sequence number in the Group Layout for the given group.
--

CREATE OR REPLACE FUNCTION musesuperchar.get_group_layout_item_max_sequence(pGroupId bigint)
    RETURNS integer AS
        $BODY$
            DECLARE

            BEGIN
                IF NOT EXISTS(SELECT true
                                FROM musesuperchar.scgrp
                                WHERE scgrp_id = pGroupId) THEN
                    RAISE EXCEPTION 'We require a valid Group ID in order to find the current max sequence number. (FUNC: musesuperchar.get_group_layout_item_max_sequence) (pGroupId: %)',pGroupId;
                END IF;

                RETURN (SELECT coalesce((
                            SELECT  max(scdef_scgrp_ass_sequence)
                            FROM    musesuperchar.scdef_scgrp_ass
                            WHERE   scdef_scgrp_ass_scgrp_id = pGroupId),0));

            END;
        $BODY$
    LANGUAGE plpgsql STABLE;

ALTER FUNCTION musesuperchar.get_group_layout_item_max_sequence(pGroupId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_group_layout_item_max_sequence(pGroupId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_group_layout_item_max_sequence(pGroupId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_group_layout_item_max_sequence(pGroupId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_group_layout_item_max_sequence(pGroupId bigint)
    IS $DOC$Returns the current max sequence number in the Group Layout for the given group.$DOC$;