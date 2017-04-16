/*************************************************************************
 *************************************************************************
 **
 ** File:         data_type.sql
 ** Project:      Muse Systems xTuple Super Charateristics
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
                                  AND table_name = 'data_type') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.data_type (
                     data_type_id    bigserial    NOT NULL    PRIMARY KEY
                    ,data_type_internal_name text NOT NULL  UNIQUE
                    ,data_type_display_name text NOT NULL UNIQUE
                    ,data_type_description text NOT NULL
                    ,data_type_is_text boolean NOT NULL DEFAULT false
                    ,data_type_is_numeric boolean NOT NULL DEFAULT false
                    ,data_type_is_date boolean NOT NULL DEFAULT false
                    ,data_type_display_order integer NOT NULL DEFAULT 99999
                );
                
                ALTER TABLE  musesuperchar.data_type OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.data_type FROM public;
                GRANT ALL ON TABLE musesuperchar.data_type TO admin;
                GRANT ALL ON TABLE musesuperchar.data_type TO xtrole;
                
                COMMENT ON TABLE musesuperchar.data_type 
                    IS $DOC$Establishes the known data types that a super characteristic can assume.  Data in this table is not user maintainable and is basically a glorified, self documenting enumeration.$DOC$;

                -- Column Comments 
                COMMENT ON COLUMN musesuperchar.data_type.data_type_id IS 
                $DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$;

                COMMENT ON COLUMN musesuperchar.data_type.data_type_internal_name IS 
                $DOC$A computer friendly natural key for the record.  This is the value that should be used for programatic references.$DOC$;

                COMMENT ON COLUMN musesuperchar.data_type.data_type_display_name IS 
                $DOC$A human friendly name for display in user interfaces.$DOC$;

                COMMENT ON COLUMN musesuperchar.data_type.data_type_description IS 
                $DOC$Some descriptive text to let users know how to appropriately use this data type.$DOC$;

                COMMENT ON COLUMN musesuperchar.data_type.data_type_is_text IS
                $DOC$If true, the data type can be meaningfully generalized as a type which can accept text validators.$DOC$;

                COMMENT ON COLUMN musesuperchar.data_type.data_type_is_numeric IS
                $DOC$If true, the data type can be meaningfully generalized as a type which can accept numeric validators.$DOC$;

                COMMENT ON COLUMN musesuperchar.data_type.data_type_is_date IS
                $DOC$If true, the data type can be meaningfully generalized as a type which can accept date validators.$DOC$;

                COMMENT ON COLUMN musesuperchar.data_type_display_order IS 
                $DOC$The display order in the user interface with lower numbers appearing first.$DOC$;

                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'data_type'
                                                                ,'data_type_date_created'
                                                                ,'data_type_role_created'
                                                                ,'data_type_date_deactivated'
                                                                ,'data_type_role_deactivated' 
                                                                ,'data_type_date_modified'
                                                                ,'data_type_wallclock_modified'
                                                                ,'data_type_role_modified'
                                                                ,'data_type_row_version_number'
                                                                ,'data_type_is_active');
                

            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
            

        END;
    $BODY$;
