/*************************************************************************
 *************************************************************************
 **
 ** File:        crmaccount.js
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
this.MuseSuperChar.CrmAccount = this.MuseSuperChar.CrmAccount || {};

//////////////////////////////////////////////////////////////////////////
//  Imports
//////////////////////////////////////////////////////////////////////////

if(!this.MuseUtils) {
    include("museUtils");
}

if(!this.MuseSuperChar.Loader) {
    include("museScLoader");
}

//////////////////////////////////////////////////////////////////////////
//  Module Defintion
//////////////////////////////////////////////////////////////////////////

(function(pPublicApi, pGlobal) {
    // Constants
    var PARENT_TABWIDGET = "_tab";
    var XTP_CHAR_TAB = "_characteristicsTab";
    var ENTITY_DATA_TABLE = "public_crmacct";
    //--------------------------------------------------------------------
    //  Get Object References From Screen Definitions
    //--------------------------------------------------------------------
    var formTab = mywindow.findChild(PARENT_TABWIDGET);
    var xtpCharTab = mywindow.findChild(XTP_CHAR_TAB);
    
    //--------------------------------------------------------------------
    //  Custom Screen Objects and Starting GUI Manipulation
    //--------------------------------------------------------------------
    var scWidget;

    try {
        scWidget = MuseSuperChar.Loader.getSuperCharWidget(ENTITY_DATA_TABLE);
        
        if(scWidget !== null) {
            formTab.insertTab(formTab.indexOf(xtpCharTab), scWidget, 
                MuseUtils.getTextMetric("musesuperchar", "superCharTabName"));
        }

        if(MuseUtils.getFlagMetric("musesuperchar", 
            "isXtupleCharacteristicsTabHidden")) {
            formTab.removeTab(xtpCharTab);
        }
    } catch(e) {
        MuseUtils.displayError(e, mywindow);
    }


    //--------------------------------------------------------------------
    //  "Private" Functional Logic
    //--------------------------------------------------------------------

    var mySave = function(pRecId) {
        try {
            scWidget.save(mywindow.id());   
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    var initSuperChar = function(pMode, pParentId) {
        scWidget.initWidget(pMode, pParentId);
        
        //----------------------------------------------------------------
        //  Connects/Disconnects
        //----------------------------------------------------------------
        mywindow["saved(int)"].connect(mySave);
    };

    //--------------------------------------------------------------------
    //  Public Interface -- Functions
    //--------------------------------------------------------------------
    
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

            if(["new", "edit", "view"].includes(myMode) && 
                scWidget !== null) {
                initSuperChar(myMode, mywindow.id());
            } else {
                return;
            }

        } catch(e) {
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
    if(typeof pGlobal.set === "function") {
        foreignSetFunc = pGlobal.set;
    } else {
        foreignSetFunc = function() {};
    }

    pGlobal.set = function(pParams) {
        try {
            foreignSetFunc(pParams);
            pPublicApi.set(pParams);
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
        
    };

})(this.MuseSuperChar.CrmAccount, this);

