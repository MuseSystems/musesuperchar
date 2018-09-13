/*************************************************************************
 *************************************************************************
 **
 ** File:        customer.js
 ** Project:     Muse Systems Super Characteristics for xTuple ERP
 ** Author:      Steven C. Buttgereit
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

try {
    //////////////////////////////////////////////////////////////////////////
    //  Namespace Definition
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseSuperChar === "undefined") {
        MuseSuperChar = {};
    }

    if (typeof MuseSuperChar.Customer === "undefined") {
        MuseSuperChar.Customer = {};
    }

    //////////////////////////////////////////////////////////////////////////
    //  Imports
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseUtils === "undefined") {
        include("museUtils");
    }

    MuseUtils.loadMuseUtils([
        MuseUtils.MOD_EXCEPTION,
        MuseUtils.MOD_JSPOLYFILL,
        MuseUtils.MOD_JS,
        MuseUtils.MOD_CONFIG,
        MuseUtils.MOD_QT
    ]);

    if (typeof MuseSuperChar.Loader === "undefined") {
        include("museScLoader");
    }
} catch (e) {
    if (
        typeof MuseUtils !== "undefined" &&
        (MuseUtils.isMuseUtilsExceptionLoaded === true ? true : false)
    ) {
        var error = new MuseUtils.ScriptException(
            "musesuperchar",
            "We encountered a script level issue while processing MuseSuperChar.Customer.",
            "MuseSuperChar.Customer",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.Customer Script Error",
            "We encountered a script level issue while processing MuseSuperChar.Customer."
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
        var PARENT_TABWIDGET = "_tab";
        var XTP_CHAR_TAB = "_characteristicsTab";
        var ENTITY_DATA_TABLE = "public_custinfo";

        // Mutable state
        var scWidget = null;

        //--------------------------------------------------------------------
        //  Get Object References From Screen Definitions
        //--------------------------------------------------------------------
        var formTab = mywindow.findChild(PARENT_TABWIDGET);
        var xtpCharTab = mywindow.findChild(XTP_CHAR_TAB);

        //--------------------------------------------------------------------
        //  Custom Screen Objects and Starting GUI Manipulation
        //--------------------------------------------------------------------
        scWidget = MuseSuperChar.Loader.getSuperCharWidget(ENTITY_DATA_TABLE);

        if (scWidget !== null) {
            formTab.insertTab(
                formTab.indexOf(xtpCharTab),
                scWidget,
                MuseUtils.getTextMetric("musesuperchar", "superCharTabName")
            );
        }

        if (
            MuseUtils.getFlagMetric(
                "musesuperchar",
                "isXtupleCharacteristicsTabHidden"
            )
        ) {
            formTab.removeTab(xtpCharTab);
        }

        //--------------------------------------------------------------------
        //  Private Functional Logic
        //--------------------------------------------------------------------
        var mySave = function(pRecId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pRecId: pRecId
            };

            try {
                scWidget.save(pRecId);
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while trying to save Super Characteristic data.",
                    "MuseSuperChar.Customer.mySave",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        var formUpdated = function() {
            try {
                var myId = MuseUtils.isValidId(mywindow.id())
                    ? mywindow.id()
                    : null;
                var myMode = MuseUtils.getModeFromXtpEnumId(mywindow.mode());

                if (!["new", "edit", "view"].includes(myMode)) {
                    return;
                }

                initSuperChar(myMode, myId);
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to properly initialize the Super Characteristics in response to a customer change or mode change.",
                    "MuseSuperChar.Customer.formUpdated",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );

                MuseUtils.displayError(error, mywindow);
            }
        };

        var initSuperChar = function(pMode, pParentId) {
            if (scWidget == null) {
                return;
            }

            scWidget.initWidget(pMode, pParentId);

            //----------------------------------------------------------------
            //  Connects/Disconnects
            //----------------------------------------------------------------
        };

        //--------------------------------------------------------------------
        //  Public Interface -- Slots
        //--------------------------------------------------------------------

        //--------------------------------------------------------------------
        //  Public Interface -- Functions
        //--------------------------------------------------------------------

        pPublicApi.getCurrentScWidget = function() {
            return scWidget;
        };

        pPublicApi.set = function(pParams) {
            try {
                var myMode = pParams.mode.toString();

                formUpdated();

                mywindow["newId(int)"].connect(formUpdated);
                mywindow["newMode(int)"].connect(formUpdated);
                mywindow["saved(int)"].connect(mySave);
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We failed to initialize the SuperChars for the Customer Workbench.",
                    "MuseSuperChar.Customer.pPublicApi,set",
                    { params: { pParams: pParams }, thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(e, mywindow);
            }
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
            "We enountered a MuseSuperChar.Customer module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.Customer",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.Customer, this);
