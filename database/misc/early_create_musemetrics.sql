/*************************************************************************
 *************************************************************************
 **
 ** File:         early_create_musemetrics.sql
 ** Project:      Muse Systems Super Characteristics for xTuple ERP
 ** Author:       Steven C. Buttgereit
 **
 ** (C) 2017-2018 Lima Buttgereit Holdings LLC d/b/a Muse Systems
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

--
--  Since we're dynamically creating widget object names, there is a small change that we could cause a naming collision with object names defined externally to the Super Characteristic package.  So we will prefix our object names with this value as a sort of namespace.
--

SELECT musextputils.create_musemetric(  'musesuperchar'
                                       ,'widgetPrefix'
                                       ,'Since we''re dynamically creating widget object names, there is a small change that we could cause a naming collision with object names defined externally to the Super Characteristic package.  So we will prefix our object names with this value as a sort of namespace.'
                                       ,'mssc'::text
                                    )
    WHERE musextputils.get_musemetric(  'musesuperchar'
                                       ,'widgetPrefix'
                                       ,null::text) IS NULL;

--
--  Used for "out-of-box" entity types like item to set the name of the tab where the Super Characteristics will be.
--

SELECT musextputils.create_musemetric(  'musesuperchar'
                                       ,'superCharTabName'
                                       ,'Used for "out-of-box" entity types like item to set the name of the tab where the Super Characteristics will be.'
                                       ,'Super Characteristics'::text
                                    )
    WHERE musextputils.get_musemetric(  'musesuperchar'
                                       ,'superCharTabName'
                                       ,null::text) IS NULL;

--
--  If true, forms that add the Super Characteristics tab and also have an xTuple out-of-box characteristics tab should hide the xTuple tab.  If false, we display both side-by-side.
--

SELECT musextputils.create_musemetric(  'musesuperchar'
                                       ,'isXtupleCharacteristicsTabHidden'
                                       ,'If true, forms that add the Super Characteristics tab and also have an xTuple out-of-box characteristics tab should hide the xTuple tab.  If false, we display both side-by-side.'
                                       ,false
                                    )
    WHERE musextputils.get_musemetric(  'musesuperchar'
                                       ,'isXtupleCharacteristicsTabHidden'
                                       ,null::boolean) IS NULL;

