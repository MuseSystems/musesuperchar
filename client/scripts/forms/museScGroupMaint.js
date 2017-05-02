/*************************************************************************
 *************************************************************************
 **
 ** File:        museScGroupMaint.js
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
this.MuseSuperChar.GroupMaint = this.MuseSuperChar.GroupMaint || {};

//////////////////////////////////////////////////////////////////////////
//  Imports
//////////////////////////////////////////////////////////////////////////

if(!this.MuseUtils) {
    include("museUtils");
}

if(!this.MuseSuperChar.Entity) {
    include("museScEntityData");
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
    
    // Add columns to entityListXTreeWidget
    entityListXTreeWidget.addColumn("Entity Id", 60, Qt.AlignRight, false, "entity_id");
    entityListXTreeWidget.addColumn("Entity", 150, Qt.AlignCenter, true, "entity_display_name");
    entityListXTreeWidget.addColumn("Schema", 100, Qt.AlignLeft, false, "entity_schema");
    entityListXTreeWidget.addColumn("Table", 100, Qt.AlignLeft, false, "entity_table");
    entityListXTreeWidget.addColumn("Primary Key Column", 150, Qt.AlignLeft, false, "entity_pk_column");
    entityListXTreeWidget.addColumn("System Locked?", 45, Qt.AlignCenter, false, "entity_is_system_locked");
    entityListXTreeWidget.addColumn("Packages", 150, Qt.AlignLeft, false, "entity_package_names");

    //--------------------------------------------------------------------
    //  "Private" Functional Logic
    //--------------------------------------------------------------------
    var clear = function() {
        entityListXTreeWidget.clear();
        groupLayoutXTreeWidget.clear();
        groupListXTreeWidget.clear();
    };

    var populate = function() {
        // Clear out everything
        clear();

        // Populate the entity list.
        entityListXTreeWidget.populate(
            MuseSuperChar.Entity.getEntities());

        //groupListXTreeWidget.populate(
        //    MuseSuperChar.Group.getGroupsSqlQuery());

        if(MuseUtils.realNull(groupListXTreeWidget.currentItem()) !== null) {
            groupLayoutXTreeWidget.populate(
                MuseSuperChar.Group.getGroupLayoutsSqlQuery(
                    groupListXTreeWidget.currentItem().id()));
        }

        setButtons();
        
    };


    var setButtons = function() {
        // Handle Entity Buttons
        if(MuseUtils.realNull(entityListXTreeWidget.currentItem()) !== null) {
            var currEntityItem = entityListXTreeWidget.currentItem();
            entityAddPushButton.enabled = true && 
                privileges.check("maintainSuperCharEntities");

            var isEntityEditingPrivileged = 
                (
                    (
                        privileges.check("maintainSuperCharEntities") && 
                        !MuseSuperChar.Entity.isEntitySystemLocked(currEntityItem.id())
                    ) ||            
                    (
                        privileges.check("maintainSuperCharEntities") &&
                        privileges.check("maintainSuperCharSysLockRecsManually")
                    )
                );

            entityEditPushButton.enabled = true && isEntityEditingPrivileged;
            entityDeletePushButton.enabled = true && isEntityEditingPrivileged;
        } else {
            entityAddPushButton.enabled = true && 
                privileges.check("maintainSuperCharEntities");
            entityEditPushButton.enabled = false;
            entityDeletePushButton.enabled = false;
        }

        // We'll use these vraiables in group and group layout so declare it
        // here and make the linter happy. We'll set them in the group check
        // since we can't edit layouts unless there is a group selected.
        var isGroupSystemLocked = true;
        var isGroupEditingPrivileged = false;

        // Handle Group Buttons
        if(MuseUtils.realNull(groupListXTreeWidget.currentItem()) !== null) {
            var currGroupItem = groupListXTreeWidget.currentItem();
            
            groupAddPushButton.enabled = true && 
                privileges.check("maintainSuperCharGroups");
            isGroupSystemLocked = 
                MuseSuperChar.Group.isGroupSystemLocked(currGroupItem.id());
            isGroupEditingPrivileged = 
                (
                    (
                        privileges.check("maintainSuperCharGroups") && 
                        !isGroupSystemLocked
                    ) ||            
                    (
                        privileges.check("maintainSuperCharGroups") &&
                        privileges.check("maintainSuperCharSysLockRecsManually")
                    )
                );

            groupAssignPushButton.enabled = true && isGroupEditingPrivileged;
            groupEditPushButton.enabled = true && isGroupEditingPrivileged;
            groupDeletePushButton.enabled = true && isGroupEditingPrivileged;

        } else {
            groupAddPushButton.enabled = true && 
                privileges.check("maintainSuperCharGroups");
            groupEditPushButton.enabled = false;
            groupDeletePushButton.enabled = false;
            groupAssignPushButton.enabled = false;
        }


        // Handle Layout Buttons
        if(MuseUtils.realNull(groupListXTreeWidget.currentItem()) !== null && 
            MuseUtils.realNull(groupLayoutXTreeWidget.currentItem()) !== null) {
            
            var currGroupLayoutItem = groupListXTreeWidget.currentItem();
            groupLayoutAddPushButton.enabled = true &&
                (
                    (
                        privileges.check("maintainSuperCharGroups") && 
                        !isGroupSystemLocked
                    ) ||
                    (
                        privileges.check("maintainSuperCharGroups") && 
                        isGroupEditingPrivileged
                    ) ||
                    (
                        privileges.check("maintainSuperCharGroups") &&
                        MuseUtils.getFlagMetric("musesuperchar", 
                            "isSystemLockedObjectUserExtendable")
                    )
                );

            var isGroupLayoutEditingPrivileged = 
                (
                    (
                        privileges.check("maintainSuperCharGroups") &&
                        !MuseSuperChar.Group.isGroupLayoutItemSystemLocked(
                            currGroupLayoutItem.id())
                    ) ||            
                    (
                        privileges.check("maintainSuperCharGroups") &&
                        privileges.check("maintainSuperCharSysLockRecsManually")
                    )
                );

            groupLayoutEditPushButton.enabled = true && isGroupLayoutEditingPrivileged;
            groupLayoutMoveUpPushButton.enabled = true && isGroupLayoutEditingPrivileged;
            groupLayoutMoveDownPushButton.enabled = true && isGroupLayoutEditingPrivileged;
            groupLayoutDeletePushButton.enabled = true && isGroupLayoutEditingPrivileged;

        } else if(MuseUtils.realNull(groupListXTreeWidget.currentItem()) !== null) {
            groupLayoutAddPushButton.enabled = true &&
                (
                    (
                        privileges.check("maintainSuperCharGroups") && 
                        !isGroupSystemLocked
                    ) ||
                    (
                        privileges.check("maintainSuperCharGroups") && 
                        isGroupEditingPrivileged
                    ) ||
                    (
                        privileges.check("maintainSuperCharGroups") &&
                        MuseUtils.getFlagMetric("musesuperchar", 
                            "isSystemLockedObjectUserExtendable")
                    )
                );
            groupLayoutEditPushButton.enabled = false;
            groupLayoutMoveUpPushButton.enabled = false;
            groupLayoutMoveDownPushButton.enabled = false;
            groupLayoutDeletePushButton.enabled = false;
        } else {
            groupLayoutAddPushButton.enabled = false;
            groupLayoutEditPushButton.enabled = false;
            groupLayoutMoveUpPushButton.enabled = false;
            groupLayoutMoveDownPushButton.enabled = false;
            groupLayoutDeletePushButton.enabled = false;
        }
        
    };

    var addEntity = function() {
        // Open a box with the requisite fields.
        var museScCreateEntity = toolbox.openWindow("museScCreateEntity", 
            mywindow, Qt.WindowModal);
        toolbox.lastWindow().set({mode: "new"});
        museScCreateEntity.exec();
        
        // We may have new entities, so lets populate them.
        entityListXTreeWidget.clear();
        entityListXTreeWidget.populate(
            MuseSuperChar.Entity.getEntities());
        setButtons();
        
    };

    var editEntity = function() {
        // Open a box with the requisite fields.
        var museScCreateEntity = toolbox.openWindow("museScCreateEntity", 
            mywindow, Qt.WindowModal);
        toolbox.lastWindow().set({
            mode: "edit",
            entity_id: entityListXTreeWidget.id()
        });
        museScCreateEntity.exec();
        
        // We may have new entities, so lets populate them.
        entityListXTreeWidget.clear();
        entityListXTreeWidget.populate(
            MuseSuperChar.Entity.getEntities());
        setButtons();
    };

    var deleteEntity = function(pEntityId) {
        MuseSuperChar.Entity.deleteEntity(pEntityId);
        // Populate the entity list.
        entityListXTreeWidget.populate(
            MuseSuperChar.Entity.getEntities());
        setButtons();
    };
    
    //--------------------------------------------------------------------
    //  Public Interface -- Slots
    //--------------------------------------------------------------------

    pPublicApi.sPopulate = function() {
        try {

        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    pPublicApi.sAddEntity = function() {
        try {
            return addEntity();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    pPublicApi.sEditEntity = function() {
        try {
            return editEntity();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    pPublicApi.sDeleteEntity = function() {
        try {
            if(MuseUtils.isValidId(entityListXTreeWidget.id())) {
                deleteEntity(entityListXTreeWidget.id());
            } else {
                QMessageBox.warning(mywindow, "No Entity Selected", 
                    "We did not understand which entity you wanted to delete.\n" + 
                    "Please select the entity in the list and try again.");
            }
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    pPublicApi.sGroupAssignToEntity = function() {
        try {

        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    pPublicApi.sAddGroup = function() {
        try {

        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    pPublicApi.sEditGroup = function() {
        try {

        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    pPublicApi.sDeleteGroup = function() {
        try {

        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    pPublicApi.sAddSuperCharToLayout = function() {
        try {

        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    pPublicApi.sEditSuperCharInLayout = function() {
        try {

        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    pPublicApi.sDeleteSuperCharFromLayout = function() {
        try {

        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    pPublicApi.sMoveSuperCharUpInLayout = function() {
        try {

        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    pPublicApi.sMoveSuperCharDownInLayout = function() {
        try {

        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    pPublicApi.sEntitySelected = function(pXtreeWidgetItem, pColumnIndex) {
        try {
            setButtons();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
    };

    try {
        //--------------------------------------------------------------------
        //  Initialization Logic Setup 
        //  Subforms are different from standard xTuple forms in that they do not 
        //  call set and instead initialize on the constructor.  This should be OK 
        //  since we should not need to depend on the outside world for anything.
        //--------------------------------------------------------------------
        populate();
        
        //----------------------------------------------------------------
        //  Connects/Disconnects
        //---------------------------------------------------------------- 

        // Entity 
        entityAddPushButton.clicked.connect(pPublicApi.sAddEntity);
        entityEditPushButton.clicked.connect(pPublicApi.sEditEntity);
        entityDeletePushButton.clicked.connect(pPublicApi.sDeleteEntity);
        entityListXTreeWidget["itemClicked(XTreeWidgetItem *, int)"].connect(
            pPublicApi.sEntitySelected);
        
        // Group Buttons
        groupAssignPushButton.clicked.connect(pPublicApi.sGroupAssignToEntity);
        groupAddPushButton.clicked.connect(pPublicApi.sAddGroup);
        groupEditPushButton.clicked.connect(pPublicApi.sEditGroup);
        groupDeletePushButton.clicked.connect(pPublicApi.sDeleteGroup);
        
        // Group Layout Buttons
        groupLayoutAddPushButton.clicked.connect(
            pPublicApi.sAddSuperCharToLayout);
        groupLayoutEditPushButton.clicked.connect(
            pPublicApi.sEditSuperCharInLayout);
        groupLayoutDeletePushButton.clicked.connect(
            pPublicApi.sDeleteSuperCharFromLayout);
        groupLayoutMoveUpPushButton.clicked.connect(
            pPublicApi.sMoveSuperCharUpInLayout);
        groupLayoutMoveDownPushButton.clicked.connect(
            pPublicApi.sMoveSuperCharDownInLayout);
        
    } catch(e) {
        MuseUtils.displayError(e, mywindow);
        mywindow.close();
    }

})(this.MuseSuperChar.GroupMaint, this);

