/*************************************************************************
 *************************************************************************
 **
 ** File:         entity_sc_group_ass.sql
 ** Project:      Muse Systems xTuple Super Characteristics
 ** Author:       Steven C. Buttgereit
 **
 ** (C) 2017 Lima Buttgereit Holdings LLC d/b/a Muse Systems
 **
 ** Contact:
 ** muse.information@musesystems.com  :: https://muse.systems
 ** 
 ** Licensing restrictions apply.  Please refer to your Master Services
 ** Agreement or governing Statement of Work for complete terms and 
 ** conditions.
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
                                  AND table_name = 'entity_sc_group_ass') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.entity_sc_group_ass (
                     entity_sc_group_ass_id    bigserial    NOT NULL    PRIMARY KEY
                    ,entity_sc_group_ass_entity_id bigint NOT NULL REFERENCES musesuperchar.entity (entity_id) ON DELETE CASCADE
                    ,entity_sc_group_ass_sc_group_id bigint NOT NULL REFERENCES musesuperchar.sc_group (sc_group_id) ON DELETE CASCADE
                    ,entity_sc_group_ass_pkghead_id integer REFERENCES public.pkghead (pkghead_id)
                    ,entity_sc_group_ass_is_system_locked boolean NOT NULL DEFAULT false
                );
                
                ALTER TABLE  musesuperchar.entity_sc_group_ass OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.entity_sc_group_ass FROM public;
                GRANT ALL ON TABLE musesuperchar.entity_sc_group_ass TO admin;
                GRANT ALL ON TABLE musesuperchar.entity_sc_group_ass TO xtrole;
                
                COMMENT ON TABLE musesuperchar.entity_sc_group_ass 
                    IS $DOC$Assigns groups as being valid for a given entity.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.entity_sc_group_ass.entity_sc_group_ass_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                COMMENT ON COLUMN musesuperchar.entity_sc_group_ass.entity_sc_group_ass_entity_id IS 
                $DOC$The entity to which a super characteristic group is being assigned.$DOC$;

                COMMENT ON COLUMN musesuperchar.entity_sc_group_ass.entity_sc_group_ass_sc_group_id IS 
                $DOC$The super characteristic group that is being assigned to a given entity.$DOC$;

                COMMENT ON COLUMN musesuperchar.entity_sc_group_ass.entity_sc_group_ass_pkghead_id IS 
                $DOC$If the entity/group assignment to an entity is managed by a package, this is the package id reference.$DOC$;

                COMMENT ON COLUMN musesuperchar.entity_sc_group_ass.entity_sc_group_ass_is_system_locked IS 
                $DOC$If the entity/group assignment is not to be altered by an end user and managed exclusively by a package.$DOC$;


                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'entity_sc_group_ass'
                                                                ,'entity_sc_group_ass_date_created'
                                                                ,'entity_sc_group_ass_role_created'
                                                                ,'entity_sc_group_ass_date_deactivated'
                                                                ,'entity_sc_group_ass_role_deactivated' 
                                                                ,'entity_sc_group_ass_date_modified'
                                                                ,'entity_sc_group_ass_wallclock_modified'
                                                                ,'entity_sc_group_ass_role_modified'
                                                                ,'entity_sc_group_ass_row_version_number'
                                                                ,'entity_sc_group_ass_is_active');
                

            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
            

        END;
    $BODY$;
