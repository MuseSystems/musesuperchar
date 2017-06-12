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

--
--  When true, this parameter instructs the group layout engine to adjust the
--  layout to minimize the space taken in case there are sections with fewer
--  columns than others.  The side effect of this is that it can cause
--  reordering of the windows from those specified.  When false, each section
--  takes the full screen width regardless whether it has sufficient columns to
--  justify the space; this upside of this approach is that the space will
--  follow the user defined order.
--

SELECT musextputils.create_musemetric(  'musesuperchar'
                                       ,'isLayoutSpaceConserved'
                                       ,'When true, this parameter instructs the group layout engine to adjust the layout to minimize the space taken in case there are sections with fewer columns than others.  The side effect of this is that it can cause reordering of the windows from those specified.  When false, each section takes the full screen width regardless whether it has sufficient columns to justify the space; this upside of this approach is that the space will follow the user defined order. '
                                       ,false
                                    )
    WHERE musextputils.get_musemetric(  'musesuperchar'
                                       ,'isLayoutSpaceConserved'
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

