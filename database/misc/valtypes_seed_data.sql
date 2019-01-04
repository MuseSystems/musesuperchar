-- File:        valtypes_seed_data.sql
-- Location:    musesuperchar/database/misc
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


INSERT INTO musesuperchar.valtype (
         valtype_internal_name
        ,valtype_display_name
        ,valtype_description
        ,valtype_is_text
        ,valtype_is_numeric
        ,valtype_is_date
        ,valtype_display_order
        ,valtype_is_flag
        ,valtype_is_user_visible)
    SELECT   valtype_internal_name
            ,valtype_display_name
            ,valtype_description
            ,valtype_is_text
            ,valtype_is_numeric
            ,valtype_is_date
            ,valtype_display_order
            ,valtype_is_flag
            ,valtype_is_user_visible
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
        AS q(    valtype_internal_name
                ,valtype_display_name
                ,valtype_description
                ,valtype_is_text
                ,valtype_is_numeric
                ,valtype_is_date
                ,valtype_display_order
                ,valtype_is_flag
                ,valtype_is_user_visible )
    WHERE NOT EXISTS(SELECT true
                     FROM   musesuperchar.valtype
                     WHERE  valtype_internal_name = q.valtype_internal_name);