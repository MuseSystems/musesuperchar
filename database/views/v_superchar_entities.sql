/*************************************************************************
 *************************************************************************
 **
 ** File:         v_superchar_entities.sql
 ** Project:      Muse Systems Super Characteristic for xTuple ERP
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
-- Makes Super Characteristic/Entity relationships queryable.
--

CREATE OR REPLACE VIEW musesuperchar.v_superchar_entities AS
    SELECT   sd.sc_def_id
            ,sd.sc_def_internal_name
            ,sd.sc_def_display_name
            ,sd.sc_def_is_system_locked
            ,sd.sc_def_pkghead_id
            ,sdph.pkghead_name AS sc_def_package_name
            ,array_agg(DISTINCT sg.sc_group_id) AS sc_group_ids
            ,array_agg(DISTINCT sg.sc_group_internal_name) AS sc_group_internal_names
            ,array_agg(DISTINCT sg.sc_group_display_name) AS sc_group_display_names
            ,e.entity_id
            ,e.entity_schema
            ,e.entity_table
            ,e.entity_data_table
            ,e.entity_display_name
            ,e.entity_is_system_locked
            ,array_agg(DISTINCT ep.entity_package_pkghead_id) AS entity_pkghead_ids
            ,array_agg(DISTINCT eph.pkghead_name) AS entity_package_names
    FROM    musesuperchar.sc_def sd 
        JOIN musesuperchar.sc_def_sc_group_ass sdsga 
            ON sd.sc_def_id = sdsga.sc_def_sc_group_ass_sc_def_id
        JOIN musesuperchar.sc_group sg 
            ON sdsga.sc_def_sc_group_ass_sc_group_id = sg.sc_group_id 
        JOIN musesuperchar.entity_sc_group_ass esga 
            ON sdsga.sc_def_sc_group_ass_sc_group_id = 
                esga.entity_sc_group_ass_sc_group_id
        JOIN musesuperchar.entity e 
            ON esga.entity_sc_group_ass_entity_id = e.entity_id
        LEFT OUTER JOIN public.pkghead sdph
            ON sd.sc_def_pkghead_id = sdph.pkghead_id 
        LEFT OUTER JOIN musesuperchar.entity_package ep 
            ON ep.entity_package_entity_id = e.entity_id
        LEFT OUTER JOIN public.pkghead eph 
            ON ep.entity_package_pkghead_id = eph.pkghead_id
    GROUP BY sd.sc_def_id
            ,sdph.pkghead_id
            ,e.entity_id;

ALTER VIEW musesuperchar.v_superchar_entities OWNER TO admin;

REVOKE ALL ON TABLE musesuperchar.v_superchar_entities FROM public;
GRANT ALL ON TABLE musesuperchar.v_superchar_entities TO admin;
GRANT ALL ON TABLE musesuperchar.v_superchar_entities TO xtrole;

COMMENT ON VIEW musesuperchar.v_superchar_entities 
    IS $DOC$Makes Super Characteristic/Entity relationships queryable.$DOC$;
