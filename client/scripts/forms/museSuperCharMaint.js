/*************************************************************************
 *************************************************************************
 **
 ** File:        museSuperCharMaint.js
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
this.MuseSuperChar.SuperCharMaint = this.MuseSuperChar.SuperCharMaint || {};

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
    var assignedGroupsListGroupBox = mywindow.findChild("assignedGroupsListGroupBox");
    var assignedGroupsListXTreeWidget = mywindow.findChild("assignedGroupsListXTreeWidget");
    var condValAddPushButton = mywindow.findChild("condValAddPushButton");
    var condValButtonsHBoxLayout = mywindow.findChild("condValButtonsHBoxLayout");
    var condValButtonsLeftSpacer = mywindow.findChild("condValButtonsLeftSpacer");
    var condValButtonsRightSpacer = mywindow.findChild("condValButtonsRightSpacer");
    var condValDeletePushButton = mywindow.findChild("condValDeletePushButton");
    var condValEditPushButton = mywindow.findChild("condValEditPushButton");
    var condValGroupBox = mywindow.findChild("condValGroupBox");
    var condValHBoxLayout = mywindow.findChild("condValHBoxLayout");
    var condValXTreeWidget = mywindow.findChild("condValXTreeWidget");
    var descriptionXLabel = mywindow.findChild("descriptionXLabel");
    var descriptionXTextEdit = mywindow.findChild("descriptionXTextEdit");
    var displayNameXLabel = mywindow.findChild("displayNameXLabel");
    var displayNameXLineEdit = mywindow.findChild("displayNameXLineEdit");
    var internalNameXLabel = mywindow.findChild("internalNameXLabel");
    var internalNameXLineEdit = mywindow.findChild("internalNameXLineEdit");
    var isSearchableXCheckBox = mywindow.findChild("isSearchableXCheckBox");
    var isSearchableXLabel = mywindow.findChild("isSearchableXLabel");
    var isSystemLockedXCheckBox = mywindow.findChild("isSystemLockedXCheckBox");
    var isSystemLockedXLabel = mywindow.findChild("isSystemLockedXLabel");
    var listOfValuesAddPushButton = mywindow.findChild("listOfValuesAddPushButton");
    var listOfValuesButtonHBoxLayout = mywindow.findChild("listOfValuesButtonHBoxLayout");
    var listOfValuesButtonsCenterSpacer = mywindow.findChild("listOfValuesButtonsCenterSpacer");
    var listOfValuesButtonsLeftSpacer = mywindow.findChild("listOfValuesButtonsLeftSpacer");
    var listOfValuesButtonsRightSpacer = mywindow.findChild("listOfValuesButtonsRightSpacer");
    var listOfValuesDeletePushButton = mywindow.findChild("listOfValuesDeletePushButton");
    var listOfValuesMoveDownPushButton = mywindow.findChild("listOfValuesMoveDownPushButton");
    var listOfValuesMoveUpPushButton = mywindow.findChild("listOfValuesMoveUpPushButton");
    var listOfValuesXTreeWidget = mywindow.findChild("listOfValuesXTreeWidget");
    var listQueryXLabel = mywindow.findChild("listQueryXLabel");
    var listQueryXTextEdit = mywindow.findChild("listQueryXTextEdit");
    var mainHBoxLayout = mywindow.findChild("mainHBoxLayout");
    var managingPackageValueXLabel = mywindow.findChild("managingPackageValueXLabel");
    var managingPackageXLabel = mywindow.findChild("managingPackageXLabel");
    var superCharAddPushButton = mywindow.findChild("superCharAddPushButton");
    var superCharButtonsBottonSpacer = mywindow.findChild("superCharButtonsBottonSpacer");
    var superCharButtonsTopSpacer = mywindow.findChild("superCharButtonsTopSpacer");
    var superCharButtonsVBoxLayout = mywindow.findChild("superCharButtonsVBoxLayout");
    var superCharDataTypeXComboBox = mywindow.findChild("superCharDataTypeXComboBox");
    var superCharDataTypeXLabel = mywindow.findChild("superCharDataTypeXLabel");
    var superCharDeletePushButton = mywindow.findChild("superCharDeletePushButton");
    var superCharDetailsVBoxLayout = mywindow.findChild("superCharDetailsVBoxLayout");
    var superCharEditPushButton = mywindow.findChild("superCharEditPushButton");
    var superCharListAndGroupListVBoxLayout = mywindow.findChild("superCharListAndGroupListVBoxLayout");
    var superCharListGroupBox = mywindow.findChild("superCharListGroupBox");
    var superCharListXTreeWidget = mywindow.findChild("superCharListXTreeWidget");
    var superCharSystemValuesGroupBox = mywindow.findChild("superCharSystemValuesGroupBox");
    var superCharSystemValuesLeftFormLayout = mywindow.findChild("superCharSystemValuesLeftFormLayout");
    var superCharSystemValuesRightFormLayout = mywindow.findChild("superCharSystemValuesRightFormLayout");
    var superCharValuesGroupBox = mywindow.findChild("superCharValuesGroupBox");
    var superCharValuesLeftFormLayout = mywindow.findChild("superCharValuesLeftFormLayout");
    var superCharValuesRightGroupBox = mywindow.findChild("superCharValuesRightGroupBox");
    
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

})(this.MuseSuperChar.SuperCharMaint, this);

