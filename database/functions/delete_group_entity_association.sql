-- File:        delete_group_entity_association.sql
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
-- A function to safely drop associations between groups and entities.
--

CREATE OR REPLACE FUNCTION musesuperchar.delete_group_entity_association(pGroupId bigint, pEntityId bigint, pPackageName text DEFAULT null)
    RETURNS bigint AS
        $BODY$
            DECLARE
                vPkgHeadId integer;
                vReturnVal bigint;
            BEGIN

                IF coalesce(pGroupId,-1) < 1 THEN
                    RAISE EXCEPTION 'We did not receive a valid group id. (FUNC: musesuperchar.delete_group_entity_association) (pGroupId: %, pEntityId: %, pPackageName: %)',
                    pGroupId, pEntityId, pPackageName;

                END IF;

                IF coalesce(pEntityId, -1) < 1 THEN
                    RAISE EXCEPTION 'We did not receive a valid entity id. (FUNC: musesuperchar.delete_group_entity_association) (pGroupId: %, pEntityId: %, pPackageName: %)',
                    pGroupId, pEntityId, pPackageName;
                END IF;

                SELECT  pkghead_id INTO vPkgHeadId
                FROM    public.pkghead
                WHERE   pkghead_name = pPackageName;

                DELETE
                    FROM    musesuperchar.entity_scgrp_ass
                    WHERE   entity_scgrp_ass_entity_id = pEntityId
                        AND entity_scgrp_ass_scgrp_id = pGroupId
                        AND coalesce(entity_scgrp_ass_pkghead_id, -1)
                                = coalesce(vPkgHeadId, -1)
                        AND (NOT entity_scgrp_ass_is_system_locked
                                OR vPkgHeadId IS NOT NULL)
                    RETURNING entity_scgrp_ass_id INTO vReturnVal;

                RETURN vReturnVal;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION musesuperchar.delete_group_entity_association(pGroupId bigint, pEntityId bigint, pPackageName text)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.delete_group_entity_association(pGroupId bigint, pEntityId bigint, pPackageName text) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.delete_group_entity_association(pGroupId bigint, pEntityId bigint, pPackageName text) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.delete_group_entity_association(pGroupId bigint, pEntityId bigint, pPackageName text) TO xtrole;


COMMENT ON FUNCTION musesuperchar.delete_group_entity_association(pGroupId bigint, pEntityId bigint, pPackageName text)
    IS $DOC$A function to safely drop associations between groups and entities.$DOC$;
