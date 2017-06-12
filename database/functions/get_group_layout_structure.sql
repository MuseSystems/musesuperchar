/*************************************************************************
 *************************************************************************
 **
 ** File:         get_group_layout_structure.sql
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
-- Generates a JSONB object that represents the structure of the group widget.
-- We do this mostly because JSONB is easier to work with than XML or record
-- sets (associative array like functionality).  Also this separates the concern
-- of generating a structured layout document and actually implementing the
-- final form.  This should make it easier to upgrade since the final form would
-- be all that needs to change.
-- 

CREATE OR REPLACE FUNCTION musesuperchar.get_group_layout_structure(pGroupId bigint) 
    RETURNS jsonb AS
        $BODY$
            DECLARE
                vIsConserved boolean := coalesce(musextputils.get_musemetric(
                        'musesuperchar','isLayoutSpaceConserved', null::boolean),
                        false);
                vRecords musesuperchar.v_form_builder_widgets[];
                vMaxColumns integer;
                vGroupIntName text;
                vReturnVal jsonb;
                vSecLayouts jsonb := '{}'::jsonb;
            BEGIN

                IF NOT EXISTS (SELECT true 
                                FROM musesuperchar.scgrp 
                                WHERE scgrp_id = pGroupId) THEN
                    RAISE EXCEPTION 'We require a valid Group ID value. (FUNC: musesuperchar.get_group_layout_structure) (pGroupId: %)',pGroupId;
                END IF;

                -- get the data.
                SELECT  array_agg(vfbw) INTO vRecords
                FROM    musesuperchar.v_form_builder_widgets vfbw
                WHERE   scgrp_id = pGroupId;

                -- setup the root elements
                SELECT DISTINCT 
                    jsonb_build_object('group',
                        jsonb_build_object(
                             'scgrp_id',r.scgrp_id
                            ,'scgrp_internal_name',r.scgrp_internal_name
                            ,'scgrp_display_name',r.scgrp_display_name
                            ,'group_rows','{}'::text[]))
                    INTO vReturnVal
                FROM unnest(vRecords) r;

                -- Get the maximum number of columns.
                SELECT scgrp_internal_name, max(r.section_column_count)
                    INTO vGroupIntName,vMaxColumns
                FROM unnest(vRecords) r
                GROUP BY scgrp_internal_name;

                SELECT jsonb_object_agg(section_internal_name,
                    jsonb_build_object('section_display_name',
                        scdef_scgrp_ass_section_name,'columns',seccols))
                    INTO vSecLayouts
                FROM
                    (SELECT section_internal_name,scdef_scgrp_ass_section_name,array_agg(cols) AS seccols
                    FROM 
                        (SELECT   section_internal_name
                                ,scdef_scgrp_ass_section_name
                                ,jsonb_build_object('column_internal_name',
                                    internal_column_name,
                                    'column_fields',
                                    array_agg(jsonb_build_object( 'column_row_number',row_number
                                                                ,'scdef_id',scdef_id
                                                                ,'scdef_internal_name',scdef_internal_name
                                                                ,'scdef_display_name', scdef_display_name
                                                                ,'datatype_internal_name',datatype_internal_name
                                                                ,'scdef_scgrp_ass_height',scdef_scgrp_ass_height
                                                                ,'scdef_scgrp_ass_width',scdef_scgrp_ass_width))) AS cols
                        FROM unnest(vRecords)
                        WHERE  scgrp_id = pGroupId
                        GROUP BY section_internal_name, scdef_scgrp_ass_section_name, internal_column_name
                        ORDER BY internal_column_name) q
                    GROUP BY section_internal_name,scdef_scgrp_ass_section_name
                    ORDER BY section_internal_name) q2;

                -- Now we figure out the rows in the layout. And the sections in
                -- the rows.
                DECLARE
                    vRowCount integer := 0;
                    vSeenSecs text[] := '{}'::text[];
                    vCurrSecName text;
                    vCurrSecColCount integer;
                    vCurrRestSecName text;
                    vCurrRestSecColCount integer;
                    vCurrRowCols integer;
                    vCurrRow jsonb := '[]'::jsonb;
                    vGroupRows jsonb := '[]'::jsonb;
                BEGIN
                        
                    IF vIsConserved THEN
                        -- Loop through each section.
                        FOR vCurrSecName, vCurrSecColCount IN
                            SELECT crow.section_internal_name,crow.section_column_count
                            FROM unnest(vRecords) crow LOOP
                            -- If the starting section col count = max, add it to
                            -- the row and start the next row.  If not add it to the
                            -- row and try and find others that can complete the
                            -- row.  If none are found, start a new row.
                            vCurrRow := '[]'::jsonb;
                            vCurrRowCols := vMaxColumns;

                            -- Start new row with a start section.
                            IF array_position(vSeenSecs, vCurrSecName) IS NOT NULL THEN
                                -- We've added this section already. Find
                                -- another starter.
                                CONTINUE;
                            ELSIF vCurrSecColCount = vMaxColumns THEN
                                -- This starting section will take the entire
                                -- row.
                                vCurrRow := vCurrRow || jsonb_build_object('section_display_name',(vSecLayouts -> vCurrSecName) ->> 'section_display_name','section_internal_name',vCurrSecName,'section_columns',(vSecLayouts -> vCurrSecName) -> 'columns');
                                vSeenSecs := vSeenSecs || vCurrSecName;
                            ELSE
                                -- Add our section and find anything else that
                                -- will fit.  Space is conserved, so keep 
                                -- going until all options are exhausted.
                                vCurrRow := vCurrRow || jsonb_build_object('section_display_name',(vSecLayouts -> vCurrSecName) ->> 'section_display_name','section_internal_name',vCurrSecName,'section_columns',(vSecLayouts -> vCurrSecName) -> 'columns');
                                vSeenSecs := vSeenSecs || vCurrSecName;
                                vCurrRowCols := vCurrRowCols - vCurrSecColCount;
                                FOR vCurrRestSecName, vCurrRestSecColCount IN
                                    SELECT arow.section_internal_name,arow.section_column_count
                                        FROM unnest(vRecords) arow 
                                        WHERE NOT arow.section_internal_name = 
                                                ANY(vSeenSecs) LOOP
                                    IF vCurrRestSecColCount <= vCurrRowCols THEN
                                        -- We have a winner. Add it and continue.
                                        vCurrRow := vCurrRow || jsonb_build_object('section_display_name',(vSecLayouts -> vCurrRestSecName) ->> 'section_display_name','section_internal_name',vCurrRestSecName,'section_columns',(vSecLayouts -> vCurrRestSecName) -> 'columns');
                                        vSeenSecs := vSeenSecs || vCurrRestSecName;
                                        vCurrRowCols := vCurrRowCols - vCurrRestSecColCount;
                                    END IF;

                                    EXIT WHEN vCurrRowCols = 0;

                                END LOOP;
                            END IF;
                            -- We should have a complete row by this point.
                            -- Add the 
                            vGroupRows := vGroupRows || jsonb_build_object(
                                'row_internal_name',
                                vGroupIntName||'_row_'||substring('00'||jsonb_array_length(vGroupRows)+1,'..$'),
                                'row_sections',
                                vCurrRow);
                        END LOOP;
                    ELSE
                        -- Loop through each section.
                        FOR vCurrSecName, vCurrSecColCount IN
                            SELECT crow.section_internal_name,crow.section_column_count
                            FROM unnest(vRecords) crow LOOP
                            -- If the starting section col count = max, add it to
                            -- the row and start the next row.  If not add it to the
                            -- row and try and find others that can complete the
                            -- row.  If none are found, start a new row.
                            vCurrRow := '[]'::jsonb;
                            vCurrRowCols := vMaxColumns;

                            -- Start new row with a start section.
                            IF array_position(vSeenSecs, vCurrSecName) IS NOT NULL THEN
                                -- We've added this section already. Find
                                -- another starter.
                                CONTINUE;
                            ELSIF vCurrSecColCount = vMaxColumns THEN
                                -- This starting section will take the entire
                                -- row.
                                vCurrRow := vCurrRow || jsonb_build_object('section_display_name',(vSecLayouts -> vCurrSecName) ->> 'section_display_name','section_internal_name',vCurrSecName,'section_columns',(vSecLayouts -> vCurrSecName) -> 'columns');
                                vSeenSecs := vSeenSecs || vCurrSecName;
                            ELSE
                                -- Add our section and find anything else that
                                -- will fit.  Space is not conserved, so exit 
                                -- the first time we cannot fit a section.
                                vCurrRow := vCurrRow || jsonb_build_object('section_display_name',(vSecLayouts -> vCurrSecName) ->> 'section_display_name','section_internal_name',vCurrSecName,'section_columns',(vSecLayouts -> vCurrSecName) -> 'columns');
                                vSeenSecs := vSeenSecs || vCurrSecName;
                                vCurrRowCols := vCurrRowCols - vCurrSecColCount;
                                FOR vCurrRestSecName, vCurrRestSecColCount IN
                                    SELECT arow.section_internal_name,arow.section_column_count
                                        FROM unnest(vRecords) arow 
                                        WHERE NOT arow.section_internal_name = 
                                                ANY(vSeenSecs) LOOP
                                    IF vCurrRestSecColCount <= vCurrRowCols THEN
                                        -- We have a winner. Add it and continue.
                                        vCurrRow := vCurrRow || jsonb_build_object('section_display_name',(vSecLayouts -> vCurrRestSecName) ->> 'section_display_name','section_internal_name',vCurrRestSecName,'section_columns',(vSecLayouts -> vCurrRestSecName) -> 'columns');
                                        vSeenSecs := vSeenSecs || vCurrRestSecName;
                                        vCurrRowCols := vCurrRowCols - vCurrRestSecColCount;
                                    ELSE
                                        -- Too big and space is not conserved.
                                        EXIT;
                                    END IF;

                                    EXIT WHEN vCurrRowCols = 0;

                                END LOOP;
                            END IF;
                            -- We should have a complete row by this point.
                            -- Add the 
                            vGroupRows := vGroupRows || jsonb_build_object(
                                'row_internal_name',
                                vGroupIntName||'_row_'||substring('00'||jsonb_array_length(vGroupRows)+1,'..$'),
                                'row_sections',
                                vCurrRow);
                        END LOOP;
                    
                    END IF;

                    -- We should have all rows/sections.
                    vReturnVal := jsonb_set(vReturnVal,ARRAY['group','group_rows'],vGroupRows);

                END;

                RETURN vReturnVal;
            END;
        $BODY$
    LANGUAGE plpgsql STABLE;

ALTER FUNCTION musesuperchar.get_group_layout_structure(pGroupId bigint)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_group_layout_structure(pGroupId bigint) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_group_layout_structure(pGroupId bigint) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_group_layout_structure(pGroupId bigint) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_group_layout_structure(pGroupId bigint) 
    IS $DOC$Generates a JSONB object that represents the structure of the group widget.  We do this mostly because JSONB is easier to work with than XML or record sets (associative array like functionality).  Also this separates the concern of generating a structured layout document and actually implementing the final form.  This should make it easier to upgrade since the final form would be all that needs to change.$DOC$;
