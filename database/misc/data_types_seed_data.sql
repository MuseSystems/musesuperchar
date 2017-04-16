/*************************************************************************
 *************************************************************************
 **
 ** File:         data_types_seed_data.sql
 ** Project:      Muse Systems xTuple Super Characteristic
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

INSERT INTO musesuperchar.data_type (
         data_type_internal_name
        ,data_type_display_name
        ,data_type_description
        ,data_type_is_text
        ,data_type_is_numeric
        ,data_type_is_date
        ,data_type_display_order
        ,data_type_is_flag
        ,data_type_is_user_visible)
    SELECT   data_type_internal_name
            ,data_type_display_name
            ,data_type_description
            ,data_type_is_text
            ,data_type_is_numeric
            ,data_type_is_date
            ,data_type_display_order
            ,data_type_is_flag
            ,data_type_is_user_visible
    FROM (VALUES 
             ('text_field', 'Text Field', 'A single line of text.', true, false, false, 10, false, true)
            ,('text_area', 'Text Area', 'A larger, multi-line text area.', true, false, false, 20, false, true)
            ,('datecluster', 'Date', 'A date field.', false, false, true, 30, false, true)
            ,('checkbox', 'Checkbox', 'A checkbox field.', false, false, false, 40, true, true)
            ,('combobox', 'List of Values', 'A list of values field.', false, false, false, 50, false, true)
            ,('wholenumber', 'Whole Number', 'A numeric whole number value.', false, true, false, 55, false, true)
            ,('qty', 'Quantity', 'A quantity value rounded to the inventory "Qty" locale precision.', false, true, false, 60, false, true)
            ,('cost', 'Cost', 'A money value rounded to the "Cost" locale precision.', false, true, false, 70, false, true)
            ,('purchprice', 'Purchase Price', 'A money value rounded to the "Purch. Price" locale precision.', false, true, false, 80, false, true)
            ,('salesprice', 'Sales Price', 'A money value rounded to the "Sales Price" locale precision.', false, true, false, 90, false, true)
            ,('extprice', 'Extended Price', 'A money value rounded to the "Ext. Price" locale precision.', false, true, false, 100, false, true)
            ,('weight', 'Weight', 'A quantity value rounded to the "Weight" locale precision.', false, true, false, 110, false, true)
            ,('percent', 'Percentage', 'A numeric value rounded to the "Percent" locale precision.', false, true, false, 115, false, true)
            ,('filecluster', 'File', 'A file/attachment reference field.', true, false, false, 120, false, true)
            ,('imagecluster', 'Image', 'An xTuple Image field.', true, false, false, 130, false, true)
            ,('custcluster', 'Customer', 'A xTuple customer field.', true, true, false, 140, false, true)
            ,('vendorcluster', 'Vendor', 'An xTuple Vendor field.', true, true, false, 150, false, true)
            ,('warehousecluster', 'Site', 'An xTuple warehouse/site', true, false, false, 160, false, true)
            ,('addresscluster', 'Address', 'An address as stored in the xTuple CRM module.', true, false, false, 170, false, true)
            ,('empgroupcluster', 'Employee Group', 'An employee group field.', true, false, false, 180, false, true)
            ,('empcluster', 'Employee', 'An xTuple employee field.', true, false, false, 190, false, true)
            ,('currcluster', 'Currency', 'A currency value of a specific currency.', true, true, false, 999, false, true)
            ,('qtyper', 'Quanity Per', 'A quantity value rounded to the "Qty. Per" locale precision.', false, true, false, 999, false, true)
            ,('uomratio', 'UOM Ratio', 'A quantity value rounded to the "UOM ratio" locale precision.', false, true, false, 999, false, true)
            ,('glcluster', 'GL Account', 'An xTuple GL Account field.', true, false, false, 999, false, true)
            ,('itemcluster', 'Item', 'An xTuple Item field.', true, true, false, 999, false, true)
            ,('shiptocluster', 'Ship-To', 'An xTuple Customer Ship-To field.', true, false, false, 999, false, true)
            ,('usernamecluster', 'xTuple User', 'An xTuple User field.', true, false, false, 999, false, true)
            ,('workcentercluster', 'Work Center', 'An xTuple Work Center field.', true, false, false, 999, false, true)
            ,('email', 'Email Address', 'An email address field.',true, false, false,999, false, true)
            ,('url', 'Web Site', 'A URL, typically a web address.', true, false, false, 999, false, true)
            )
        AS q(    data_type_internal_name 
                ,data_type_display_name 
                ,data_type_description 
                ,data_type_is_text 
                ,data_type_is_numeric 
                ,data_type_is_date
                ,data_type_display_order
                ,data_type_is_flag
                ,data_type_is_user_visible ) 
    WHERE NOT EXISTS(SELECT true 
                     FROM   musesuperchar.data_type 
                     WHERE  data_type_internal_name = q.data_type_internal_name);