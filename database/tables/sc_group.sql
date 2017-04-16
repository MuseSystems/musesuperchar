/*************************************************************************
 *************************************************************************
 **
 ** File:         sc_group.sql
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
                                  AND table_name = 'sc_group') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.sc_group (
                     sc_group_id    bigserial    NOT NULL    PRIMARY KEY
                    ,sc_group_internal_name text NOT NULL UNIQUE
                    ,sc_group_display_name text NOT NULL UNIQUE
                    ,sc_group_description text NOT NULL
                    ,sc_group_pkghead_id integer REFERENCES public.pkghead (pkghead_id)
                    ,sc_group_is_system_locked boolean NOT NULL DEFAULT false
                );
                
                ALTER TABLE  musesuperchar.sc_group OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.sc_group FROM public;
                GRANT ALL ON TABLE musesuperchar.sc_group TO admin;
                GRANT ALL ON TABLE musesuperchar.sc_group TO xtrole;
                
                COMMENT ON TABLE musesuperchar.sc_group 
                    IS $DOC$A table to hold the defined groups to which super characteristics belong.  It is only through these groups that characteristics are made visible.  Note that all entities have a default group which is automatically created and assigned to themselves.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.sc_group.sc_group_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                COMMENT ON COLUMN   musesuperchar.sc_group.sc_group_internal_name IS
                $DOC$An computer friendly name which serves as the natural key of the record.  This is value to reference programmatically.$DOC$;

                COMMENT ON COLUMN   musesuperchar.sc_group.sc_group_display_name IS
                $DOC$A human friendly name which is to be displayed in user interfaces.$DOC$;

                COMMENT ON COLUMN   musesuperchar.sc_group.sc_group_description IS
                $DOC$A description of the purpose of the group.$DOC$;

                COMMENT ON COLUMN   musesuperchar.sc_group.sc_group_pkghead_id IS
                $DOC$If the group is managed through an extension package, this is a reference to that package.$DOC$;

                COMMENT ON COLUMN   musesuperchar.sc_group.sc_group_is_system_locked IS
                $DOC$If the group is not user managed directly by users, the value of this column should be true.$DOC$;


                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'sc_group'
                                                                ,'sc_group_date_created'
                                                                ,'sc_group_role_created'
                                                                ,'sc_group_date_deactivated'
                                                                ,'sc_group_role_deactivated' 
                                                                ,'sc_group_date_modified'
                                                                ,'sc_group_wallclock_modified'
                                                                ,'sc_group_role_modified'
                                                                ,'sc_group_row_version_number'
                                                                ,'sc_group_is_active');
                

            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
            

        END;
    $BODY$;
