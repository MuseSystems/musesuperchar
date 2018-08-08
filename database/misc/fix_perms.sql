/*************************************************************************
 *************************************************************************
 **
 ** File:         fix_perms.sql
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

ALTER TABLE musesuperchar.pkgcmd OWNER TO admin;
ALTER TABLE musesuperchar.pkgcmdarg OWNER TO admin;
ALTER TABLE musesuperchar.pkgimage OWNER TO admin;
ALTER TABLE musesuperchar.pkgmetasql OWNER TO admin;
ALTER TABLE musesuperchar.pkgpriv OWNER TO admin;
ALTER TABLE musesuperchar.pkgreport OWNER TO admin;
ALTER TABLE musesuperchar.pkgscript OWNER TO admin;
ALTER TABLE musesuperchar.pkguiform OWNER TO admin;