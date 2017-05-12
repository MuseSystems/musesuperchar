/*************************************************************************
 *************************************************************************
 **
 ** File:         get_group_entity_remove_violations.sql
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
-- Returns validator violations that would arise if the given group were
-- disassociated with the given entity.  The returned jsonb object has the
-- structure:
-- {
--   "violation_count": 1,
--   "violations": [
--     {
--       "entity_id": 1,
--       "entity_data_table": "public_item",
--       "entity_display_name": "Item",
--       "sc_def_id": 4,
--       "sc_def_internal_name": "tstchr_4",
--       "sc_def_display_name": "Test Char 4",
--       "conditional_validation_rule_id": 6,
--       "conditional_validation_rule_fails_message_text": "2 fails 4",
--       "if_validator_type_id": 14,
--       "if_validator_type_display_name": "Is Checked",
--       "then_validator_type_id": 1,
--       "then_validator_type_display_name": "Text Regular Expression"
--     }
--   ]
-- }

CREATE OR REPLACE FUNCTION musesuperchar.get_group_entity_remove_violations(pGroupId bigint, pEntityId bigint) 
    RETURNS jsonb AS
        $BODY$
            SELECT jsonb_build_object(   'violation_count'
                                        ,count(entity_id)
                                        ,'violations'
                                        ,array_agg(json_build_object(
                                                 'entity_id', entity_id
                                                ,'entity_data_table', entity_data_table
                                                ,'entity_display_name', entity_display_name
                                                ,'sc_def_id', sc_def_id
                                                ,'sc_def_internal_name', sc_def_internal_name
                                                ,'sc_def_display_name', sc_def_display_name
                                                ,'conditional_validation_rule_id', conditional_validation_rule_id
                                                ,'conditional_validation_rule_fails_message_text', conditional_validation_rule_fails_message_text
                                                ,'if_validator_type_id', if_validator_type_id
                                                ,'if_validator_type_display_name', if_validator_type_display_name
                                                ,'then_validator_type_id', then_validator_type_id
                                                ,'then_validator_type_display_name', then_validator_type_display_name)
                                            ))
            FROM
                (SELECT DISTINCT sub.entity_id
                        ,obj.entity_data_table
                        ,obj.entity_display_name
                        ,obj.sc_def_id
                        ,obj.sc_def_internal_name
                        ,obj.sc_def_display_name
                        ,cvr.conditional_validation_rule_id 
                        ,cvr.conditional_validation_rule_fails_message_text
                        ,ifvt.validator_type_id AS if_validator_type_id 
                        ,ifvt.validator_type_display_name AS if_validator_type_display_name 
                        ,thenvt.validator_type_id AS then_validator_type_id 
                        ,thenvt.validator_type_display_name AS then_validator_type_display_name
                FROM    musesuperchar.conditional_validation_rule cvr
                    JOIN musesuperchar.validator_type ifvt 
                        ON cvr.conditional_validation_rule_if_validator_type_id = ifvt.validator_type_id
                    JOIN musesuperchar.validator_type thenvt
                        ON cvr.conditional_validation_rule_then_validator_type_id = thenvt.validator_type_id
                    JOIN musesuperchar.v_superchar_entities obj 
                        ON cvr.conditional_validation_rule_object_sc_def_id = obj.sc_def_id
                    JOIN musesuperchar.v_superchar_entities sub 
                        ON cvr.conditional_validation_rule_subject_sc_def_id = sub.sc_def_id
                WHERE   cvr.conditional_validation_rule_subject_sc_def_id !=
                            cvr.conditional_validation_rule_object_sc_def_id
                    AND pGroupId = any(obj.sc_group_ids)
                    AND obj.entity_id = pEntityId
                    AND sub.entity_id = pEntityId
                    AND array_length(obj.sc_group_ids,1) = 1
                    AND array_length(sub.sc_group_ids,1) > 1) q;
        $BODY$
    LANGUAGE sql STABLE;

ALTER FUNCTION musesuperchar.get_group_entity_remove_violations(pGroupId bigint, pEntityId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_group_entity_remove_violations(pGroupId bigint, pEntityId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_group_entity_remove_violations(pGroupId bigint, pEntityId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_group_entity_remove_violations(pGroupId bigint, pEntityId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_group_entity_remove_violations(pGroupId bigint, pEntityId bigint) 
    IS $DOC$Returns validator violations that would arise if the given group were disassociated with the given entity.  The returned jsonb object has the structure:
{
  "violation_count": 1,
  "violations": [
    {
      "entity_id": 1,
      "entity_data_table": "public_item",
      "entity_display_name": "Item",
      "sc_def_id": 4,
      "sc_def_internal_name": "tstchr_4",
      "sc_def_display_name": "Test Char 4",
      "conditional_validation_rule_id": 6,
      "conditional_validation_rule_fails_message_text": "2 fails 4",
      "if_validator_type_id": 14,
      "if_validator_type_display_name": "Is Checked",
      "then_validator_type_id": 1,
      "then_validator_type_display_name": "Text Regular Expression"
    }
  ]
}$DOC$;
