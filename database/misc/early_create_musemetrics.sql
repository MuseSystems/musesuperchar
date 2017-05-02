/*************************************************************************
 *************************************************************************
 **
 ** File:         early_create_musemetrics.sql
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


--
--  If true, this setting allows users to add layout items or validation rules
--  in addition to the system installed entries for otherwise system locked
--  records.
--

SELECT musextputils.create_musemetric(  'musesuperchar'
                                       ,'isSystemLockedObjectUserExtendable'
                                       ,'If true, this setting allows users to add layout items or validation rules in addition to the system installed entries for otherwise system locked records.'
                                       ,true
                                    )
    WHERE musextputils.get_musemetric(  'musesuperchar'
                                       ,'isSystemLockedObjectUserExtendable'
                                       ,null::boolean) IS NULL;

