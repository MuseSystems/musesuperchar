/*************************************************************************
 *************************************************************************
 **
 ** File:        museRequestForQuote.js
 ** Project:     Muse Systems Super Characteristics for xTuple ERP
 ** Author:      Steven C. Buttgereit
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

// If the muserfq package is installed, this script will add superchar
// capabilities to it.

try {
    //////////////////////////////////////////////////////////////////////////
    //  Namespace Definition
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseSuperChar === "undefined") {
        MuseSuperChar = {};
    }

    if (typeof MuseSuperChar.RfqHead === "undefined") {
        MuseSuperChar.RfqHead = {};
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
        MuseUtils.MOD_CONFIG
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
            "We encountered a script level issue while processing MuseSuperChar.RfqHead.",
            "MuseSuperChar.RfqHead",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.RfqHead Script Error",
            "We encountered a script level issue while processing MuseSuperChar.RfqHead."
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
        // Constants
        var PARENT_TABWIDGET = "tabsAreaTabWidget";
        var XTP_CHAR_TAB = "commentsTab";
        var ENTITY_DATA_TABLE = "muserfq_rfqhead";

        // Mutable state
        var scWidget = null;
        var myId = null;

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
                    "MuseSuperChar.RfqHead.mySave",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        var initSuperChar = function(pMode, pParentId) {
            scWidget.initWidget(pMode, pParentId);
        };

        var handleGlobalSignal = function(pSource, pMessage) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSource: pSource,
                pMessage: pMessage
            };

            // For us, pSource is the record info and pMessage is the action
            // info.  The parameters use the xTuple names.
            if (/^_@muserfq@@rfqhead@@/.test(pSource)) {
                if (!/^save/.test(pMessage)) {
                    return;
                }

                var targRfqHeadId = /^_@muserfq@@rfqhead@@([0-9]+)/.exec(
                    pSource
                )[1];

                if ((targRfqHeadId = myId)) {
                    mySave(targRfqHeadId);
                }
            }
        };

        //--------------------------------------------------------------------
        //  Public Interface -- Slots
        //--------------------------------------------------------------------
        pPublicApi.sSignalHandler = function(pSource, pMessage) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSource: pSource,
                pMessage: pMessage
            };

            try {
                handleGlobalSignal(pSource, pMessage);
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We failed to respond to a global signal event properly.",
                    "MuseSuperChar.RfqHead.pPublicApi.sSignalHandler",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };
        //--------------------------------------------------------------------
        //  Public Interface -- Functions
        //--------------------------------------------------------------------

        pPublicApi.getCurrentScWidget = function() {
            return scWidget;
        };

        /**
         * Form startup initialization.  Standard part of the xTuple ERP
         * startup process.
         * @param {Object} pParams An associative array of values passed from
         *                         the xTuple C++ forms which contain context
         *                         setting information.
         */
        pPublicApi.set = function(pParams) {
            var myMode = pParams.mode;

            if (["edit", "view"].includes(myMode) && scWidget !== null) {
                myId = MuseRfq.RfqHead.id();
                initSuperChar(myMode, myId);
            } else {
                return;
            }
        };

        //--------------------------------------------------------------------
        //  Definition Timed Connects/Disconnects
        //--------------------------------------------------------------------
        mainwindow["emitSignal(QString, QString)"].connect(
            pPublicApi.sSignalHandler
        );

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
            "We enountered a MuseSuperChar.RfqHead module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.RfqHead",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.RfqHead, this);
