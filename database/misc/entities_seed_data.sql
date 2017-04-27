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
             ('public','item','item_id','Item',false)
            ,('public','ls','ls_id','Lot/Serial',false)
            ,('public','custinfo','cust_id','Customer',false)
            ,('public','crmacct','crmacct_id','CRM Account',false)
            ,('public','addr','addr_id','Address',false)
            ,('public','cntct','cntct_id','Contact',false)
            ,('public','ophead','ophead_id','Opportunity',false)
            ,('public','emp','emp_id','Employee',false)
            ,('public','incdt','incdt_id','Incident',false)
            ,('public','quhead','quhead_id','Quote',false)
            ,('public','cohead','cohead_id','Sales Order',false)
            ,('public','invchead','invchead_id','Customer Invoice',false)
            ,('public','vendinfo','vend_id','Vendor',false)
            ,('public','pohead','pohead_id','Purchase Order',false)
            ,('public','vohead','vohead_id','Voucher',false)
            ,('public','prj','prj_id','Project',false)
            ,('public','prjtask','prjtask_id','Proejct Task',false)
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