// File:        purchaseOrderItem.js
// Location:    /home/scb/source/products/xtuple/musesuperchar/client/scripts/forms/xtuple
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

    if (typeof MuseSuperChar.PurchaseOrderItem === "undefined") {
        MuseSuperChar.PurchaseOrderItem = {};
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
            "We encountered a script level issue while processing MuseSuperChar.PurchaseOrderItem.",
            "MuseSuperChar.PurchaseOrderItem",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.PurchaseOrderItem Script Error",
            "We encountered a script level issue while processing MuseSuperChar.PurchaseOrderItem."
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
        var PARENT_TABWIDGET = "_tab";
        var XTP_CHAR_TAB = "itemchar";
        var ENTITY_DATA_TABLE = "public_poitem";

        // Mutable state
        var preSavePoItemId = -1;
        var currentMode = null;
        var scWidget = null;

        //--------------------------------------------------------------------
        //  Get Object References From Screen Definitions
        //--------------------------------------------------------------------
        var formTab = mywindow.findChild(PARENT_TABWIDGET);
        var xtpCharTab = mywindow.findChild(XTP_CHAR_TAB);

        //--------------------------------------------------------------------
        //  Custom Screen Objects and Starting GUI Manipulation
        //--------------------------------------------------------------------

        //--------------------------------------------------------------------
        //  Private Functional Logic
        //--------------------------------------------------------------------
        var myPreSave = function() {
            preSavePoItemId = mywindow.id();
        };

        var myPostSave = function() {
            try {
                if (
                    !MuseUtils.isValidId(preSavePoItemId) ||
                    MuseUtils.realNull(scWidget) === null
                ) {
                    return;
                }

                scWidget.save(preSavePoItemId);
                preSavePoItemId = -1;
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while trying to save Super Characteristic data.",
                    "MuseSuperChar.PurchaseOrderItem.myPostSave",
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

        pPublicApi.set = function(pParams) {
            var myMode = pParams.mode.toString();

            if (["new", "edit", "view"].includes(myMode)) {
                if (
                    MuseUtils.getFlagMetric(
                        "musesuperchar",
                        "isXtupleCharacteristicsTabHidden"
                    )
                ) {
                    formTab.removeTab(xtpCharTab);
                }

                // We need to be sure that the set function is re-entrant since
                // the native form calls set for each next/prev button press.
                // Hopefully, we release the memory when we kill the reference
                // here, but I expect we don't until we close the form.
                if (scWidget === null) {
                    scWidget = MuseSuperChar.Loader.getSuperCharWidget(
                        ENTITY_DATA_TABLE
                    );
                }

                if (scWidget !== null && formTab.indexOf(scWidget) == -1) {
                    formTab.insertTab(
                        formTab.indexOf(xtpCharTab),
                        scWidget,
                        MuseUtils.getTextMetric(
                            "musesuperchar",
                            "superCharTabName"
                        )
                    );
                }

                currentMode = myMode;
                initSuperChar(myMode, mywindow.id());
            } else {
                return;
            }
        };
        //--------------------------------------------------------------------
        //  Definition Timed Connects/Disconnects
        //--------------------------------------------------------------------
        MuseUtils.PurchaseOrderItem.addPreSaveHookFunc(myPreSave);
        MuseUtils.PurchaseOrderItem.addPostSaveHookFunc(myPostSave);

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
            "We enountered a MuseSuperChar.PurchaseOrderItem module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.PurchaseOrderItem",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.PurchaseOrderItem, this);
