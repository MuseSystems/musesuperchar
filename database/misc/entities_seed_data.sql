/*************************************************************************
 *************************************************************************
 **
 ** File:         entities_seed_data.sql
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

    SELECT  musesuperchar.create_entity(
                 entity_schema
                ,entity_table
                ,entity_display_name
                ,entity_pk_column
                ,'musesuperchar'
                ,entity_is_system_locked)   
             
    FROM (VALUES 
             ('public','item','item_id','Item',true)
            ,('public','ls','ls_id','Lot/Serial',true)
            ,('public','custinfo','cust_id','Customer',true)
            ,('public','crmacct','crmacct_id','CRM Account',true)
            ,('public','addr','addr_id','Address',true)
            ,('public','cntct','cntct_id','Contact',true)
            ,('public','ophead','ophead_id','Opportunity',true)
            ,('public','emp','emp_id','Employee',true)
            ,('public','incdt','incdt_id','Incident',true)
            ,('public','quhead','quhead_id','Quote',true)
            ,('public','cohead','cohead_id','Sales Order',true)
            ,('public','invchead','invchead_id','Customer Invoice',true)
            ,('public','vendinfo','vend_id','Vendor',true)
            ,('public','pohead','pohead_id','Purchase Order',true)
            ,('public','vohead','vohead_id','Voucher',true)
            ,('public','prj','prj_id','Project',true)
            ,('public','prjtask','prjtask_id','Proejct Task',true)
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