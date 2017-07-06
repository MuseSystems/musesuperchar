/*************************************************************************
 *************************************************************************
 **
 ** File:         v_form_builder_widgets.sql
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

DO
    $BODY$
        DECLARE
            
        BEGIN

            -- We have to create some of our views in init scripts since the
            -- xTuple Updater cannot properly express certain kind of database
            -- dependencies (such as functions depending on views.)  This script
            -- serves as that purpose.
            

        END;
    $BODY$;
