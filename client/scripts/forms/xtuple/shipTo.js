/*************************************************************************
 *************************************************************************
 **
 ** File:        shipTo.js
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
this.MuseSuperChar.ShipTo = this.MuseSuperChar.ShipTo || {};

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
    var PARENT_TABWIDGET = "_commentsTab";
    var XTP_CHAR_TAB = "_documentsTab";
    var ENTITY_DATA_TABLE = "public_shiptoinfo";

    // Mutable state
    var entityDataTable;
    var preSaveShipToId = -1;
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
    try {
        scWidget = MuseSuperChar.Loader.getSuperCharWidget(ENTITY_DATA_TABLE);

        if (scWidget !== null) {
            formTab.insertTab(
                formTab.indexOf(xtpCharTab),
                scWidget,
                MuseUtils.getTextMetric("musesuperchar", "superCharTabName")
            );
        }
    } catch (e) {
        MuseUtils.displayError(e, mywindow);
    }

    //--------------------------------------------------------------------
    //  "Private" Functional Logic
    //--------------------------------------------------------------------

    var myPreSave = function() {
        preSaveShipToId = mywindow.id();
    };

    var myPostSave = function() {
        try {
            if (
                !MuseUtils.isValidId(preSaveShipToId) ||
                MuseUtils.realNull(scWidget) === null
            ) {
                return;
            }

            scWidget.save(preSaveShipToId);
            preSaveShipToId = -1;
        } catch (e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    var initSuperChar = function(pMode, pParentId) {
        scWidget.initWidget(pMode, pParentId);
    };

    //----------------------------------------------------------------
    //  Connects/Disconnects
    //----------------------------------------------------------------
    MuseUtils.ShipTo.addPreSaveHookFunc(myPreSave);
    MuseUtils.ShipTo.addPostSaveHookFunc(myPostSave);

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

            if (["new", "edit", "view"].includes(myMode) && scWidget !== null) {
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
})(this.MuseSuperChar.ShipTo, this);
