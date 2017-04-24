/*************************************************************************
 *************************************************************************
 **
 ** File:        museScGroupEntityAssign.js
 ** Project:     Muse Systems xTuple Super Characteristics
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
this.MuseSuperChar.GroupEntityAssign = this.MuseSuperChar.GroupEntityAssign || {};

//////////////////////////////////////////////////////////////////////////
//  Imports
//////////////////////////////////////////////////////////////////////////

if(!this.MuseUtils) {
    include("museUtils");
}



//////////////////////////////////////////////////////////////////////////
//  Module Defintion
//////////////////////////////////////////////////////////////////////////

(function(pPublicApi, pGlobal) {

    //--------------------------------------------------------------------
    //  Get Object References From Screen Definitions
    //--------------------------------------------------------------------
    var addAllPushButton = mywindow.findChild("addAllPushButton");
    var addPushButton = mywindow.findChild("addPushButton");
    var assignedEntitiesListXTreeWidget = mywindow.findChild("assignedEntitiesListXTreeWidget");
    var assignedEntitiesVBoxLayout = mywindow.findChild("assignedEntitiesVBoxLayout");
    var assignedEntitiesXLabel = mywindow.findChild("assignedEntitiesXLabel");
    var availEntitiesListXTreeWidget = mywindow.findChild("availEntitiesListXTreeWidget");
    var availEntitiesVBoxLayout = mywindow.findChild("availEntitiesVBoxLayout");
    var availEntitiesXLabel = mywindow.findChild("availEntitiesXLabel");
    var bottomSpacer = mywindow.findChild("bottomSpacer");
    var cancelPushButton = mywindow.findChild("cancelPushButton");
    var controlsVBoxLayout = mywindow.findChild("controlsVBoxLayout");
    var editPushButton = mywindow.findChild("editPushButton");
    var groupComboBox = mywindow.findChild("groupComboBox");
    var groupInactiveSpacer = mywindow.findChild("groupInactiveSpacer");
    var groupLabel = mywindow.findChild("groupLabel");
    var groupSelectHBoxLayout = mywindow.findChild("groupSelectHBoxLayout");
    var inactiveEditSpacer = mywindow.findChild("inactiveEditSpacer");
    var isInactiveShownXCheckBox = mywindow.findChild("isInactiveShownXCheckBox");
    var outerHBoxLayout = mywindow.findChild("outerHBoxLayout");
    var outerVBoxLayout = mywindow.findChild("outerVBoxLayout");
    var panesHBoxLayout = mywindow.findChild("panesHBoxLayout");
    var removeAddSpacer = mywindow.findChild("removeAddSpacer");
    var removeAllPushButton = mywindow.findChild("removeAllPushButton");
    var removePushButton = mywindow.findChild("removePushButton");
    var topSpacer = mywindow.findChild("topSpacer");
    
    //--------------------------------------------------------------------
    //  Custom Screen Objects and Starting GUI Manipulation
    //--------------------------------------------------------------------


    //--------------------------------------------------------------------
    //  "Private" Functional Logic
    //--------------------------------------------------------------------


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

        
        //----------------------------------------------------------------
        //  Connects/Disconnects
        //----------------------------------------------------------------

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
    if(pGlobal.set === "function") {
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

})(this.MuseSuperChar.GroupEntityAssign, this);

