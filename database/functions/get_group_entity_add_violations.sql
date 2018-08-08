/*************************************************************************
 *************************************************************************
 **
 ** File:         get_group_entity_add_violations.sql
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
-- Returns the list of validator violations that would occur if the given group
-- were associated with the given entity.  The format of the returned jsonb is:
-- {
--   "violation_count": 1,
--   "violations": [
--     {
--       "entity_id": 8,
--       "entity_data_table": "public_emp",
--       "entity_display_name": "Employee",
--       "scdef_id": 4,
--       "scdef_internal_name": "tstchr_4",
--       "scdef_display_name": "Test Char 4",
--       "condvalrule_id": 6,
--       "condvalrule_fails_message_text": "2 fails 4",
--       "if_valtype_id": 14,
--       "if_valtype_display_name": "Is Checked",
--       "then_valtype_id": 1,
--       "then_valtype_display_name": "Text Regular Expression"
--     }
--   ]
-- }

CREATE OR REPLACE FUNCTION musesuperchar.get_group_entity_add_violations(pGroupId bigint, pEntityId bigint)
    RETURNS jsonb AS
        $BODY$
            WITH curr_entity AS (
                SELECT   entity_id
                        ,entity_data_table
                        ,entity_display_name
                FROM    musesuperchar.entity
                WHERE   entity_id = pEntityId)
            SELECT jsonb_build_object(   'violation_count'
                                        ,count(condvalrule_id)
                                        ,'violations'
                                        ,array_agg(json_build_object(
                                                 'entity_id', (SELECT entity_id FROM curr_entity)
                                                ,'entity_data_table', (SELECT entity_data_table FROM curr_entity)
                                                ,'entity_display_name', (SELECT entity_display_name FROM curr_entity)
                                                ,'scdef_id', scdef_id
                                                ,'scdef_internal_name', scdef_internal_name
                                                ,'scdef_display_name', scdef_display_name
                                                ,'condvalrule_id', condvalrule_id
                                                ,'condvalrule_fails_message_text', condvalrule_fails_message_text
                                                ,'if_valtype_id', if_valtype_id
                                                ,'if_valtype_display_name', if_valtype_display_name
                                                ,'then_valtype_id', then_valtype_id
                                                ,'then_valtype_display_name', then_valtype_display_name)
                                            ))
            FROM
                (SELECT  DISTINCT obj.scdef_id
                        ,obj.scdef_internal_name
                        ,obj.scdef_display_name
                        ,cvr.condvalrule_id
                        ,cvr.condvalrule_fails_message_text
                        ,ifvt.valtype_id AS if_valtype_id
                        ,ifvt.valtype_display_name AS if_valtype_display_name
                        ,thenvt.valtype_id AS then_valtype_id
                        ,thenvt.valtype_display_name AS then_valtype_display_name
                FROM    musesuperchar.condvalrule cvr
                    JOIN musesuperchar.valtype ifvt
                        ON cvr.condvalrule_if_valtype_id = ifvt.valtype_id
                    JOIN musesuperchar.valtype thenvt
                        ON cvr.condvalrule_then_valtype_id = thenvt.valtype_id
                    JOIN musesuperchar.v_superchar_entities sub
                        ON cvr.condvalrule_subject_scdef_id = sub.scdef_id
                    JOIN musesuperchar.v_superchar_entities obj
                        ON cvr.condvalrule_object_scdef_id = obj.scdef_id
                    LEFT OUTER JOIN musesuperchar.v_superchar_entities targ
                        ON cvr.condvalrule_object_scdef_id = targ.scdef_id
                            AND targ.entity_id = pEntityId
                WHERE   pGroupId = any(sub.scgrp_ids)
                    AND NOT pGroupId = any(obj.scgrp_ids)
                    AND targ.scdef_id IS NULL
                    AND cvr.condvalrule_subject_scdef_id !=
                        cvr.condvalrule_object_scdef_id) q;
        $BODY$
    LANGUAGE sql STABLE;

ALTER FUNCTION musesuperchar.get_group_entity_add_violations(pGroupId bigint, pEntityId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_group_entity_add_violations(pGroupId bigint, pEntityId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_group_entity_add_violations(pGroupId bigint, pEntityId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_group_entity_add_violations(pGroupId bigint, pEntityId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_group_entity_add_violations(pGroupId bigint, pEntityId bigint)
    IS $DOC$Returns the list of validator violations that would occur if the given group were associated with the given entity.  The format of the returned jsonb is:
{
  "violation_count": 1,
  "violations": [
    {
      "entity_id": 8,
      "entity_data_table": "public_emp",
      "entity_display_name": "Employee",
      "scdef_id": 4,
      "scdef_internal_name": "tstchr_4",
      "scdef_display_name": "Test Char 4",
      "condvalrule_id": 6,
      "condvalrule_fails_message_text": "2 fails 4",
      "if_valtype_id": 14,
      "if_valtype_display_name": "Is Checked",
      "then_valtype_id": 1,
      "then_valtype_display_name": "Text Regular Expression"
    }
  ]
}$DOC$;
