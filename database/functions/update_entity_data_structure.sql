/*************************************************************************
 *************************************************************************
 **
 ** File:         update_entity_data_structure.sql
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
-- Compares the scdef/scgrp/entity associations and ensures that the associated
-- entity tables are in sync with the user definition.
--

CREATE OR REPLACE FUNCTION musesuperchar.update_entity_data_structure()
    RETURNS void AS
        $BODY$
            DECLARE
                vTargetTable text;
                vTargetColumn text;
                vDataType text;
                vColumnComment text;
            BEGIN
                <<addcols>>
                FOR vTargetTable, vTargetColumn, vDataType, vColumnComment IN
                    SELECT   DISTINCT vse.entity_data_table
                            ,vse.scdef_internal_name
                            ,d.datatype_internal_name
                            ,s.scdef_display_name||E' -- '||s.scdef_description
                    FROM    musesuperchar.v_superchar_entities vse
                        JOIN musesuperchar.scdef s
                            ON vse.scdef_id = s.scdef_id
                        JOIN musesuperchar.datatype d
                            ON s.scdef_datatype_id = d.datatype_id
                        LEFT OUTER JOIN musextputils.v_basic_catalog vbc
                            ON  vbc.table_schema_name = 'musesuperchar'
                                AND vbc.table_kind = 'TABLE'
                                AND vbc.table_persistence = 'PERMANENT'
                                AND vbc.column_ordinal > 0
                                AND vse.entity_data_table = vbc.table_name
                                AND vse.scdef_internal_name = vbc.column_name
                    WHERE vbc.column_name IS NULL
                        AND NOT d.datatype_is_cosmetic
                        AND NOT s.scdef_is_virtual
                    ORDER BY vse.entity_data_table
                            ,vse.scdef_internal_name
                            ,d.datatype_internal_name LOOP

                    CASE vDataType
                        WHEN 'textfield' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I text',
                                vTargetTable, vTargetColumn);
                        WHEN 'textarea' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I text',
                                vTargetTable, vTargetColumn);
                        WHEN 'datecluster' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I date',
                                vTargetTable, vTargetColumn);
                        WHEN 'checkbox' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I boolean',
                                vTargetTable, vTargetColumn);
                        WHEN 'combobox' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I text',
                                vTargetTable, vTargetColumn);
                        WHEN 'wholenumber' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I bigint',
                                vTargetTable, vTargetColumn);
                        WHEN 'decimalnumber' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I numeric',
                                vTargetTable, vTargetColumn);
                        WHEN 'qty' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I numeric',
                                vTargetTable, vTargetColumn);
                        WHEN 'cost' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I numeric',
                                vTargetTable, vTargetColumn);
                        WHEN 'purchprice' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I numeric',
                                vTargetTable, vTargetColumn);
                        WHEN 'salesprice' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I numeric',
                                vTargetTable, vTargetColumn);
                        WHEN 'extprice' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I numeric',
                                vTargetTable, vTargetColumn);
                        WHEN 'weight' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I numeric',
                                vTargetTable, vTargetColumn);
                        WHEN 'percent' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I numeric',
                                vTargetTable, vTargetColumn);
                        WHEN 'filecluster' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I text',
                                vTargetTable, vTargetColumn);
                        WHEN 'imagecluster' THEN
                            EXECUTE format(
                                'ALTER TABLE musesuperchar.%1$I ADD COLUMN %2$I integer',
                                vTargetTable, vTargetColumn);
                        ELSE
                            RAISE EXCEPTION 'We encountered a data type that is unknown. (FUNC: musesuperchar.update_entity_data_structure)';
                    END CASE;

                    EXECUTE format(
                        'COMMENT ON COLUMN musesuperchar.%1$I.%2$I IS %3$L',
                        vTargetTable, vTargetColumn, vColumnComment);

                END LOOP addcols;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE;

ALTER FUNCTION musesuperchar.update_entity_data_structure()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.update_entity_data_structure() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.update_entity_data_structure() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.update_entity_data_structure() TO xtrole;


COMMENT ON FUNCTION musesuperchar.update_entity_data_structure()
    IS $DOC$Compares the scdef/scgrp/entity associations and ensures that the associated entity tables are in sync with the user definition.$DOC$;
