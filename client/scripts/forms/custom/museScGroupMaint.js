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
try {
    //////////////////////////////////////////////////////////////////////////
    //  Namespace Definition
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseSuperChar === "undefined") {
        MuseSuperChar = {};
    }

    if (typeof MuseSuperChar.GroupMaint === "undefined") {
        MuseSuperChar.GroupMaint = {};
    }

    //////////////////////////////////////////////////////////////////////////
    //  Imports
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseUtils === "undefined") {
        include("museUtils");
    }

    MuseUtils.loadMuseUtils([MuseUtils.MOD_EXCEPTION, MuseUtils.MOD_JS]);

    if (typeof MuseSuperChar.Entity === "undefined") {
        include("museScEntityData");
    }

    if (typeof MuseSuperChar.Group === "undefined") {
        include("museScGroupData");
    }
} catch (e) {
    if (
        typeof MuseUtils !== "undefined" &&
        (MuseUtils.isMuseUtilsExceptionLoaded === true ? true : false)
    ) {
        var error = new MuseUtils.ScriptException(
            "musesuperchar",
            "We encountered a script level issue while processing MuseSuperChar.GroupMaint.",
            "MuseSuperChar.GroupMaint",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.GroupMaint Script Error",
            "We encountered a script level issue while processing MuseSuperChar.GroupMaint."
        );
    }
}

//////////////////////////////////////////////////////////////////////////
//  Module Defintion
//////////////////////////////////////////////////////////////////////////

(function(pPublicApi, pGlobal) {
    try {
        //--------------------------------------------------------------------
        //  Constants
        //--------------------------------------------------------------------

        //--------------------------------------------------------------------
        //  Get Object References From Screen Definitions
        //--------------------------------------------------------------------
        var entitiesButtonsHBoxLayout = mywindow.findChild(
            "entitiesButtonsHBoxLayout"
        );
        var entitiesButtonsLeftSpacer = mywindow.findChild(
            "entitiesButtonsLeftSpacer"
        );
        var entitiesButtonsRightSpacer = mywindow.findChild(
            "entitiesButtonsRightSpacer"
        );
        var entitiesGroupBox = mywindow.findChild("entitiesGroupBox");
        var entityAddPushButton = mywindow.findChild("entityAddPushButton");
        var entityDeletePushButton = mywindow.findChild(
            "entityDeletePushButton"
        );
        var entityEditPushButton = mywindow.findChild("entityEditPushButton");
        var entityListXTreeWidget = mywindow.findChild("entityListXTreeWidget");
        var groupAddPushButton = mywindow.findChild("groupAddPushButton");
        var groupDeletePushButton = mywindow.findChild("groupDeletePushButton");
        var groupEditPushButton = mywindow.findChild("groupEditPushButton");
        var groupLayoutAddPushButton = mywindow.findChild(
            "groupLayoutAddPushButton"
        );
        var groupLayoutButtonsCenterSpacer = mywindow.findChild(
            "groupLayoutButtonsCenterSpacer"
        );
        var groupLayoutButtonsHBoxLayout = mywindow.findChild(
            "groupLayoutButtonsHBoxLayout"
        );
        var groupLayoutButtonsLeftSpacer = mywindow.findChild(
            "groupLayoutButtonsLeftSpacer"
        );
        var groupLayoutButtonsRightSpacer = mywindow.findChild(
            "groupLayoutButtonsRightSpacer"
        );
        var groupLayoutDeletePushButton = mywindow.findChild(
            "groupLayoutDeletePushButton"
        );
        var groupLayoutEditPushButton = mywindow.findChild(
            "groupLayoutEditPushButton"
        );
        var groupLayoutPreviewPushButton = mywindow.findChild(
            "groupLayoutPreviewPushButton"
        );
        var groupLayoutGroupBox = mywindow.findChild("groupLayoutGroupBox");
        var groupLayoutMoveDownPushButton = mywindow.findChild(
            "groupLayoutMoveDownPushButton"
        );
        var groupLayoutMoveUpPushButton = mywindow.findChild(
            "groupLayoutMoveUpPushButton"
        );
        var groupLayoutXTreeWidget = mywindow.findChild(
            "groupLayoutXTreeWidget"
        );
        var groupListXTreeWidget = mywindow.findChild("groupListXTreeWidget");
        var groupsButtonsHBoxLayout = mywindow.findChild(
            "groupsButtonsHBoxLayout"
        );
        var groupsButtonsLeftSpacer = mywindow.findChild(
            "groupsButtonsLeftSpacer"
        );
        var groupsButtonsRightSpacer = mywindow.findChild(
            "groupsButtonsRightSpacer"
        );
        var groupsEntitiesHBoxLayout = mywindow.findChild(
            "groupsEntitiesHBoxLayout"
        );
        var groupsGroupBox = mywindow.findChild("groupsGroupBox");

        //--------------------------------------------------------------------
        //  Custom Screen Objects and Starting GUI Manipulation
        //--------------------------------------------------------------------

        // Add columns to entityListXTreeWidget
        entityListXTreeWidget.addColumn(
            "Entity Id",
            60,
            Qt.AlignRight,
            false,
            "entity_id"
        );
        entityListXTreeWidget.addColumn(
            "Entity",
            150,
            Qt.AlignCenter,
            true,
            "entity_display_name"
        );
        entityListXTreeWidget.addColumn(
            "Data Table",
            150,
            Qt.AlignCenter,
            false,
            "entity_data_table"
        );
        entityListXTreeWidget.addColumn(
            "Schema",
            100,
            Qt.AlignLeft,
            false,
            "entity_schema"
        );
        entityListXTreeWidget.addColumn(
            "Table",
            100,
            Qt.AlignLeft,
            false,
            "entity_table"
        );
        entityListXTreeWidget.addColumn(
            "Primary Key Column",
            150,
            Qt.AlignLeft,
            false,
            "entity_pk_column"
        );
        entityListXTreeWidget.addColumn(
            "System Locked?",
            45,
            Qt.AlignCenter,
            false,
            "entity_is_system_locked"
        );
        entityListXTreeWidget.addColumn(
            "Packages",
            150,
            Qt.AlignLeft,
            false,
            "entitypkg_names"
        );

        // Add columns to groupListXTreeWidget
        groupListXTreeWidget.addColumn(
            "Group Id",
            60,
            Qt.AlignRight,
            false,
            "scgrp_id"
        );
        groupListXTreeWidget.addColumn(
            "Group",
            150,
            Qt.AlignCenter,
            true,
            "scgrp_display_name"
        );
        groupListXTreeWidget.addColumn(
            "Internal Name",
            150,
            Qt.AlignCenter,
            false,
            "scgrp_internal_name"
        );
        groupListXTreeWidget.addColumn(
            "System Locked?",
            45,
            Qt.AlignCenter,
            false,
            "scgrp_is_system_locked"
        );
        groupListXTreeWidget.addColumn(
            "Description",
            200,
            Qt.AlignLeft,
            true,
            "scgrp_description"
        );
        groupListXTreeWidget.addColumn(
            "Package",
            150,
            Qt.AlignLeft,
            false,
            "scgrp_package_name"
        );

        //Add columns to groupLayoutXTreeWidget
        groupLayoutXTreeWidget.addColumn(
            "Group Layout ID",
            45,
            Qt.AlignRight,
            false,
            "scdef_scgrp_ass_id"
        );
        groupLayoutXTreeWidget.addColumn(
            "Sort Order",
            45,
            Qt.AlignRight,
            true,
            "scdef_scgrp_ass_sequence"
        );
        groupLayoutXTreeWidget.addColumn(
            "Group",
            15,
            Qt.AlignCenter,
            false,
            "scdef_scgrp_ass_scgrp_display_name"
        );
        groupLayoutXTreeWidget.addColumn(
            "Group ID",
            -1,
            Qt.AlignCenter,
            false,
            "scdef_scgrp_ass_scgrp_id"
        );
        groupLayoutXTreeWidget.addColumn(
            "Group Int. Name",
            -1,
            Qt.AlignCenter,
            false,
            "scdef_scgrp_ass_scgrp_internal_name"
        );
        groupLayoutXTreeWidget.addColumn(
            "Section",
            150,
            Qt.AlignCenter,
            true,
            "scdef_scgrp_ass_section_name"
        );
        groupLayoutXTreeWidget.addColumn(
            "SuperChar",
            150,
            Qt.AlignCenter,
            true,
            "scdef_scgrp_ass_scdef_display_name"
        );
        groupLayoutXTreeWidget.addColumn(
            "SuperChar ID",
            45,
            Qt.AlignRight,
            false,
            "scdef_scgrp_ass_scdef_id"
        );
        groupLayoutXTreeWidget.addColumn(
            "SuperChar Int. Name",
            100,
            Qt.AlignCenter,
            false,
            "scdef_scgrp_ass_scdef_internal_name"
        );
        groupLayoutXTreeWidget.addColumn(
            "Is Column Start?",
            45,
            Qt.AlignCenter,
            true,
            "scdef_scgrp_ass_is_column_start"
        );
        groupLayoutXTreeWidget.addColumn(
            "Width",
            45,
            Qt.AlignRight,
            true,
            "scdef_scgrp_ass_width"
        );
        groupLayoutXTreeWidget.addColumn(
            "Height",
            45,
            Qt.AlignRight,
            true,
            "scdef_scgrp_ass_height"
        );
        groupLayoutXTreeWidget.addColumn(
            "Is System Locked",
            45,
            Qt.AlignCenter,
            false,
            "scdef_scgrp_ass_is_system_locked"
        );

        //--------------------------------------------------------------------
        //  Private Functional Logic
        //--------------------------------------------------------------------
        var clear = function() {
            entityListXTreeWidget.clear();
            groupLayoutXTreeWidget.clear();
            groupLayoutGroupBox.enabled = false;
            groupLayoutGroupBox.title =
                "Super Characteristic Layout / No Group Selected";
            groupListXTreeWidget.clear();
        };

        var populate = function() {
            // Clear out everything
            clear();

            // Populate the entity list.
            entityListXTreeWidget.populate(MuseSuperChar.Entity.getEntities());

            groupListXTreeWidget.populate(MuseSuperChar.Group.getGroups());

            setButtons();
        };

        var setButtons = function() {
            // Handle Entity Buttons
            if (
                MuseUtils.realNull(entityListXTreeWidget.currentItem()) !== null
            ) {
                var currEntityItem = entityListXTreeWidget.currentItem();
                entityAddPushButton.enabled =
                    true && privileges.check("maintainSuperCharEntities");

                var isEntityEditingPrivileged =
                    (privileges.check("maintainSuperCharEntities") &&
                        !MuseSuperChar.Entity.isEntitySystemLocked(
                            currEntityItem.id()
                        )) ||
                    (privileges.check("maintainSuperCharEntities") &&
                        privileges.check(
                            "maintainSuperCharSysLockRecsManually"
                        ));

                entityEditPushButton.enabled =
                    true && isEntityEditingPrivileged;
                entityDeletePushButton.enabled =
                    true && isEntityEditingPrivileged;
            } else {
                entityAddPushButton.enabled =
                    true && privileges.check("maintainSuperCharEntities");
                entityEditPushButton.enabled = false;
                entityDeletePushButton.enabled = false;
            }

            // We'll use these vraiables in group and group layout so declare it
            // here and make the linter happy. We'll set them in the group check
            // since we can't edit layouts unless there is a group selected.
            var isGroupSystemLocked = true;
            var isGroupEditingPrivileged = false;

            // Handle Group Buttons
            if (
                MuseUtils.realNull(groupListXTreeWidget.currentItem()) !== null
            ) {
                var currGroupItem = groupListXTreeWidget.currentItem();

                groupAddPushButton.enabled =
                    true && privileges.check("maintainSuperCharGroups");
                isGroupSystemLocked = MuseSuperChar.Group.isGroupSystemLocked(
                    currGroupItem.id()
                );
                isGroupEditingPrivileged =
                    (privileges.check("maintainSuperCharGroups") &&
                        !isGroupSystemLocked) ||
                    (privileges.check("maintainSuperCharGroups") &&
                        privileges.check(
                            "maintainSuperCharSysLockRecsManually"
                        ));

                groupEditPushButton.enabled = true && isGroupEditingPrivileged;
                groupDeletePushButton.enabled =
                    true && isGroupEditingPrivileged;
            } else {
                groupAddPushButton.enabled =
                    true && privileges.check("maintainSuperCharGroups");
                groupEditPushButton.enabled = false;
                groupDeletePushButton.enabled = false;
            }

            // Handle Layout Buttons
            if (
                MuseUtils.realNull(groupListXTreeWidget.currentItem()) !==
                    null &&
                MuseUtils.realNull(groupLayoutXTreeWidget.currentItem()) !==
                    null
            ) {
                var currGroupLayoutItem = groupLayoutXTreeWidget.currentItem();
                groupLayoutAddPushButton.enabled =
                    true &&
                    ((privileges.check("maintainSuperCharGroups") &&
                        !isGroupSystemLocked) ||
                        (privileges.check("maintainSuperCharGroups") &&
                            isGroupEditingPrivileged) ||
                        (privileges.check("maintainSuperCharGroups") &&
                            MuseUtils.getFlagMetric(
                                "musesuperchar",
                                "isSystemLockedObjectUserExtendable"
                            )));

                var isGroupLayoutEditingPrivileged =
                    (privileges.check("maintainSuperCharGroups") &&
                        !MuseSuperChar.Group.isGroupLayoutItemSystemLocked(
                            currGroupLayoutItem.id()
                        )) ||
                    (privileges.check("maintainSuperCharGroups") &&
                        privileges.check(
                            "maintainSuperCharSysLockRecsManually"
                        ));

                groupLayoutEditPushButton.enabled =
                    true && isGroupLayoutEditingPrivileged;
                groupLayoutMoveUpPushButton.enabled =
                    true &&
                    isGroupLayoutEditingPrivileged &&
                    currGroupLayoutItem.rawValue("scdef_scgrp_ass_sequence") >
                        1;
                groupLayoutMoveDownPushButton.enabled =
                    true &&
                    isGroupLayoutEditingPrivileged &&
                    !MuseSuperChar.Group.isGroupLayoutItemAtBotton(
                        currGroupLayoutItem.id()
                    );
                groupLayoutDeletePushButton.enabled =
                    true && isGroupLayoutEditingPrivileged;
            } else if (
                MuseUtils.realNull(groupListXTreeWidget.currentItem()) !== null
            ) {
                groupLayoutAddPushButton.enabled =
                    true &&
                    ((privileges.check("maintainSuperCharGroups") &&
                        !isGroupSystemLocked) ||
                        (privileges.check("maintainSuperCharGroups") &&
                            isGroupEditingPrivileged) ||
                        (privileges.check("maintainSuperCharGroups") &&
                            MuseUtils.getFlagMetric(
                                "musesuperchar",
                                "isSystemLockedObjectUserExtendable"
                            )));
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

            // If the Group layout has any items, we should allow previewing.
            if (
                groupLayoutXTreeWidget.topLevelItemCount > 0 &&
                MuseUtils.isValidId(groupListXTreeWidget.id())
            ) {
                groupLayoutPreviewPushButton.enabled = true;
            } else {
                groupLayoutPreviewPushButton.enabled = false;
            }
        };

        var addEntity = function() {
            // Open a box with the requisite fields.
            var museScCreateEntity = toolbox.openWindow(
                "museScCreateEntity",
                mywindow,
                Qt.WindowModal
            );
            toolbox.lastWindow().set({ mode: "new" });
            museScCreateEntity.exec();

            // We may have new entities, so lets populate them.
            entityListXTreeWidget.clear();
            entityListXTreeWidget.populate(MuseSuperChar.Entity.getEntities());
            setButtons();
        };

        var editEntity = function() {
            // Open a box with the requisite fields.
            var museScCreateEntity = toolbox.openWindow(
                "museScCreateEntity",
                mywindow,
                Qt.WindowModal
            );
            toolbox.lastWindow().set({
                mode: "edit",
                entity_id: entityListXTreeWidget.id()
            });
            museScCreateEntity.exec();

            // We may have new entities, so lets populate them.
            entityListXTreeWidget.clear();
            entityListXTreeWidget.populate(MuseSuperChar.Entity.getEntities());
            setButtons();
        };

        var deleteEntity = function(pEntityId) {
            MuseSuperChar.Entity.deleteEntity(pEntityId);
            // Populate the entity list.
            entityListXTreeWidget.populate(MuseSuperChar.Entity.getEntities());
            setButtons();
        };

        var groupSelected = function() {
            if (
                MuseUtils.realNull(groupListXTreeWidget.currentItem()) !== null
            ) {
                var currentItem = groupListXTreeWidget.currentItem();

                groupLayoutGroupBox.enabled = true;
                //    groupLayoutXTreeWidget.populate(
                //        MuseSuperChar.Group.getGroupLayoutsSqlQuery(
                //            currentItem.id()));

                groupLayoutGroupBox.title =
                    currentItem.rawValue("scgrp_display_name") +
                    " Super Characteristic Layout";

                groupLayoutXTreeWidget.clear();
                groupLayoutXTreeWidget.populate(
                    MuseSuperChar.Group.getGroupLayoutItems({
                        scdef_scgrp_ass_scgrp_id: currentItem.id()
                    })
                );
            }

            setButtons();
        };

        var addGroup = function() {
            // Open a box with the requisite fields.
            var museScCreateGroup = toolbox.openWindow(
                "museScCreateGroup",
                mywindow,
                Qt.WindowModal
            );
            toolbox.lastWindow().set({ mode: "new" });
            museScCreateGroup.exec();

            // We may have new entities, so lets populate them.
            groupListXTreeWidget.clear();
            groupListXTreeWidget.populate(MuseSuperChar.Group.getGroups());
            groupLayoutXTreeWidget.clear();
            groupLayoutGroupBox.enabled = false;
            groupLayoutGroupBox.title =
                "Super Characteristic Layout / No Group Selected";
            setButtons();
        };

        var editGroup = function() {
            // Only try to do anything if we have a discernible ID.
            if (MuseUtils.isValidId(groupListXTreeWidget.id())) {
                // Open a box with the requisite fields.
                var museScCreateGroup = toolbox.openWindow(
                    "museScCreateGroup",
                    mywindow,
                    Qt.WindowModal
                );
                toolbox.lastWindow().set({
                    mode: "edit",
                    scgrp_id: groupListXTreeWidget.id()
                });
                museScCreateGroup.exec();

                // We may have updated entities, so lets populate them.
                groupListXTreeWidget.clear();
                groupListXTreeWidget.populate(MuseSuperChar.Group.getGroups());
                groupLayoutXTreeWidget.clear();
                groupLayoutGroupBox.enabled = false;
                groupLayoutGroupBox.title =
                    "Super Characteristic Layout / No Group Selected";
                setButtons();
            }
        };

        var deleteGroup = function() {
            // Only try to delete if we have a discernible group id.
            if (MuseUtils.isValidId(groupListXTreeWidget.id())) {
                MuseSuperChar.Group.deleteGroup(groupListXTreeWidget.id());

                // We should now have a different group list.
                groupListXTreeWidget.clear();
                groupListXTreeWidget.populate(MuseSuperChar.Group.getGroups());
                groupLayoutXTreeWidget.clear();
                groupLayoutGroupBox.enabled = false;
                groupLayoutGroupBox.title =
                    "Super Characteristic Layout / No Group Selected";
                setButtons();
            }
        };

        var addGroupLayoutItem = function() {
            // Open a box with the requisite fields.
            var museScCreateGroupLayoutItem = toolbox.openWindow(
                "museScCreateGroupLayoutItem",
                mywindow,
                Qt.WindowModal
            );
            toolbox.lastWindow().set({
                mode: "new",
                scdef_scgrp_ass_scgrp_id: groupListXTreeWidget.id()
            });
            museScCreateGroupLayoutItem.exec();

            // We may have new entities, so lets populate them.
            groupLayoutXTreeWidget.clear();
            groupLayoutXTreeWidget.populate(
                MuseSuperChar.Group.getGroupLayoutItems({
                    scdef_scgrp_ass_scgrp_id: groupListXTreeWidget.id()
                })
            );
            setButtons();
        };

        var editGroupLayoutItem = function() {
            var currGroupLayoutItemId = groupLayoutXTreeWidget.id();
            // Open a box with the requisite fields.
            var museScCreateGroupLayoutItem = toolbox.openWindow(
                "museScCreateGroupLayoutItem",
                mywindow,
                Qt.WindowModal
            );
            toolbox.lastWindow().set({
                mode: "edit",
                scdef_scgrp_ass_id: currGroupLayoutItemId
            });
            museScCreateGroupLayoutItem.exec();

            groupLayoutXTreeWidget.clear();
            groupLayoutXTreeWidget.populate(
                MuseSuperChar.Group.getGroupLayoutItems({
                    scdef_scgrp_ass_scgrp_id: groupListXTreeWidget.id()
                })
            );

            groupLayoutXTreeWidget.setId(currGroupLayoutItemId);
            setButtons();
        };

        var deleteGroupLayoutItem = function() {
            try {
                MuseSuperChar.Group.deleteGroupLayoutItem(
                    groupLayoutXTreeWidget.id()
                );

                groupLayoutXTreeWidget.clear();
                groupLayoutXTreeWidget.populate(
                    MuseSuperChar.Group.getGroupLayoutItems({
                        scdef_scgrp_ass_scgrp_id: groupListXTreeWidget.id()
                    })
                );
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We confirm that the requested Group Layout Item was deleted.",
                    "MuseSuperChar.GroupMaint.deleteGroupLayoutItem",
                    { thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var moveGroupLayoutItemUp = function() {
            var currGroupLayoutItemId = groupLayoutXTreeWidget.id();

            try {
                MuseSuperChar.Group.moveUpGroupLayoutItem(
                    currGroupLayoutItemId
                );
                groupLayoutXTreeWidget.populate(
                    MuseSuperChar.Group.getGroupLayoutItems({
                        scdef_scgrp_ass_scgrp_id: groupListXTreeWidget.id()
                    })
                );
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to properly move a Group Layout Item up in the layout.",
                    "MuseSuperChar.GroupMaint.moveGroupLayoutItemUp",
                    { thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }

            groupLayoutXTreeWidget.setId(currGroupLayoutItemId);
            setButtons();
        };

        var moveGroupLayoutItemDown = function() {
            var currGroupLayoutItemId = groupLayoutXTreeWidget.id();

            try {
                MuseSuperChar.Group.moveDownGroupLayoutItem(
                    currGroupLayoutItemId
                );
                groupLayoutXTreeWidget.populate(
                    MuseSuperChar.Group.getGroupLayoutItems({
                        scdef_scgrp_ass_scgrp_id: groupListXTreeWidget.id()
                    })
                );
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to properly move a Group Layout Item up in the layout.",
                    "MuseSuperChar.GroupMaint.moveGroupLayoutItemDown",
                    { thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }

            groupLayoutXTreeWidget.setId(currGroupLayoutItemId);
            setButtons();
        };

        var previewGroupUiForm = function() {
            var objectPrefix = MuseUtils.getTextMetric(
                "musesuperchar",
                "widgetPrefix"
            );
            var groupPreviewUiForm = toolbox.openWindow(
                objectPrefix +
                    "_" +
                    groupListXTreeWidget.rawValue("scgrp_internal_name"),
                mywindow,
                Qt.WindowModal
            );
            // TODO: As of now we can't properly run the form script to get things
            // like populate comboboxes; try and make that work.
            toolbox.lastWindow().set({ mode: "preview" });
        };

        //--------------------------------------------------------------------
        //  Public Interface -- Functions
        //--------------------------------------------------------------------

        //--------------------------------------------------------------------
        //  Public Interface -- Slots
        //--------------------------------------------------------------------

        pPublicApi.sPopulate = function() {
            try {
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to a request to populate the group maintenance form.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sPopulate",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sAddEntity = function() {
            try {
                return addEntity();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to add a new entity.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sAddEntity",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sEditEntity = function() {
            try {
                return editEntity();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to a request to edit an entity entry.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sEditEntity",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sDeleteEntity = function() {
            try {
                if (MuseUtils.isValidId(entityListXTreeWidget.id())) {
                    deleteEntity(entityListXTreeWidget.id());
                } else {
                    QMessageBox.warning(
                        mywindow,
                        "No Entity Selected",
                        "We did not understand which entity you wanted to delete.\n" +
                            "Please select the entity in the list and try again."
                    );
                }
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to request to delete an entity entry.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sDeleteEntity",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sAddGroup = function() {
            try {
                addGroup();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to a request to add a group.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sAddGroup",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sEditGroup = function() {
            try {
                editGroup();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to a request edit a group.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sEditGroup",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sDeleteGroup = function() {
            try {
                deleteGroup();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to a request to delete a group.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sDeleteGroup",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sAddSuperCharToLayout = function() {
            try {
                addGroupLayoutItem();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to a request to add a Super Characteristic to a group's layout.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sAddSuperCharToLayout",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sEditSuperCharInLayout = function() {
            try {
                editGroupLayoutItem();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to a request to edit a group layout item.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sEditSuperCharInLayout",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sDeleteSuperCharFromLayout = function() {
            try {
                deleteGroupLayoutItem();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to a request to remove a Super Characteristic from a group layout.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sDeleteSuperCharFromLayout",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sMoveSuperCharUpInLayout = function() {
            try {
                moveGroupLayoutItemUp();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to a request to move an item up in the group layout sort order.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sMoveSuperCharUpInLayout",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sMoveSuperCharDownInLayout = function() {
            try {
                moveGroupLayoutItemDown();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to a request to move an item down in the the group layout sort order.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sMoveSuperCharDownInLayout",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sEntitySelected = function(pXtreeWidgetItem, pColumnIndex) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pXtreeWidgetItem: pXtreeWidgetItem,
                pColumnIndex: pColumnIndex
            };

            try {
                setButtons();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to the selection of an entity item.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sEntitySelected",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sGroupSelected = function(pXtreeWidgetItem, pColumnIndex) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pXtreeWidgetItem: pXtreeWidgetItem,
                pColumnIndex: pColumnIndex
            };

            try {
                groupSelected();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to the selection of a group item.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sGroupSelected",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sGroupLayoutSelected = function() {
            try {
                setButtons();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to the selection of a group layout item.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sGroupLayoutSelected",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sPreviewGroupUiForm = function() {
            try {
                previewGroupUiForm();
            } catch (e) {
                var error = new MuseUtils.ApiException(
                    "musesuperchar",
                    "We found problems while responding to a request to preview the group's UI form.",
                    "MuseSuperChar.GroupMaint.pPublicApi.sPreviewGroupUiForm",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

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
            pPublicApi.sEntitySelected
        );

        // Group Buttons
        groupAddPushButton.clicked.connect(pPublicApi.sAddGroup);
        groupEditPushButton.clicked.connect(pPublicApi.sEditGroup);
        groupDeletePushButton.clicked.connect(pPublicApi.sDeleteGroup);
        groupListXTreeWidget["itemClicked(XTreeWidgetItem *, int)"].connect(
            pPublicApi.sGroupSelected
        );

        // Group Layout Buttons
        groupLayoutAddPushButton.clicked.connect(
            pPublicApi.sAddSuperCharToLayout
        );
        groupLayoutEditPushButton.clicked.connect(
            pPublicApi.sEditSuperCharInLayout
        );
        groupLayoutDeletePushButton.clicked.connect(
            pPublicApi.sDeleteSuperCharFromLayout
        );
        groupLayoutMoveUpPushButton.clicked.connect(
            pPublicApi.sMoveSuperCharUpInLayout
        );
        groupLayoutMoveDownPushButton.clicked.connect(
            pPublicApi.sMoveSuperCharDownInLayout
        );
        groupLayoutXTreeWidget["itemClicked(XTreeWidgetItem *, int)"].connect(
            pPublicApi.sGroupLayoutSelected
        );
        groupLayoutPreviewPushButton.clicked.connect(
            pPublicApi.sPreviewGroupUiForm
        );
    } catch (e) {
        var error = new MuseUtils.ModuleException(
            "musesuperchar",
            "We enountered a MuseSuperChar.GroupMaint module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.GroupMaint",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.GroupMaint, this);
