// File:        accountNumber.js
// Location:    musesuperchar/client/scripts/forms/xtuple
// Project:     Muse Systems Super Characteristics for xTuple ERP
//
// Licensed to Lima Buttgereit Holdings LLC (d/b/a Muse Systems) under one or
// more agreements.  Muse Systems licenses this file to you under the Apache
// License, Version 2.0.
//
// See the LICENSE file in the project root for license terms and conditions.
// See the NOTICE file in the project root for copyright ownership information.
//
// muse.information@musesystems.com  :: https://muse.systems

try {
    //////////////////////////////////////////////////////////////////////////
    //  Namespace Definition
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseSuperChar === "undefined") {
        MuseSuperChar = {};
    }

    if (typeof MuseSuperChar.LedgerAccountNumber === "undefined") {
        MuseSuperChar.LedgerAccountNumber = {};
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
            "We encountered a script level issue while processing MuseSuperChar.LedgerAccountNumber.",
            "MuseSuperChar.LedgerAccountNumber",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.LedgerAccountNumber Script Error",
            "We encountered a script level issue while processing MuseSuperChar.LedgerAccountNumber."
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
        var ENTITY_DATA_TABLE = "public_accnt";

        // Mutable state
        var preSaveAccntId = -1;
        var scWidget = null;

        //--------------------------------------------------------------------
        //  Get Object References From Screen Definitions
        //--------------------------------------------------------------------

        //--------------------------------------------------------------------
        //  Custom Screen Objects and Starting GUI Manipulation
        //--------------------------------------------------------------------

        //--------------------------------------------------------------------
        //  Private Functional Logic
        //--------------------------------------------------------------------
        var myPreSave = function() {
            // preSaveAccntId = mywindow.id();
        };

        var myPostSave = function() {
            QMessageBox.critical(
                mainwindow,
                "",
                "in myPostSave"
            );

            try {
                if (
                    !MuseUtils.isValidId(preSaveAccntId) ||
                    MuseUtils.realNull(scWidget) === null
                ) {
                    return;
                }

                scWidget.save(preSaveAccntId);
                preSaveAccntId = -1;
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while trying to save Super Characteristic data.",
                    "MuseSuperChar.LedgerAccountNumber.myPostSave",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        var mySave = function(pRecId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pRecId: pRecId
            };

            if (scWidget == null) {
                // Nothing to do here.
                return;
            }

            try {
                scWidget.save(pRecId);
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while trying to save Super Characteristic data.",
                    "MuseSuperChar.LedgerAccountNumber.mySave",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        var initSuperChar = function(pMode, pParentId) {
/*
            scWidget.initWidget(pMode, pParentId);

            //----------------------------------------------------------------
            //  Connects/Disconnects
            //----------------------------------------------------------------
            mywindow["saved(int)"].connect(mySave);
*/

            if (MuseUtils.realNull(scWidget) === null) {
                return;
            }
            scWidget.initWidget(pMode, pParentId);

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

        /**
         * Form startup initialization.  Standard part of the xTuple ERP
         * startup process.
         * @param {Object} pParams An associative array of values passed from
         *                         the xTuple C++ forms which contain context
         *                         setting information.
         */
        pPublicApi.set = function(pParams) {
            var myMode = pParams.mode.toString();
            preSaveAccntId = (pParams.accnt_id || -1);

            if (["new", "edit", "view"].includes(myMode)) {
                if (scWidget === null) {
                    scWidget = MuseSuperChar.Loader.getSuperCharWidget(
                        ENTITY_DATA_TABLE
                    );
                }

/*
        QMessageBox.critical(
            mainwindow,
            "scWidget",
            "" + scWidget
        );
*/

                if (scWidget !== null) {
                    mywindow.layout().addWidget(scWidget, 10, 0, 1, 5);
                } else {
                    return;
                }

                initSuperChar(myMode, preSaveAccntId);
            } else {
                return;
            }
        };

        //--------------------------------------------------------------------
        //  Definition Timed Connects/Disconnects
        //--------------------------------------------------------------------
        MuseUtils.LedgerAccountNumber.addPreSaveHookFunc(myPreSave);
        MuseUtils.LedgerAccountNumber.addPostSaveHookFunc(myPostSave);

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
            "We enountered a MuseSuperChar.LedgerAccountNumber module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.LedgerAccountNumber",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.LedgerAccountNumber, this);
