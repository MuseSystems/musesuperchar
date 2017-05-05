/*************************************************************************
 *************************************************************************
 **
 ** File:        museScCreateGroup.js
 ** Project:     Muse Systems Super Charateristics for xTuple ERP
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
this.MuseSuperChar.CreateGroup = this.MuseSuperChar.CreateGroup || {};

//////////////////////////////////////////////////////////////////////////
//  Imports
//////////////////////////////////////////////////////////////////////////

if(!this.MuseUtils) {
    include("museUtils");
}

if(!this.MuseUtils.SuperChar.Entity) {
    include("museScEntityData");
}

if(!this.MuseUtils.SuperChar.Group) {
    include("museScGroupData");
}

//////////////////////////////////////////////////////////////////////////
//  Module Defintion
//////////////////////////////////////////////////////////////////////////

(function(pPublicApi, pGlobal) {

    var mode = "UNDEFINED";
    var currGroupId = -1;
    var lastGroupDisplayName = "";
    var lastGroupInternalName = "";
    var lastGroupDescription = "";

    //--------------------------------------------------------------------
    //  Get Object References From Screen Definitions
    //--------------------------------------------------------------------
    var assignEntityVBoxLayout = mywindow.findChild("assignEntityVBoxLayout");
    var assignEntityXLabel = mywindow.findChild("assignEntityXLabel");
    var assignEntityXTreeWidget = mywindow.findChild("assignEntityXTreeWidget");
    var assignPushButton = mywindow.findChild("assignPushButton");
    var availEntityVBoxLayout = mywindow.findChild("availEntityVBoxLayout");
    var availEntityXLabel = mywindow.findChild("availEntityXLabel");
    var availEntityXTreeWidget = mywindow.findChild("availEntityXTreeWidget");
    var closePushButton = mywindow.findChild("closePushButton");
    var descXLabel = mywindow.findChild("descXLabel");
    var descXTextArea = mywindow.findChild("descXTextArea");
    var displayNameXLabel = mywindow.findChild("displayNameXLabel");
    var displayNameXLineEdit = mywindow.findChild("displayNameXLineEdit");
    var entityButtonBottomSpacer = mywindow.findChild("entityButtonBottomSpacer");
    var entityButtonTopSpacer = mywindow.findChild("entityButtonTopSpacer");
    var entityButtonVBoxLayout = mywindow.findChild("entityButtonVBoxLayout");
    var groupButtonHBoxLayout = mywindow.findChild("groupButtonHBoxLayout");
    var groupButtonLeftSpacer = mywindow.findChild("groupButtonLeftSpacer");
    var groupButtonRightSpacer = mywindow.findChild("groupButtonRightSpacer");
    var groupDescFormLayout = mywindow.findChild("groupDescFormLayout");
    var groupEntityGroupBox = mywindow.findChild("groupEntityGroupBox");
    var groupFieldsHBoxLayout = mywindow.findChild("groupFieldsHBoxLayout");
    var groupFieldsLeftSpacer = mywindow.findChild("groupFieldsLeftSpacer");
    var groupFieldsRightSpacer = mywindow.findChild("groupFieldsRightSpacer");
    var groupNameFormLayout = mywindow.findChild("groupNameFormLayout");
    var internalNameXLabel = mywindow.findChild("internalNameXLabel");
    var internalNameXLineEdit = mywindow.findChild("internalNameXLineEdit");
    var savePushButton = mywindow.findChild("savePushButton");
    var unsassignPushButton = mywindow.findChild("unsassignPushButton");
    
    //--------------------------------------------------------------------
    //  Custom Screen Objects and Starting GUI Manipulation
    //--------------------------------------------------------------------
    availEntityXTreeWidget.addColumn("Entity ID", 60, Qt.AlignRight, false, "entity_id");
    availEntityXTreeWidget.addColumn("Entity", 150, Qt.AlignCenter, true, "entity_display_name");
    availEntityXTreeWidget.addColumn("Table", 150, Qt.AlignLeft, false, "entity_code");
    availEntityXTreeWidget.addColumn("Locked?", 45, Qt.AlignCenter, false, "entity_is_system_locked");
    
    assignEntityXTreeWidget.addColumn("Entity ID", 60, Qt.AlignRight, false, "entity_id");
    assignEntityXTreeWidget.addColumn("Entity", 150, Qt.AlignCenter, true, "entity_display_name");
    assignEntityXTreeWidget.addColumn("Table", 150, Qt.AlignLeft, false, "entity_code");
    assignEntityXTreeWidget.addColumn("Locked?", 45, Qt.AlignCenter, false, "entity_is_system_locked");

    //--------------------------------------------------------------------
    //  "Private" Functional Logic
    //--------------------------------------------------------------------
    var populate = function(pGroupId) {
        groupData = MuseSuperChar.Group.getGroupById(pGroupId);

        displayNameXLineEdit.text = groupData.sc_group_display_name;
        lastGroupDisplayName = displayNameXLineEdit.text;

        internalNameXLineEdit.text = groupData.sc_group_internal_name;
        lastGroupInternalName = internalNameXLineEdit.text;

        descXTextArea.setPlainText(groupData.sc_group_description);
        lastGroupDescription = descXTextArea.toPlainText();

        availEntityXLabel.populate(MuseSuperChar.Group.getNonGroupEntities(
            pGroupId));
        assignEntityXTreeWidget.populate(MuseSuperChar.Group.getGroupEntities(
            pGroupId));
    };

    var setButtons = function() {
        if(mode == "view") {
            assignPushButton.enabled = false;
            closePushButton.enabled = true;
            closePushButton.text = "Close";
            savePushButton.enabled = false;
            unsassignPushButton.enabled = false;
            return;
        }

        // Set group save button
        if((displayNameXLineEdit.text != lastGroupDisplayName ||
            internalNameXLineEdit.text != lastGroupInternalName ||
            descXTextArea.toPlainText() != lastGroupDescription) &&
           MuseUtils.coalesce(displayNameXLineEdit.text,"") !== "" &&
           MuseUtils.coalesce(internalNameXLineEdit.text,"") !== "" &&
           MuseUtils.coalesce(descXTextArea.toPlainText(),"") !== "") {
            
            closePushButton.enabled = true;
            closePushButton.text = "Cancel";
            savePushButton.enabled = true;
        } else {
            closePushButton.enabled = true;
            closePushButton.text = "Close";
            savePushButton.enabled = false;
        }

        // Set assign button
        if(availEntityXTreeWidget.selectedItems().length > 0) {
            assignPushButton.enabled = true;
        } else {
            assignPushButton.enabled = false;
        }

        if(assignEntityXTreeWidget.selectedItems().length > 0) {
            unsassignPushButton.enabled = true;
        } else {
            unsassignPushButton.enabled = false;
        }
    };

    var setNewMode = function() {
        mode = "new";

        // Group Edit Area
        displayNameXLineEdit.enabled = true;
        internalNameXLineEdit.enabled = true;
        descXTextArea.enabled = true;

        // Entity Assign Area
        groupEntityGroupBox.enabled = false;

        setButtons();
    };

    var setEditMode = function(pGroupId) {
        // Set a couple of our values that are immediately knowable.
        mode = "edit";
        currGroupId = pGroupId;
        populate(pGroupId);

        // Group Edit Area
        displayNameXLineEdit.enabled = true;
        internalNameXLineEdit.enabled = 
            privilege.check("maintainSuperCharInternalNames");
        descXTextArea.enabled = true;

        // Entity Assign Area
        groupEntityGroupBox.enabled = true;

        setButtons();
    };

    var setViewMode = function(pGroupId) {
        mode = "view";
        currGroupId = pGroupId;
        populate(pGroupId);

        // Group Edit Area
        displayNameXLineEdit.enabled = false;
        internalNameXLineEdit.enabled = false;
        descXTextArea.enabled = false;

        // Entity Assign Area
        groupEntityGroupBox.enabled = false;

        setButtons();
    };

    //--------------------------------------------------------------------
    //  Public Interface -- Functions
    //--------------------------------------------------------------------
    pPublicApi.sFieldsUpdated = function() {
        try {
            setButtons();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    /**
     * Form startup initialization.  Standard part of the xTuple ERP 
     * startup process.
     * @param {Object} pParams An associative array of values passed from
     *                         the xTuple C++ forms which contain context
     *                         setting information.
     */
    pPublicApi.set = function(pParams) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pParams: pParams
        };

        if(pParams.mode == "new") {
            if(privilege.check("maintainSuperCharGroups")) {
                setNewMode();
            } else {
                QMessageBox.critical(mywindow,
                    "Permission Denied", 
                    "You do not have permission to create new Super " +
                    "Characeteristic groups.\n\n(maintainSuperCharGroups)");
                mywindow.close();
            }
        } else if(pParams.mode == "edit" && 
                    privilege.check("maintainSuperCharGroups")) {
            if(!MuseUtils.isValidId(pParams.sc_group_id)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require a valid group id for edit mode.",
                    "MuseSuperChar.CreateGroup.pPublicApi.set",
                    {params: funcParams});
            }

            setEditMode(pParams.sc_group_id);
        } else if(pParams.mode == "view" && 
                    privilege.check("maintainSuperCharGroups")) {
            if(!MuseUtils.isValidId(pParams.sc_group_id)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require a valid group id for view mode.",
                    "MuseSuperChar.CreateGroup.pPublicApi.set",
                    {params: funcParams});
            }

            setViewMode(pParams.sc_group_id);
        }
        
        //----------------------------------------------------------------
        //  Connects/Disconnects
        //----------------------------------------------------------------
        //assignPushButton.clicked.connect();
        //closePushButton.clicked.connect();
        //savePushButton.clicked.connect();
        //unsassignPushButton.clicked.connect();

        descXTextArea["textChanged()"].connect(pPublicApi.sFieldsUpdated);
        displayNameXLineEdit["editingFinished()"].connect(
            pPublicApi.sFieldsUpdated);
        internalNameXLineEdit["editingFinished()"].connect(
            pPublicApi.sFieldsUpdated);
        assignEntityXTreeWidget["itemClicked(XTreeWidgetItem *, int)"].connect(
            pPublicApi.sFieldsUpdated);
        availEntityXTreeWidget["itemClicked(XTreeWidgetItem *, int)"].connect(
            pPublicApi.sFieldsUpdated);
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

})(this.MuseSuperChar.CreateGroup, this);

