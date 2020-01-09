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
        var preSaveAccntId = null;
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
        var getAccntIdIfNecessary = function() {
            var get_param = function(name, property) {
                return mywindow.findChild(name)[property || "currentText"];
            };

            if (!preSaveAccntId) {
                var params = {};
                params.number = get_param("_number", "text");
                params.profit = get_param("_profit");
                params.sub = get_param("_sub");
                params.company = get_param("_company");

                var query = MuseUtils.executeQuery(
                    "SELECT accnt_id " +
                        "FROM   accnt " +
                        "WHERE  accnt_number = <? value('number') ?> " +
                        "  AND  accnt_profit = <? value('profit') ?> " +
                        "  AND  accnt_sub = <? value('sub') ?> " +
                        "  AND  accnt_company = <? value('company') ?> ",
                    params
                );

                if (query.first()) {
                    preSaveAccntId = query.value("accnt_id");
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We encountered an error while loading the new account record.",
                        "MuseSuperChar.LedgerAccountNumber.getAccntIdIfNecessary",
                        {
                            params: params
                        },
                        MuseUtils.LOG_CRITICAL
                    );
                }
            }
        };

        var myPostSave = function() {
            getAccntIdIfNecessary();

            try {
                if (
                    !MuseUtils.isValidId(preSaveAccntId) ||
                    MuseUtils.realNull(scWidget) === null
                ) {
                    return;
                }

                scWidget.save(preSaveAccntId);
                preSaveAccntId = null;
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

        var initSuperChar = function(pMode, pParentId) {
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
            preSaveAccntId = pParams.accnt_id;

            if (["new", "edit", "view"].includes(myMode)) {
                if (scWidget === null) {
                    scWidget = MuseSuperChar.Loader.getSuperCharWidget(
                        ENTITY_DATA_TABLE
                    );
                }

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
        //        MuseUtils.LedgerAccountNumber.addPreSaveHookFunc(myPreSave);
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
