/*************************************************************************
 *************************************************************************
 **
 ** File:        museScGroupMaint.js
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
this.MuseSuperChar.GroupMaint = this.MuseSuperChar.GroupMaint || {};

//////////////////////////////////////////////////////////////////////////
//  Imports
//////////////////////////////////////////////////////////////////////////

if(!this.MuseUtils) {
    include("museUtils");
}

if(!this.MuseSuperChar.Data) {
    include("museScData");
}

//////////////////////////////////////////////////////////////////////////
//  Module Defintion
//////////////////////////////////////////////////////////////////////////

(function(pPublicApi, pGlobal) {

    //--------------------------------------------------------------------
    //  Get Object References From Screen Definitions
    //--------------------------------------------------------------------
    var entitiesButtonsHBoxLayout = mywindow.findChild("entitiesButtonsHBoxLayout");
    var entitiesButtonsLeftSpacer = mywindow.findChild("entitiesButtonsLeftSpacer");
    var entitiesButtonsRightSpacer = mywindow.findChild("entitiesButtonsRightSpacer");
    var entitiesGroupBox = mywindow.findChild("entitiesGroupBox");
    var entityAddPushButton = mywindow.findChild("entityAddPushButton");
    var entityDeletePushButton = mywindow.findChild("entityDeletePushButton");
    var entityEditPushButton = mywindow.findChild("entityEditPushButton");
    var entityListXTreeWidget = mywindow.findChild("entityListXTreeWidget");
    var groupAddPushButton = mywindow.findChild("groupAddPushButton");
    var groupAssignPushButton = mywindow.findChild("groupAssignPushButton");
    var groupDeletePushButton = mywindow.findChild("groupDeletePushButton");
    var groupEditPushButton = mywindow.findChild("groupEditPushButton");
    var groupLayoutAddPushButton = mywindow.findChild("groupLayoutAddPushButton");
    var groupLayoutButtonsCenterSpacer = mywindow.findChild("groupLayoutButtonsCenterSpacer");
    var groupLayoutButtonsHBoxLayout = mywindow.findChild("groupLayoutButtonsHBoxLayout");
    var groupLayoutButtonsLeftSpacer = mywindow.findChild("groupLayoutButtonsLeftSpacer");
    var groupLayoutButtonsRightSpacer = mywindow.findChild("groupLayoutButtonsRightSpacer");
    var groupLayoutDeletePushButton = mywindow.findChild("groupLayoutDeletePushButton");
    var groupLayoutEditPushButton = mywindow.findChild("groupLayoutEditPushButton");
    var groupLayoutGroupBox = mywindow.findChild("groupLayoutGroupBox");
    var groupLayoutMoveDownPushButton = mywindow.findChild("groupLayoutMoveDownPushButton");
    var groupLayoutMoveUpPushButton = mywindow.findChild("groupLayoutMoveUpPushButton");
    var groupLayoutXTreeWidget = mywindow.findChild("groupLayoutXTreeWidget");
    var groupListXTreeWidget = mywindow.findChild("groupListXTreeWidget");
    var groupsButtonsCenterSpacer = mywindow.findChild("groupsButtonsCenterSpacer");
    var groupsButtonsHBoxLayout = mywindow.findChild("groupsButtonsHBoxLayout");
    var groupsButtonsLeftSpacer = mywindow.findChild("groupsButtonsLeftSpacer");
    var groupsButtonsRightSpacer = mywindow.findChild("groupsButtonsRightSpacer");
    var groupsEntitiesHBoxLayout = mywindow.findChild("groupsEntitiesHBoxLayout");
    var groupsGroupBox = mywindow.findChild("groupsGroupBox");

    
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

})(this.MuseSuperChar.GroupMaint, this);

