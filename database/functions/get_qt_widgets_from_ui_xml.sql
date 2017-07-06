/*************************************************************************
 *************************************************************************
 **
 ** File:         get_qt_widgets_from_ui_xml.sql
 ** Project:      Muse Systems Super Characteristic for xTuple ERP
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

--
-- Takes Qt UI XML as input and returns the extracted widget names as keys and
-- their Qt object class as values of a flat jsonb object.  Note that because
-- we're using jsonb as the return type, we expect the object names to unique
-- otherwise it is indeterminate which object you will receive (actually is to
-- probably the last one in the file, but we're not going to take the time to
-- prove it out.)  Note that this function excludes XLabel widgets, see
-- get_qt_labels_from_ui_xml for that version.
--

CREATE OR REPLACE FUNCTION musesuperchar.get_qt_widgets_from_ui_xml(pXml xml) 
    RETURNS jsonb AS
        $BODY$
            SELECT 
                jsonb_object(
                    xpath('widget//widget[@class!="XLabel" and @class!="QGroupBox"]/./@name',
                        pXml::xml)::text[],
                    xpath('widget//widget[@class!="XLabel" and @class!="QGroupBox"]/./@class',
                        pXml::xml)::text[]);
        $BODY$
    LANGUAGE sql IMMUTABLE;

ALTER FUNCTION musesuperchar.get_qt_widgets_from_ui_xml(pXml xml)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_qt_widgets_from_ui_xml(pXml xml) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_widgets_from_ui_xml(pXml xml) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_widgets_from_ui_xml(pXml xml) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_qt_widgets_from_ui_xml(pXml xml) 
    IS $DOC$Takes Qt UI XML as input and returns the extracted widget names as keys and their Qt object class as values of a flat jsonb object.  Note that because we're using jsonb as the return type, we expect the object names to unique otherwise it is indeterminate which object you will receive (actually is to probably the last one in the file, but we're not going to take the time to prove it out.)  Note that this function excludes XLabel widgets, see get_qt_labels_from_ui_xml for that version.$DOC$;