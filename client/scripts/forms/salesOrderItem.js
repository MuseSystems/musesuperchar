/*************************************************************************
 *************************************************************************
 **
 ** File:        salesOrderItem.js
 ** Project:     Muse Systems Super Characteristics for xTuple ERP
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

//////////////////////////////////////////////////////////////////////////
//  Namespace Definition
//////////////////////////////////////////////////////////////////////////

this.MuseSuperChar = this.MuseSuperChar || {};
this.MuseSuperChar.SalesOrderItem = this.MuseSuperChar.SalesOrderItem || {};

//////////////////////////////////////////////////////////////////////////
//  Imports
//////////////////////////////////////////////////////////////////////////

if (!this.MuseUtils) {
    include("museUtils");
}

if (!this.MuseSuperChar.Loader) {
    include("museScLoader");
}

//////////////////////////////////////////////////////////////////////////
//  Module Defintion
//////////////////////////////////////////////////////////////////////////

(function(pPublicApi, pGlobal) {
    // Constants
    var PARENT_TABWIDGET = "_tabs";
    var XTP_CHAR_TAB = "_itemCharacteristicsTab";

    // Mutable state
    var entityDataTable;
    var preSaveCoItemId = -1;
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
    //  "Private" Functional Logic
    //--------------------------------------------------------------------

    var myPreSave = function() {
        preSaveCoItemId = mywindow.id();
    };
    var myPostSave = function() {
        try {
            if (
                !MuseUtils.isValidId(preSaveCoItemId) ||
                MuseUtils.realNull(scWidget) === null
            ) {
                return;
            }

            scWidget.save(preSaveCoItemId);
            preSaveCoItemId = -1;
        } catch (e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    var initSuperChar = function(pMode, pParentId) {
        if (MuseUtils.realNull(scWidget) === null) {
            return;
        }
        scWidget.initWidget(pMode, pParentId);
    };

    //----------------------------------------------------------------
    //  Connects/Disconnects
    //----------------------------------------------------------------
    MuseUtils.SalesOrderItem.addPreSaveHookFunc(myPreSave);
    MuseUtils.SalesOrderItem.addPostSaveHookFunc(myPostSave);

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
        try {
            var myMode = pParams.mode.toString();

            if (mywindow.modeType() == 2) {
                // Sales Order
                entityDataTable = "public_coitem";
            } else {
                // Quote
                entityDataTable = "public_quitem";
            }

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
                        entityDataTable
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
        } catch (e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    //--------------------------------------------------------------------
    //  Public Interface -- Slots
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
        try {
            foreignSetFunc(pParams);
            pPublicApi.set(pParams);
        } catch (e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };
})(this.MuseSuperChar.SalesOrderItem, this);
