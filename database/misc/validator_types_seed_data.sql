/*************************************************************************
 *************************************************************************
 **
 ** File:         validator_types_seed_data.sql
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

INSERT INTO musesuperchar.validator_type (
         validator_type_internal_name
        ,validator_type_display_name
        ,validator_type_description
        ,validator_type_is_text
        ,validator_type_is_numeric
        ,validator_type_is_date
        ,validator_type_display_order
        ,validator_type_is_flag
        ,validator_type_is_user_visible)
    SELECT   validator_type_internal_name
            ,validator_type_display_name
            ,validator_type_description
            ,validator_type_is_text
            ,validator_type_is_numeric
            ,validator_type_is_date
            ,validator_type_display_order
            ,validator_type_is_flag
            ,validator_type_is_user_visible
    FROM (VALUES 
             ('regexp', 'Text Regular Expression', 'Allows a user to identify a text regular expression.', true, false, false, 10, false, true)
            ,('numericequal', 'Equals', 'Evaluates to true if the characteristic value matches the validation value.', false, true, false, 20, false, true)
            ,('numericgreaterthan', 'Greater Than', 'Evaluates to true if the characteristic value is greater than the validation value.', false, true, false, 30, false, true)
            ,('numericgreaterthanorequalto', 'Greater Than or Equal To', 'Evaluates to true if the characteristic value is greater than or equal to the validation value.', false, true, false, 40, false, true)
            ,('numericlessthan', 'Less Than', 'Evaluates to true if the characteristic value is less than the validation value.', false, true, false, 50, false, true)
            ,('numericlessthanorequalto', 'Less Than or Equal To', 'Evaluates to true if the characteristic value is less than or equal to the validation value.', false, true, false, 60, false, true)
            ,('numericbetweeninclusive', 'Between (Inclusive)', 'Evaluates to true if the characteristic value is between or equal the validation range values.', false, true, false, 70, false, true)
            ,('dateequal', 'Equals', 'Evaluates to true if the characteristic value matches the validation value.', false, false, true, 80, false, true)
            ,('dategreaterthan', 'Greater Than', 'Evaluates to true if the characteristic value is greater than the validation value.', false, false, true, 90, false, true)
            ,('dategreaterthanorequalto', 'Greater Than or Equal To', 'Evaluates to true if the characteristic value is greater than or equal to the validation value.', false, false, true, 100, false, true)
            ,('datelessthan', 'Less Than', 'Evaluates to true if the characteristic value is less than the validation value.', false, false, true, 110, false, true)
            ,('datelessthanorequalto', 'Less Than or Equal To', 'Evaluates to true if the characteristic value is less than or equal to the validation value.', false, false, true, 120, false, true)
            ,('datebetweeninclusive', 'Between (Inclusive)', 'Evaluates to true if the characteristic value is between or equal the validation range values.', false, false, true, 130, false, true)
            ,('flagistrue', 'Is Checked', 'Evaluates to true if the characteristic is checked.', false, false, false, 140, true, true)
            ,('flagisfalse', 'Is Not Checked', 'Evaluates to true if the characteristic is not checked.', false, false, false, 150, true, true))
        AS q(    validator_type_internal_name 
                ,validator_type_display_name 
                ,validator_type_description 
                ,validator_type_is_text 
                ,validator_type_is_numeric 
                ,validator_type_is_date
                ,validator_type_display_order
                ,validator_type_is_flag
                ,validator_type_is_user_visible ) 
    WHERE NOT EXISTS(SELECT true 
                     FROM   musesuperchar.validator_type 
                     WHERE  validator_type_internal_name = q.validator_type_internal_name);