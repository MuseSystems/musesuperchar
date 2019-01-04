// File:        item.js
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

    if (typeof MuseSuperChar.Item === "undefined") {
        MuseSuperChar.Item = {};
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
            "We encountered a script level issue while processing MuseSuperChar.Item.",
            "MuseSuperChar.Item",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.Item Script Error",
            "We encountered a script level issue while processing MuseSuperChar.Item."
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
        var ENTITY_DATA_TABLE = "public_item";

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
                    "MuseSuperChar.Item.mySave",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        var initSuperChar = function(pMode, pParentId) {
            scWidget.initWidget(pMode, pParentId);

            //----------------------------------------------------------------
            //  Connects/Disconnects
            //----------------------------------------------------------------
        };

        //--------------------------------------------------------------------
        //  Public Interface -- Slots
        //--------------------------------------------------------------------
        pPublicApi.sItemWindowUpdate = function() {
            try {
                pPublicApi.set({
                    mode: MuseUtils.getModeFromXtpEnumId(mywindow.mode()),
                    item_id: mywindow.id()
                });
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We failed to respond correctly to an update in the Item form information.",
                    "MuseSuperChar.Item.pPublicApi.sItemWindowUpdate",
                    { thrownError: e },
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

        pPublicApi.set = function(pParams) {
            var myMode = pParams.mode;

            if (["new", "edit", "view"].includes(myMode) && scWidget !== null) {
                initSuperChar(myMode, mywindow.id());
            } else {
                return;
            }
        };

        //--------------------------------------------------------------------
        //  Definition Timed Connects/Disconnects
        //--------------------------------------------------------------------
        mywindow["saved(int)"].connect(mySave);
        mywindow["populated()"].connect(pPublicApi.sItemWindowUpdate);

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
            "We enountered a MuseSuperChar.Item module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.Item",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.Item, this);
