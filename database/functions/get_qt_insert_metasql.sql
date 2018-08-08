/*************************************************************************
 *************************************************************************
 **
 ** File:         get_qt_insert_metasql.sql
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
-- Generates insert MetaSQL for a given Super Characteristics Entity.
--

CREATE OR REPLACE FUNCTION musesuperchar.get_qt_insert_metasql(pEntityId bigint)
    RETURNS text AS
        $BODY$
            DECLARE
                vCfgPfx text := musextputils.get_musemetric('musesuperchar','widgetPrefix',null::text);
                vInsertMql text;
                vEntityDataTable text;
                vDataTablePkName text;
                vDataTableFkName text;
                vEntityDisplayName text;
                vColumnList text;
                vValueList text;
                vDataTableStruct musextputils.v_basic_catalog[];
                vCurrStructRec musextputils.v_basic_catalog;
            BEGIN

                SELECT   entity_data_table
                        ,entity_data_table || '_id'
                        ,entity_data_table || '_' || entity_table || '_id'
                        ,entity_display_name
                    INTO vEntityDataTable, vDataTablePkName, vDataTableFkName,
                        vEntityDisplayName
                FROM musesuperchar.entity
                WHERE entity_id = pEntityId;

                IF vEntityDataTable IS NULL THEN
                    RAISE EXCEPTION 'We require a valid Entity ID in order to produce its insert MetaSQL. (FUNC: musesuperchar.get_qt_insert_metasql) (pEntityId: %)',pEntityId;
                END IF;

                SELECT array_agg(q) INTO vDataTableStruct
                FROM
                    (SELECT *
                     FROM musextputils.v_basic_catalog
                     WHERE table_schema_name = 'musesuperchar'
                         AND table_name = vEntityDataTable
                         AND column_ordinal > 0
                         AND column_name != vDataTablePkName
                         AND column_name != vDataTableFkName
                         AND column_name != vEntityDataTable || '_data'
                         AND column_name != vEntityDataTable || '_is_active'
                         AND column_name != vEntityDataTable || '_date_created'
                         AND column_name != vEntityDataTable || '_role_created'
                         AND column_name != vEntityDataTable || '_date_modified'
                         AND column_name != vEntityDataTable || '_wallclock_modified'
                         AND column_name != vEntityDataTable || '_role_modified'
                         AND column_name != vEntityDataTable || '_date_deactivated'
                         AND column_name != vEntityDataTable || '_role_deactivated'
                         AND column_name != vEntityDataTable || '_row_version_number'
                     ORDER BY column_ordinal) q;

                vColumnList :=  format(E'%1$s\n',vDataTableFkName);
                vValueList := format(E'    (<? value("%1$s") ?>)::int8\n',
                        vDataTableFkName);

                -- We could well do this without looping, but I don't think it
                -- would be very clear and I don't think the loop's performance
                -- will be bad enough to justify it.
                FOR vCurrStructRec IN
                    SELECT q.* FROM unnest(vDataTableStruct) q LOOP

                    -- If the field is required and not defaulted, we require it
                    -- in the MetaSQL.  Otherwise it's optional in the MetaSQL.
                    IF  vCurrStructRec.is_required
                        AND vCurrStructRec.default_value IS NULL THEN
                        -- Required and not default, so we require it.
                        vColumnList := vColumnList ||
                            (format(E'     ,%1$s\n',
                                vCurrStructRec.column_name));
                        vValueList := vValueList ||
                            (format(E'     ,(<? value("%1$s") ?>)::%2$s\n',
                                vCurrStructRec.column_name,
                                vCurrStructRec.column_type_name));
                    ELSE
                        vColumnList := vColumnList ||
                            (format(E'     <? if exists("%1$s") ?>,%1$s<? endif ?>\n',
                                vCurrStructRec.column_name));
                        vValueList := vValueList ||
                            (format(E'     <? if exists("%1$s") ?>,(<? value("%1$s") ?>)::%2$s<? endif ?>\n',
                                vCurrStructRec.column_name,
                                vCurrStructRec.column_type_name));

                    END IF;

                END LOOP;

                vInsertMql :=
                    E'-- Group: musesuperchar\n' ||
                    format(E'-- Name: %1$s\n',vCfgPfx||'_'||vEntityDataTable||'_insert') ||
                    format(E'-- Notes: MetaSQL for Super Characteristics Entity %1$s\n',vEntityDisplayName) ||
                    format(E'--        Autogenerated on: %1$s\n',now()) ||
                    format(E'INSERT INTO musesuperchar.%1$s\n    ( ',vEntityDataTable) ||
                    vColumnList || E'    )\nVALUES\n    ( ' ||
                    vValueList ||
                    format(E'    )\nRETURNING %1$s ',vDataTablePkName);

                RETURN vInsertMql;
            END;
        $BODY$
    LANGUAGE plpgsql STABLE;

ALTER FUNCTION musesuperchar.get_qt_insert_metasql(pEntityId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_qt_insert_metasql(pEntityId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_insert_metasql(pEntityId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_insert_metasql(pEntityId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_qt_insert_metasql(pEntityId bigint)
    IS $DOC$Generates insert MetaSQL for a given Super Characteristics Entity.$DOC$;
