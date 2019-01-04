-- File:        fix_perms.sql
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


ALTER TABLE musesuperchar.pkgcmd OWNER TO admin;
ALTER TABLE musesuperchar.pkgcmdarg OWNER TO admin;
ALTER TABLE musesuperchar.pkgimage OWNER TO admin;
ALTER TABLE musesuperchar.pkgmetasql OWNER TO admin;
ALTER TABLE musesuperchar.pkgpriv OWNER TO admin;
ALTER TABLE musesuperchar.pkgreport OWNER TO admin;
ALTER TABLE musesuperchar.pkgscript OWNER TO admin;
ALTER TABLE musesuperchar.pkguiform OWNER TO admin;