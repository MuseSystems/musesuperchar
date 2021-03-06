-- File:        get_superchar_delete_violations.sql
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
-- Looks at which validation rules the proposed Super Characteristic is an
-- object super characteristic and reports those as violations.  The format
-- follows the convention:
-- {
--   "violation_count": 1,
--   "violations": [
--     {
--       "entity_id": 8,
--       "entity_data_table": "public_emp",
--       "entity_display_name": "Employee",
--       "scdef_id": 1,
--       "scdef_internal_name": "tstchr_1",
--       "scdef_display_name": "Test Char 1",
--       "condvalrule_id": 4,
--       "condvalrule_fails_message_text": "1 fails 3",
--       "if_valtype_id": 2,
--       "if_valtype_display_name": "Equals",
--       "then_valtype_id": 1,
--       "then_valtype_display_name": "Text Regular Expression"
--     }
--   ]
-- }

CREATE OR REPLACE FUNCTION musesuperchar.get_superchar_delete_violations(pObjSuperCharId bigint)
    RETURNS jsonb AS
        $BODY$
            SELECT jsonb_build_object(   'violation_count'
                                        ,count(entity_id)
                                        ,'violations'
                                        ,array_agg(json_build_object(
                                                 'entity_id', entity_id
                                                ,'entity_data_table', entity_data_table
                                                ,'entity_display_name', entity_display_name
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
                (SELECT   DISTINCT sub.entity_id
                         ,sub.entity_data_table
                         ,sub.entity_display_name
                         ,sub.scdef_id
                         ,sub.scdef_internal_name
                         ,sub.scdef_display_name
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
                                 AND obj.entity_id = obj.entity_id
                 WHERE   cvr.condvalrule_object_scdef_id = pObjSuperCharId
                     AND cvr.condvalrule_subject_scdef_id != cvr.condvalrule_object_scdef_id) q;
        $BODY$
    LANGUAGE sql STABLE;

ALTER FUNCTION musesuperchar.get_superchar_delete_violations(pObjSuperCharId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_superchar_delete_violations(pObjSuperCharId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_superchar_delete_violations(pObjSuperCharId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_superchar_delete_violations(pObjSuperCharId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_superchar_delete_violations(pObjSuperCharId bigint)
    IS $DOC$Looks at which validation rules the proposed Super Characteristic is an object super characteristic and reports those as violations.  The format follows the convention:
{
  "violation_count": 1,
  "violations": [
    {
      "entity_id": 8,
      "entity_data_table": "public_emp",
      "entity_display_name": "Employee",
      "scdef_id": 1,
      "scdef_internal_name": "tstchr_1",
      "scdef_display_name": "Test Char 1",
      "condvalrule_id": 4,
      "condvalrule_fails_message_text": "1 fails 3",
      "if_valtype_id": 2,
      "if_valtype_display_name": "Equals",
      "then_valtype_id": 1,
      "then_valtype_display_name": "Text Regular Expression"
    }
  ]
}$DOC$;
