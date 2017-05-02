/*************************************************************************
 *************************************************************************
 **
 ** File:         is_superchar_table_populated.sql
 ** Project:      Muse Systems xTuple Super Characteristics
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
-- Returns true if super characteristic data table associated with the provided
-- entity contains rows.  If the table is empty return false.
--

CREATE OR REPLACE FUNCTION musesuperchar.is_superchar_table_populated(pEntityId bigint) 
    RETURNS boolean AS
        $BODY$
            DECLARE
                vReturnVal boolean;
            BEGIN
                IF coalesce(pEntityId,0) < 1 THEN
                    RAISE EXCEPTION 'You must provide a valid Entity ID to evaluate if the table is populated. (FUNC: musesuperchar.is_superchar_table_populated) (pEntityId: %)',pEntityId;
                END IF;

                EXECUTE format('SELECT EXISTS(SELECT true FROM musesuperchar.%1$I)',
                    (SELECT entity_data_table 
                       FROM musesuperchar.entity 
                      WHERE entity_id = pEntityId)) INTO vReturnVal;

                RETURN coalesce(vReturnVal,false);
            END;
        $BODY$
    LANGUAGE plpgsql STABLE;

ALTER FUNCTION musesuperchar.is_superchar_table_populated(pEntityId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.is_superchar_table_populated(pEntityId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.is_superchar_table_populated(pEntityId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.is_superchar_table_populated(pEntityId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.is_superchar_table_populated(pEntityId bigint) 
    IS $DOC$Returns true if super characteristic data table associated with the provided entity contains rows.  If the table is empty return false.$DOC$;
