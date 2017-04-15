/*************************************************************************
 *************************************************************************
 **
 ** File:         sc_def.sql
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
                                  AND table_name = 'sc_def') THEN
                -- The table doesn't exist, so let's create it.
                CREATE TABLE musesuperchar.sc_def (
                     sc_def_id     bigserial   NOT NULL    PRIMARY KEY
                    ,sc_def_internal_name  text        NOT NULL    UNIQUE
                    ,sc_def_display_name   text        NOT NULL
                    ,sc_def_description    text        NOT NULL
                    ,sc_def_package text
                    ,sc_def_is_system_locked      boolean     NOT NULL    DEFAULT false
                    ,sc_def_sc_data_type_id bigint     NOT NULL
                    ,sc_def_values_list     text[]
                    ,sc_def_list_query      text
                    ,sc_def_is_default_required boolean NOT NULL   DEFAULT false
                    ,sc_def_validator jsonb
                );
                
                ALTER TABLE  musesuperchar.sc_def OWNER TO admin;

                REVOKE ALL ON TABLE musesuperchar.sc_def FROM public;
                GRANT ALL ON TABLE musesuperchar.sc_def TO admin;
                GRANT ALL ON TABLE musesuperchar.sc_def TO xtrole;
                
                COMMENT ON TABLE musesuperchar.sc_def 
                    IS $DOC$Defines individual super characteristics.  Here we define the type, default validation, and whether or not a value is considered required.$DOC$;

                -- Column Comments
                COMMENT ON COLUMN musesuperchar.sc_def.sc_def_id IS
                $DOC$The primary key and unique identifier of the record.$DOC$;

                COMMENT ON COLUMN musesuperchar.sc_def.sc_def_internal_name IS
                $DOC$A name that should be used in any programmatic references to the characteristic.  The goal is to have this name be computer friendly, usable across installations, and not change after creation.  This way the display name can change ad hoc without breaking programming.$DOC$;

                COMMENT ON COLUMN musesuperchar.sc_def.sc_def_display_name IS
                $DOC$A friendly name intended for display in user interfaces.  The value of this field should not be referenced programmatically.$DOC$;

                COMMENT ON COLUMN musesuperchar.sc_def.sc_def_description IS
                $DOC$A description of what the purpose of the field is.  This may be placed in such things as hover-over, tool text sorts of displays. Should be end user friendly.$DOC$;

                COMMENT ON COLUMN musesuperchar.sc_def_package IS
                $DOC$If the super characteristic is managed via a package, the managing package name appears here.$DOC$;

                COMMENT ON COLUMN musesuperchar.sc_def.sc_def_is_system_locked IS
                $DOC$If true, we do not allow manual editing of the super characteristic's definition via the normal user interfaces.  The expectation is that such a super characteristic is managed via an extension package only.$DOC$;

                COMMENT ON COLUMN musesuperchar.sc_def.sc_def_sc_data_type_id IS
                $DOC$The kind of information stored by this super characteristic.$DOC$;

                COMMENT ON COLUMN musesuperchar.sc_def.sc_def_values_list IS
                $DOC$If the super characteristic is a simple list of values, we record that here.$DOC$;

                COMMENT ON COLUMN musesuperchar.sc_def_list_query IS
                $DOC$Allows the definition of a list as a standard "poopulate" query.  Note that this is security sensitive since it allows creating SQL queries (think JavaScript "exec()") and it requires the maintainListQuery permission.$DOC$;

                COMMENT ON COLUMN musesuperchar.sc_def.sc_def_is_default_required IS
                $DOC$Determines whether or not this Super Characteristic is, by default, required by any groups to which it is added.$DOC$;

                COMMENT ON COLUMN musesuperchar.sc_def.sc_def_other_superchar_validator IS
                $DOC$A set of JSON objects which follow the spec:

[{
    "<sc_def_internal_name>": {
        "ifExistsRequire": <true/default false>,
        "ifNotExistsDisallow": <true/default false>,
        "ifValidatorRequire": {
            "validatorTypeCode": <known validator type code>,
            "validatorTypeId": <known validator type id>,
            "validatorRegExp": <a true/false evaluating regexp>,
            "validatorNumericRange": <a PostgreSQL compatible numeric range definition>,
            "validatorDateRange": <a PostgreSQL compatible date range definition>
        },
        ifValidatorApplyValidation: [
            {
                "ifAlwaysValidate": <true/default false>,
                "ifValidatorTypeCode": <known validator type code>,
                "ifValidatorTypeId": <known validator type id>,
                "ifValidatorRegExp": <a true/false evaluating regexp>,
                "ifValidatorNumericRange": <a PostgreSQL compatible numeric range definition>,
                "ifValidatorDateRange": <a PostgreSQL compatible date range definition>,
                "thenValidatorFailsMessageText": <What to tell a user if validation fails>,
                "thenValidatorTypeCode": <known validator type code>,
                "thenValidatorTypeId": <known validator type id>,
                "thenValidatorRegExp": <a true/false evaluating regexp>,
                "thenValidatorNumericRange": <a PostgreSQL compatible numeric range definition>,
                "thenValidatorDateRange": <a PostgreSQL compatible date range definition>
            }
        ],
    }
}]

If an object is self-referential, only the "ifValidatorApplyValidation" object of array element 0 is applied and "ifAlwaysValidate" is assumed true (in the object only for convenience/clarity/completeness).  ifExistsRequire checks to see if the named characteristic is added to the record in any state; if true, the subject characteristic is automatically added as well.  ifNotExistsDisallow is true, the subject characteristic is automatically removed if the object characteristic is removed.  Otherwise, any automatically added characteristics are left even if added automatically.  If this field is null or otherwise empty, the field is subject to no valiation and any entry of the appropriate type, including null/empty/etc, are is valid.
    $DOC$;

                -- Let's now add the audit columns and triggers
                PERFORM musextputils.add_common_table_columns(   'musesuperchar'
                                                                ,'sc_def'
                                                                ,'sc_def_date_created'
                                                                ,'sc_def_role_created'
                                                                ,'sc_def_date_deactivated'
                                                                ,'sc_def_role_deactivated' 
                                                                ,'sc_def_date_modified'
                                                                ,'sc_def_wallclock_modified'
                                                                ,'sc_def_role_modified'
                                                                ,'sc_def_row_version_number'
                                                                ,'sc_def_is_active');
                

            ELSE
                -- Deltas go here.  Be sure to check if each is really needed.

            END IF;
            

        END;
    $BODY$;
