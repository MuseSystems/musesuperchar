/*************************************************************************
 *************************************************************************
 **
 ** File:         get_group_entity_add_violations.sql
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
-- Returns the list of validator violations that would occur if the given group
-- were associated with the given entity.  The format of the returned jsonb is:
-- {
--   "violation_count": 1,
--   "violations": [
--     {
--       "entity_id": 8,
--       "entity_data_table": "public_emp",
--       "entity_display_name": "Employee",
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
                                        ,count(conditional_validation_rule_id)
                                        ,'violations'
                                        ,array_agg(json_build_object(
                                                 'entity_id', (SELECT entity_id FROM curr_entity)
                                                ,'entity_data_table', (SELECT entity_data_table FROM curr_entity)
                                                ,'entity_display_name', (SELECT entity_display_name FROM curr_entity)
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
                (SELECT  DISTINCT obj.sc_def_id
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
                    JOIN musesuperchar.v_superchar_entities sub 
                        ON cvr.conditional_validation_rule_subject_sc_def_id = sub.sc_def_id
                    JOIN musesuperchar.v_superchar_entities obj
                        ON cvr.conditional_validation_rule_object_sc_def_id = obj.sc_def_id
                    LEFT OUTER JOIN musesuperchar.v_superchar_entities targ
                        ON cvr.conditional_validation_rule_object_sc_def_id = targ.sc_def_id
                            AND targ.entity_id = pEntityId
                WHERE   pGroupId = any(sub.sc_group_ids)
                    AND NOT pGroupId = any(obj.sc_group_ids)
                    AND cvr.conditional_validation_rule_subject_sc_def_id != 
                        cvr.conditional_validation_rule_object_sc_def_id) q;
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
