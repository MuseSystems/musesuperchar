-- File:        scdef_cosmetic_seed_data.sql
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


INSERT INTO musesuperchar.scdef (
     scdef_internal_name
    ,scdef_display_name
    ,scdef_description
    ,scdef_pkghead_id
    ,scdef_is_system_locked
    ,scdef_datatype_id
    ,scdef_values_list
    ,scdef_list_query
    ,scdef_is_searchable
    ,scdef_is_display_only
    ,scdef_is_virtual)
VALUES
    ('system_empty_space'
    ,''
    ,'Allows you to add a placeholder empty space into a group layout.  This characteristic can be added to a group multiple times as needed.'
    ,(SELECT pkghead_id FROM public.pkghead WHERE pkghead_name = 'musesuperchar')
    ,true
    ,(SELECT datatype_id FROM musesuperchar.datatype WHERE datatype_internal_name = 'emptyspace')
    ,null
    ,null
    ,false
    ,true
    ,true),
    ('system_horizontal_line'
    ,''
    ,'Allows you to add a horizontal dividing line into a group layout.  This characteristic can be added to a group multiple times as needed.'
    ,(SELECT pkghead_id FROM public.pkghead WHERE pkghead_name = 'musesuperchar')
    ,true
    ,(SELECT datatype_id FROM musesuperchar.datatype WHERE datatype_internal_name = 'horizontalline')
    ,null
    ,null
    ,false
    ,true
    ,true)
ON CONFLICT(scdef_internal_name)
        DO NOTHING;