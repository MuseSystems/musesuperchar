/*************************************************************************
 *************************************************************************
 **
 ** File:         get_qt_delete_metasql.sql
 ** Project:      Muse Super Characteristics for xTuple ERP
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
-- Generates delete MetaSQL for a given Super Characteristics Entity.
--

CREATE OR REPLACE FUNCTION musesuperchar.get_qt_delete_metasql(pEntityId bigint) 
    RETURNS text AS
        $BODY$
            DECLARE
                vCfgPfx text := musextputils.get_musemetric('musesuperchar','widgetPrefix',null::text);
                vDeleteMql text;
                vEntityDataTable text;
                vDataTablePkName text;
                vDataTableFkName text;
                vEntityDisplayName text;
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
                    RAISE EXCEPTION 'We require a valid Entity ID in order to produce its delete MetaSQL. (FUNC: musesuperchar.get_qt_delete_metasql) (pEntityId: %)',pEntityId;
                END IF;

                vDeleteMql :=
                    E'-- Group: musesuperchar\n' ||
                    format(E'-- Name: %1$s\n',vCfgPfx||'_'||vEntityDataTable||'_delete') ||
                    format(E'-- Notes: MetaSQL for Super Characteristics Entity %1$s\n',vEntityDisplayName) ||
                    format(E'--        Autogenerated on: %1$s\n',now()) ||
                    format(
                        E'DELETE FROM musesuperchar.%3$s \n' ||
                        E'    WHERE %1$s = coalesce(<? if exists("%1$s") ?>' ||
                        E'(<? value("%1$s") ?>)::int8<? else ?>null<? endif ?>,' ||
                        E'<? if exists("%2$s") ?>(SELECT %1$s ' ||
                        E'FROM musesuperchar.%3$s WHERE %2$s = <? value("%2$s") ?>)' ||
                        E'<? else ?> null <? endif ?>)\nRETURNING %1$s',
                        vDataTablePkName, vDataTableFkName, vEntityDataTable);

                RETURN vDeleteMql;
            END;
        $BODY$
    LANGUAGE plpgsql STABLE;

ALTER FUNCTION musesuperchar.get_qt_delete_metasql(pEntityId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_qt_delete_metasql(pEntityId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_delete_metasql(pEntityId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_delete_metasql(pEntityId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_qt_delete_metasql(pEntityId bigint) 
    IS $DOC$Generates delete MetaSQL for a given Super Characteristics Entity.$DOC$;