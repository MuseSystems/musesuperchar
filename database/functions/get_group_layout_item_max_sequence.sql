

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