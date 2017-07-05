/*************************************************************************
 *************************************************************************
 **
 ** File:         get_qt_select_metasql.sql
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
-- Generates select MetaSQL for a given Super Characteristics Entity.
--

CREATE OR REPLACE FUNCTION musesuperchar.get_qt_select_metasql(pEntityId bigint) 
    RETURNS text AS
        $BODY$
            DECLARE
                vCfgPfx text := musextputils.get_musemetric('musesuperchar','widgetPrefix',null::text);
                vSelectMql text;
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
                    RAISE EXCEPTION 'We require a valid Entity ID in order to produce its select MetaSQL. (FUNC: musesuperchar.get_qt_select_metasql) (pEntityId: %)',pEntityId;
                END IF;

                SELECT array_agg(q) INTO vDataTableStruct
                FROM
                    (SELECT *
                     FROM musextputils.v_basic_catalog
                     WHERE table_schema_name = 'musesuperchar'
                         AND table_name = vEntityDataTable
                         AND column_ordinal > 0
                     ORDER BY column_ordinal) q;

                vColumnList := format(E'%1$s\n',vDataTablePkName);
                vWhereList := E'WHERE    true\n';
                
                -- We could well do this without looping, but I don't think it
                -- would be very clear and I don't think the loop's performance
                -- will be bad enough to justify it.
                FOR vCurrStructRec IN 
                    SELECT q.* FROM unnest(vDataTableStruct) q LOOP 

                    vColumnList := vColumnList || format(E'    <? if exists("select_%1$s") ?>,%1$s<? endif ?>\n',
                        vCurrStructRec.column_name);
                    vWhereList := vWhereList || format(E'    <? if exists("where_%1$s") ?>AND %1$s = (<? value("where_%1$s") ?>)::%2$s<? endif ?>\n',
                        vCurrStructRec.column_name, vCurrStructRec.column_type_name);

                END LOOP;

                vSelectMql := 
                    E'-- Group: musesuperchar\n' ||
                    format(E'-- Name: %1$s\n',vCfgPfx||'_'||vEntityDataTable||'_select') ||
                    format(E'-- Notes: MetaSQL for Super Characteristics Entity %1$s\n',vEntityDisplayName) ||
                    format(E'--        Autogenerated on: %1$s\n',now()) ||
                    E'SELECT\n     ' ||
                    vColumnList ||
                    format(E'FROM musesuperchar.%1$s \n', vEntityDataTable) ||
                    vWhereList ;

                RETURN vSelectMql;
            END;
        $BODY$
    LANGUAGE plpgsql STABLE;

ALTER FUNCTION musesuperchar.get_qt_select_metasql(pEntityId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_qt_select_metasql(pEntityId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_select_metasql(pEntityId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_select_metasql(pEntityId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_qt_select_metasql(pEntityId bigint) 
    IS $DOC$Generates select MetaSQL for a given Super Characteristics Entity.$DOC$;