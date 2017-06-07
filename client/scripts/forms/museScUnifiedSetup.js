/*************************************************************************
 *************************************************************************
 **
 ** File:        museScUnifiedSetup.js
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
this.MuseSuperChar.UnifiedSetup = this.MuseSuperChar.UnifiedSetup || {};

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
    var museScUnifiedSetup = mywindow.findChild("museScUnifiedSetup");
    var superCharSetupTabWidget = mywindow.findChild("superCharSetupTabWidget");
    var groupsTab = mywindow.findChild("groupsTab");
    var superCharTab = mywindow.findChild("superCharTab");
    
    //--------------------------------------------------------------------
    //  Custom Screen Objects and Starting GUI Manipulation
    //--------------------------------------------------------------------
    groupTabVBoxLayout = new QBoxLayout(QBoxLayout.TopToBottom);
    groupsTab.setLayout(groupTabVBoxLayout);
    superCharTabVBoxLayout = new QBoxLayout(QBoxLayout.TopToBottom);
    superCharTab.setLayout(superCharTabVBoxLayout);

    var groupMaintWidget = toolbox.loadUi("museScGroupMaint");
    groupTabVBoxLayout.addWidget(groupMaintWidget);
    if(!this.MuseSuperChar.GroupMaint) {
        include("museScGroupMaint");
    }

    var superCharMaint = toolbox.loadUi("museSuperCharMaint");
    superCharTabVBoxLayout.addWidget(superCharMaint);
    if(!this.MuseSuperChar.SuperCharMaint) {
        include("museSuperCharMaint");
    }

    groupsTab.enabled = privileges.check("maintainSuperCharGroups");
    superCharTab.enabled = privileges.check("maintainSuperCharateristics");

    //--------------------------------------------------------------------
    //  "Private" Functional Logic
    //--------------------------------------------------------------------


    //--------------------------------------------------------------------
    //  Public Interface -- Functions
    //--------------------------------------------------------------------
    

})(this.MuseSuperChar.UnifiedSetup, this);

