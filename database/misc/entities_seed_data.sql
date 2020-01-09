-- File:        entities_seed_data.sql
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


    SELECT  musesuperchar.create_entity(
                 entity_schema
                ,entity_table
                ,entity_display_name
                ,entity_pk_column
                ,'musesuperchar'
                ,entity_is_system_locked)

    FROM (VALUES
             ('public','item','item_id','Item',true)
            --,('public','ls','ls_id','Lot/Serial',true)
            ,('public','custinfo','cust_id','Customer',true)
            ,('public','crmacct','crmacct_id','CRM Account',true)
            --,('public','addr','addr_id','Address',true)
            --,('public','cntct','cntct_id','Contact',true)
            --,('public','ophead','ophead_id','Opportunity',true)
            --,('public','emp','emp_id','Employee',true)
            --,('public','incdt','incdt_id','Incident',true)
            ,('public','quhead','quhead_id','Quote',true)
            ,('public','quitem','quitem_id','Quote Item',true)
            ,('public','cohead','cohead_id','Sales Order',true)
            ,('public','coitem','coitem_id','Sales Order Item',true)
            --,('public','invchead','invchead_id','Customer Invoice',true)
            ,('public','vendinfo','vend_id','Vendor',true)
            ,('public','pohead','pohead_id','Purchase Order',true)
            ,('public','shiptoinfo','shipto_id','Customer Ship-To',true)
            --,('public','vohead','vohead_id','Voucher',true)
            --,('public','prj','prj_id','Project',true)
            --,('public','prjtask','prjtask_id','Project Task',true)
            ,('public','tohead','tohead_id','Transfer Order',true)
            ,('public','toitem','toitem_id','Transfer Order Item',true)
            ,('public','accnt','accnt_id', 'General Ledger Account',true)
            )
        AS q(    entity_schema
                ,entity_table
                ,entity_pk_column
                ,entity_display_name
                ,entity_is_system_locked )
    WHERE NOT EXISTS(SELECT true
                     FROM   musesuperchar.entity
                     WHERE  entity_schema = q.entity_schema
                        AND entity_table = q.entity_table);