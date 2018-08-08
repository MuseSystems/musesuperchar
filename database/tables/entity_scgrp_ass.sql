/*************************************************************************
 *************************************************************************
 **
 ** File:
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

DO
    $BODY$
        DECLARE

        BEGIN

            -- We have to create our tables in init scripts since the xTuple
            -- Updater cannot properly express certain kind of database
            -- dependencies (such as functions depending on views.)  This script
            -- serves as 1) a place holder so that we can properly validate that
            -- the related table init script passes the Updater's validations;
            -- 2) a convenient place to put "ALTER" statements for deltas after
            -- initial release.


        END;
    $BODY$;
