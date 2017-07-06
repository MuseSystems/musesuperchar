/*************************************************************************
 *************************************************************************
 **
 ** File:         get_qt_update_metasql.sql
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
-- Generates update MetaSQL for a given Super Characteristics Entity.
--

CREATE OR REPLACE FUNCTION musesuperchar.get_qt_update_metasql(pEntityId bigint) 
    RETURNS text AS
        $BODY$
            DECLARE
                vCfgPfx text := musextputils.get_musemetric('musesuperchar','widgetPrefix',null::text);
                vUpdateMql text;
                vEntityDataTable text;
                vDataTablePkName text;
                vDataTableFkName text;
                vEntityDisplayName text;
                vColumnList text;
                vWhereList text;
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
                    RAISE EXCEPTION 'We require a valid Entity ID in order to produce its update MetaSQL. (FUNC: musesuperchar.get_qt_update_metasql) (pEntityId: %)',pEntityId;
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

                vColumnList := format(E'    SET   %1$s = %1$s\n',vDataTablePkName);
                vWhereList := format(
                    E'WHERE    %1$s = coalesce(<? if exists("where_%1$s") ?>' ||
                    E'(<? value("where_%1$s") ?>)::int8<? else ?>null<? endif ?>,' ||
                    E'<? if exists("where_%2$s") ?>(SELECT %1$s ' ||
                    E'FROM musesuperchar.%3$s WHERE %2$s = <? value("where_%2$s") ?>)' ||
                    E'<? else ?> null <? endif ?>)\n',
                    vDataTablePkName, vDataTableFkName, vEntityDataTable);
                
                -- We could well do this without looping, but I don't think it
                -- would be very clear and I don't think the loop's performance
                -- will be bad enough to justify it.
                FOR vCurrStructRec IN 
                    SELECT q.* FROM unnest(vDataTableStruct) q LOOP 

                    vColumnList := vColumnList || format(E'        ' ||
                        E'<? if exists("update_%1$s") ?>,%1$s = (<? value("update_%1$s") ?>)::%2$s<? endif ?>\n',
                        vCurrStructRec.column_name,vCurrStructRec.column_type_name);
                    vWhereList := vWhereList || format(E'        ' ||
                        E'<? if exists("where_%1$s") ?>AND %1$s = (<? value("where_%1$s") ?>)::%2$s<? endif ?>\n',
                        vCurrStructRec.column_name, vCurrStructRec.column_type_name);

                END LOOP;

                vUpdateMql := 
                    E'-- Group: musesuperchar\n' ||
                    format(E'-- Name: %1$s\n',vCfgPfx||'_'||vEntityDataTable||'_update') ||
                    format(E'-- Notes: MetaSQL for Super Characteristics Entity %1$s\n',vEntityDisplayName) ||
                    format(E'--        Autogenerated on: %1$s\n',now()) ||
                    format(E'UPDATE musesuperchar.%1$s',vEntityDataTable)|| E' \n' || 
                    vColumnList || vWhereList || E'\n' ||
                    format(E'RETURNING %1$s',vDataTablePkName);

                RETURN vUpdateMql;
            END;
        $BODY$
    LANGUAGE plpgsql STABLE;

ALTER FUNCTION musesuperchar.get_qt_update_metasql(pEntityId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_qt_update_metasql(pEntityId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_update_metasql(pEntityId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_update_metasql(pEntityId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_qt_update_metasql(pEntityId bigint) 
    IS $DOC$Generates update MetaSQL for a given Super Characteristics Entity.$DOC$;
