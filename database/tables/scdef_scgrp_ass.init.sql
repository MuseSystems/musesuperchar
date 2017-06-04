/*************************************************************************
 *************************************************************************
 **
 ** File:         scdef_scgrp_ass.sql
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

DO
    $BODY$
        DECLARE
            
        BEGIN

            -- Create the table if it does not exist.  Apply deltas if it does and it's needed.
            IF NOT EXISTS(SELECT     true 
                          FROM         musextputils.v_basic_catalog 
                          WHERE     table_schema_name = 'musesuperchar' 
                                  AND table_name = 'scdef_scgrp_ass') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.scdef_scgrp_ass (
                     scdef_scgrp_ass_id    bigserial    NOT NULL    PRIMARY KEY
                    ,scdef_scgrp_ass_scdef_id bigint NOT NULL REFERENCES musesuperchar.scdef (scdef_id) ON DELETE CASCADE
                    ,scdef_scgrp_ass_scgrp_id bigint NOT NULL REFERENCES musesuperchar.scgrp (scgrp_id) ON DELETE CASCADE
                    ,scdef_scgrp_ass_pkghead_id integer REFERENCES public.pkghead (pkghead_id)
                    ,scdef_scgrp_ass_is_system_locked boolean NOT NULL DEFAULT false
                );
                
                ALTER TABLE  musesuperchar.scdef_scgrp_ass OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.scdef_scgrp_ass FROM public;
                GRANT ALL ON TABLE musesuperchar.scdef_scgrp_ass TO admin;
                GRANT ALL ON TABLE musesuperchar.scdef_scgrp_ass TO xtrole;
                
                COMMENT ON TABLE musesuperchar.scdef_scgrp_ass 
                    IS $DOC$Defines the assignment of super characteristic definitions to groups.  Note that super characteristics are only visible to users via their assignments to groups.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.scdef_scgrp_ass.scdef_scgrp_ass_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef_scgrp_ass.scdef_scgrp_ass_scdef_id IS
                $DOC$A reference to the super characteristic which is being assigned to a group.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef_scgrp_ass.scdef_scgrp_ass_scgrp_id IS
                $DOC$A reference to the group to which the super characteristic is being assigned.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef_scgrp_ass.scdef_scgrp_ass_pkghead_id IS
                $DOC$If the group/characteristic relationship is managed by an extension package if this value is not null.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef_scgrp_ass.scdef_scgrp_ass_is_system_locked IS
                $DOC$If the group/characteristic is not meant to be user editable, this column should be "true".$DOC$;


                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'scdef_scgrp_ass'
                                                                ,'scdef_scgrp_ass_date_created'
                                                                ,'scdef_scgrp_ass_role_created'
                                                                ,'scdef_scgrp_ass_date_deactivated'
                                                                ,'scdef_scgrp_ass_role_deactivated' 
                                                                ,'scdef_scgrp_ass_date_modified'
                                                                ,'scdef_scgrp_ass_wallclock_modified'
                                                                ,'scdef_scgrp_ass_role_modified'
                                                                ,'scdef_scgrp_ass_row_version_number'
                                                                ,'scdef_scgrp_ass_is_active');
    
            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
        END;
    $BODY$;
