/*************************************************************************
 *************************************************************************
 **
 ** File:         add_group_entity_association.sql
 ** Project:      Muse Systems Super Characteristics for xTuple ERP
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
-- Safely adds a a group to entity association.  We can ensure that any group association that gets made will succeed even if the association already exists.
--

CREATE OR REPLACE FUNCTION musesuperchar.add_group_entity_association(pGroupId bigint, pEntityId bigint, pPackageName text DEFAULT NULL)
    RETURNS bigint AS
        $BODY$
            DECLARE
                vPkgHeadId integer;
                vReturnVal bigint;
            BEGIN

                IF coalesce(pGroupId,-1) < 1 THEN
                    RAISE EXCEPTION 'We did not receive a valid group id. (FUNC: musesuperchar.add_group_entity_association) (pGroupId: %, pEntityId: %, pPackageName: %)',
                    pGroupId, pEntityId, pPackageName;

                END IF;

                IF coalesce(pEntityId, -1) < 1 THEN
                    RAISE EXCEPTION 'We did not receive a valid entity id. (FUNC: musesuperchar.add_group_entity_association) (pGroupId: %, pEntityId: %, pPackageName: %)',
                    pGroupId, pEntityId, pPackageName;
                END IF;

                SELECT  pkghead_id INTO vPkgHeadId
                FROM    public.pkghead
                WHERE   pkghead_name = pPackageName;

                INSERT INTO musesuperchar.entity_scgrp_ass
                    ( entity_scgrp_ass_scgrp_id
                     ,entity_scgrp_ass_entity_id
                     ,entity_scgrp_ass_pkghead_id
                     ,entity_scgrp_ass_is_system_locked)
                    VALUES ( pGroupId
                            ,pEntityId
                            ,vPkgHeadId
                            ,vPkgHeadId IS NOT NULL)
                    ON CONFLICT ( entity_scgrp_ass_entity_id
                                 ,entity_scgrp_ass_scgrp_id)
                    DO UPDATE SET
                        entity_scgrp_ass_pkghead_id =
                            coalesce(entity_scgrp_ass.entity_scgrp_ass_pkghead_id
                                ,vPkgHeadId),
                        entity_scgrp_ass_is_system_locked =
                                entity_scgrp_ass.entity_scgrp_ass_is_system_locked
                            OR  vPkgHeadId IS NOT NULL
                    RETURNING entity_scgrp_ass_id INTO vReturnVal;

                RETURN vReturnVal;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION musesuperchar.add_group_entity_association(pGroupId bigint, pEntityId bigint, pPackageName text)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.add_group_entity_association(pGroupId bigint, pEntityId bigint, pPackageName text) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.add_group_entity_association(pGroupId bigint, pEntityId bigint, pPackageName text) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.add_group_entity_association(pGroupId bigint, pEntityId bigint, pPackageName text) TO xtrole;


COMMENT ON FUNCTION musesuperchar.add_group_entity_association(pGroupId bigint, pEntityId bigint, pPackageName text)
    IS $DOC$Safely adds a a group to entity association.  We can ensure that any group association that gets made will succeed even if the association already exists.$DOC$;
