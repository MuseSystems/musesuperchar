/*************************************************************************
 *************************************************************************
 **
 ** File:         get_superchar_group_remove_violations.sql
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
-- Returns the validator violations that would occur if the given Super
-- Characteristic where removed from the given group.  The format of the jsonb
-- response is:
-- {
--   "violation_count": 1,
--   "violations": [
--     {
--       "entity_id": 8,
--       "entity_data_table": "public_emp",
--       "entity_display_name": "Employee",
--       "sc_def_id": 1,
--       "sc_def_internal_name": "tstchr_1",
--       "sc_def_display_name": "Test Char 1",
--       "conditional_validation_rule_id": 4,
--       "conditional_validation_rule_fails_message_text": "1 fails 3",
--       "if_validator_type_id": 2,
--       "if_validator_type_display_name": "Equals",
--       "then_validator_type_id": 1,
--       "then_validator_type_display_name": "Text Regular Expression"
--     }
--   ]
-- }

CREATE OR REPLACE FUNCTION musesuperchar.get_superchar_group_remove_violations(pObjSuperCharId bigint, pGroupId bigint) 
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
                (SELECT   DISTINCT sub.entity_id
                         ,sub.entity_data_table
                         ,sub.entity_display_name
                         ,sub.sc_def_id
                         ,sub.sc_def_internal_name
                         ,sub.sc_def_display_name
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
                                 AND obj.entity_id = obj.entity_id
                         LEFT OUTER JOIN (SELECT  DISTINCT sc_def_sc_group_ass_sc_def_id 
                                                 ,esga.entity_sc_group_ass_entity_id
                                          FROM    musesuperchar.sc_def_sc_group_ass sdsga
                                              JOIN musesuperchar.entity_sc_group_ass esga
                                                  ON sdsga.sc_def_sc_group_ass_sc_group_id =
                                                      esga.entity_sc_group_ass_sc_group_id
                                          WHERE   sdsga.sc_def_sc_group_ass_sc_group_id != pGroupId) e
                             ON e.sc_def_sc_group_ass_sc_def_id = sub.sc_def_id
                                 AND e.entity_sc_group_ass_entity_id = sub.entity_id
                 WHERE   cvr.conditional_validation_rule_object_sc_def_id = pObjSuperCharId
                     AND cvr.conditional_validation_rule_subject_sc_def_id != pObjSuperCharId
                     AND e.entity_sc_group_ass_entity_id IS NULL) q;
        $BODY$
    LANGUAGE sql STABLE;

ALTER FUNCTION musesuperchar.get_superchar_group_remove_violations(pObjSuperCharId bigint, pGroupId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_superchar_group_remove_violations(pObjSuperCharId bigint, pGroupId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_superchar_group_remove_violations(pObjSuperCharId bigint, pGroupId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_superchar_group_remove_violations(pObjSuperCharId bigint, pGroupId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_superchar_group_remove_violations(pObjSuperCharId bigint, pGroupId bigint) 
    IS $DOC$Returns the validator violations that would occur if the given Super Characteristic where removed from the given group.  The format of the jsonb response is:
{
  "violation_count": 1,
  "violations": [
    {
      "entity_id": 8,
      "entity_data_table": "public_emp",
      "entity_display_name": "Employee",
      "sc_def_id": 1,
      "sc_def_internal_name": "tstchr_1",
      "sc_def_display_name": "Test Char 1",
      "conditional_validation_rule_id": 4,
      "conditional_validation_rule_fails_message_text": "1 fails 3",
      "if_validator_type_id": 2,
      "if_validator_type_display_name": "Equals",
      "then_validator_type_id": 1,
      "then_validator_type_display_name": "Text Regular Expression"
    }
  ]
}$DOC$;
