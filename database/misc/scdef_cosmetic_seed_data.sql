/*************************************************************************
 *************************************************************************
 **
 ** File:         scdef_cosmetic_seed_data.sql
 ** Project:      Muse Systems Super Characteristics for xTuple ERP
 ** Author:       Steven C. Buttgereit
 **
 ** (C) 2018 Lima Buttgereit Holdings LLC d/b/a Muse Systems
 **
 ** Contact:
 ** muse.information@musesystems.com  :: https://muse.systems
 **
 ** License: MIT License. See LICENSE.md for complete licensing details.
 **
 *************************************************************************
 ************************************************************************/

INSERT INTO musesuperchar.scdef (
     scdef_internal_name
    ,scdef_display_name
    ,scdef_description
    ,scdef_pkghead_id
    ,scdef_is_system_locked
    ,scdef_datatype_id
    ,scdef_values_list
    ,scdef_list_query
    ,scdef_is_searchable)
VALUES
    ('system_empty_space'
    ,''
    ,'Allows you to add a placeholder empty space into a group layout.  This characteristic can be added to a group multiple times as needed.'
    ,(SELECT pkghead_id FROM public.pkghead WHERE pkghead_name = 'musesuperchar')
    ,true
    ,(SELECT datatype_id FROM musesuperchar.datatype WHERE datatype_internal_name = 'emptyspace')
    ,null
    ,null
    ,false),
    ('system_horizontal_line'
    ,''
    ,'Allows you to add a horizontal dividing line into a group layout.  This characteristic can be added to a group multiple times as needed.'
    ,(SELECT pkghead_id FROM public.pkghead WHERE pkghead_name = 'musesuperchar')
    ,true
    ,(SELECT datatype_id FROM musesuperchar.datatype WHERE datatype_internal_name = 'horizontalline')
    ,null
    ,null
    ,false)
ON CONFLICT(scdef_internal_name)
        DO NOTHING;