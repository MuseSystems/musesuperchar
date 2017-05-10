/*************************************************************************
 *************************************************************************
 **
 ** File:         get_superchar_non_overlapping_entities.sql
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
-- For a given subject characteristic, we return any entities which are not
-- contained by the entities associated with the object super characteristic.
-- This is useful in evaluating, for example, if a proposed validation rule will
-- be enforcable across all of the entities in which a subject will need to be
-- evaluated.  This function returns a JSON object (jsonb type) in the form: 
-- {
--     "non_overlapping_count": 1, 
--     "non_overlapping_entities": [
--         {
--             "entity_id": 12, 
--             "entity_data_table": "public_item",
--             "entity_display_name": "Item"
--         }
--     ]
-- } 
--

CREATE OR REPLACE FUNCTION musesuperchar.get_superchar_non_overlapping_entities(pSbjSuperCharId bigint, pObjSuperCharId bigint) 
    RETURNS jsonb AS
        $BODY$
            SELECT row_to_json(q)::jsonb
            FROM
                (SELECT   count(sub.entity_id) AS non_overlapping_count
                        ,to_json(
                            array_agg(
                                json_build_object(
                                     'entity_id', sub.entity_id
                                    ,'entity_data_table', sub.entity_data_table
                                    ,'entity_display_name', sub.entity_display_name)
                                )
                            ) AS non_overlapping_entities
                FROM    musesuperchar.v_superchar_entities sub 
                    LEFT OUTER JOIN musesuperchar.v_superchar_entities obj 
                        ON sub.entity_id = obj.entity_id 
                            AND obj.sc_def_id = pObjSuperCharId 
                WHERE   obj.sc_def_id IS NULL 
                    AND sub.sc_def_id = pSbjSuperCharId) q;
        $BODY$
    LANGUAGE sql STABLE;

ALTER FUNCTION musesuperchar.get_superchar_non_overlapping_entities(pSbjSuperCharId bigint, pObjSuperCharId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_superchar_non_overlapping_entities(pSbjSuperCharId bigint, pObjSuperCharId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_superchar_non_overlapping_entities(pSbjSuperCharId bigint, pObjSuperCharId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_superchar_non_overlapping_entities(pSbjSuperCharId bigint, pObjSuperCharId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_superchar_non_overlapping_entities(pSbjSuperCharId bigint, pObjSuperCharId bigint) 
    IS $DOC$For a given subject characteristic, we return any entities which are not contained by the entities associated with the object super characteristic.  This is useful in evaluating, for example, if a proposed validation rule will be enforcable across all of the entities in which a subject will need to be evaluated.  This function returns a JSON object (jsonb type) in the form: 
{
    "non_overlapping_count": 1, 
    "non_overlapping_entities": [
        {
            "entity_id": 12, 
            "entity_data_table": "public_item",
            "entity_display_name": "Item"
        }
    ]
} $DOC$;
