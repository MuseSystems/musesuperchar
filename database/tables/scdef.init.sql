-- File:        scdef.init.sql
-- Location:    musesuperchar/database/tables
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


DO
    $BODY$
        DECLARE

        BEGIN

            -- Create the table if it does not exist.  Apply deltas if it does and it's needed.
            IF NOT EXISTS(SELECT     true
                          FROM         musextputils.v_basic_catalog
                          WHERE     table_schema_name = 'musesuperchar'
                                  AND table_name = 'scdef') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.scdef (
                     scdef_id     bigserial   NOT NULL    PRIMARY KEY
                    ,scdef_internal_name  text        NOT NULL    UNIQUE
                    ,scdef_display_name   text        NOT NULL
                    ,scdef_description    text        NOT NULL
                    ,scdef_pkghead_id integer REFERENCES public.pkghead (pkghead_id)
                    ,scdef_is_system_locked      boolean     NOT NULL    DEFAULT false
                    ,scdef_datatype_id bigint     NOT NULL REFERENCES musesuperchar.datatype (datatype_id)
                    ,scdef_values_list     text[]
                    ,scdef_list_query      text
                    ,scdef_is_searchable boolean NOT NULL   DEFAULT false
                    ,scdef_is_display_only boolean NOT NULL DEFAULT false
                    ,scdef_is_virtual boolean NOT NULL DEFAULT false
                );

                ALTER TABLE  musesuperchar.scdef OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.scdef FROM public;
                GRANT ALL ON TABLE musesuperchar.scdef TO admin;
                GRANT ALL ON TABLE musesuperchar.scdef TO xtrole;

                COMMENT ON TABLE musesuperchar.scdef
                    IS $DOC$Defines individual super characteristics.  Here we define the type, default validation, and whether or not a value is considered required.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.scdef.scdef_id IS
                $DOC$The primary key and unique identifier of the record.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef.scdef_internal_name IS
                $DOC$A name that should be used in any programmatic references to the characteristic.  The goal is to have this name be computer friendly, usable across installations, and not change after creation.  This way the display name can change ad hoc without breaking programming.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef.scdef_display_name IS
                $DOC$A friendly name intended for display in user interfaces.  The value of this field should not be referenced programmatically.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef.scdef_description IS
                $DOC$A description of what the purpose of the field is.  This may be placed in such things as hover-over, tool text sorts of displays. Should be end user friendly.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef.scdef_pkghead_id IS
                $DOC$If the super characteristic is managed via a package, the managing package id appears here.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef.scdef_is_system_locked IS
                $DOC$If true, we do not allow manual editing of the super characteristic's definition via the normal user interfaces.  The expectation is that such a super characteristic is managed via an extension package only.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef.scdef_datatype_id IS
                $DOC$The kind of information stored by this super characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef.scdef_values_list IS
                $DOC$If the super characteristic is a simple list of values, we record that here.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef.scdef_list_query IS
                $DOC$Allows the definition of a list as a standard "poopulate" query.  Note that this is security sensitive since it allows creating SQL queries (think JavaScript "exec()") and it requires the maintainListQuery permission.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef.scdef_is_searchable IS
                $DOC$Determines whether or not if the super characteristic is searchable; this only applies if there is an appropriate/relevant search available for the entity type.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef.scdef_is_display_only IS
                $DOC$Determines whether or not this characteristic accepts user input from the UI.  If true, the field displays in the user interface, but is "disabled" for entry.  Note that values in this field may still be persisted in the database.$DOC$;

                COMMENT ON COLUMN musesuperchar.scdef.scdef_is_virtual IS
                $DOC$If true, the value represented by the characteristic is not saved to the database, but is expected to be populated/calculated for display by the UI itself.$DOC$;

                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'scdef'
                                                                ,'scdef_date_created'
                                                                ,'scdef_role_created'
                                                                ,'scdef_date_deactivated'
                                                                ,'scdef_role_deactivated'
                                                                ,'scdef_date_modified'
                                                                ,'scdef_wallclock_modified'
                                                                ,'scdef_role_modified'
                                                                ,'scdef_row_version_number'
                                                                ,'scdef_is_active');


            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.
                -- Create scdef is display only column if needed
                IF NOT EXISTS(SELECT true
                              FROM musextputils.v_basic_catalog
                              WHERE     table_schema_name = 'musesuperchar'
                                  AND table_name = 'scdef'
                                  AND column_name = 'scdef_is_display_only' ) THEN
                    --
                    -- Determines whether or not this characteristic accepts
                    -- user input from the UI.  If true, the field displays in
                    -- the user interface, but is "disabled" for entry.  Note
                    -- that values in this field may still be persisted in the
                    -- database.
                    --

                    ALTER TABLE musesuperchar.scdef ADD COLUMN scdef_is_display_only boolean;

                    COMMENT ON COLUMN musesuperchar.scdef.scdef_is_display_only
                        IS $DOC$Determines whether or not this characteristic accepts user input from the UI.  If true, the field displays in the user interface, but is "disabled" for entry.  Note that values in this field may still be persisted in the database.$DOC$;

                    UPDATE musesuperchar.scdef SET scdef_is_display_only = false;

                    ALTER TABLE musesuperchar.scdef ALTER COLUMN scdef_is_display_only SET NOT NULL;
                    ALTER TABLE musesuperchar.scdef ALTER COLUMN scdef_is_display_only SET DEFAULT false;

                END IF;

                -- Create scdef is display only column if needed
                IF NOT EXISTS(SELECT true
                              FROM musextputils.v_basic_catalog
                              WHERE     table_schema_name = 'musesuperchar'
                                  AND table_name = 'scdef'
                                  AND column_name = 'scdef_is_virtual' ) THEN
                    --
                    -- If true, the value represented by the characteristic is
                    -- not saved to the database, but is expected to be
                    -- populated/calculated for display by the UI itself.
                    --

                    ALTER TABLE musesuperchar.scdef ADD COLUMN scdef_is_virtual boolean;

                    COMMENT ON COLUMN musesuperchar.scdef.scdef_is_virtual
                        IS $DOC$If true, the value represented by the characteristic is not saved to the database, but is expected to be populated/calculated for display by the UI itself.$DOC$;

                    UPDATE musesuperchar.scdef SET scdef_is_virtual = false;

                    ALTER TABLE musesuperchar.scdef ALTER COLUMN scdef_is_virtual SET NOT NULL;
                    ALTER TABLE musesuperchar.scdef ALTER COLUMN scdef_is_virtual SET DEFAULT false;

                END IF;
            END IF;


        END;
    $BODY$;
