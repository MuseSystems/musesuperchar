/*************************************************************************
 *************************************************************************
 **
 ** File:        museScCreateCondValRule.js
 ** Project:     Muse System Super Characteristics for xTuple ERP
 ** Author:      Steven C. Buttgereit
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

try {
    //////////////////////////////////////////////////////////////////////////
    //  Namespace Definition
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseSuperChar === "undefined") {
        MuseSuperChar = {};
    }

    if (typeof MuseSuperChar.CreateCondValRule === "undefined") {
        MuseSuperChar.CreateCondValRule = {};
    }

    //////////////////////////////////////////////////////////////////////////
    //  Imports
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseUtils === "undefined") {
        include("museUtils");
    }

    MuseUtils.loadMuseUtils([
        MuseUtils.MOD_JS,
        MuseUtils.MOD_EXCEPTION,
        MuseUtils.MOD_QT,
        MuseUtils.MOD_JSPOLYFILL
    ]);

    if (typeof MuseSuperChar.SuperChar === "undefined") {
        include("museSuperCharData");
    }

    if (typeof MuseSuperChar.CondValRule === "undefined") {
        include("museScCondValRuleData");
    }

    if (typeof MuseSuperChar.Widget === "undefined") {
        include("museScWidget");
    }
} catch (e) {
    if (
        typeof MuseUtils !== "undefined" &&
        (MuseUtils.isMuseUtilsExceptionLoaded === true ? true : false)
    ) {
        var error = new MuseUtils.ScriptException(
            "musesuperchar",
            "We encountered a script level issue while processing MuseSuperChar.CreateCondValRule.",
            "MuseSuperChar.CreateCondValRule",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.CreateCondValRule Script Error",
            "We encountered a script level issue while processing MuseSuperChar.CreateCondValRule."
        );
    }
}

//////////////////////////////////////////////////////////////////////////
//  Module Defintion
//////////////////////////////////////////////////////////////////////////

(function(pPublicApi, pGlobal) {
    try {
        //--------------------------------------------------------------------
        //  Constants and Module State
        //--------------------------------------------------------------------
        // Holding place for our Super Chars.  These hold fairly rich data including
        // the related data type.
        var subSc = {};
        var objSc = {};
        var currCondValRule = {};
        var mode = "UNKNOWN";
        //--------------------------------------------------------------------
        //  Get Object References From Screen Definitions
        //--------------------------------------------------------------------
        var ifCharFormLayout = mywindow.findChild("ifCharFormLayout");
        var ifCondHBoxLayout = mywindow.findChild("ifCondHBoxLayout");
        var ifCondLeftSpacer = mywindow.findChild("ifCondLeftSpacer");
        var ifCondRightSpacer = mywindow.findChild("ifCondRightSpacer");
        var ifDataTypeFormLayout = mywindow.findChild("ifDataTypeFormLayout");
        var ifDataTypeValueXLabel = mywindow.findChild("ifDataTypeValueXLabel");
        var ifDataTypeXLabel = mywindow.findChild("ifDataTypeXLabel");
        var ifFormsHBoxLayout = mywindow.findChild("ifFormsHBoxLayout");
        var ifGroupBox = mywindow.findChild("ifGroupBox");
        var ifSuperCharComboBox = mywindow.findChild("ifSuperCharComboBox");
        var ifSuperCharXLabel = mywindow.findChild("ifSuperCharXLabel");
        var ifValidatorTypeComboBox = mywindow.findChild(
            "ifValidatorTypeComboBox"
        );
        var ifValidatorTypeXLabel = mywindow.findChild("ifValidatorTypeXLabel");
        var saveButtonBox = mywindow.findChild("saveButtonBox");
        var thenCharFormLayout = mywindow.findChild("thenCharFormLayout");
        var thenCondHBoxLayout = mywindow.findChild("thenCondHBoxLayout");
        var thenCondLeftSpacer = mywindow.findChild("thenCondLeftSpacer");
        var thenCondRightSpacer = mywindow.findChild("thenCondRightSpacer");
        var thenDataTypeFormLayout = mywindow.findChild(
            "thenDataTypeFormLayout"
        );
        var thenDataTypeValueXLabel = mywindow.findChild(
            "thenDataTypeValueXLabel"
        );
        var thenDataTypeXLabel = mywindow.findChild("thenDataTypeXLabel");
        var thenFormsHBoxLayout = mywindow.findChild("thenFormsHBoxLayout");
        var thenGroupBox = mywindow.findChild("thenGroupBox");
        var thenSuperCharComboBox = mywindow.findChild("thenSuperCharComboBox");
        var thenSuperCharXLabel = mywindow.findChild("thenSuperCharXLabel");
        var thenValidatorTypeComboBox = mywindow.findChild(
            "thenValidatorTypeComboBox"
        );
        var thenValidatorTypeXLabel = mywindow.findChild(
            "thenValidatorTypeXLabel"
        );
        var failGroupBox = mywindow.findChild("failGroupBox");
        var failXLineEdit = mywindow.findChild("failXLineEdit");

        var cancelPushButton = saveButtonBox.button(QDialogButtonBox.Cancel);
        var savePushButton = saveButtonBox.button(QDialogButtonBox.Save);

        //--------------------------------------------------------------------
        //  Custom Screen Objects and Starting GUI Manipulation
        //--------------------------------------------------------------------
        ifValidatorTypeComboBox.allowNull = true;
        ifValidatorTypeComboBox.nullStr = "--Please Select--";

        ifSuperCharComboBox.allowNull = true;
        ifSuperCharComboBox.nullStr = "--Please Select--";

        thenValidatorTypeComboBox.allowNull = true;
        thenValidatorTypeComboBox.nullStr = "--Please Select--";

        thenSuperCharComboBox.allowNull = true;
        thenSuperCharComboBox.nullStr = "--Please Select--";

        //--------------------------------------------------------------------
        //  Private Functional Logic
        //--------------------------------------------------------------------
        var isConValRuleValid = function() {
            return (
                MuseUtils.isValidId(ifSuperCharComboBox.id()) &&
                MuseUtils.isValidId(ifValidatorTypeComboBox.id()) &&
                MuseUtils.isValidId(thenSuperCharComboBox.id()) &&
                MuseUtils.isValidId(thenValidatorTypeComboBox.id()) &&
                MuseUtils.coalesce(failXLineEdit.text, "") !== "" &&
                MuseSuperChar.Widget.returnAllValidatorExceptions() === null
            );
        };

        var setButtons = function() {
            if (isConValRuleValid()) {
                savePushButton.enabled = true;
            } else {
                savePushButton.enabled = false;
            }
        };

        var getValidatorValuesStructure = function(
            pPrefix,
            pValTypeIntName,
            pValTypeDispName,
            pSuperChar
        ) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pPrefix: pPrefix,
                pValTypeIntName: pValTypeIntName,
                pValTypeDispName: pValTypeDispName,
                pSuperChar: pSuperChar
            };

            var group;
            var data = {};

            var normPrefix = MuseUtils.getNormalizedString(pPrefix);

            switch (pValTypeIntName) {
                case "regexp":
                case "numericequal":
                case "numericlessthan":
                case "numericgreaterthan":
                case "numericgreaterthanorequalto":
                case "numericlessthanorequalto":
                case "dateequal":
                case "datelessthan":
                case "datelessthanorequalto":
                case "dategreaterthan":
                case "dategreaterthanorequalto":
                    var testValName = normPrefix + "_test_val";
                    group = {
                        scgrp_id: null,
                        scgrp_internal_name: normPrefix + "_validator",
                        scgrp_display_name:
                            pSuperChar.scdef_datatype_display_name +
                            " Based Validator",
                        layout: [
                            {
                                section_name: "Test Value",
                                section_column_count: 1,
                                columns: [
                                    [
                                        {
                                            scdef_id: null,
                                            scdef_internal_name: testValName,
                                            scdef_display_name:
                                                pValTypeDispName + ":",
                                            datatype_internal_name:
                                                pSuperChar.scdef_datatype_internal_name,
                                            datatype_display_name:
                                                pSuperChar.scdef_datatype_display_name
                                        }
                                    ]
                                ]
                            }
                        ]
                    };

                    try {
                        data[
                            testValName
                        ] = MuseSuperChar.Widget.generateScWidget(
                            pSuperChar.scdef_datatype_internal_name,
                            testValName
                        );

                        if (
                            data[testValName].hasOwnProperty(
                                "editingFinished()"
                            )
                        ) {
                            data[
                                testValName
                            ].MSSC.pushValidationFunction(function() {
                                if (
                                    MuseUtils.coalesce(
                                        data[testValName].text,
                                        ""
                                    ) === ""
                                ) {
                                    return (
                                        "You must provide a test value for " +
                                        pPrefix +
                                        " condition " +
                                        pValTypeDispName +
                                        "."
                                    );
                                } else {
                                    return null;
                                }
                            });

                            data[testValName]["editingFinished()"].connect(
                                setButtons
                            );
                        } else if (
                            data[testValName].hasOwnProperty("newDate(QDate)")
                        ) {
                            data[
                                testValName
                            ].MSSC.pushValidationFunction(function() {
                                if (
                                    MuseUtils.coalesce(
                                        data[testValName].date,
                                        ""
                                    ) === ""
                                ) {
                                    return (
                                        "You must provide a test value for " +
                                        pPrefix +
                                        " condition " +
                                        pValTypeDispName +
                                        "."
                                    );
                                } else {
                                    return null;
                                }
                            });

                            data[testValName]["newDate(QDate)"].connect(
                                setButtons
                            );
                        }

                        if (pValTypeIntName == "regexp") {
                            data[
                                testValName
                            ].MSSC.pushValidationFunction(function() {
                                try {
                                    new RegExp(data[testValName].text);
                                    return null;
                                } catch (e) {
                                    return (
                                        "The provided test value for " +
                                        pPrefix +
                                        " condition " +
                                        pValTypeDispName +
                                        " is not " +
                                        "a valid regular expression."
                                    );
                                }
                            });
                        }
                    } catch (e) {
                        throw new MuseUtils.ApiException(
                            "musesuperchar",
                            "We caused errors while trying to set up a conditional validation test widget.",
                            "MuseSuperChar.CreateCondValRule.getValidatorValuesStructure",
                            { params: funcParams, thrownError: e },
                            MuseUtils.LOG_WARNING
                        );
                    }

                    break;
                case "numericbetweeninclusive":
                case "datebetweeninclusive":
                    var lowValName = normPrefix + "_low_val";
                    var highValName = normPrefix + "_high_val";

                    group = {
                        scgrp_id: null,
                        scgrp_internal_name: MuseUtils.getNormalizedString(
                            pPrefix + "_validator"
                        ),
                        scgrp_display_name:
                            pSuperChar.scdef_datatype_display_name +
                            " Based Validator",
                        layout: [
                            {
                                section_name: "Test Values",
                                section_column_count: 2,
                                columns: [
                                    [
                                        {
                                            scdef_id: null,
                                            scdef_internal_name: lowValName,
                                            scdef_display_name: "Low Value:",
                                            datatype_internal_name:
                                                pSuperChar.scdef_datatype_internal_name,
                                            datatype_display_name:
                                                pSuperChar.scdef_datatype_display_name
                                        }
                                    ],
                                    [
                                        {
                                            scdef_id: null,
                                            scdef_internal_name: highValName,
                                            scdef_display_name: "High Value:",
                                            datatype_internal_name:
                                                pSuperChar.scdef_datatype_internal_name,
                                            datatype_display_name:
                                                pSuperChar.scdef_datatype_display_name
                                        }
                                    ]
                                ]
                            }
                        ]
                    };

                    try {
                        data[
                            lowValName
                        ] = MuseSuperChar.Widget.generateScWidget(
                            pSuperChar.scdef_datatype_internal_name,
                            lowValName
                        );
                        data[
                            highValName
                        ] = MuseSuperChar.Widget.generateScWidget(
                            pSuperChar.scdef_datatype_internal_name,
                            highValName
                        );

                        if (pValTypeIntName == "numericbetweeninclusive") {
                            data[
                                lowValName
                            ].MSSC.pushValidationFunction(function() {
                                if (
                                    MuseUtils.coalesce(
                                        data[lowValName].text,
                                        ""
                                    ) === ""
                                ) {
                                    return (
                                        "You must provide a test value for " +
                                        pPrefix +
                                        " condition " +
                                        pValTypeDispName +
                                        "."
                                    );
                                } else if (
                                    data[lowValName].getNumericValue() >=
                                    data[highValName].getNumericValue()
                                ) {
                                    return (
                                        "The " +
                                        pPrefix +
                                        " condition " +
                                        pValTypeDispName +
                                        " requires that the low value " +
                                        "is lower than the high value."
                                    );
                                } else {
                                    return null;
                                }
                            });

                            data[
                                highValName
                            ].MSSC.pushValidationFunction(function() {
                                if (
                                    MuseUtils.coalesce(
                                        data[highValName].text,
                                        ""
                                    ) === ""
                                ) {
                                    return (
                                        "You must provide a test value for " +
                                        pPrefix +
                                        " condition " +
                                        pValTypeDispName +
                                        "."
                                    );
                                } else if (
                                    data[lowValName].getNumericValue() >=
                                    data[highValName].getNumericValue()
                                ) {
                                    return (
                                        "The " +
                                        pPrefix +
                                        " condition " +
                                        pValTypeDispName +
                                        " requires that the high value " +
                                        "is higher than the low value."
                                    );
                                } else {
                                    return null;
                                }
                            });

                            data[lowValName]["editingFinished()"].connect(
                                setButtons
                            );
                            data[highValName]["editingFinished()"].connect(
                                setButtons
                            );
                        } else if (pValTypeIntName == "datebetweeninclusive") {
                            data[
                                lowValName
                            ].MSSC.pushValidationFunction(function() {
                                if (
                                    MuseUtils.coalesce(
                                        data[lowValName].date,
                                        ""
                                    ) === ""
                                ) {
                                    return (
                                        "You must provide a test value for " +
                                        pPrefix +
                                        " condition " +
                                        pValTypeDispName +
                                        "."
                                    );
                                } else if (
                                    data[lowValName].date >=
                                    data[highValName].date
                                ) {
                                    return (
                                        "The " +
                                        pPrefix +
                                        " condition " +
                                        pValTypeDispName +
                                        " requires that the low value " +
                                        "is lower than the high value."
                                    );
                                } else {
                                    return null;
                                }
                            });

                            data[
                                highValName
                            ].MSSC.pushValidationFunction(function() {
                                if (
                                    MuseUtils.coalesce(
                                        data[highValName].date,
                                        ""
                                    ) === ""
                                ) {
                                    return (
                                        "You must provide a test value for " +
                                        pPrefix +
                                        " condition " +
                                        pValTypeDispName +
                                        "."
                                    );
                                } else if (
                                    data[lowValName].date >=
                                    data[highValName].date
                                ) {
                                    return (
                                        "The " +
                                        pPrefix +
                                        " condition " +
                                        pValTypeDispName +
                                        " requires that the high value " +
                                        "is higher than the low value."
                                    );
                                } else {
                                    return null;
                                }
                            });

                            data[lowValName]["newDate(QDate)"].connect(
                                setButtons
                            );
                            data[highValName]["newDate(QDate)"].connect(
                                setButtons
                            );
                        }
                    } catch (e) {
                        throw new MuseUtils.ApiException(
                            "musesuperchar",
                            "We caused errors while trying to set up a conditional validation test widget pair.",
                            "MuseSuperChar.CreateCondValRule.getValidatorValuesStructure",
                            { params: funcParams, thrownError: e },
                            MuseUtils.LOG_WARNING
                        );
                    }
                    break;
                default:
                    throw new MuseUtils.OutOfBoundsException(
                        "musesuperchar",
                        "We failed to understand the kind of validator being requested.",
                        "MuseSuperChar.CreateCondValRule.getValidatorValuesStructure",
                        { params: funcParams },
                        MuseUtils.LOG_WARNING
                    );
            }

            MuseSuperChar.Data.Entities[normPrefix + "_condvalrule"] = {
                scgrps: group,
                scdefs: data
            };
        };

        var addValidatorWidget = function(
            pPrefix,
            pValTypeComboBox,
            pTargLayout,
            pSuperChar
        ) {
            var widgetName = MuseUtils.getNormalizedString(
                pPrefix + "_validator_widget"
            );
            var removeWidget = mywindow.findChild(widgetName);

            if (MuseUtils.realNull(removeWidget) !== null) {
                pTargLayout.removeWidget(removeWidget);
                removeWidget.deleteLater();
            }

            if (!MuseUtils.isValidId(pValTypeComboBox.id())) {
                // If there's not a valid select, we want to clear things out,
                // but can't build anything else so we exit.
                return;
            }

            var fieldsWidget;

            if (["flagistrue", "flagisfalse"].includes(pValTypeComboBox.code)) {
                fieldsWidget = new QWidget();
                fieldsWidget.setObjectName(widgetName);
            } else {
                var widgetData = getValidatorValuesStructure(
                    pPrefix,
                    pValTypeComboBox.code,
                    pValTypeComboBox.text,
                    pSuperChar
                );
                var tmpEntityName =
                    MuseUtils.getNormalizedString(pPrefix) + "_condvalrule";
                fieldsWidget = MuseSuperChar.Widget.generateLegacyWidget(
                    MuseSuperChar.Data.Entities[tmpEntityName].scgrps,
                    MuseSuperChar.Data.Entities[tmpEntityName].scdefs
                );
            }

            pTargLayout.insertWidget(1, fieldsWidget);
        };

        var populateThenSuperCharComboBox = function(pSubSuperCharId) {
            if (MuseUtils.isValidId(pSubSuperCharId)) {
                thenSuperCharComboBox.populate(
                    MuseSuperChar.SuperChar.getSuperCharList(pSubSuperCharId)
                );
                thenSuperCharComboBox.setId(pSubSuperCharId);
                thenSuperCharComboBox.enabled = false;
            } else {
                thenSuperCharComboBox.populate(
                    MuseSuperChar.SuperChar.getSuperCharList()
                );
                thenSuperCharComboBox.enabled = true;
            }
        };

        var populateIfSuperCharComboBox = function(pObjSuperCharId) {
            if (MuseUtils.isValidId(pObjSuperCharId)) {
                ifSuperCharComboBox.populate(
                    MuseSuperChar.SuperChar.getSuperCharList(pObjSuperCharId)
                );
                ifSuperCharComboBox.setId(pObjSuperCharId);
                ifSuperCharComboBox.enabled = false;
            } else {
                ifSuperCharComboBox.populate(
                    MuseSuperChar.SuperChar.getSuperCharList()
                );
                ifSuperCharComboBox.enabled = true;
            }
        };

        var populateThenScDependents = function() {
            if (MuseUtils.isValidId(thenSuperCharComboBox.id())) {
                // Populate subSc with superchar
                subSc = MuseSuperChar.SuperChar.getSuperCharById(
                    thenSuperCharComboBox.id()
                );

                thenDataTypeValueXLabel.text =
                    subSc.scdef_datatype_display_name;
                try {
                    thenValidatorTypeComboBox.populate(
                        MuseSuperChar.SuperChar.getValidatorTypesForSuperChar(
                            subSc.scdef_id
                        )
                    );
                    thenValidatorTypeComboBox.setId(
                        currCondValRule.condvalrule_then_valtype_id
                    );
                    populateThenValTestFields();
                } catch (e) {
                    throw new MuseUtils.ApiException(
                        "musesuperchar",
                        "We failed to populate the 'Then' Super Characteristic data boxes.",
                        "MuseSuperChar.CreateCondValRule.populateThenScDependents",
                        { thrownError: e },
                        MuseUtils.LOG_WARNING
                    );
                }
            } else {
                thenValidatorTypeComboBox.clear();
                populateThenValTestFields();
                thenDataTypeValueXLabel.text = "<Not Yet Selected>";
            }
        };

        var populateIfScDependents = function() {
            if (MuseUtils.isValidId(ifSuperCharComboBox.id())) {
                // Populate subSc with superchar
                objSc = MuseSuperChar.SuperChar.getSuperCharById(
                    ifSuperCharComboBox.id()
                );

                ifDataTypeValueXLabel.text = objSc.scdef_datatype_display_name;
                try {
                    ifValidatorTypeComboBox.populate(
                        MuseSuperChar.SuperChar.getValidatorTypesForSuperChar(
                            objSc.scdef_id
                        )
                    );
                    ifValidatorTypeComboBox.setId(
                        currCondValRule.condvalrule_if_valtype_id
                    );
                    populateIfValTestFields();
                } catch (e) {
                    throw new MuseUtils.ApiException(
                        "musesuperchar",
                        "We failed to populate the 'If' Super Characteristic data boxes.",
                        "MuseSuperChar.CreateCondValRule.populateIfScDependents",
                        { thrownError: e },
                        MuseUtils.LOG_WARNING
                    );
                }
            } else {
                ifValidatorTypeComboBox.clear();
                populateIfValTestFields();
                ifDataTypeValueXLabel.text = "<Not Yet Selected>";
            }
        };

        var populateThenValTestFields = function() {
            addValidatorWidget(
                "Then",
                thenValidatorTypeComboBox,
                thenCondHBoxLayout,
                subSc
            );

            if (MuseUtils.isValidId(currCondValRule.condvalrule_id)) {
                var thenTestVal =
                    MuseSuperChar.Data.Entities.then_condvalrule.scdefs
                        .then_test_val;
                var thenLowVal =
                    MuseSuperChar.Data.Entities.then_condvalrule.scdefs
                        .then_low_val;
                var thenHighVal =
                    MuseSuperChar.Data.Entities.then_condvalrule.scdefs
                        .then_high_val;

                switch (currCondValRule.condvalrule_then_valtype_internal_name) {
                    case "regexp":
                        thenTestVal.text =
                            currCondValRule.condvalrule_thenval_regexp;
                        break;
                    case "numericequal":
                        thenTestVal.setFormattedText(
                            currCondValRule.condvalrule_thenval_numeric
                        );
                        break;
                    case "numericlessthan":
                    case "numericlessthanorequalto":
                        thenTestVal.setFormattedText(
                            currCondValRule.condvalrule_thenval_numeric_upper
                        );
                        break;
                    case "numericgreaterthan":
                    case "numericgreaterthanorequalto":
                        thenTestVal.setFormattedText(
                            currCondValRule.condvalrule_thenval_numeric_lower
                        );
                        break;
                    case "dateequal":
                        thenTestVal.date =
                            currCondValRule.condvalrule_thenval_date;
                        break;
                    case "datelessthan":
                    case "datelessthanorequalto":
                        thenTestVal.date =
                            currCondValRule.condvalrule_thenval_date_upper;
                        break;
                    case "dategreaterthan":
                    case "dategreaterthanorequalto":
                        thenTestVal.date =
                            currCondValRule.condvalrule_thenval_date_lower;
                        break;
                    case "numericbetweeninclusive":
                        thenLowVal.setFormattedText(
                            currCondValRule.condvalrule_thenval_numeric_lower
                        );
                        thenHighVal.setFormattedText(
                            currCondValRule.condvalrule_thenval_numeric_upper
                        );
                        break;
                    case "datebetweeninclusive":
                        thenLowVal.date =
                            currCondValRule.condvalrule_thenval_date_lower;
                        thenHighVal.date =
                            currCondValRule.condvalrule_thenval_date_upper;
                        break;
                }
            }
        };

        var populateIfValTestFields = function() {
            addValidatorWidget(
                "If",
                ifValidatorTypeComboBox,
                ifCondHBoxLayout,
                objSc
            );

            if (MuseUtils.isValidId(currCondValRule.condvalrule_id)) {
                var ifTestVal =
                    MuseSuperChar.Data.Entities.if_condvalrule.scdefs
                        .if_test_val;
                var ifLowVal =
                    MuseSuperChar.Data.Entities.if_condvalrule.scdefs
                        .if_low_val;
                var ifHighVal =
                    MuseSuperChar.Data.Entities.if_condvalrule.scdefs
                        .if_high_val;

                switch (currCondValRule.condvalrule_if_valtype_internal_name) {
                    case "regexp":
                        ifTestVal.text =
                            currCondValRule.condvalrule_ifval_regexp;
                        break;
                    case "numericequal":
                        ifTestVal.setFormattedText(
                            currCondValRule.condvalrule_ifval_numeric
                        );
                        break;
                    case "numericlessthan":
                    case "numericlessthanorequalto":
                        ifTestVal.setFormattedText(
                            currCondValRule.condvalrule_ifval_numeric_upper
                        );
                        break;
                    case "numericgreaterthan":
                    case "numericgreaterthanorequalto":
                        ifTestVal.setFormattedText(
                            currCondValRule.condvalrule_ifval_numeric_lower
                        );
                        break;
                    case "dateequal":
                        ifTestVal.date = currCondValRule.condvalrule_ifval_date;
                        break;
                    case "datelessthan":
                    case "datelessthanorequalto":
                        ifTestVal.date =
                            currCondValRule.condvalrule_ifval_date_upper;
                        break;
                    case "dategreaterthan":
                    case "dategreaterthanorequalto":
                        ifTestVal.date =
                            currCondValRule.condvalrule_ifval_date_lower;
                        break;
                    case "numericbetweeninclusive":
                        ifLowVal.setFormattedText(
                            currCondValRule.condvalrule_ifval_numeric_lower
                        );
                        ifHighVal.setFormattedText(
                            currCondValRule.condvalrule_ifval_numeric_upper
                        );
                        break;
                    case "datebetweeninclusive":
                        ifLowVal.date =
                            currCondValRule.condvalrule_ifval_date_lower;
                        ifHighVal.date =
                            currCondValRule.condvalrule_ifval_date_upper;
                        break;
                }
            }
        };

        var populateValidationRule = function(pCondValRuleId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pCondValRuleId: pCondValRuleId
            };

            try {
                currCondValRule = MuseSuperChar.CondValRule.getValidatorById(
                    pCondValRuleId
                );
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to load the requested Conditional Validation Rule.",
                    "MuseSuperChar.CreateCondValRule.populateValidationRule",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }

            populateIfSuperCharComboBox(
                currCondValRule.condvalrule_object_scdef_id
            );
            populateThenSuperCharComboBox(
                currCondValRule.condvalrule_subject_scdef_id
            );

            populateIfScDependents();
            populateThenScDependents();
            ifValidatorTypeComboBox.setId(
                currCondValRule.condvalrule_if_valtype_id
            );
            ifValidatorTypeComboBox.enabled = false;
            thenValidatorTypeComboBox.setId(
                currCondValRule.condvalrule_then_valtype_id
            );
            thenValidatorTypeComboBox.enabled = false;

            populateIfValTestFields();
            populateThenValTestFields();

            failXLineEdit.text = currCondValRule.condvalrule_fails_message_text;
        };

        var save = function() {
            var validatorData = {
                condvalrule_subject_scdef_id: thenSuperCharComboBox.id(),
                condvalrule_object_scdef_id: ifSuperCharComboBox.id(),
                condvalrule_if_valtype_id: ifValidatorTypeComboBox.id(),
                condvalrule_then_valtype_id: thenValidatorTypeComboBox.id(),
                condvalrule_fails_message_text: failXLineEdit.text
            };

            if (
                currCondValRule.hasOwnProperty("condvalrule_id") &&
                MuseUtils.isValidId(currCondValRule.condvalrule_id)
            ) {
                validatorData.condvalrule_id = currCondValRule.condvalrule_id;
            }

            try {
                switch (ifValidatorTypeComboBox.code) {
                    case "regexp":
                        validatorData.condvalrule_ifval_regexp =
                            MuseSuperChar.Data.Entities.if_condvalrule.scdefs.if_test_val.text;
                        break;
                    case "numericequal":
                        validatorData.condvalrule_ifval_numeric = MuseSuperChar.Data.Entities.if_condvalrule.scdefs.if_test_val.getNumericValue();
                        break;
                    case "numericlessthan":
                    case "numericlessthanorequalto":
                        validatorData.condvalrule_ifval_numeric_upper = MuseSuperChar.Data.Entities.if_condvalrule.scdefs.if_test_val.getNumericValue();
                        break;
                    case "numericgreaterthan":
                    case "numericgreaterthanorequalto":
                        validatorData.condvalrule_ifval_numeric_lower = MuseSuperChar.Data.Entities.if_condvalrule.scdefs.if_test_val.getNumericValue();
                        break;
                    case "dateequal":
                        validatorData.condvalrule_ifval_date =
                            MuseSuperChar.Data.Entities.if_condvalrule.scdefs.if_test_val.date;
                        break;
                    case "datelessthan":
                    case "datelessthanorequalto":
                        validatorData.condvalrule_ifval_date_upper =
                            MuseSuperChar.Data.Entities.if_condvalrule.scdefs.if_test_val.date;
                        break;
                    case "dategreaterthan":
                    case "dategreaterthanorequalto":
                        validatorData.condvalrule_ifval_date_lower =
                            MuseSuperChar.Data.Entities.if_condvalrule.scdefs.if_test_val.date;
                        break;
                    case "numericbetweeninclusive":
                        validatorData.condvalrule_ifval_numeric_lower = MuseSuperChar.Data.Entities.if_condvalrule.scdefs.if_low_val.getNumericValue();
                        validatorData.condvalrule_ifval_numeric_upper = MuseSuperChar.Data.Entities.if_condvalrule.scdefs.if_high_val.getNumericValue();
                        break;
                    case "datebetweeninclusive":
                        validatorData.condvalrule_ifval_date_lower =
                            MuseSuperChar.Data.Entities.if_condvalrule.scdefs.if_low_val.date;
                        validatorData.condvalrule_ifval_date_upper =
                            MuseSuperChar.Data.Entities.if_condvalrule.scdefs.if_high_val.date;
                        break;
                    default:
                }

                switch (thenValidatorTypeComboBox.code) {
                    case "regexp":
                        validatorData.condvalrule_thenval_regexp =
                            MuseSuperChar.Data.Entities.then_condvalrule.scdefs.then_test_val.text;
                        break;
                    case "numericequal":
                        validatorData.condvalrule_thenval_numeric = MuseSuperChar.Data.Entities.then_condvalrule.scdefs.then_test_val.getNumericValue();
                        break;
                    case "numericlessthan":
                    case "numericlessthanorequalto":
                        validatorData.condvalrule_thenval_numeric_upper = MuseSuperChar.Data.Entities.then_condvalrule.scdefs.then_test_val.getNumericValue();
                        break;
                    case "numericgreaterthan":
                    case "numericgreaterthanorequalto":
                        validatorData.condvalrule_thenval_numeric_lower = MuseSuperChar.Data.Entities.then_condvalrule.scdefs.then_test_val.getNumericValue();
                        break;
                    case "dateequal":
                        validatorData.condvalrule_thenval_date =
                            MuseSuperChar.Data.Entities.then_condvalrule.scdefs.then_test_val.date;
                        break;
                    case "datelessthan":
                    case "datelessthanorequalto":
                        validatorData.condvalrule_thenval_date_upper =
                            MuseSuperChar.Data.Entities.then_condvalrule.scdefs.then_test_val.date;
                        break;
                    case "dategreaterthan":
                    case "dategreaterthanorequalto":
                        validatorData.condvalrule_thenval_date_lower =
                            MuseSuperChar.Data.Entities.then_condvalrule.scdefs.then_test_val.date;
                        break;
                    case "numericbetweeninclusive":
                        validatorData.condvalrule_thenval_numeric_lower = MuseSuperChar.Data.Entities.then_condvalrule.scdefs.then_low_val.getNumericValue();
                        validatorData.condvalrule_thenval_numeric_upper = MuseSuperChar.Data.Entities.then_condvalrule.scdefs.then_high_val.getNumericValue();
                        break;
                    case "datebetweeninclusive":
                        validatorData.condvalrule_thenval_date_lower =
                            MuseSuperChar.Data.Entities.then_condvalrule.scdefs.then_low_val.date;
                        validatorData.condvalrule_thenval_date_upper =
                            MuseSuperChar.Data.Entities.then_condvalrule.scdefs.then_high_val.date;
                        break;
                    default:
                }

                if (mode == "new") {
                    MuseSuperChar.CondValRule.createValidator(validatorData);
                } else {
                    MuseSuperChar.CondValRule.updateValidator(validatorData);
                }

                mydialog.accept();
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found an error condition while trying to save a Conditional Validation Rule.",
                    "MuseSuperChar.CreateCondValRule.save",
                    { thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var setNewMode = function(pParams) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pParams: pParams
            };

            mode = "new";

            populateIfSuperCharComboBox();
            populateThenSuperCharComboBox(pParams.subject_scdef_id || -1);
            populateIfScDependents();
            populateThenScDependents();
        };

        var setEditMode = function(pParams) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pParams: pParams
            };

            mode = "edit";

            populateValidationRule(pParams.condvalrule_id);
        };

        var setViewMode = function(pParams) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pParams: pParams
            };

            mode = "view";
        };
        //--------------------------------------------------------------------
        //  Public Interface -- Slots
        //--------------------------------------------------------------------
        pPublicApi.sCancel = function() {
            try {
                mydialog.reject();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a cancellation request.",
                    "MuseSuperChar.CreateCondValRule.pPublicApi.sCancel",
                    { thrownError: e },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };

        pPublicApi.sThenValidatorSelected = function(pId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pId: pId
            };

            try {
                populateThenValTestFields();
                setButtons();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a 'then' validator being selected.",
                    "MuseSuperChar.CreateCondValRule.pPublicApi.sThenValidatorSelected",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };

        pPublicApi.sIfValidatorSelected = function(pId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pId: pId
            };

            try {
                populateIfValTestFields();
                setButtons();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to an 'if' validator being selected.",
                    "MuseSuperChar.CreateCondValRule.pPublicApi.sIfValidatorSelected",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };

        pPublicApi.sThenSuperCharSelected = function(pId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pId: pId
            };

            try {
                populateThenScDependents();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a 'then' Super Characteristic being selected.",
                    "MuseSuperChar.CreateCondValRule.pPublicApi.sThenSuperCharSelected",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };

        pPublicApi.sIfSuperCharSelected = function(pId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pId: pId
            };

            try {
                populateIfScDependents();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to an 'if' Super Characteristic being selected.",
                    "MuseSuperChar.CreateCondValRule.pPublicApi.sIfSuperCharSelected",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };

        pPublicApi.sFailureMsgUpdated = function() {
            try {
                setButtons();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to an updated failure message.",
                    "MuseSuperChar.CreateCondValRule.pPublicApi.sFailureMsgUpdated",
                    { thrownError: e },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };

        pPublicApi.sSave = function() {
            try {
                save();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a request to save the conditional validation rule.",
                    "MuseSuperChar.CreateCondValRule.pPublicApi.sSave",
                    { thrownError: e },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };
        //--------------------------------------------------------------------
        //  Public Interface -- Functions
        //--------------------------------------------------------------------

        pPublicApi.set = function(pParams) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pParams: pParams
            };

            setButtons();

            if (parsedParams.mode == "new") {
                setNewMode(parsedParams);
            } else if (parsedParams.mode == "edit") {
                if (!MuseUtils.isValidId(parsedParams.condvalrule_id)) {
                    throw new MuseUtils.ParameterException(
                        "musesuperchar",
                        "We need a valid Conditional Validation Rule ID in order to launch the form in edit mode.",
                        "MuseSuperChar.CreateCondValRule.pPublicApi.set",
                        { params: funcParams },
                        MuseUtils.LOG_WARNING
                    );
                }
                setEditMode(parsedParams);
            } else if (parsedParams.mode == "view") {
                setViewMode(parsedParams);
            } else {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We did not understand which mode we were to open the form in.",
                    "MuseSuperChar.CreateCondValRule.pPublicApi.set",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }
            //----------------------------------------------------------------
            //  Set Timed Connects/Disconnects
            //----------------------------------------------------------------
            ifSuperCharComboBox["newID(int)"].connect(
                pPublicApi.sIfSuperCharSelected
            );
            ifValidatorTypeComboBox["newID(int)"].connect(
                pPublicApi.sIfValidatorSelected
            );

            thenSuperCharComboBox["newID(int)"].connect(
                pPublicApi.sThenSuperCharSelected
            );
            thenValidatorTypeComboBox["newID(int)"].connect(
                pPublicApi.sThenValidatorSelected
            );

            failXLineEdit["editingFinished()"].connect(
                pPublicApi.sFailureMsgUpdated
            );

            cancelPushButton.clicked.connect(pPublicApi.sCancel);
            savePushButton.clicked.connect(pPublicApi.sSave);
        };

        //--------------------------------------------------------------------
        //  Definition Timed Connects/Disconnects
        //--------------------------------------------------------------------

        //--------------------------------------------------------------------
        //  Foreign Script "Set" Handling
        //--------------------------------------------------------------------

        // "Set" handling base on suggestion of Gil Moskowitz/xTuple.
        var foreignSetFunc;

        // Lower graded scripts should be loaded prior to our call and as such we
        // should be able to intercept their set functions.
        if (typeof pGlobal.set === "function") {
            foreignSetFunc = pGlobal.set;
        } else {
            foreignSetFunc = function() {};
        }

        pGlobal.set = function(pParams) {
            var funcParams = { pParams: pParams };

            var myParams = MuseUtils.parseParams(pParams || {});

            try {
                foreignSetFunc(myParams);
                pPublicApi.set(myParams);
            } catch (e) {
                var error = new MuseUtils.ModuleException(
                    "musesuperchar",
                    "We enountered an error while initializing the form.",
                    "global.set",
                    {
                        params: funcParams,
                        thrownError: e,
                        context: {
                            parsedParams: myParams
                        }
                    },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mywindow.close();
            }
        };
    } catch (e) {
        var error = new MuseUtils.ModuleException(
            "musesuperchar",
            "We enountered a MuseSuperChar.CreateCondValRule module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.CreateCondValRule",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.CreateCondValRule, this);
