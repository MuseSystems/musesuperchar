-- File:        drop_objects.sql
-- Location:    /home/scb/source/products/xtuple/musesuperchar/database/misc
-- Project:     Muse Systems Super Characteristics for xTuple ERP
--
-- Licensed to Lima Buttgereit Holdings LLC (d/b/a Muse Systems) under one or
-- more agreements.  Muse Systems licenses this file to you under the terms and
-- conditions of your Muse Systems Master Services Agreement or governing
-- Statement of Work.
--
-- See the NOTICE file in the project root for copyright ownership information.
--
-- muse.information@musesystems.com  :: https://muse.systems

-- This script will clean up package objects such as scripts, reports, and
-- UI forms.  These objects can get left behind as cruft as change happens
-- and there's no real mechanism to clean them up... that is until this
-- script!

DELETE FROM musesuperchar.pkgscript;
DELETE FROM musesuperchar.pkgreport;
DELETE FROM musesuperchar.pkgmetasql;
DELETE FROM musesuperchar.pkguiform;
DELETE FROM musesuperchar.pkgcmd;
DELETE FROM musesuperchar.pkgcmdarg;
DELETE FROM musesuperchar.pkgimage;
