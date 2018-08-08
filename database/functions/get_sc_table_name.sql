/*************************************************************************
 *************************************************************************
 **
 ** File:         get_sc_table_name.sql
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
-- Returns the standardized table name to be used to store super characteristic data for the entity found at the provided schema/table combination.  Note that this function does not try to validate the schema/table combination
--

CREATE OR REPLACE FUNCTION musesuperchar.get_sc_table_name(pSchema text, pTable text)
    RETURNS text AS
        $BODY$
            WITH entity AS (
                SELECT   table_schema || '_' || table_name AS entity_table
                FROM    information_schema.tables
                WHERE   table_schema = pSchema
                    AND table_name = pTable
                )
            SELECT
                CASE
                    WHEN length(pSchema) + (2 * length(pTable)) < 59 THEN
                        entity_table
                    WHEN length(pSchema) + (2 * length(regexp_replace( pTable,
                                                E'[a|A|e|E|i|I|o|O|u|U]','','g'))
                                            ) < 59 THEN
                        pSchema || '_' ||regexp_replace(pTable,
                            E'[a|A|e|E|i|I|o|O|u|U]','','g')
                    WHEN length(
                            regexp_replace(
                                    entity_table || '_' || pTable,
                                    E'[a|A|e|E|i|I|o|O|u|U]','','g')) < 59 THEN
                        regexp_replace(entity_table, E'[a|A|e|E|i|I|o|O|u|U]',
                            '','g')
                    END
            FROM    entity;
        $BODY$
    LANGUAGE sql STABLE;

ALTER FUNCTION musesuperchar.get_sc_table_name(pSchema text, pTable text)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_sc_table_name(pSchema text, pTable text) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_sc_table_name(pSchema text, pTable text) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_sc_table_name(pSchema text, pTable text) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_sc_table_name(pSchema text, pTable text)
    IS $DOC$Returns the standardized table name to be used to store super characteristic data for the entity found at the provided schema/table combination.  Note that this function does not try to validate the schema/table combination  $DOC$;
