/*************************************************************************
 *************************************************************************
 **
 ** File:         datatype.sql
 ** Project:      Muse Systems Super Characteristics for xTuple ERP
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

DO
    $BODY$
        DECLARE

        BEGIN

            -- Create the table if it does not exist.  Apply deltas if it does and it's needed.
            IF NOT EXISTS(SELECT     true
                          FROM         musextputils.v_basic_catalog
                          WHERE     table_schema_name = 'musesuperchar'
                                  AND table_name = 'datatype') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.datatype (
                     datatype_id    bigserial    NOT NULL    PRIMARY KEY
                    ,datatype_internal_name text NOT NULL  UNIQUE
                    ,datatype_display_name text NOT NULL UNIQUE
                    ,datatype_description text NOT NULL
                    ,datatype_is_text boolean NOT NULL DEFAULT false
                    ,datatype_is_numeric boolean NOT NULL DEFAULT false
                    ,datatype_is_date boolean NOT NULL DEFAULT false
                    ,datatype_is_flag boolean NOT NULL DEFAULT false
                    ,datatype_is_array boolean NOT NULL DEFAULT false
                    ,datatype_is_lov_based boolean NOT NULL DEFAULT false
                    ,datatype_is_user_visible boolean NOT NULL DEFAULT false
                    ,datatype_is_cosmetic boolean NOT NULL DEFAULT false
                    ,datatype_display_order integer NOT NULL DEFAULT 99999
                );

                ALTER TABLE  musesuperchar.datatype OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.datatype FROM public;
                GRANT ALL ON TABLE musesuperchar.datatype TO admin;
                GRANT ALL ON TABLE musesuperchar.datatype TO xtrole;

                COMMENT ON TABLE musesuperchar.datatype
                    IS $DOC$Establishes the known data types that a super characteristic can assume.  Data in this table is not user maintainable and is basically a glorified, self documenting enumeration.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.datatype.datatype_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                COMMENT ON COLUMN musesuperchar.datatype.datatype_internal_name IS
                $DOC$A computer friendly natural key for the record.  This is the value that should be used for programatic references.$DOC$;

                COMMENT ON COLUMN musesuperchar.datatype.datatype_display_name IS
                $DOC$A human friendly name for display in user interfaces.$DOC$;

                COMMENT ON COLUMN musesuperchar.datatype.datatype_description IS
                $DOC$Some descriptive text to let users know how to appropriately use this data type.$DOC$;

                COMMENT ON COLUMN musesuperchar.datatype.datatype_is_text IS
                $DOC$If true, the data type can be meaningfully generalized as a type which can accept text validators.$DOC$;

                COMMENT ON COLUMN musesuperchar.datatype.datatype_is_numeric IS
                $DOC$If true, the data type can be meaningfully generalized as a type which can accept numeric validators.$DOC$;

                COMMENT ON COLUMN musesuperchar.datatype.datatype_is_date IS
                $DOC$If true, the data type can be meaningfully generalized as a type which can accept date validators.$DOC$;

                COMMENT ON COLUMN musesuperchar.datatype.datatype_is_flag IS
                $DOC$If true, the data type can be meaningfully generalized as a boolean type which can accept boolean validators.$DOC$;

                COMMENT ON COLUMN musesuperchar.datatype.datatype_is_array IS
                $DOC$If true, the data type can be meaningfully generalized as an array type; usually text values as from a multiple selection list of values.$DOC$;

                COMMENT ON COLUMN musesuperchar.datatype.datatype_is_lov_based IS
                $DOC$If true, there is an expectation that there is a list of values association with the characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.datatype.datatype_is_user_visible IS
                $DOC$If true, the data type can be assigned to normal user created fields via the UI.$DOC$;

                COMMENT ON COLUMN musesuperchar.datatype.datatype_is_cosmetic IS
                $DOC$If true, this means the characteristic should not be persisted into the database, but only exists to enhance the UI aesthetics.$DOC$;

                COMMENT ON COLUMN musesuperchar.datatype.datatype_display_order IS
                $DOC$The display order in the user interface with lower numbers appearing first.$DOC$;

                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'datatype'
                                                                ,'datatype_date_created'
                                                                ,'datatype_role_created'
                                                                ,'datatype_date_deactivated'
                                                                ,'datatype_role_deactivated'
                                                                ,'datatype_date_modified'
                                                                ,'datatype_wallclock_modified'
                                                                ,'datatype_role_modified'
                                                                ,'datatype_row_version_number'
                                                                ,'datatype_is_active');


            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.
                IF NOT EXISTS(SELECT true
                              FROM musextputils.v_basic_catalog
                              WHERE     table_schema_name = 'musesuperchar'
                                  AND table_name = 'datatype'
                                  AND column_name = 'datatype_is_cosmetic' ) THEN
                    --
                    -- If true, this means the characteristic should not be
                    -- persisted into the database, but only exists to enhance
                    -- the UI aesthetics.
                    --

                    ALTER TABLE musesuperchar.datatype ADD COLUMN datatype_is_cosmetic boolean NOT NULL DEFAULT false;

                    COMMENT ON COLUMN musesuperchar.datatype.datatype_is_cosmetic
                        IS
                        $DOC$If true, this means the characteristic should not be persisted into the database, but only exists to enhance the UI aesthetics.$DOC$;

                END IF;

            END IF;


        END;
    $BODY$;
