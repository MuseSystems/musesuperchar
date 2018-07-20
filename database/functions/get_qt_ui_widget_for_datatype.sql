/*************************************************************************
 *************************************************************************
 **
 ** File:         get_qt_ui_widget_for_datatype.sql
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

-- Drop the legacy version of this function
DROP FUNCTION IF EXISTS musesuperchar.get_qt_ui_widget_for_datatype(
    pPrefix text, pScDefIntName text, pDataTypeIntName text, pHeight integer,
    pWidth integer);

--
-- A function which returns the UI XML for a standard Qt widget based on the
-- datatype.   Note that other parts of this package expect the trailing name of
-- each widget to be the lowercase name of the widget class.
--

CREATE OR REPLACE FUNCTION musesuperchar.get_qt_ui_widget_for_datatype(pPrefix text, pScDefIntName text, pDataTypeIntName text, pHeight integer DEFAULT 0, pWidth integer DEFAULT 0, pMaxHeight integer DEFAULT 0, pMaxWidth integer DEFAULT 0)
    RETURNS xml[] AS
        $BODY$
            SELECT
                CASE
                    WHEN pDataTypeIntName = 'textfield' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('XLineEdit' as class, pPrefix||'_'||pScDefIntName||'_xlineedit' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('XLineEdit' as class, 'QLineEdit' as extends, 'xlineedit.h' as header))]
                    WHEN pDataTypeIntName = 'textarea' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('XTextEdit' as class, pPrefix||'_'||pScDefIntName||'_xtextedit' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('XTextEdit' as class, 'QTextEdit' as extends, 'xtextedit.h' as header))]
                    WHEN pDataTypeIntName = 'datecluster' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('DLineEdit' as class, pPrefix||'_'||pScDefIntName||'_dlineedit' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('DLineEdit' as class, 'QWidget' as extends, 'datecluster.h' as header))]
                    WHEN pDataTypeIntName = 'checkbox' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('QCheckBox' as class, pPrefix||'_'||pScDefIntName||'_qcheckbox' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        null::xml]
                    WHEN pDataTypeIntName = 'combobox' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('XComboBox' as class, pPrefix||'_'||pScDefIntName||'_xcombobox' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('XComboBox' as class, 'QComboBox' as extends, 'xcombobox.h' as header))]
                    WHEN pDataTypeIntName = 'wholenumber' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('XLineEdit' as class, pPrefix||'_'||pScDefIntName||'_xlineedit' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('XLineEdit' as class, 'QLineEdit' as extends, 'xlineedit.h' as header))]
                    WHEN pDataTypeIntName = 'decimalnumber' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('XLineEdit' as class, pPrefix||'_'||pScDefIntName||'_xlineedit' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('XLineEdit' as class, 'QLineEdit' as extends, 'xlineedit.h' as header))]
                    WHEN pDataTypeIntName = 'qty' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('XLineEdit' as class, pPrefix||'_'||pScDefIntName||'_xlineedit' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('XLineEdit' as class, 'QLineEdit' as extends, 'xlineedit.h' as header))]
                    WHEN pDataTypeIntName = 'cost' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('XLineEdit' as class, pPrefix||'_'||pScDefIntName||'_xlineedit' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('XLineEdit' as class, 'QLineEdit' as extends, 'xlineedit.h' as header))]
                    WHEN pDataTypeIntName = 'purchprice' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('XLineEdit' as class, pPrefix||'_'||pScDefIntName||'_xlineedit' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('XLineEdit' as class, 'QLineEdit' as extends, 'xlineedit.h' as header))]
                    WHEN pDataTypeIntName = 'salesprice' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('XLineEdit' as class, pPrefix||'_'||pScDefIntName||'_xlineedit' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('XLineEdit' as class, 'QLineEdit' as extends, 'xlineedit.h' as header))]
                    WHEN pDataTypeIntName = 'extprice' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('XLineEdit' as class, pPrefix||'_'||pScDefIntName||'_xlineedit' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('XLineEdit' as class, 'QLineEdit' as extends, 'xlineedit.h' as header))]
                    WHEN pDataTypeIntName = 'weight' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('XLineEdit' as class, pPrefix||'_'||pScDefIntName||'_xlineedit' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('XLineEdit' as class, 'QLineEdit' as extends, 'xlineedit.h' as header))]
                    WHEN pDataTypeIntName = 'percent' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('XLineEdit' as class, pPrefix||'_'||pScDefIntName||'_xlineedit' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('XLineEdit' as class, 'QLineEdit' as extends, 'xlineedit.h' as header))]
                    WHEN pDataTypeIntName = 'filecluster' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('FileCluster' as class, pPrefix||'_'||pScDefIntName||'_filecluster' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('FileCluster' as class, 'QWidget' as extends, 'filecluster.h' as header))]
                    WHEN pDataTypeIntName = 'imagecluster' THEN
                        ARRAY[xmlelement(name widget, xmlattributes('ImageCluster' as class, pPrefix||'_'||pScDefIntName||'_imagecluster' AS name),
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('minimumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pWidth)
                                                ELSE
                                                    xmlelement(name width, null, 0)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pHeight)
                                                ELSE
                                                    xmlelement(name height, null, 0)
                                            END))
                                ELSE
                                    null
                            END,
                            CASE
                                WHEN coalesce(pHeight,0) > 0 OR coalesce(pWidth,0) > 0 THEN
                                    xmlelement(name property, xmlattributes('maximumSize' AS name),
                                        xmlelement(name size, null,
                                            CASE
                                                WHEN coalesce(pWidth,0) > 0 THEN
                                                    xmlelement(name width, null, pMaxWidth)
                                                ELSE
                                                    xmlelement(name width, null, 16777215)
                                            END,
                                            CASE
                                                WHEN coalesce(pHeight,0) > 0 THEN
                                                    xmlelement(name height, null, pMaxHeight)
                                                ELSE
                                                    xmlelement(name height, null, 16777215)
                                            END))
                                ELSE
                                    null
                            END),
                        xmlelement(name customwidget,
                            xmlforest('ImageCluster' as class, 'QWidget' as extends, 'imagecluster.h' as header))]
                END;
        $BODY$
    LANGUAGE sql IMMUTABLE;

ALTER FUNCTION musesuperchar.get_qt_ui_widget_for_datatype(pPrefix text, pScDefIntName text, pDataTypeIntName text, pHeight integer, pWidth integer, pMaxHeight integer, pMaxWidth integer)
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_qt_ui_widget_for_datatype(pPrefix text, pScDefIntName text, pDataTypeIntName text, pHeight integer, pWidth integer, pMaxHeight integer, pMaxWidth integer) FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_ui_widget_for_datatype(pPrefix text, pScDefIntName text, pDataTypeIntName text, pHeight integer, pWidth integer, pMaxHeight integer, pMaxWidth integer) TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_ui_widget_for_datatype(pPrefix text, pScDefIntName text, pDataTypeIntName text, pHeight integer, pWidth integer, pMaxHeight integer, pMaxWidth integer) TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_qt_ui_widget_for_datatype(pPrefix text, pScDefIntName text, pDataTypeIntName text, pHeight integer, pWidth integer, pMaxHeight integer, pMaxWidth integer)
    IS $DOC$A function which returns the UI XML for a standard Qt widget based on the datatype.$DOC$;
