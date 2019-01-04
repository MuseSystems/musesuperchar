-- File:        delete_internal_names_maint_priv.sql
-- Location:    musesuperchar/database/misc
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


-- This script drops the now deprecated privilege allowing users to alter
-- "internal names".  This feature was just dumb and should not have been
-- added in the first place. So... clean it up.

DO
    $BODY$
        DECLARE
            vPrivId integer;
        BEGIN
            DELETE FROM public.priv
                WHERE priv_module = 'Muse Systems Super Characteristics'
                    AND priv_name = 'maintainSuperCharInternalNames'
            RETURNING priv_id INTO vPrivId;

            DELETE FROM public.grppriv
                WHERE grppriv_priv_id = vPrivId;

            DELETE FROM public.usrpriv
                WHERE usrpriv_priv_id = vPrivId;
        END;
    $BODY$;