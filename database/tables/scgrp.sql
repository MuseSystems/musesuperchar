-- File:        scgrp.sql
-- Location:    musesuperchar/database/tables
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
