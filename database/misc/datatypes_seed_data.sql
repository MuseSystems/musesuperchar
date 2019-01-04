-- File:        datatypes_seed_data.sql
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


INSERT INTO musesuperchar.datatype (
         datatype_internal_name
        ,datatype_display_name
        ,datatype_description
        ,datatype_is_text
        ,datatype_is_numeric
        ,datatype_is_date
        ,datatype_display_order
        ,datatype_is_flag
        ,datatype_is_array
        ,datatype_is_lov_based
        ,datatype_is_user_visible
        ,datatype_is_cosmetic)
    VALUES
         ('textfield', 'Text Field', 'A single line of text.', true, false, false, 10, false, false, false, true, false)
        ,('textarea', 'Text Area', 'A larger, multi-line text area.', true, false, false, 20, false, false, false, true, false)
        ,('datecluster', 'Date', 'A date field.', false, false, true, 30, false, false, false, true, false)
        ,('checkbox', 'Checkbox', 'A checkbox field.', false, false, false, 40, true, false, false, true, false)
        ,('combobox', 'List of Values', 'A list of values field.', false, false, false, 50, false, false, true, true, false)
        ,('wholenumber', 'Whole Number', 'A numeric whole number value.', false, true, false, 55, false, false, false, true, false)
        ,('decimalnumber', 'Decimal Number', 'A numeric real number value.', false, true, false, 55, false, false, false, true, false)
        ,('qty', 'Quantity', 'A quantity value rounded to the inventory "Qty" locale precision.', false, true, false, 60, false, false, false, true, false)
        ,('cost', 'Cost', 'A money value rounded to the "Cost" locale precision.', false, true, false, 70, false, false, false, true, false)
        ,('purchprice', 'Purchase Price', 'A money value rounded to the "Purch. Price" locale precision.', false, true, false, 80, false, false, false, true, false)
        ,('salesprice', 'Sales Price', 'A money value rounded to the "Sales Price" locale precision.', false, true, false, 90, false, false, false, true, false)
        ,('extprice', 'Extended Price', 'A money value rounded to the "Ext. Price" locale precision.', false, true, false, 100, false, false, false, true, false)
        ,('weight', 'Weight', 'A quantity value rounded to the "Weight" locale precision.', false, true, false, 110, false, false, false, true, false)
        ,('percent', 'Percentage', 'A numeric value rounded to the "Percent" locale precision.', false, true, false, 115, false, false, false, true, false)
        --,('filecluster', 'File', 'A file/attachment reference field.', true, false, false, 120, false, false, false, true, false)
        ,('imagecluster', 'Image', 'An xTuple Image field.', true, false, false, 130, false, false, false, true, false)
        ,('emptyspace', 'Empty Space', 'A placeholder like field which just takes space.', false, false, false, 500, false, false, false, false, true)
        ,('horizontalline', 'Horizontal Line', 'Draws a line across the column where this characteristic is placed.', false, false, false, 510, false, false, false, false, true)
    ON CONFLICT(datatype_internal_name)
        DO NOTHING;