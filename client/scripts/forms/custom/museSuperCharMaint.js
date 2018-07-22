/*************************************************************************
 *************************************************************************
 **
 ** File:        museSuperCharMaint.js
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

    if (typeof MuseSuperChar.SuperCharMaint === "undefined") {
        MuseSuperChar.SuperCharMaint = {};
    }

    //////////////////////////////////////////////////////////////////////////
    //  Imports
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseUtils === "undefined") {
        include("museUtils");
    }

    MuseUtils.loadMuseUtils([MuseUtils.MOD_JS, MuseUtils.MOD_EXCEPTION]);

    if (typeof MuseSuperChar.SuperChar === "undefined") {
        include("museSuperCharData");
    }

    if (typeof MuseSuperChar.Widget === "undefined") {
        include("museScWidget");
    }

    if (typeof MuseSuperChar.CondValRule === "undefined") {
        include("museScCondValRuleData");
    }
} catch (e) {
    if (
        typeof MuseUtils !== "undefined" &&
        (MuseUtils.isMuseUtilsExceptionLoaded === true ? true : false)
    ) {
        var error = new MuseUtils.ScriptException(
            "musesuperchar",
            "We encountered a script level issue while processing MuseSuperChar.SuperCharMaint.",
            "MuseSuperChar.SuperCharMaint",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.SuperCharMaint Script Error",
            "We encountered a script level issue while processing MuseSuperChar.SuperCharMaint."
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
        // A couple constants for reordering LOV values.  Just for
        // convenience/clarity.
        var UP = -1;
        var DOWN = 1;

        // Set up a variable to hold the selected superchar and use that the
        // check whether or not the user has made an update over previous values.
        // In "new" state, we presume that the the values (particularly scdef_id)
        // are null and as such use that to infer the new vs update state.

        var currSc;

        //--------------------------------------------------------------------
        //  Get Object References From Screen Definitions
        //--------------------------------------------------------------------
        var assignedGroupsListGroupBox = mywindow.findChild(
            "assignedGroupsListGroupBox"
        );
        var condValGroupBox = mywindow.findChild("condValGroupBox");
        var superCharListGroupBox = mywindow.findChild("superCharListGroupBox");
        var superCharSystemValuesGroupBox = mywindow.findChild(
            "superCharSystemValuesGroupBox"
        );
        var superCharValuesGroupBox = mywindow.findChild(
            "superCharValuesGroupBox"
        );
        var superCharValuesRightGroupBox = mywindow.findChild(
            "superCharValuesRightGroupBox"
        );

        var assignedGroupsListXTreeWidget = mywindow.findChild(
            "assignedGroupsListXTreeWidget"
        );
        var condValXTreeWidget = mywindow.findChild("condValXTreeWidget");
        var listOfValuesXTreeWidget = mywindow.findChild(
            "listOfValuesXTreeWidget"
        );
        var superCharListXTreeWidget = mywindow.findChild(
            "superCharListXTreeWidget"
        );

        var descriptionXTextEdit = mywindow.findChild("descriptionXTextEdit");
        var listQueryXTextEdit = mywindow.findChild("listQueryXTextEdit");

        var displayNameXLineEdit = mywindow.findChild("displayNameXLineEdit");
        var internalNameXLineEdit = mywindow.findChild("internalNameXLineEdit");

        var isSearchableXCheckBox = mywindow.findChild("isSearchableXCheckBox");
        var isSystemLockedXCheckBox = mywindow.findChild(
            "isSystemLockedXCheckBox"
        );
        var isDisplayOnlyXCheckBox = mywindow.findChild(
            "isDisplayOnlyXCheckBox"
        );
        var isVirtualXCheckBox = mywindow.findChild("isVirtualXCheckBox");

        var superCharDataTypeXComboBox = mywindow.findChild(
            "superCharDataTypeXComboBox"
        );

        var condValAddPushButton = mywindow.findChild("condValAddPushButton");
        var condValEditPushButton = mywindow.findChild("condValEditPushButton");
        var condValDeletePushButton = mywindow.findChild(
            "condValDeletePushButton"
        );
        var listOfValuesAddPushButton = mywindow.findChild(
            "listOfValuesAddPushButton"
        );
        var listOfValuesDeletePushButton = mywindow.findChild(
            "listOfValuesDeletePushButton"
        );
        var listOfValuesMoveDownPushButton = mywindow.findChild(
            "listOfValuesMoveDownPushButton"
        );
        var listOfValuesMoveUpPushButton = mywindow.findChild(
            "listOfValuesMoveUpPushButton"
        );
        var superCharAddPushButton = mywindow.findChild(
            "superCharAddPushButton"
        );
        var superCharDeletePushButton = mywindow.findChild(
            "superCharDeletePushButton"
        );
        var superCharSavePushButton = mywindow.findChild(
            "superCharSavePushButton"
        );

        var descriptionXLabel = mywindow.findChild("descriptionXLabel");
        var displayNameXLabel = mywindow.findChild("displayNameXLabel");
        var internalNameXLabel = mywindow.findChild("internalNameXLabel");
        var isSearchableXLabel = mywindow.findChild("isSearchableXLabel");
        var isDisplayOnlyXLabel = mywindow.findChild("isDisplayOnlyXLabel");
        var isVirtualXLabel = mywindow.findChild("isVirtualXLabel");
        var isSystemLockedXLabel = mywindow.findChild("isSystemLockedXLabel");
        var listQueryXLabel = mywindow.findChild("listQueryXLabel");
        var managingPackageValueXLabel = mywindow.findChild(
            "managingPackageValueXLabel"
        );
        var managingPackageXLabel = mywindow.findChild("managingPackageXLabel");
        var superCharDataTypeXLabel = mywindow.findChild(
            "superCharDataTypeXLabel"
        );

        var condValButtonsHBoxLayout = mywindow.findChild(
            "condValButtonsHBoxLayout"
        );
        var condValHBoxLayout = mywindow.findChild("condValHBoxLayout");
        var listOfValuesButtonHBoxLayout = mywindow.findChild(
            "listOfValuesButtonHBoxLayout"
        );
        var mainHBoxLayout = mywindow.findChild("mainHBoxLayout");

        var superCharButtonsVBoxLayout = mywindow.findChild(
            "superCharButtonsVBoxLayout"
        );
        var superCharDetailsVBoxLayout = mywindow.findChild(
            "superCharDetailsVBoxLayout"
        );
        var superCharListAndGroupListVBoxLayout = mywindow.findChild(
            "superCharListAndGroupListVBoxLayout"
        );

        var superCharSystemValuesLeftFormLayout = mywindow.findChild(
            "superCharSystemValuesLeftFormLayout"
        );
        var superCharSystemValuesRightFormLayout = mywindow.findChild(
            "superCharSystemValuesRightFormLayout"
        );
        var superCharValuesLeftFormLayout = mywindow.findChild(
            "superCharValuesLeftFormLayout"
        );

        var condValButtonsLeftSpacer = mywindow.findChild(
            "condValButtonsLeftSpacer"
        );
        var condValButtonsRightSpacer = mywindow.findChild(
            "condValButtonsRightSpacer"
        );
        var listOfValuesButtonsCenterSpacer = mywindow.findChild(
            "listOfValuesButtonsCenterSpacer"
        );
        var listOfValuesButtonsLeftSpacer = mywindow.findChild(
            "listOfValuesButtonsLeftSpacer"
        );
        var listOfValuesButtonsRightSpacer = mywindow.findChild(
            "listOfValuesButtonsRightSpacer"
        );
        var superCharButtonsBottomSpacer = mywindow.findChild(
            "superCharButtonsBottomSpacer"
        );
        var superCharButtonsTopSpacer = mywindow.findChild(
            "superCharButtonsTopSpacer"
        );

        //--------------------------------------------------------------------
        //  Custom Screen Objects and Starting GUI Manipulation
        //--------------------------------------------------------------------
        superCharListXTreeWidget.addColumn(
            "SuperChar ID",
            45,
            Qt.AlignCenter,
            false,
            "scdef_id"
        );
        superCharListXTreeWidget.addColumn(
            "SuperChar Internal Name",
            150,
            Qt.AlignCenter,
            false,
            "scdef_internal_name"
        );
        superCharListXTreeWidget.addColumn(
            "SuperChar",
            150,
            Qt.AlignCenter,
            true,
            "scdef_display_name"
        );
        superCharListXTreeWidget.addColumn(
            "Type ID",
            45,
            Qt.AlignCenter,
            false,
            "scdef_datatype_id"
        );
        superCharListXTreeWidget.addColumn(
            "Type Interal Name",
            150,
            Qt.AlignCenter,
            false,
            "scdef_datatype_internal_name"
        );
        superCharListXTreeWidget.addColumn(
            "Type",
            150,
            Qt.AlignCenter,
            true,
            "scdef_datatype_display_name"
        );
        superCharListXTreeWidget.addColumn(
            "Description",
            300,
            Qt.AlignLeft,
            true,
            "scdef_description"
        );
        superCharListXTreeWidget.addColumn(
            "Sys. Locked?",
            25,
            Qt.AlignCenter,
            false,
            "scdef_is_system_locked"
        );
        superCharListXTreeWidget.addColumn(
            "LOV",
            150,
            Qt.AlignLeft,
            false,
            "scdef_values_list"
        );
        superCharListXTreeWidget.addColumn(
            "Package Name",
            150,
            Qt.AlignCenter,
            false,
            "scdef_package_name"
        );

        assignedGroupsListXTreeWidget.addColumn(
            "Group ID",
            45,
            Qt.AlignCenter,
            false,
            "scgrp_id"
        );
        assignedGroupsListXTreeWidget.addColumn(
            "Group Internal Name",
            150,
            Qt.AlignCenter,
            false,
            "scgrp_internal_name"
        );
        assignedGroupsListXTreeWidget.addColumn(
            "Group",
            150,
            Qt.AlignCenter,
            true,
            "scgrp_display_name"
        );
        assignedGroupsListXTreeWidget.addColumn(
            "Group Entities",
            300,
            Qt.AlignCenter,
            true,
            "scgrp_entity_display_names"
        );

        listOfValuesXTreeWidget.addColumn(
            "Sort Order",
            45,
            Qt.AlignRight,
            false,
            "sort_order"
        );
        listOfValuesXTreeWidget.addColumn(
            "Value Text",
            150,
            Qt.AlignCenter,
            true,
            "value_text"
        );

        condValXTreeWidget.addColumn(
            "Rule ID",
            45,
            Qt.AlignCenter,
            false,
            "condvalrule_id"
        );
        condValXTreeWidget.addColumn(
            "If SC ID",
            45,
            Qt.AlignCenter,
            false,
            "condvalrule_object_scdef_id"
        );
        condValXTreeWidget.addColumn(
            "If SuperChar",
            150,
            Qt.AlignCenter,
            false,
            "condvalrule_object_scdef_display_name"
        );
        condValXTreeWidget.addColumn(
            "Then SC ID",
            45,
            Qt.AlignCenter,
            false,
            "condvalrule_subject_scdef_id"
        );
        condValXTreeWidget.addColumn(
            "Then SuperChar",
            150,
            Qt.AlignCenter,
            false,
            "condvalrule_subject_scdef_display_name"
        );
        condValXTreeWidget.addColumn(
            "If Val Type",
            100,
            Qt.AlignCenter,
            false,
            "condvalrule_if_valtype_display_name"
        );
        condValXTreeWidget.addColumn(
            "Then Val Type",
            100,
            Qt.AlignCenter,
            false,
            "condvalrule_then_valtype_display_name"
        );
        condValXTreeWidget.addColumn(
            "Validator Description",
            500,
            Qt.AlignLeft,
            true,
            "validator_description"
        );
        condValXTreeWidget.addColumn(
            "User Failure Message",
            500,
            Qt.AlignLeft,
            true,
            "condvalrule_fails_message_text"
        );

        superCharDataTypeXComboBox.allowNull = true;
        superCharDataTypeXComboBox.nullStr = "-- Select Type --";
        superCharDataTypeXComboBox.populate(
            "SELECT   datatype_id " +
                ",datatype_display_name " +
                ",datatype_internal_name " +
                "FROM musesuperchar.datatype " +
                "WHERE datatype_is_active " +
                "AND datatype_is_user_visible " +
                "ORDER BY datatype_display_order"
        );
        //--------------------------------------------------------------------
        //  Private Functional Logic
        //--------------------------------------------------------------------
        var clear = function() {
            superCharListXTreeWidget.clear();
            assignedGroupsListXTreeWidget.clear();
            listOfValuesXTreeWidget.clear();
            condValXTreeWidget.clear();
            internalNameXLineEdit.text = "";
            displayNameXLineEdit.text = "";
            managingPackageValueXLabel.text = "";
            descriptionXTextEdit.setPlainText("");
            listQueryXTextEdit.setPlainText("");
            isSearchableXCheckBox.checked = false;
            isSystemLockedXCheckBox.checked = false;
            isDisplayOnlyXCheckBox.checked = false;
            isVirtualXCheckBox.checked = false;
            superCharDataTypeXComboBox.setId(-1);

            currSc = {
                scdef_id: null,
                scdef_internal_name: null,
                scdef_display_name: null,
                scdef_description: null,
                scdef_pkghead_id: null,
                scdef_is_system_locked: null,
                scdef_datatype_id: null,
                scdef_datatype_display_name: null,
                scdef_datatype_internal_name: null,
                scdefdatatype_is_text: null,
                scdefdatatype_is_numeric: null,
                scdefdatatype_is_date: null,
                scdefdatatype_is_flag: null,
                scdefdatatype_is_array: null,
                scdefdatatype_is_lov_based: null,
                scdef_values_list: null,
                scdef_list_query: null,
                scdef_is_searchable: null,
                scdef_is_display_only: null,
                scdef_is_virtual: null,
                scdef_package_name: null
            };
        };

        var isScDataEdited = function() {
            return (
                descriptionXTextEdit.document.toPlainText() !=
                    currSc.scdef_description ||
                displayNameXLineEdit.text != currSc.scdef_display_name ||
                internalNameXLineEdit.text != currSc.scdef_internal_name ||
                isSearchableXCheckBox.checked != currSc.scdef_is_searchable ||
                isSystemLockedXCheckBox.checked !=
                    currSc.scdef_is_system_locked ||
                listQueryXTextEdit.document.toPlainText() !=
                    currSc.scdef_list_query ||
                superCharDataTypeXComboBox.id() != currSc.scdef_datatype_id ||
                isDisplayOnlyXCheckBox.checked !=
                    currSc.scdef_is_display_only ||
                isVirtualXCheckBox.checked != currSc.scdef_is_virtual
            );
        };

        var isScDataValid = function() {
            return (
                MuseUtils.coalesce(
                    descriptionXTextEdit.document.toPlainText(),
                    ""
                ) !== "" &&
                MuseUtils.coalesce(displayNameXLineEdit.text, "") !== "" &&
                MuseUtils.coalesce(internalNameXLineEdit.text, "") !== "" &&
                MuseUtils.isValidId(superCharDataTypeXComboBox.id())
            );
        };

        var setCurrSc = function(pSuperCharId) {
            currSc = MuseSuperChar.SuperChar.getSuperCharById(pSuperCharId);

            if (MuseUtils.coalesce(currSc.scdef_values_list, "") !== "") {
                currSc.scdef_values_list = currSc.scdef_values_list.split(",");
            } else {
                currSc.scdef_values_list = [];
            }
        };

        var setListOfValuesButtons = function() {
            if (!MuseUtils.isValidId(currSc.scdef_id)) {
                listOfValuesAddPushButton.enabled = false;
                listOfValuesDeletePushButton.enabled = false;
                listOfValuesMoveDownPushButton.enabled = false;
                listOfValuesMoveUpPushButton.enabled = false;
            } else if (!MuseUtils.isValidId(listOfValuesXTreeWidget.id())) {
                listOfValuesAddPushButton.enabled =
                    true &&
                    (!currSc.scdef_is_system_locked ||
                        privileges.check(
                            "maintainSuperCharSysLockRecsManually"
                        ));
                listOfValuesDeletePushButton.enabled = false;
                listOfValuesMoveDownPushButton.enabled = false;
                listOfValuesMoveUpPushButton.enabled = false;
            } else {
                listOfValuesAddPushButton.enabled =
                    true &&
                    (!currSc.scdef_is_system_locked ||
                        privileges.check(
                            "maintainSuperCharSysLockRecsManually"
                        ));
                listOfValuesDeletePushButton.enabled =
                    true &&
                    (!currSc.scdef_is_system_locked ||
                        privileges.check(
                            "maintainSuperCharSysLockRecsManually"
                        ));

                if (listOfValuesXTreeWidget.id() == 1) {
                    listOfValuesMoveDownPushButton.enabled = true;
                    listOfValuesMoveUpPushButton.enabled = false;
                } else if (
                    listOfValuesXTreeWidget.id() ==
                    currSc.scdef_values_list.length
                ) {
                    listOfValuesMoveDownPushButton.enabled = false;
                    listOfValuesMoveUpPushButton.enabled = true;
                } else listOfValuesMoveDownPushButton.enabled = true;
                listOfValuesMoveUpPushButton.enabled = true;
            }
        };

        var setCondValButtons = function() {
            if (!MuseUtils.isValidId(currSc.scdef_id)) {
                condValAddPushButton.enabled = false;
                condValEditPushButton.enabled = false;
                condValDeletePushButton.enabled = false;
            } else if (!MuseUtils.isValidId(condValXTreeWidget.id())) {
                condValAddPushButton.enabled = true;
                condValEditPushButton.enabled = false;
                condValDeletePushButton.enabled = false;
            } else {
                var isCondValEditQualified =
                    !MuseSuperChar.CondValRule.isValidatorSystemLocked(
                        condValXTreeWidget.id()
                    ) ||
                    privileges.check("maintainSuperCharSysLockRecsManually");

                condValAddPushButton.enabled = true;
                condValEditPushButton.enabled = true && isCondValEditQualified;
                condValDeletePushButton.enabled =
                    true && isCondValEditQualified;
            }
        };

        var populateCondValRules = function() {
            if (!MuseUtils.isValidId(currSc.scdef_id)) {
                return;
            }

            condValXTreeWidget.populate(
                MuseSuperChar.CondValRule.getValidators({
                    condvalrule_subject_scdef_id: currSc.scdef_id
                })
            );
            setCondValButtons();
        };

        var setSelectState = function() {
            clear();

            // Disable pretty much everything except the new button.
            assignedGroupsListGroupBox.enabled = false;
            assignedGroupsListGroupBox.title = "(N/A) Assigned Groups";

            condValGroupBox.enabled = false;
            condValGroupBox.title = "(N/A) Conditional Validation";

            superCharListGroupBox.enabled = true;

            superCharSystemValuesGroupBox.enabled = false;
            superCharSystemValuesGroupBox.title = "(N/A) System Values";

            superCharValuesGroupBox.enabled = false;
            superCharValuesGroupBox.title = "(N/A) Definition";

            superCharValuesRightGroupBox.enabled = false;

            superCharAddPushButton.enabled =
                true && privileges.check("maintainSuperCharateristics");
            superCharDeletePushButton.text = "Delete";
            superCharDeletePushButton.enabled = false;
            superCharSavePushButton.enabled = false;

            // Populate the SuperChar List
            superCharListXTreeWidget.populate(
                MuseSuperChar.SuperChar.getSuperChars()
            );
        };

        var setPopulatedState = function(pSuperCharId) {
            setCurrSc(pSuperCharId);

            superCharListXTreeWidget.populate(
                MuseSuperChar.SuperChar.getSuperChars()
            );
            superCharListXTreeWidget.setId(currSc.scdef_id);

            var isEditQualified =
                !MuseUtils.isTrue(currSc.scdef_is_system_locked) ||
                privileges.check("maintainSuperCharSysLockRecsManually");

            // Enable the GroupBoxes as appropriate
            assignedGroupsListGroupBox.enabled = true;
            condValGroupBox.enabled = true;
            superCharValuesGroupBox.enabled = true && isEditQualified;
            superCharValuesRightGroupBox.enabled = true;

            superCharSystemValuesGroupBox.enabled =
                privileges.check("maintainSuperCharListQuery") ||
                privileges.check("maintainSuperCharSysLockRecsManually");
            isSystemLockedXCheckBox.enabled =
                true &&
                privileges.check("maintainSuperCharSysLockRecsManually");
            internalNameXLineEdit.enabled = false;
            internalNameXLineEdit.text = currSc.scdef_internal_name;

            assignedGroupsListGroupBox.title =
                currSc.scdef_display_name + " Assigned Groups";
            condValGroupBox.title =
                currSc.scdef_display_name + " Conditional Validation";
            superCharSystemValuesGroupBox.title =
                currSc.scdef_display_name + " System Values";
            superCharValuesGroupBox.title =
                currSc.scdef_display_name + " Definition";

            listOfValuesXTreeWidget.clear();
            if (MuseUtils.isTrue(currSc.scdefdatatype_is_lov_based)) {
                listQueryXTextEdit.setPlainText(currSc.scdef_list_query);
                superCharValuesRightGroupBox.enabled = true;
                listQueryXTextEdit.enabled =
                    true && privileges.check("maintainSuperCharListQuery");
                for (var i = 0; i < currSc.scdef_values_list.length; i++) {
                    new XTreeWidgetItem(
                        listOfValuesXTreeWidget,
                        i + 1,
                        -1,
                        i + 1,
                        currSc.scdef_values_list[i]
                    );
                }
            } else {
                superCharValuesRightGroupBox.enabled = false;
                listQueryXTextEdit.enabled = false;
                listQueryXTextEdit.clear();
            }

            isDisplayOnlyXCheckBox.enabled = false;
            isDisplayOnlyXCheckBox.checked = currSc.scdef_is_display_only;
            isVirtualXCheckBox.enabled = false;
            isVirtualXCheckBox.checked = currSc.scdef_is_virtual;

            superCharDataTypeXComboBox.enabled = false;
            superCharDataTypeXComboBox.setId(currSc.scdef_datatype_id);

            displayNameXLineEdit.enabled = true;
            displayNameXLineEdit.text = currSc.scdef_display_name;

            managingPackageValueXLabel.text = currSc.scdef_package_name;

            descriptionXTextEdit.enabled = true;
            descriptionXTextEdit.setPlainText(currSc.scdef_description);

            assignedGroupsListXTreeWidget.populate(
                MuseSuperChar.SuperChar.getSuperCharGroups(pSuperCharId)
            );

            superCharAddPushButton.enabled = true;
            superCharDeletePushButton.enabled = true && isEditQualified;
            superCharDeletePushButton.text = "Delete";
            superCharSavePushButton.enabled = false;

            populateCondValRules();
            setListOfValuesButtons();
            setCondValButtons();
        };

        var setEditedState = function() {
            // If we creating a new SuperChar, we default the internal name to be a
            // deriviative of the display name.  We infer that we're creating a new
            // SuperChar as the currSc will contain all null values.
            if (
                internalNameXLineEdit.enabled &&
                MuseUtils.coalesce(displayNameXLineEdit.text, "") !== "" &&
                !MuseUtils.isValidId(currSc.scdef_id) &&
                displayNameXLineEdit.text !=
                    MuseUtils.coalesce(currSc.scdef_display_name, "")
            ) {
                internalNameXLineEdit.text = MuseSuperChar.SuperChar.getDefaultScInternalName(
                    displayNameXLineEdit.text
                );
            }

            superCharSavePushButton.enabled =
                isScDataEdited() && isScDataValid();

            if (!isScDataEdited() && !MuseUtils.isValidId(currSc.scdef_id)) {
                superCharDeletePushButton.text = "Cancel";
            } else if (isScDataEdited()) {
                superCharDeletePushButton.text = "Cancel";
            }
        };

        var setNewState = function() {
            clear();
            // Enable the GroupBoxes as appropriate
            assignedGroupsListGroupBox.enabled = false;
            condValGroupBox.enabled = false;
            superCharValuesGroupBox.enabled = true;
            superCharValuesRightGroupBox.enabled = false;

            superCharSystemValuesGroupBox.enabled = true;
            isSystemLockedXCheckBox.enabled = false;
            internalNameXLineEdit.enabled = true;
            isDisplayOnlyXCheckBox.enabled = true;
            isVirtualXCheckBox.enabled = true;
            assignedGroupsListGroupBox.title = "(N/A) Assigned Groups";
            condValGroupBox.title = "(N/A) Conditional Validation";
            superCharSystemValuesGroupBox.title =
                "New Super Characeristic System Values";
            superCharValuesGroupBox.title =
                "New Super Characteristic Definition";

            superCharValuesRightGroupBox.enabled = false;
            listQueryXTextEdit.enabled = false;

            superCharDataTypeXComboBox.enabled = true;
            superCharDataTypeXComboBox.setId(-1);

            displayNameXLineEdit.enabled = true;

            descriptionXTextEdit.enabled = true;

            superCharAddPushButton.enabled = false;
            superCharSavePushButton.enabled = false;
            superCharDeletePushButton.enabled = true;
            superCharDeletePushButton.text = "Cancel";

            setListOfValuesButtons();
            setCondValButtons();
        };

        var superCharSelected = function() {
            var currentItem = superCharListXTreeWidget.currentItem();

            if (
                MuseUtils.realNull(currentItem) !== null &&
                MuseUtils.isValidId(currentItem.id())
            ) {
                setPopulatedState(currentItem.id());
            }
        };

        var deleteSuperChar = function(pSuperCharId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharId: pSuperCharId
            };

            try {
                var violations = MuseSuperChar.SuperChar.getSuperCharDeleteViolations(
                    pSuperCharId
                );

                if (violations.violation_count === 0) {
                    MuseSuperChar.SuperChar.deleteSuperChar(pSuperCharId);
                    setSelectState();
                } else {
                    var violationDialog = MuseSuperChar.Widget.MSSCViolationsDialog(
                        violations,
                        mywindow
                    );
                    violationDialog.exec();
                    setPopulatedState(pSuperCharId);
                }
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to delete a Super Characteristic.",
                    "MuseSuperChar.SuperCharMaint.deleteSuperChar",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var saveSuperChar = function() {
            if (!isScDataValid()) {
                return;
            }

            var scData;

            if (!MuseUtils.isValidId(currSc.scdef_id)) {
                scData = {
                    scdef_internal_name: internalNameXLineEdit.text,
                    scdef_display_name: displayNameXLineEdit.text,
                    scdef_description: descriptionXTextEdit.document.toPlainText(),
                    scdef_datatype_id: superCharDataTypeXComboBox.id(),
                    scdef_is_searchable: isSearchableXCheckBox.checked,
                    scdef_is_display_only: isDisplayOnlyXCheckBox.checked,
                    scdef_is_virtual: isVirtualXCheckBox.checked
                };

                var newScId = MuseSuperChar.SuperChar.createSuperChar(scData);

                setPopulatedState(newScId);
            } else {
                scData = { scdef_id: currSc.scdef_id };

                if (internalNameXLineEdit.text != currSc.scdef_internal_name) {
                    scData.scdef_internal_name = internalNameXLineEdit.text;
                }

                if (displayNameXLineEdit.text != currSc.scdef_display_name) {
                    scData.scdef_display_name = displayNameXLineEdit.text;
                }

                if (
                    descriptionXTextEdit.document.toPlainText() !=
                    currSc.scdef_description
                ) {
                    scData.scdef_description = descriptionXTextEdit.document.toPlainText();
                }

                if (
                    listQueryXTextEdit.document.toPlainText() !=
                    currSc.scdef_list_query
                ) {
                    scData.scdef_list_query = listQueryXTextEdit.document.toPlainText();
                }

                if (
                    isSearchableXCheckBox.checked != currSc.scdef_is_searchable
                ) {
                    scData.scdef_is_searchable = isSearchableXCheckBox.checked;
                }

                if (
                    isDisplayOnlyXCheckBox.checked !=
                    currSc.scdef_is_display_only
                ) {
                    scData.scdef_is_display_only =
                        isDisplayOnlyXCheckBox.checked;
                }

                if (isVirtualXCheckBox.checked != currSc.scdef_is_virtual) {
                    scData.scdef_is_virtual = isVirtualXCheckBox.checked;
                }

                var updatedScId = MuseSuperChar.SuperChar.updateSuperChar(
                    scData
                );

                setPopulatedState(updatedScId);
            }
        };

        var addLov = function() {
            // Get the new LOV window and the objects we care about.
            var dialogBox = toolbox.loadUi("museScNewListValue", mywindow);

            var valueXLineEdit = dialogBox.findChild("valueXLineEdit");
            var dialogButtonBox = dialogBox.findChild("dialogButtonBox");
            var okPushButton = dialogButtonBox.button(QDialogButtonBox.Ok);
            var cancelPushButton = dialogButtonBox.button(
                QDialogButtonBox.Cancel
            );

            okPushButton.clicked.connect(function() {
                var newLovList = currSc.scdef_values_list.slice();

                if (MuseUtils.coalesce(valueXLineEdit.text, "") === "") {
                    dialogBox.reject();
                    return;
                }

                newLovList.push(valueXLineEdit.text);

                var scId = MuseSuperChar.SuperChar.updateSuperChar({
                    scdef_id: currSc.scdef_id,
                    scdef_values_list: JSON.stringify(newLovList)
                });
                setPopulatedState(scId);
                dialogBox.accept();
            });

            cancelPushButton.clicked.connect(function() {
                dialogBox.reject();
            });

            dialogBox.exec();
        };

        var deleteLov = function() {
            if (MuseUtils.isValidId(listOfValuesXTreeWidget.id())) {
                var delLovIndex = listOfValuesXTreeWidget.id() - 1;
                var newLovList = currSc.scdef_values_list.slice();
                newLovList.splice(delLovIndex, 1);

                var scId = MuseSuperChar.SuperChar.updateSuperChar({
                    scdef_id: currSc.scdef_id,
                    scdef_values_list: JSON.stringify(newLovList)
                });

                setPopulatedState(scId);
            }

            return;
        };

        var moveLovValue = function(pMoveDirection) {
            if (MuseUtils.isValidId(listOfValuesXTreeWidget.id())) {
                var moveLovIndex = listOfValuesXTreeWidget.id() - 1;
                var movingValue = currSc.scdef_values_list[moveLovIndex];
                var newLovList = currSc.scdef_values_list.slice();
                newLovList.splice(moveLovIndex, 1);
                newLovList.splice(
                    moveLovIndex + pMoveDirection,
                    0,
                    movingValue
                );

                var scId = MuseSuperChar.SuperChar.updateSuperChar({
                    scdef_id: currSc.scdef_id,
                    scdef_values_list: JSON.stringify(newLovList)
                });

                setPopulatedState(scId);
            }

            return;
        };

        var valRuleDialog = function(pMode) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pMode: pMode
            };

            var dialogBox;

            try {
                dialogBox = toolbox.openWindow(
                    "museScCreateCondValRule",
                    mywindow,
                    Qt.WindowModal
                );
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to display and process the new conditional validation rule form.",
                    "MuseSuperChar.SuperCharMaint.addValRule",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }

            if (pMode == "new") {
                if (MuseUtils.isValidId(currSc.scdef_id)) {
                    toolbox.lastWindow().set({
                        subject_scdef_id: currSc.scdef_id,
                        mode: "new"
                    });
                } else {
                    toolbox.lastWindow().set({ mode: "new" });
                }
            } else if (pMode == "edit") {
                var editValRuleId = condValXTreeWidget.id();
                if (MuseUtils.isValidId(editValRuleId)) {
                    toolbox.lastWindow().set({
                        condvalrule_id: editValRuleId,
                        mode: "edit"
                    });
                } else {
                    throw new MuseUtils.ApiException(
                        "musesuperchar",
                        "We could not tell which Conditional Validation Rule you wished to edit.",
                        "MuseSuperChar.SuperCharMaint.valRuleDialog",
                        { params: funcParams },
                        MuseUtils.LOG_WARNING
                    );
                }
            } else if (pMode == "view") {
                var viewValRuleId = condValXTreeWidget.id();
                if (MuseUtils.isValidId(viewValRuleId)) {
                    toolbox.lastWindow().set({
                        convalrule_id: viewValRuleId,
                        mode: "view"
                    });
                } else {
                    throw new MuseUtils.ApiException(
                        "musesuperchar",
                        "We could not tell which Conditional Validation Rule you wished to view.",
                        "MuseSuperChar.SuperCharMaint.valRuleDialog",
                        { params: funcParams },
                        MuseUtils.LOG_WARNING
                    );
                }
            } else {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We did not understand in which mode we should open the Conditional Validation Rule dialog box.",
                    "MuseSuperChar.SuperCharMaint.valRuleDialog",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            dialogBox.exec();
        };

        var addValRule = function() {
            valRuleDialog("new");
            populateCondValRules();
        };

        var editValRule = function() {
            valRuleDialog("edit");
            populateCondValRules();
        };

        var deleteValRule = function() {
            var condValRuleId = condValXTreeWidget.id();
            if (!MuseUtils.isValidId(condValRuleId)) {
                return;
            }

            try {
                MuseSuperChar.CondValRule.deleteValidator(condValRuleId);
                populateCondValRules();
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We received an error response trying to delete Conditional Validation Rule.",
                    "MuseSuperChar.SuperCharMaint.deleteValRule",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        //--------------------------------------------------------------------
        //  Public Interface -- Slots
        //--------------------------------------------------------------------
        pPublicApi.sSuperCharSelected = function(pSuperCharItem, pColumnId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharItem: pSuperCharItem,
                pColumnId: pColumnId
            };

            try {
                superCharSelected();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to the selection of a Super Characteristic.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sSuperCharSelected",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sLovValueSelected = function(pLovValueId, pColumnId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pLovValueId: pLovValueId,
                pColumnId: pColumnId
            };

            try {
                setListOfValuesButtons();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to the selection of a list of values item.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sLovValueSelected",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sAddSc = function() {
            try {
                setNewState();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a request to add a Super Characteristic.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sAddSc",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sCancelSc = function() {
            try {
                if (
                    MuseUtils.isValidId(currSc.scdef_id) &&
                    superCharDeletePushButton.text == "Cancel"
                ) {
                    setPopulatedState(currSc.scdef_id);
                } else if (
                    MuseUtils.isValidId(currSc.scdef_id) &&
                    superCharDeletePushButton.text == "Delete"
                ) {
                    deleteSuperChar(currSc.scdef_id);
                    setSelectState();
                } else {
                    setSelectState();
                }
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to the cancel or deletion of a Super Characteristic.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sCancelSc",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sFieldsUpdated = function() {
            try {
                setEditedState();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a field update action.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sFieldsUpdated",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sSaveSc = function() {
            try {
                saveSuperChar();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a request to save a Super Characteristic.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sSaveSc",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sAddLov = function() {
            try {
                addLov();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a request to add a list of values item.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sAddLov",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sDeleteLov = function() {
            try {
                deleteLov();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a request to delete a list of values item.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sDeleteLov",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sMoveDownLovValue = function() {
            try {
                moveLovValue(DOWN);
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a request to move the current list of values item down in the sort order.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sMoveDownLovValue",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sMoveUpLovValue = function() {
            try {
                moveLovValue(UP);
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a request to move the current list of values item up in the sort order.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sMoveUpLovValue",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sAddValRule = function() {
            try {
                addValRule();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a request to add a validation rule.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sAddValRule",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sEditValRule = function() {
            try {
                editValRule();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to edit a validation rule.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sEditValRule",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sDeleteValRule = function() {
            try {
                deleteValRule();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to delete a vaidation rule.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sDeleteValRule",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sCondValRuleSelected = function() {
            try {
                setCondValButtons();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to the selection of a validation rule item.",
                    "MuseSuperChar.SuperCharMaint.pPublicApi.sCondValRuleSelected",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };
        //--------------------------------------------------------------------
        //  Public Interface -- Functions
        //--------------------------------------------------------------------

        //--------------------------------------------------------------------
        //  Initialization Logic Setup
        //  Subforms are different from standard xTuple forms in that they do not
        //  call set and instead initialize on the constructor.  This should be OK
        //  since we should not need to depend on the outside world for anything.
        //--------------------------------------------------------------------
        setSelectState();

        //--------------------------------------------------------------------
        //  Definition Timed Connects/Disconnects
        //--------------------------------------------------------------------
        superCharListXTreeWidget["itemClicked(XTreeWidgetItem *, int)"].connect(
            pPublicApi.sSuperCharSelected
        );
        listOfValuesXTreeWidget["itemClicked(XTreeWidgetItem *, int)"].connect(
            pPublicApi.sLovValueSelected
        );
        condValXTreeWidget["itemClicked(XTreeWidgetItem *, int)"].connect(
            pPublicApi.sCondValRuleSelected
        );

        superCharAddPushButton.clicked.connect(pPublicApi.sAddSc);
        superCharSavePushButton.clicked.connect(pPublicApi.sSaveSc);
        superCharDeletePushButton.clicked.connect(pPublicApi.sCancelSc);

        listOfValuesAddPushButton.clicked.connect(pPublicApi.sAddLov);
        listOfValuesDeletePushButton.clicked.connect(pPublicApi.sDeleteLov);
        listOfValuesMoveDownPushButton.clicked.connect(
            pPublicApi.sMoveDownLovValue
        );
        listOfValuesMoveUpPushButton.clicked.connect(
            pPublicApi.sMoveUpLovValue
        );

        condValAddPushButton.clicked.connect(pPublicApi.sAddValRule);
        condValEditPushButton.clicked.connect(pPublicApi.sEditValRule);
        condValDeletePushButton.clicked.connect(pPublicApi.sDeleteValRule);

        descriptionXTextEdit["textChanged()"].connect(
            pPublicApi.sFieldsUpdated
        );
        listQueryXTextEdit["textChanged()"].connect(pPublicApi.sFieldsUpdated);
        displayNameXLineEdit["editingFinished()"].connect(
            pPublicApi.sFieldsUpdated
        );
        internalNameXLineEdit["editingFinished()"].connect(
            pPublicApi.sFieldsUpdated
        );
        isSearchableXCheckBox.clicked.connect(pPublicApi.sFieldsUpdated);
        isDisplayOnlyXCheckBox.clicked.connect(pPublicApi.sFieldsUpdated);
        isVirtualXCheckBox.clicked.connect(pPublicApi.sFieldsUpdated);
        isSystemLockedXCheckBox.clicked.connect(pPublicApi.sFieldsUpdated);
        superCharDataTypeXComboBox["newID(int)"].connect(
            pPublicApi.sFieldsUpdated
        );
    } catch (e) {
        var error = new MuseUtils.ModuleException(
            "musesuperchar",
            "We enountered a MuseSuperChar.SuperCharMaint module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.SuperCharMaint",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.SuperCharMaint, this);
