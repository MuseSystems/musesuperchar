/*************************************************************************
 *************************************************************************
 **
 ** File:         scgrp.sql
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
                                  AND table_name = 'scgrp') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.scgrp (
                     scgrp_id    bigserial    NOT NULL    PRIMARY KEY
                    ,scgrp_internal_name text NOT NULL UNIQUE
                    ,scgrp_display_name text NOT NULL UNIQUE
                    ,scgrp_description text NOT NULL
                    ,scgrp_pkghead_id integer REFERENCES public.pkghead (pkghead_id)
                    ,scgrp_is_system_locked boolean NOT NULL DEFAULT false
                );

                ALTER TABLE  musesuperchar.scgrp OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.scgrp FROM public;
                GRANT ALL ON TABLE musesuperchar.scgrp TO admin;
                GRANT ALL ON TABLE musesuperchar.scgrp TO xtrole;

                COMMENT ON TABLE musesuperchar.scgrp
                    IS $DOC$A table to hold the defined groups to which super characteristics belong.  It is only through these groups that characteristics are made visible.  Note that all entities have a default group which is automatically created and assigned to themselves.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.scgrp.scgrp_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                COMMENT ON COLUMN   musesuperchar.scgrp.scgrp_internal_name IS
                $DOC$An computer friendly name which serves as the natural key of the record.  This is value to reference programmatically.$DOC$;

                COMMENT ON COLUMN   musesuperchar.scgrp.scgrp_display_name IS
                $DOC$A human friendly name which is to be displayed in user interfaces.$DOC$;

                COMMENT ON COLUMN   musesuperchar.scgrp.scgrp_description IS
                $DOC$A description of the purpose of the group.$DOC$;

                COMMENT ON COLUMN   musesuperchar.scgrp.scgrp_pkghead_id IS
                $DOC$If the group is managed through an extension package, this is a reference to that package.$DOC$;

                COMMENT ON COLUMN   musesuperchar.scgrp.scgrp_is_system_locked IS
                $DOC$If the group is not user managed directly by users, the value of this column should be true.$DOC$;


                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'scgrp'
                                                                ,'scgrp_date_created'
                                                                ,'scgrp_role_created'
                                                                ,'scgrp_date_deactivated'
                                                                ,'scgrp_role_deactivated'
                                                                ,'scgrp_date_modified'
                                                                ,'scgrp_wallclock_modified'
                                                                ,'scgrp_role_modified'
                                                                ,'scgrp_row_version_number'
                                                                ,'scgrp_is_active');


            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;


        END;
    $BODY$;
