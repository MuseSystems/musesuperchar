-- File:        v_form_builder_widgets.sql
-- Location:    musesuperchar/database/views
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

            -- We have to create some of our views in init scripts since the
            -- xTuple Updater cannot properly express certain kind of database
            -- dependencies (such as functions depending on views.)  This script
            -- serves as that purpose.


        END;
    $BODY$;
