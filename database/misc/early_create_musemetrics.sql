/*************************************************************************
 *************************************************************************
 **
 ** File:         early_create_musemetrics.sql
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

--
--  A configuration flag that, if true sets the Muse Systems xTuple Utilities
--  auditing feature triggers for super characteristic tables for entities.
--

SELECT musextputils.create_musemetric(  'musesuperchar'
                                       ,'isEntityMuseUtilsAuditingDefaulted'
                                       ,'A configuration flag that, if true sets the Muse Systems xTuple Utilities auditing feature triggers for super characteristic tables for entities.'
                                       ,true
                                    )
    WHERE musextputils.get_musemetric(  'musesuperchar'
                                       ,'isEntityMuseUtilsAuditingDefaulted'
                                       ,null::boolean) IS NULL;
--
--  If isEntityMuseUtilsAuditingDefaulted is true, then this configuration is
--  used to set the default auditing events recorded.
--

SELECT musextputils.create_musemetric(  'musesuperchar'
                                       ,'defaultEntityMuseUtilsAuditingEvents'
                                       ,'If isEntityMuseUtilsAuditingDefaulted is true, then this configuration is used to set the default auditing events recorded.'
                                       ,'{INSERT, UPDATE, DELETE}'::text[]
                                    )
    WHERE musextputils.get_musemetric(  'musesuperchar'
                                       ,'defaultEntityMuseUtilsAuditingEvents'
                                       ,null::text[]) IS NULL;


