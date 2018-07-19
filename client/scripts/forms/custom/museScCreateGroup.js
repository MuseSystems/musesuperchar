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

try {
    //////////////////////////////////////////////////////////////////////////
    //  Namespace Definition
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseSuperChar === "undefined") {
        MuseSuperChar = {};
    }

    if (typeof MuseSuperChar.CreateGroup === "undefined") {
        MuseSuperChar.CreateGroup = {};
    }

    //////////////////////////////////////////////////////////////////////////
    //  Imports
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseUtils === "undefined") {
        include("museUtils");
    }

    MuseUtils.loadMuseUtils([MuseUtils.MOD_JS, MuseUtils.MOD_EXCEPTION]);

    if (typeof MuseSuperChar.Group === "undefined") {
        include("museScGroupData");
    }

    if (typeof MuseSuperChar.Widget === "undefined") {
        include("museScWidget");
    }
} catch (e) {
    if (
        typeof MuseUtils !== "undefined" &&
        (MuseUtils.isMuseUtilsExceptionLoaded === true ? true : false)
    ) {
        var error = new MuseUtils.ScriptException(
            "musesuperchar",
            "We encountered a script level issue while processing MuseSuperChar.CreateGroup.",
            "MuseSuperChar.CreateGroup",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.CreateGroup Script Error",
            "We encountered a script level issue while processing MuseSuperChar.CreateGroup."
        );
    }
}

//////////////////////////////////////////////////////////////////////////
//  Module Defintion
//////////////////////////////////////////////////////////////////////////

(function(pPublicApi, pGlobal) {
    try {
        //--------------------------------------------------------------------
        //  Constants and Module State
        //--------------------------------------------------------------------
        var mode = "UNDEFINED";
        var currGroupId = -1;
        var lastGroupDisplayName = "";
        var lastGroupInternalName = "";
        var lastGroupDescription = "";

        //--------------------------------------------------------------------
        //  Get Object References From Screen Definitions
        //--------------------------------------------------------------------
        var assignEntityVBoxLayout = mywindow.findChild(
            "assignEntityVBoxLayout"
        );
        var assignEntityXLabel = mywindow.findChild("assignEntityXLabel");
        var assignEntityXTreeWidget = mywindow.findChild(
            "assignEntityXTreeWidget"
        );
        var assignPushButton = mywindow.findChild("assignPushButton");
        var availEntityVBoxLayout = mywindow.findChild("availEntityVBoxLayout");
        var availEntityXLabel = mywindow.findChild("availEntityXLabel");
        var availEntityXTreeWidget = mywindow.findChild(
            "availEntityXTreeWidget"
        );
        var closePushButton = mywindow.findChild("closePushButton");
        var descXLabel = mywindow.findChild("descXLabel");
        var descXTextArea = mywindow.findChild("descXTextArea");
        var displayNameXLabel = mywindow.findChild("displayNameXLabel");
        var displayNameXLineEdit = mywindow.findChild("displayNameXLineEdit");
        var entityButtonBottomSpacer = mywindow.findChild(
            "entityButtonBottomSpacer"
        );
        var entityButtonTopSpacer = mywindow.findChild("entityButtonTopSpacer");
        var entityButtonVBoxLayout = mywindow.findChild(
            "entityButtonVBoxLayout"
        );
        var groupButtonHBoxLayout = mywindow.findChild("groupButtonHBoxLayout");
        var groupButtonLeftSpacer = mywindow.findChild("groupButtonLeftSpacer");
        var groupButtonRightSpacer = mywindow.findChild(
            "groupButtonRightSpacer"
        );
        var groupDescFormLayout = mywindow.findChild("groupDescFormLayout");
        var groupEntityGroupBox = mywindow.findChild("groupEntityGroupBox");
        var groupFieldsHBoxLayout = mywindow.findChild("groupFieldsHBoxLayout");
        var groupFieldsLeftSpacer = mywindow.findChild("groupFieldsLeftSpacer");
        var groupFieldsRightSpacer = mywindow.findChild(
            "groupFieldsRightSpacer"
        );
        var groupNameFormLayout = mywindow.findChild("groupNameFormLayout");
        var internalNameXLabel = mywindow.findChild("internalNameXLabel");
        var internalNameXLineEdit = mywindow.findChild("internalNameXLineEdit");
        var savePushButton = mywindow.findChild("savePushButton");
        var unsassignPushButton = mywindow.findChild("unsassignPushButton");

        //--------------------------------------------------------------------
        //  Custom Screen Objects and Starting GUI Manipulation
        //--------------------------------------------------------------------
        availEntityXTreeWidget.addColumn(
            "Entity ID",
            60,
            Qt.AlignRight,
            false,
            "entity_id"
        );
        availEntityXTreeWidget.addColumn(
            "Entity",
            150,
            Qt.AlignCenter,
            true,
            "entity_display_name"
        );
        availEntityXTreeWidget.addColumn(
            "Table",
            150,
            Qt.AlignLeft,
            false,
            "entity_code"
        );
        availEntityXTreeWidget.addColumn(
            "Locked?",
            45,
            Qt.AlignCenter,
            false,
            "entity_is_system_locked"
        );

        assignEntityXTreeWidget.addColumn(
            "Entity ID",
            60,
            Qt.AlignRight,
            false,
            "entity_id"
        );
        assignEntityXTreeWidget.addColumn(
            "Entity",
            150,
            Qt.AlignCenter,
            true,
            "entity_display_name"
        );
        assignEntityXTreeWidget.addColumn(
            "Table",
            150,
            Qt.AlignLeft,
            false,
            "entity_code"
        );
        assignEntityXTreeWidget.addColumn(
            "Locked?",
            45,
            Qt.AlignCenter,
            false,
            "entity_is_system_locked"
        );

        //--------------------------------------------------------------------
        //  Private Functional Logic
        //--------------------------------------------------------------------
        var populate = function(pGroupId) {
            groupData = MuseSuperChar.Group.getGroupById(pGroupId);

            displayNameXLineEdit.text = groupData.scgrp_display_name;
            lastGroupDisplayName = displayNameXLineEdit.text;

            internalNameXLineEdit.text = groupData.scgrp_internal_name;
            lastGroupInternalName = internalNameXLineEdit.text;

            descXTextArea.setPlainText(groupData.scgrp_description);
            lastGroupDescription = descXTextArea.document.toPlainText();

            availEntityXTreeWidget.populate(
                MuseSuperChar.Group.getNonGroupEntities(pGroupId)
            );
            assignEntityXTreeWidget.populate(
                MuseSuperChar.Group.getGroupEntities(pGroupId)
            );
        };

        var setButtons = function() {
            if (mode == "view") {
                assignPushButton.enabled = false;
                closePushButton.enabled = true;
                closePushButton.text = "Close";
                savePushButton.enabled = false;
                unsassignPushButton.enabled = false;
                return;
            }

            // Set group save button
            if (
                (displayNameXLineEdit.text != lastGroupDisplayName ||
                    internalNameXLineEdit.text != lastGroupInternalName ||
                    descXTextArea.document.toPlainText() !=
                        lastGroupDescription) &&
                MuseUtils.coalesce(displayNameXLineEdit.text, "") !== "" &&
                MuseUtils.coalesce(internalNameXLineEdit.text, "") !== "" &&
                MuseUtils.coalesce(descXTextArea.document.toPlainText(), "") !==
                    ""
            ) {
                closePushButton.enabled = true;
                closePushButton.text = "Cancel";
                savePushButton.enabled = true;
            } else {
                closePushButton.enabled = true;
                closePushButton.text = "Close";
                savePushButton.enabled = false;
            }

            // Set assign button
            if (availEntityXTreeWidget.selectedItems().length > 0) {
                assignPushButton.enabled = true;
            } else {
                assignPushButton.enabled = false;
            }

            if (assignEntityXTreeWidget.selectedItems().length > 0) {
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
            descXTextArea.setPlainText("");

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
            internalNameXLineEdit.enabled = false;
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

        var updateInternalName = function() {
            if (
                mode == "new" &&
                internalNameXLineEdit.enabled &&
                MuseUtils.coalesce(displayNameXLineEdit.text, "") !== ""
            ) {
                internalNameXLineEdit.text = MuseSuperChar.Group.getDefaultGroupInternalName(
                    displayNameXLineEdit.text
                );
            }
        };

        var save = function() {
            var groupData;

            if (mode == "new") {
                groupData = {
                    scgrp_display_name: displayNameXLineEdit.text,
                    scgrp_internal_name: internalNameXLineEdit.text,
                    scgrp_description: descXTextArea.document.toPlainText()
                };
                setEditMode(MuseSuperChar.Group.createGroup(groupData));
            } else if (mode == "edit") {
                groupData = { scgrp_id: currGroupId };

                if (displayNameXLineEdit.text != lastGroupDisplayName) {
                    groupData.scgrp_display_name = displayNameXLineEdit.text;
                }

                if (
                    descXTextArea.document.toPlainText() != lastGroupDescription
                ) {
                    groupData.scgrp_description = descXTextArea.document.toPlainText();
                }

                setEditMode(MuseSuperChar.Group.updateGroup(groupData));
            }
        };

        var assignSelectedEntities = function() {
            var selectedItems = availEntityXTreeWidget.selectedItems();

            if (selectedItems.length < 1 || currGroupId < 1) {
                setButtons();
                return;
            }

            for (var i = 0; i < selectedItems.length; i++) {
                if (MuseUtils.isValidId(selectedItems[i].id())) {
                    var violations = MuseSuperChar.Group.getGroupEntityAsscAddViolations(
                        currGroupId,
                        selectedItems[i].id()
                    );
                    if (violations.violation_count === 0) {
                        MuseSuperChar.Group.addGroupEntityAssc(
                            currGroupId,
                            selectedItems[i].id()
                        );
                    } else {
                        var violationDialog = MuseSuperChar.Widget.MSSCViolationsDialog(
                            violations,
                            mywindow
                        );
                        violationDialog.exec();
                    }
                }
            }

            availEntityXTreeWidget.populate(
                MuseSuperChar.Group.getNonGroupEntities(currGroupId)
            );
            assignEntityXTreeWidget.populate(
                MuseSuperChar.Group.getGroupEntities(currGroupId)
            );

            setButtons();
        };

        var unassignSelectedEntities = function() {
            var selectedItems = assignEntityXTreeWidget.selectedItems();

            if (selectedItems.length < 1 || currGroupId < 1) {
                setButtons();
                return;
            }

            for (var i = 0; i < selectedItems.length; i++) {
                if (
                    MuseUtils.isValidId(selectedItems[i].id()) &&
                    (!MuseSuperChar.Group.isGroupEntityAsscSystemLocked(
                        currGroupId,
                        selectedItems[i].id()
                    ) ||
                        privileges.check(
                            "maintainSuperCharSysLockRecsManually"
                        ))
                ) {
                    var violations = MuseSuperChar.Group.getGroupEntityAsscDeleteViolations(
                        currGroupId,
                        selectedItems[i].id()
                    );
                    if (violations.violation_count === 0) {
                        MuseSuperChar.Group.deleteGroupEntityAssc(
                            currGroupId,
                            selectedItems[i].id()
                        );
                    } else {
                        var violationDialog = MuseSuperChar.Widget.MSSCViolationsDialog(
                            violations,
                            mywindow
                        );
                        violationDialog.exec();
                    }
                }
            }

            availEntityXTreeWidget.populate(
                MuseSuperChar.Group.getNonGroupEntities(currGroupId)
            );
            assignEntityXTreeWidget.populate(
                MuseSuperChar.Group.getGroupEntities(currGroupId)
            );

            setButtons();
        };

        //--------------------------------------------------------------------
        //  Public Interface -- Slots
        //--------------------------------------------------------------------
        pPublicApi.sFieldsUpdated = function() {
            try {
                updateInternalName();
                setButtons();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to an updated field.",
                    "MuseSuperChar.CreateGroup.pPublicApi.sFieldsUpdated",
                    { thrownError: e },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };

        pPublicApi.sClose = function() {
            try {
                mydialog.accept();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to close form request.",
                    "MuseSuperChar.CreateGroup.pPublicApi.sClose",
                    { thrownError: e },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };

        pPublicApi.sSave = function() {
            try {
                save();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to save record request.",
                    "MuseSuperChar.CreateGroup.pPublicApi.sSave",
                    { thrownError: e },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };

        pPublicApi.sAssignEntities = function() {
            try {
                assignSelectedEntities();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a group to an entity.",
                    "MuseSuperChar.CreateGroup.pPublicApi.sAssignEntities",
                    { thrownError: e },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };

        pPublicApi.sUnassignEntities = function() {
            try {
                unassignSelectedEntities();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to the removal of a group/entity assignment.",
                    "MuseSuperChar.CreateGroup.pPublicApi.sUnassignEntities",
                    { thrownError: e },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };

        //--------------------------------------------------------------------
        //  Public Interface -- Functions
        //--------------------------------------------------------------------

        pPublicApi.set = function(pParams) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pParams: pParams
            };

            if (pParams.mode == "new") {
                if (privileges.check("maintainSuperCharGroups")) {
                    setNewMode();
                } else {
                    QMessageBox.critical(
                        mywindow,
                        "Permission Denied",
                        "You do not have permission to create new Super " +
                            "Characeteristic groups.\n\n(maintainSuperCharGroups)"
                    );
                    mywindow.close();
                }
            } else if (
                pParams.mode == "edit" &&
                privileges.check("maintainSuperCharGroups")
            ) {
                if (!MuseUtils.isValidId(pParams.scgrp_id)) {
                    throw new MuseUtils.ParameterException(
                        "musesuperchar",
                        "We require a valid group id for edit mode.",
                        "MuseSuperChar.CreateGroup.pPublicApi.set",
                        { params: funcParams },
                        MuseUtils.LOG_WARNING
                    );
                }

                setEditMode(pParams.scgrp_id);
            } else if (
                pParams.mode == "view" &&
                privileges.check("maintainSuperCharGroups")
            ) {
                if (!MuseUtils.isValidId(pParams.scgrp_id)) {
                    throw new MuseUtils.ParameterException(
                        "musesuperchar",
                        "We require a valid group id for view mode.",
                        "MuseSuperChar.CreateGroup.pPublicApi.set",
                        { params: funcParams },
                        MuseUtils.LOG_WARNING
                    );
                }

                setViewMode(pParams.scgrp_id);
            }
            //----------------------------------------------------------------
            //  Set Timed Connects/Disconnects
            //----------------------------------------------------------------
            assignPushButton.clicked.connect(pPublicApi.sAssignEntities);
            closePushButton.clicked.connect(pPublicApi.sClose);
            savePushButton.clicked.connect(pPublicApi.sSave);
            unsassignPushButton.clicked.connect(pPublicApi.sUnassignEntities);

            descXTextArea["textChanged()"].connect(pPublicApi.sFieldsUpdated);
            displayNameXLineEdit["editingFinished()"].connect(
                pPublicApi.sFieldsUpdated
            );
            internalNameXLineEdit["editingFinished()"].connect(
                pPublicApi.sFieldsUpdated
            );
            assignEntityXTreeWidget[
                "itemClicked(XTreeWidgetItem *, int)"
            ].connect(pPublicApi.sFieldsUpdated);
            availEntityXTreeWidget[
                "itemClicked(XTreeWidgetItem *, int)"
            ].connect(pPublicApi.sFieldsUpdated);
        };

        //--------------------------------------------------------------------
        //  Definition Timed Connects/Disconnects
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
            var funcParams = { pParams: pParams };

            var myParams = MuseUtils.parseParams(pParams || {});

            try {
                foreignSetFunc(myParams);
                pPublicApi.set(myParams);
            } catch (e) {
                var error = new MuseUtils.ModuleException(
                    "musesuperchar",
                    "We enountered an error while initializing the form.",
                    "global.set",
                    {
                        params: funcParams,
                        thrownError: e,
                        context: {
                            parsedParams: myParams
                        }
                    },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };
    } catch (e) {
        var error = new MuseUtils.ModuleException(
            "musesuperchar",
            "We enountered a MuseSuperChar.CreateGroup module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.CreateGroup",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.CreateGroup, this);
