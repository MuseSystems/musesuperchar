-- File:        get_sc_table_name.sql
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
