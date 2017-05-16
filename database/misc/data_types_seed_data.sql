/*************************************************************************
 *************************************************************************
 **
 ** File:         data_types_seed_data.sql
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

INSERT INTO musesuperchar.data_type (
         data_type_internal_name
        ,data_type_display_name
        ,data_type_description
        ,data_type_is_text
        ,data_type_is_numeric
        ,data_type_is_date
        ,data_type_display_order
        ,data_type_is_flag
        ,data_type_is_array
        ,data_type_is_lov_based
        ,data_type_is_user_visible)
    VALUES 
         ('text_field', 'Text Field', 'A single line of text.', true, false, false, 10, false, false, false, true)
        ,('text_area', 'Text Area', 'A larger, multi-line text area.', true, false, false, 20, false, false, false, true)
        ,('datecluster', 'Date', 'A date field.', false, false, true, 30, false, false, false, true)
        ,('checkbox', 'Checkbox', 'A checkbox field.', false, false, false, 40, true, false, false, true)
        ,('combobox', 'List of Values', 'A list of values field.', false, false, false, 50, false, false, true, true)
        ,('wholenumber', 'Whole Number', 'A numeric whole number value.', false, true, false, 55, false, false, false, true)
        ,('qty', 'Quantity', 'A quantity value rounded to the inventory "Qty" locale precision.', false, true, false, 60, false, false, false, true)
        ,('cost', 'Cost', 'A money value rounded to the "Cost" locale precision.', false, true, false, 70, false, false, false, true)
        ,('purchprice', 'Purchase Price', 'A money value rounded to the "Purch. Price" locale precision.', false, true, false, 80, false, false, false, true)
        ,('salesprice', 'Sales Price', 'A money value rounded to the "Sales Price" locale precision.', false, true, false, 90, false, false, false, true)
        ,('extprice', 'Extended Price', 'A money value rounded to the "Ext. Price" locale precision.', false, true, false, 100, false, false, false, true)
        ,('weight', 'Weight', 'A quantity value rounded to the "Weight" locale precision.', false, true, false, 110, false, false, false, true)
        ,('percent', 'Percentage', 'A numeric value rounded to the "Percent" locale precision.', false, true, false, 115, false, false, false, true)
        ,('filecluster', 'File', 'A file/attachment reference field.', true, false, false, 120, false, false, false, true)
        ,('imagecluster', 'Image', 'An xTuple Image field.', true, false, false, 130, false, false, false, true)
    ON CONFLICT(data_type_internal_name)
        DO NOTHING;