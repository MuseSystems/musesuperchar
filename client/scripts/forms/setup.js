/*************************************************************************
 *************************************************************************
 **
 ** File:        setup.js
 ** Project:     Muse Systems xTuple Super Characteristics
 ** Author:      Steven C. Buttgereit
 **
 ** (C) 2017 Lima Buttgereit Holdings LLC d/b/a Muse Systems
 **
 ** Contact:
 ** muse.information@musesystems.com  :: https://muse.systems
 ** 
 ** Licensing restrictions apply.  Please refer to your Master Services
 ** Agreement or governing Statement of Work for complete terms and 
 ** conditions.
 **
 *************************************************************************
 ************************************************************************/

//////////////////////////////////////////////////////////////////////////
//  Namespace Definition
//////////////////////////////////////////////////////////////////////////

this.MuseSuperChar = this.MuseSuperChar || {};
this.MuseSuperChar.Setup = this.MuseSuperChar.Setup || {};

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
    
    
    //--------------------------------------------------------------------
    //  Custom Screen Objects and Starting GUI Manipulation
    //--------------------------------------------------------------------
    
    // Add the group/entity maintenance form to setup.
    var scGroupName = qsTr("SuperChar Groups/Entities");
    var scGroupUiName = "museScGroupMaint";
    var scGroupModeVal = mywindow.mode("maintainSuperCharGroups");
    
    mywindow.insert( scGroupName, scGroupUiName, setup.MasterInformation, 
        Xt.ProductsModule | Xt.InventoryModule | Xt.CRMModule | Xt.SalesModule | 
        Xt.AccountingModule, scGroupModeVal, scGroupModeVal);

    // Add the characteristic maintenance form to setup.
    var superCharName = qsTr("SuperChar");
    var superCharUiName = "museSuperCharMaint";
    var superCharModeVal = mywindow.mode("maintainSuperCharateristics");
    
    mywindow.insert( superCharName, superCharUiName, setup.MasterInformation, 
        Xt.ProductsModule | Xt.InventoryModule | Xt.CRMModule | Xt.SalesModule | 
        Xt.AccountingModule, superCharModeVal, superCharModeVal);

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

})(this.MuseSuperChar.Setup, this);

