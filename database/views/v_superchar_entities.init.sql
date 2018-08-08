/*************************************************************************
 *************************************************************************
 **
 ** File:         v_superchar_entities.sql
 ** Project:      Muse Systems Super Characteristic for xTuple ERP
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
-- Makes Super Characteristic/Entity relationships queryable.
--

CREATE OR REPLACE VIEW musesuperchar.v_superchar_entities AS
    SELECT   sd.scdef_id
            ,sd.scdef_internal_name
            ,sd.scdef_display_name
            ,sd.scdef_is_system_locked
            ,sd.scdef_pkghead_id
            ,sdph.pkghead_name AS scdef_package_name
            ,array_agg(DISTINCT sg.scgrp_id) AS scgrp_ids
            ,array_agg(DISTINCT sg.scgrp_internal_name) AS scgrp_internal_names
            ,array_agg(DISTINCT sg.scgrp_display_name) AS scgrp_display_names
            ,e.entity_id
            ,e.entity_schema
            ,e.entity_table
            ,e.entity_data_table
            ,e.entity_display_name
            ,e.entity_is_system_locked
            ,array_agg(DISTINCT ep.entitypkg_pkghead_id) AS entity_pkghead_ids
            ,array_agg(DISTINCT eph.pkghead_name) AS entitypkg_names
    FROM    musesuperchar.scdef sd
        JOIN musesuperchar.scdef_scgrp_ass sdsga
            ON sd.scdef_id = sdsga.scdef_scgrp_ass_scdef_id
        JOIN musesuperchar.scgrp sg
            ON sdsga.scdef_scgrp_ass_scgrp_id = sg.scgrp_id
        JOIN musesuperchar.entity_scgrp_ass esga
            ON sdsga.scdef_scgrp_ass_scgrp_id =
                esga.entity_scgrp_ass_scgrp_id
        JOIN musesuperchar.entity e
            ON esga.entity_scgrp_ass_entity_id = e.entity_id
        LEFT OUTER JOIN public.pkghead sdph
            ON sd.scdef_pkghead_id = sdph.pkghead_id
        LEFT OUTER JOIN musesuperchar.entitypkg ep
            ON ep.entitypkg_entity_id = e.entity_id
        LEFT OUTER JOIN public.pkghead eph
            ON ep.entitypkg_pkghead_id = eph.pkghead_id
    GROUP BY sd.scdef_id
            ,sdph.pkghead_id
            ,e.entity_id;

ALTER VIEW musesuperchar.v_superchar_entities OWNER TO admin;

REVOKE ALL ON TABLE musesuperchar.v_superchar_entities FROM public;
GRANT ALL ON TABLE musesuperchar.v_superchar_entities TO admin;
GRANT ALL ON TABLE musesuperchar.v_superchar_entities TO xtrole;

COMMENT ON VIEW musesuperchar.v_superchar_entities
    IS $DOC$Makes Super Characteristic/Entity relationships queryable.$DOC$;
