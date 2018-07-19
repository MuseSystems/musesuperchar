/*************************************************************************
 *************************************************************************
 **
 ** File:         delete_internal_names_maint_priv.sql
 ** Project:      Muse Systems Super Characteristics for xTuple ERP
 ** Author:       Steven C. Buttgereit
 **
 ** (C) 2018 Lima Buttgereit Holdings LLC d/b/a Muse Systems
 **
 ** Contact:
 ** muse.information@musesystems.com  :: https://muse.systems
 **
 ** License: MIT License. See LICENSE.md for complete licensing details.
 **
 *************************************************************************
 ************************************************************************/

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