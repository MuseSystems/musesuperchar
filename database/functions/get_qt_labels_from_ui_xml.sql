-- File:        get_qt_labels_from_ui_xml.sql
-- Location:    musesuperchar/database/functions
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


--
-- Takes Qt UI XML as input and returns the extracted widget names as keys and
-- their Qt object class as values of a flat jsonb object.  Note that because
-- we're using jsonb as the return type, we expect the object names to unique
-- otherwise it is indeterminate which object you will receive (actually is to
-- probably the last one in the file, but we're not going to take the time to
-- prove it out.)  Note that this function only includes XLabel widgets, see
-- get_qt_widgets_from_ui_xml for the generalized version.
--

CREATE OR REPLACE FUNCTION musesuperchar.get_qt_labels_from_ui_xml(pXml xml)
    RETURNS jsonb AS
        $BODY$
            SELECT
                jsonb_object(
                    xpath('widget//widget[@class="XLabel"]/./@name',
                        pXml::xml)::text[],
                    xpath('widget//widget[@class="XLabel"]/./@class',
                        pXml::xml)::text[]);
        $BODY$
    LANGUAGE sql IMMUTABLE;

ALTER FUNCTION musesuperchar.get_qt_labels_from_ui_xml(pXml xml)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_qt_labels_from_ui_xml(pXml xml) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_labels_from_ui_xml(pXml xml) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_labels_from_ui_xml(pXml xml) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_qt_labels_from_ui_xml(pXml xml)
    IS $DOC$Takes Qt UI XML as input and returns the extracted widget names as keys and their Qt object class as values of a flat jsonb object.  Note that because we're using jsonb as the return type, we expect the object names to unique otherwise it is indeterminate which object you will receive (actually is to probably the last one in the file, but we're not going to take the time to prove it out.)  Note that this function only includes XLabel widgets, see get_qt_widgets_from_ui_xml for the generalized version.$DOC$;