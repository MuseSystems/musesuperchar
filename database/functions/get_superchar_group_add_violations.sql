/*************************************************************************
 *************************************************************************
 **
 ** File:         get_superchar_group_add_violations.sql
 ** Project:      Muse Systems Super Characteristic for xTuple ERP
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
-- Returns potential validation violations when adding a Super Characteristic to
-- a group.  Since a Super Characteristic defines its own validation rules, and
-- group defines with what entities its member characteristics are associated
-- with, it is possible to inadvertantly add characteristic to a group (and
-- thereby entity) for which passing validation is not possible.  For a given
-- Super Characteristic and group, this function will return a JSON (jsonb)
-- object which counts the number of violations and enumerates the entity &
-- missing characteristics which cause the validator exceptions.  The returns
-- JSON object has the following format:
-- {
--   "non_overlapping_count": 1,
--   "non_overlapping_entities": [
--     {
--       "entity_id": 8,
--       "entity_data_table": "public_emp",
--       "entity_display_name": "Employee",
--       "sc_def_id": 3,
--       "sc_def_internal_name": "tstchr_3",
--       "sc_def_display_name": "Test Char 3",
--       "conditional_validation_rule_id": 4,
--       "conditional_validation_rule_fails_message_text": "1 fails 3",
--       "if_validator_type_id": 2,
--       "if_validator_type_display_name": "Equals",
--       "then_validator_type_id": 1,
--       "then_validator_type_display_name": "Text Regular Expression",
--     }
--   ]
-- }

CREATE OR REPLACE FUNCTION musesuperchar.get_superchar_group_add_violations(pSubSuperCharId bigint, pGroupId bigint) 
    RETURNS jsonb AS
        $BODY$
            SELECT jsonb_build_object(   'non_overlapping_count'
                                        ,count(entity_id)
                                        ,'non_overlapping_entities'
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
                (SELECT  DISTINCT sub.entity_id
                        ,sub.entity_data_table
                        ,sub.entity_display_name
                        ,osd.sc_def_id
                        ,osd.sc_def_internal_name
                        ,osd.sc_def_display_name
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
                    JOIN musesuperchar.sc_def osd 
                        ON cvr.conditional_validation_rule_object_sc_def_id = osd.sc_def_id 
                            AND osd.sc_def_id != pSubSuperCharId 
                    LEFT OUTER JOIN musesuperchar.v_superchar_entities obj 
                        ON sub.entity_id = obj.entity_id 
                            AND pGroupId = ANY(obj.sc_group_ids) 
                WHERE   obj.sc_def_id IS NULL 
                    AND sub.sc_def_id = pSubSuperCharId) q;
        $BODY$
    LANGUAGE plpgsql STABLE;

ALTER FUNCTION musesuperchar.get_superchar_group_add_violations(pSubSuperCharId bigint, pGroupId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_superchar_group_add_violations(pSubSuperCharId bigint, pGroupId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_superchar_group_add_violations(pSubSuperCharId bigint, pGroupId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_superchar_group_add_violations(pSubSuperCharId bigint, pGroupId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_superchar_group_add_violations(pSubSuperCharId bigint, pGroupId bigint) 
    IS $DOC$Returns potential validation violations when adding a Super Characteristic to a group.  Since a Super Characteristic defines its own validation rules, and group defines with what entities its member characteristics are associated with, it is possible to inadvertantly add characteristic to a group (and thereby entity) for which passing validation is not possible.  For a given Super Characteristic and group, this function will return a JSON (jsonb) object which counts the number of violations and enumerates the entity & missing characteristics which cause the validator exceptions.  The returns JSON object has the following format:
{
  "non_overlapping_count": 1,
  "non_overlapping_entities": [
    {
      "entity_id": 8,
      "entity_data_table": "public_emp",
      "entity_display_name": "Employee",
      "sc_def_id": 3,
      "sc_def_internal_name": "tstchr_3",
      "sc_def_display_name": "Test Char 3",
      "conditional_validation_rule_id": 4,
      "conditional_validation_rule_fails_message_text": "1 fails 3",
      "if_validator_type_id": 2,
      "if_validator_type_display_name": "Equals",
      "then_validator_type_id": 1,
      "then_validator_type_display_name": "Text Regular Expression",
    }
  ]
}
$DOC$;
