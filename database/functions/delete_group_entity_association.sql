/*************************************************************************
 *************************************************************************
 **
 ** File:         delete_group_entity_association.sql
 ** Project:      Muse Systems Super Characteristic for xTuple ERP
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
