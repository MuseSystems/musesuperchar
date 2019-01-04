-- File:        v_form_builder_widgets.init.sql
-- Location:    musesuperchar/database/views
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


DROP VIEW IF EXISTS musesuperchar.v_form_builder_widgets CASCADE;
--
-- Assembles the basic elements required for building the Qt .ui XML files.  We go so far as including the fundamental widget xml and names required for constructing subsequent levels of the format.
--

CREATE OR REPLACE VIEW musesuperchar.v_form_builder_widgets AS
    SELECT   scdef_scgrp_ass_id
            ,scgrp_id
            ,scgrp_internal_name
            ,scgrp_display_name
            ,scgrp_min_columns
            ,scgrp_is_space_conserved
            ,scgrp_is_row_expansion_allowed
            ,scdef_id
            ,scdef_internal_name
            ,scdef_display_name
            ,scdef_is_display_only
            ,scdef_is_virtual
            ,scdef_scgrp_ass_height
            ,scdef_scgrp_ass_max_height
            ,scdef_scgrp_ass_width
            ,scdef_scgrp_ass_max_width
            ,datatype_id
            ,datatype_internal_name
            ,datatype_is_cosmetic
            ,scdef_scgrp_ass_section_name
            ,section_internal_name
            ,max(current_column::integer) OVER (PARTITION BY scdef_scgrp_ass_section_name) + 1 AS section_column_count
            ,section_internal_name||'_column_'||current_column AS internal_column_name
            ,current_column::integer AS column_number
            ,row_number()
                OVER
                    (PARTITION BY section_internal_name||'_column_'||current_column
                        ORDER BY section_internal_name||'_column_'||current_column, scdef_scgrp_ass_sequence) - 1 AS row_number
    FROM
        (SELECT   scdef_scgrp_ass_id
                    ,scgrp_id
                    ,scgrp_internal_name
                    ,scgrp_display_name
                    ,scgrp_min_columns
                    ,scgrp_is_space_conserved
                    ,scgrp_is_row_expansion_allowed
                    ,scdef_id
                    ,scdef_internal_name
                    ,scdef_display_name
                    ,scdef_is_display_only
                    ,scdef_is_virtual
                    ,scdef_scgrp_ass_height
                    ,scdef_scgrp_ass_max_height
                    ,scdef_scgrp_ass_width
                    ,scdef_scgrp_ass_max_width
                    ,datatype_id
                    ,datatype_internal_name
                    ,datatype_is_cosmetic
                    ,scdef_scgrp_ass_section_name
                    ,lower(regexp_replace(regexp_replace(scdef_scgrp_ass_section_name,E'[^[:alnum:]_]+','_','g'),E'^_+|_+$','','g')) AS section_internal_name
                    ,substring('00'||sum(CASE WHEN scdef_scgrp_ass_is_column_start THEN 1 ELSE 0 END)
                                OVER (PARTITION BY scdef_scgrp_ass_section_name
                                        ORDER BY scdef_scgrp_ass_section_name
                                                ,scdef_scgrp_ass_sequence),E'..$') AS current_column
                    ,scdef_scgrp_ass_sequence
            FROM     musesuperchar.scdef_scgrp_ass
                JOIN musesuperchar.scgrp
                    ON scdef_scgrp_ass_scgrp_id = scgrp_id
                JOIN musesuperchar.scdef
                    ON scdef_scgrp_ass_scdef_id = scdef_id
                JOIN musesuperchar.datatype
                    ON scdef_datatype_id = datatype_id
            ORDER BY scdef_scgrp_ass_section_name
                    ,scdef_scgrp_ass_sequence) q;

ALTER VIEW musesuperchar.v_form_builder_widgets OWNER TO admin;

REVOKE ALL ON TABLE musesuperchar.v_form_builder_widgets FROM public;
GRANT ALL ON TABLE musesuperchar.v_form_builder_widgets TO admin;
GRANT ALL ON TABLE musesuperchar.v_form_builder_widgets TO xtrole;

COMMENT ON VIEW musesuperchar.v_form_builder_widgets
    IS $DOC$Assembles the basic elements required for building the Qt .ui XML files.  We go so far as including the fundamental widget xml and names required for constructing subsequent levels of the format.$DOC$;
