/*************************************************************************
 *************************************************************************
 **
 ** File:         entity_scgrp_ass.sql
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
                                  AND table_name = 'entity_scgrp_ass') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.entity_scgrp_ass (
                     entity_scgrp_ass_id    bigserial    NOT NULL    PRIMARY KEY
                    ,entity_scgrp_ass_entity_id bigint NOT NULL REFERENCES musesuperchar.entity (entity_id) ON DELETE CASCADE
                    ,entity_scgrp_ass_scgrp_id bigint NOT NULL REFERENCES musesuperchar.scgrp (scgrp_id) ON DELETE CASCADE
                    ,entity_scgrp_ass_pkghead_id integer REFERENCES public.pkghead (pkghead_id)
                    ,entity_scgrp_ass_is_system_locked boolean NOT NULL DEFAULT false
                    ,UNIQUE(entity_scgrp_ass_entity_id, entity_scgrp_ass_scgrp_id)
                );
                
                ALTER TABLE  musesuperchar.entity_scgrp_ass OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.entity_scgrp_ass FROM public;
                GRANT ALL ON TABLE musesuperchar.entity_scgrp_ass TO admin;
                GRANT ALL ON TABLE musesuperchar.entity_scgrp_ass TO xtrole;
                
                COMMENT ON TABLE musesuperchar.entity_scgrp_ass 
                    IS $DOC$Assigns groups as being valid for a given entity.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.entity_scgrp_ass.entity_scgrp_ass_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                COMMENT ON COLUMN musesuperchar.entity_scgrp_ass.entity_scgrp_ass_entity_id IS 
                $DOC$The entity to which a super characteristic group is being assigned.$DOC$;

                COMMENT ON COLUMN musesuperchar.entity_scgrp_ass.entity_scgrp_ass_scgrp_id IS 
                $DOC$The super characteristic group that is being assigned to a given entity.$DOC$;

                COMMENT ON COLUMN musesuperchar.entity_scgrp_ass.entity_scgrp_ass_pkghead_id IS 
                $DOC$If the entity/group assignment to an entity is managed by a package, this is the package id reference.$DOC$;

                COMMENT ON COLUMN musesuperchar.entity_scgrp_ass.entity_scgrp_ass_is_system_locked IS 
                $DOC$If the entity/group assignment is not to be altered by an end user and managed exclusively by a package.$DOC$;


                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'entity_scgrp_ass'
                                                                ,'entity_scgrp_ass_date_created'
                                                                ,'entity_scgrp_ass_role_created'
                                                                ,'entity_scgrp_ass_date_deactivated'
                                                                ,'entity_scgrp_ass_role_deactivated' 
                                                                ,'entity_scgrp_ass_date_modified'
                                                                ,'entity_scgrp_ass_wallclock_modified'
                                                                ,'entity_scgrp_ass_role_modified'
                                                                ,'entity_scgrp_ass_row_version_number'
                                                                ,'entity_scgrp_ass_is_active');                

            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;            
        END;
    $BODY$;
