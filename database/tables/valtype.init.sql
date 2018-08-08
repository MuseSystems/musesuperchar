/*************************************************************************
 *************************************************************************
 **
 ** File:         valtype.sql
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
                                  AND table_name = 'valtype') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.valtype (
                     valtype_id    bigserial    NOT NULL    PRIMARY KEY
                    ,valtype_internal_name text NOT NULL    UNIQUE
                    ,valtype_display_name text NOT NULL
                    ,valtype_description text NOT NULL
                    ,valtype_is_user_visible boolean NOT NULL DEFAULT true
                    ,valtype_is_text boolean NOT NULL DEFAULT false
                    ,valtype_is_numeric boolean NOT NULL DEFAULT false
                    ,valtype_is_date boolean NOT NULL DEFAULT false
                    ,valtype_is_flag boolean NOT NULL DEFAULT false
                    ,valtype_display_order integer NOT NULL DEFAULT 99999
                );

                ALTER TABLE  musesuperchar.valtype OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.valtype FROM public;
                GRANT ALL ON TABLE musesuperchar.valtype TO admin;
                GRANT ALL ON TABLE musesuperchar.valtype TO xtrole;

                COMMENT ON TABLE musesuperchar.valtype
                    IS $DOC$Enumerates the known validation types.  This table is not intended to be user maintainable and as inferred in the first sentence, is a glorified, self-documenting enumeration.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.valtype.valtype_id IS
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                COMMENT ON COLUMN musesuperchar.valtype.valtype_internal_name IS
                $DOC$The computer friendly naturaly key of the validation type.  This is the value that should be referenced programmatically.$DOC$;

                COMMENT ON COLUMN musesuperchar.valtype.valtype_display_name IS
                $DOC$A name for the validation which appears to end users in the user interface.$DOC$;

                COMMENT ON COLUMN musesuperchar.valtype.valtype_description IS
                $DOC$Brief, tool-tip style help to aid in understanding how to use the validation type.$DOC$;

                COMMENT ON COLUMN musesuperchar.valtype.valtype_is_user_visible IS
                $DOC$If true, the validation will appear in user interfaces as a selectable option for appropriate types.$DOC$;

                COMMENT ON COLUMN musesuperchar.valtype.valtype_is_text IS
                $DOC$If true, this validator is appropriate for data types which can generalize meaningfully to text data.$DOC$;

                COMMENT ON COLUMN musesuperchar.valtype.valtype_is_numeric IS
                $DOC$If true, this validator is appropriate for data types which can generalize meaningfully to numeric data.$DOC$;

                COMMENT ON COLUMN musesuperchar.valtype.valtype_is_date IS
                $DOC$If true, this validator is appropriate for data types which can generalize meaningfully to date data.$DOC$;

                COMMENT ON COLUMN musesuperchar.valtype.valtype_is_flag IS
                $DOC$If true, this validator is appropriate for data types which can generalize meaningfully to boolean data.$DOC$;

                COMMENT ON COLUMN musesuperchar.valtype.valtype_display_order IS
                $DOC$The display order in the user interface with lower numbers appearing first.$DOC$;

                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'valtype'
                                                                ,'valtype_date_created'
                                                                ,'valtype_role_created'
                                                                ,'valtype_date_deactivated'
                                                                ,'valtype_role_deactivated'
                                                                ,'valtype_date_modified'
                                                                ,'valtype_wallclock_modified'
                                                                ,'valtype_role_modified'
                                                                ,'valtype_row_version_number'
                                                                ,'valtype_is_active');


            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;


        END;
    $BODY$;
