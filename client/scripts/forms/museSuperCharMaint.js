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

if(!this.MuseSuperChar.SuperChar) {
    include("museSuperCharData");
}

if(!this.MuseSuperChar.Widget) {
    include("museScWidget");
}

//////////////////////////////////////////////////////////////////////////
//  Module Defintion
//////////////////////////////////////////////////////////////////////////

(function(pPublicApi, pGlobal) {

    // A couple constants for reordering LOV values.  Just for
    // convenience/clarity.
    var UP = -1;
    var DOWN = 1;

    // Set up a variable to hold the selected superchar and use that the 
    // check whether or not the user has made an update over previous values.
    // In "new" state, we presume that the the values (particularly sc_def_id) 
    // are null and as such use that to infer the new vs update state. 
     
    var currSc;

    //--------------------------------------------------------------------
    //  Get Object References From Screen Definitions
    //--------------------------------------------------------------------
    var assignedGroupsListGroupBox = mywindow.findChild("assignedGroupsListGroupBox");
    var condValGroupBox = mywindow.findChild("condValGroupBox");
    var superCharListGroupBox = mywindow.findChild("superCharListGroupBox");
    var superCharSystemValuesGroupBox = mywindow.findChild("superCharSystemValuesGroupBox");
    var superCharValuesGroupBox = mywindow.findChild("superCharValuesGroupBox");
    var superCharValuesRightGroupBox = mywindow.findChild("superCharValuesRightGroupBox");
    
    var assignedGroupsListXTreeWidget = mywindow.findChild("assignedGroupsListXTreeWidget");
    var condValXTreeWidget = mywindow.findChild("condValXTreeWidget");
    var listOfValuesXTreeWidget = mywindow.findChild("listOfValuesXTreeWidget");
    var superCharListXTreeWidget = mywindow.findChild("superCharListXTreeWidget");
    
    var descriptionXTextEdit = mywindow.findChild("descriptionXTextEdit");
    var listQueryXTextEdit = mywindow.findChild("listQueryXTextEdit");
    
    var displayNameXLineEdit = mywindow.findChild("displayNameXLineEdit");
    var internalNameXLineEdit = mywindow.findChild("internalNameXLineEdit");
    
    var isSearchableXCheckBox = mywindow.findChild("isSearchableXCheckBox");
    var isSystemLockedXCheckBox = mywindow.findChild("isSystemLockedXCheckBox");
    
    var superCharDataTypeXComboBox = mywindow.findChild("superCharDataTypeXComboBox");
    
    var condValAddPushButton = mywindow.findChild("condValAddPushButton");
    var condValEditPushButton = mywindow.findChild("condValEditPushButton");
    var condValDeletePushButton = mywindow.findChild("condValDeletePushButton");
    var listOfValuesAddPushButton = mywindow.findChild("listOfValuesAddPushButton");
    var listOfValuesDeletePushButton = mywindow.findChild("listOfValuesDeletePushButton");
    var listOfValuesMoveDownPushButton = mywindow.findChild("listOfValuesMoveDownPushButton");
    var listOfValuesMoveUpPushButton = mywindow.findChild("listOfValuesMoveUpPushButton");
    var superCharAddPushButton = mywindow.findChild("superCharAddPushButton");
    var superCharDeletePushButton = mywindow.findChild("superCharDeletePushButton");
    var superCharSavePushButton = mywindow.findChild("superCharSavePushButton");
    
    var descriptionXLabel = mywindow.findChild("descriptionXLabel");
    var displayNameXLabel = mywindow.findChild("displayNameXLabel");
    var internalNameXLabel = mywindow.findChild("internalNameXLabel");
    var isSearchableXLabel = mywindow.findChild("isSearchableXLabel");
    var isSystemLockedXLabel = mywindow.findChild("isSystemLockedXLabel");
    var listQueryXLabel = mywindow.findChild("listQueryXLabel");
    var managingPackageValueXLabel = mywindow.findChild("managingPackageValueXLabel");
    var managingPackageXLabel = mywindow.findChild("managingPackageXLabel");
    var superCharDataTypeXLabel = mywindow.findChild("superCharDataTypeXLabel");
    
    var condValButtonsHBoxLayout = mywindow.findChild("condValButtonsHBoxLayout");
    var condValHBoxLayout = mywindow.findChild("condValHBoxLayout");
    var listOfValuesButtonHBoxLayout = mywindow.findChild("listOfValuesButtonHBoxLayout");
    var mainHBoxLayout = mywindow.findChild("mainHBoxLayout");
    
    var superCharButtonsVBoxLayout = mywindow.findChild("superCharButtonsVBoxLayout");
    var superCharDetailsVBoxLayout = mywindow.findChild("superCharDetailsVBoxLayout");
    var superCharListAndGroupListVBoxLayout = mywindow.findChild("superCharListAndGroupListVBoxLayout");
    
    var superCharSystemValuesLeftFormLayout = mywindow.findChild("superCharSystemValuesLeftFormLayout");
    var superCharSystemValuesRightFormLayout = mywindow.findChild("superCharSystemValuesRightFormLayout");
    var superCharValuesLeftFormLayout = mywindow.findChild("superCharValuesLeftFormLayout");
    
    var condValButtonsLeftSpacer = mywindow.findChild("condValButtonsLeftSpacer");
    var condValButtonsRightSpacer = mywindow.findChild("condValButtonsRightSpacer");
    var listOfValuesButtonsCenterSpacer = mywindow.findChild("listOfValuesButtonsCenterSpacer");
    var listOfValuesButtonsLeftSpacer = mywindow.findChild("listOfValuesButtonsLeftSpacer");
    var listOfValuesButtonsRightSpacer = mywindow.findChild("listOfValuesButtonsRightSpacer");
    var superCharButtonsBottomSpacer = mywindow.findChild("superCharButtonsBottomSpacer");
    var superCharButtonsTopSpacer = mywindow.findChild("superCharButtonsTopSpacer");
    
    //--------------------------------------------------------------------
    //  Custom Screen Objects and Starting GUI Manipulation
    //--------------------------------------------------------------------
    superCharListXTreeWidget.addColumn("SuperChar ID", 45, Qt.AlignCenter, false, "sc_def_id");
    superCharListXTreeWidget.addColumn("SuperChar Internal Name", 150, Qt.AlignCenter, false, "sc_def_internal_name");
    superCharListXTreeWidget.addColumn("SuperChar", 150, Qt.AlignCenter, true, "sc_def_display_name");
    superCharListXTreeWidget.addColumn("Type ID", 45, Qt.AlignCenter, false, "sc_def_data_type_id");
    superCharListXTreeWidget.addColumn("Type Interal Name", 150, Qt.AlignCenter, false, "sc_def_data_type_internal_name");
    superCharListXTreeWidget.addColumn("Type", 150, Qt.AlignCenter, true, "sc_def_data_type_display_name");
    superCharListXTreeWidget.addColumn("Description", 300, Qt.AlignLeft, true, "sc_def_description");
    superCharListXTreeWidget.addColumn("Sys. Locked?", 25, Qt.AlignCenter, false, "sc_def_is_system_locked");
    superCharListXTreeWidget.addColumn("LOV", 150, Qt.AlignLeft, false, "sc_def_values_list");
    superCharListXTreeWidget.addColumn("Package Name", 150, Qt.AlignCenter, false, "sc_def_package_name");

    assignedGroupsListXTreeWidget.addColumn("Group ID", 45, Qt.AlignCenter, false, "sc_group_id");
    assignedGroupsListXTreeWidget.addColumn("Group Internal Name", 150, Qt.AlignCenter, false, "sc_group_internal_name");
    assignedGroupsListXTreeWidget.addColumn("Group", 150, Qt.AlignCenter, true, "sc_group_display_name");
    assignedGroupsListXTreeWidget.addColumn("Group Entities", 300, Qt.AlignCenter, true, "sc_group_entity_display_names");

    listOfValuesXTreeWidget.addColumn("Sort Order",45, Qt.AlignRight, false, "sort_order");
    listOfValuesXTreeWidget.addColumn("Value Text", 150, Qt.AlignCenter, true, "value_text");

    superCharDataTypeXComboBox.allowNull = true;
    superCharDataTypeXComboBox.nullStr = "-- Select Type --";
    superCharDataTypeXComboBox.populate(
        "SELECT   data_type_id " +
                ",data_type_display_name " +
                ",data_type_internal_name " +
        "FROM musesuperchar.data_type " +
        "WHERE data_type_is_active " +
            "AND data_type_is_user_visible " +
        "ORDER BY data_type_display_order");

    //--------------------------------------------------------------------
    //  "Private" Functional Logic
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
        superCharDataTypeXComboBox.setId(-1);

        currSc = {
            sc_def_id: null, 
            sc_def_internal_name: null, 
            sc_def_display_name: null, 
            sc_def_description: null, 
            sc_def_pkghead_id: null, 
            sc_def_is_system_locked: null, 
            sc_def_data_type_id: null, 
            sc_def_data_type_display_name: null, 
            sc_def_data_type_internal_name: null, 
            sc_defdata_type_is_text: null,
            sc_defdata_type_is_numeric: null,
            sc_defdata_type_is_date: null,
            sc_defdata_type_is_flag: null,
            sc_defdata_type_is_array: null,
            sc_defdata_type_is_lov_based: null,
            sc_def_values_list: null, 
            sc_def_list_query: null, 
            sc_def_is_searchable: null, 
            sc_def_package_name: null, 
        };
    };

    var isScDataEdited = function() {
        return descriptionXTextEdit.document.toPlainText() != currSc.sc_def_description ||
            displayNameXLineEdit.text != currSc.sc_def_display_name ||
            internalNameXLineEdit.text != currSc.sc_def_internal_name ||
            isSearchableXCheckBox.checked != currSc.sc_def_is_searchable ||
            isSystemLockedXCheckBox.checked != currSc.sc_def_is_system_locked ||
            listQueryXTextEdit.document.toPlainText() != currSc.sc_def_list_query ||
            superCharDataTypeXComboBox.id() != currSc.sc_def_data_type_id;
    };

    var isScDataValid = function() {
        return MuseUtils.coalesce(descriptionXTextEdit.document.toPlainText(),"") !== "" &&
            MuseUtils.coalesce(displayNameXLineEdit.text,"") !== "" &&
            MuseUtils.coalesce(internalNameXLineEdit.text, "") !== "" &&
            MuseUtils.isValidId(superCharDataTypeXComboBox.id());
    };

    var setCurrSc = function(pSuperCharId) {
        currSc = MuseSuperChar.SuperChar.getSuperCharById(pSuperCharId);

        currSc.sc_def_values_list = currSc.sc_def_values_list.split(", ");
    };

    var setListOfValuesButtons = function() {
        if(!MuseUtils.isValidId(currSc.sc_def_id)) {
            listOfValuesAddPushButton.enabled = false;
            listOfValuesDeletePushButton.enabled = false;
            listOfValuesMoveDownPushButton.enabled = false;
            listOfValuesMoveUpPushButton.enabled = false;
        } else if(!MuseUtils.isValidId(listOfValuesXTreeWidget.id())) {
            listOfValuesAddPushButton.enabled = true && 
                (!currSc.sc_def_is_system_locked || 
                    privileges.check("maintainSuperCharSysLockRecsManually"));
            listOfValuesDeletePushButton.enabled = false;
            listOfValuesMoveDownPushButton.enabled = false;
            listOfValuesMoveUpPushButton.enabled = false;
        } else {
            listOfValuesAddPushButton.enabled = true && 
                (!currSc.sc_def_is_system_locked || 
                    privileges.check("maintainSuperCharSysLockRecsManually"));
            listOfValuesDeletePushButton.enabled = true && 
                (!currSc.sc_def_is_system_locked || 
                    privileges.check("maintainSuperCharSysLockRecsManually"));
            
            if(listOfValuesXTreeWidget.id() == 1) {
                listOfValuesMoveDownPushButton.enabled = true;
                listOfValuesMoveUpPushButton.enabled = false;
            } else if(listOfValuesXTreeWidget.id() == currSc.sc_def_values_list.length) {
                listOfValuesMoveDownPushButton.enabled = false;
                listOfValuesMoveUpPushButton.enabled = true;
            } else
                listOfValuesMoveDownPushButton.enabled = true;
                listOfValuesMoveUpPushButton.enabled = true;
        }
    };

    var setCondValButtons = function() {
        if(!MuseUtils.isValidId(currSc.sc_def_id)) {
            condValAddPushButton.enabled = false;
            condValEditPushButton.enabled = false;
            condValDeletePushButton.enabled = false;
        } else if(!MuseUtils.isValidId(condValXTreeWidget.id())) {
            condValAddPushButton.enabled = true;
            condValEditPushButton.enabled = false;
            condValDeletePushButton.enabled = false;
        } else {
            var isCondValEditQualified = 
                !MuseSuperChar.SuperChar.isValidatorSystemLocked(
                    condValXTreeWidget.id()) ||
                privileges.check("maintainSuperCharSysLockRecsManually");

            condValAddPushButton.enabled = true;
            condValEditPushButton.enabled = true && 
                (!isCondValEditQualified || 
                    privileges.check("maintainSuperCharSysLockRecsManually"));
            condValDeletePushButton.enabled = true && 
                (!isCondValEditQualified || 
                    privileges.check("maintainSuperCharSysLockRecsManually"));
        }
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


        superCharAddPushButton.enabled = true && 
            privileges.check("maintainSuperCharateristics");
        superCharDeletePushButton.text = "Delete";
        superCharDeletePushButton.enabled = false;
        superCharSavePushButton.enabled = false;
        
        // Populate the SuperChar List
        superCharListXTreeWidget.populate(
            MuseSuperChar.SuperChar.getSuperChars());

    };

    var setPopulatedState = function(pSuperCharId) {
        setCurrSc(pSuperCharId);

        superCharListXTreeWidget.populate(
            MuseSuperChar.SuperChar.getSuperChars());
        superCharListXTreeWidget.setId(currSc.sc_def_id);

        var isEditQualified = 
            !MuseUtils.isTrue(currSc.sc_def_is_system_locked) ||
            privileges.check("maintainSuperCharSysLockRecsManually");

        // Enable the GroupBoxes as appropriate
        assignedGroupsListGroupBox.enabled = true;
        condValGroupBox.enabled = true;
        superCharValuesGroupBox.enabled = true && isEditQualified;
        superCharValuesRightGroupBox.enabled = true;

        superCharSystemValuesGroupBox.enabled = 
            privileges.check("maintainSuperCharListQuery") ||
            privileges.check("maintainSuperCharInternalNames") ||
            privileges.check("maintainSuperCharSysLockRecsManually");
        isSystemLockedXCheckBox.enabled = true && 
            privileges.check("maintainSuperCharSysLockRecsManually");
        internalNameXLineEdit.enabled = true && 
            privileges.check("maintainSuperCharInternalNames");
        internalNameXLineEdit.text = currSc.sc_def_internal_name;

        assignedGroupsListGroupBox.title =  
            currSc.sc_def_display_name + " Assigned Groups";
        condValGroupBox.title =  
            currSc.sc_def_display_name + " Conditional Validation";
        superCharSystemValuesGroupBox.title =  
            currSc.sc_def_display_name + " System Values";
        superCharValuesGroupBox.title =  
            currSc.sc_def_display_name + " Definition";

        listOfValuesXTreeWidget.clear();
        if(MuseUtils.isTrue(currSc.sc_defdata_type_is_lov_based)) {
            superCharValuesRightGroupBox.enabled = true;
            listQueryXTextEdit.enabled = true && 
                privileges.check("maintainSuperCharListQuery");
            for(var i = 0; i < currSc.sc_def_values_list.length; i++) {
                new XTreeWidgetItem(listOfValuesXTreeWidget,i+1, -1, i+1,
                    currSc.sc_def_values_list[i]);
            }
        } else {
            superCharValuesRightGroupBox.enabled = false;
            listQueryXTextEdit.enabled = false;
        }


        superCharDataTypeXComboBox.enabled = false;
        superCharDataTypeXComboBox.setId(currSc.sc_def_data_type_id);

        displayNameXLineEdit.enabled = true;
        displayNameXLineEdit.text = currSc.sc_def_display_name;

        managingPackageValueXLabel.text = currSc.sc_def_package_name;

        descriptionXTextEdit.enabled = true;
        descriptionXTextEdit.setPlainText(currSc.sc_def_description);

        assignedGroupsListXTreeWidget.populate(
            MuseSuperChar.SuperChar.getSuperCharGroups(pSuperCharId));
        
        superCharAddPushButton.enabled = true;
        superCharDeletePushButton.enabled = true && isEditQualified;
        superCharDeletePushButton.text = "Delete";
        superCharSavePushButton.enabled = false;
        
        setListOfValuesButtons();
        setCondValButtons();
    };

    var setEditedState = function() {
        // If we creating a new SuperChar, we default the internal name to be a
        // deriviative of the display name.  We infer that we're creating a new
        // SuperChar as the currSc will contain all null values.
        if(internalNameXLineEdit.enabled &&
            MuseUtils.coalesce(displayNameXLineEdit.text, "") !== "" &&
            !MuseUtils.isValidId(currSc.sc_def_id) &&            
            displayNameXLineEdit.text != 
                MuseUtils.coalesce(currSc.sc_def_display_name, "")) {

            internalNameXLineEdit.text = 
                MuseSuperChar.SuperChar.getDefaultScInternalName(
                    displayNameXLineEdit.text);

        }

        superCharSavePushButton.enabled =  isScDataEdited() && isScDataValid();

        if(!isScDataEdited() && !MuseUtils.isValidId(currSc.sc_def_id)) {
            superCharDeletePushButton.text = "Cancel";
        } else if(isScDataEdited()) {
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

        assignedGroupsListGroupBox.title = "(N/A) Assigned Groups";
        condValGroupBox.title = "(N/A) Conditional Validation";
        superCharSystemValuesGroupBox.title = "New Super Characeristic System Values";
        superCharValuesGroupBox.title = "New Super Characteristic Definition";

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

        if(MuseUtils.realNull(currentItem) !== null &&
            MuseUtils.isValidId(currentItem.id())) {
            setPopulatedState(currentItem.id());
        }
    };

    var deleteSuperChar = function(pSuperCharId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharId: pSuperCharId
        };

        try {
            var violations = 
                MuseSuperChar.SuperChar.getSuperCharDeleteViolations(
                    pSuperCharId);

            if(violations.violation_count === 0) {
                MuseSuperChar.SuperChar.deleteSuperChar(pSuperCharId);
                setSelectState();
            } else {
                var violationDialog = 
                    MuseSuperChar.Widget.MSSCViolationsDialog(violations,
                        mywindow);
                violationDialog.exec();
                setPopulatedState(pSuperCharId);
            }
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to delete a Super Characteristic.",
                "MuseSuperChar.SuperCharMaint.deleteSuperChar",
                {params: funcParams, thrownError: e});
        }
    };

    var saveSuperChar = function() {
        if(!isScDataValid()) {
            return;
        }

        var scData;

        if(!MuseUtils.isValidId(currSc.sc_def_id)) {
            scData = {
                sc_def_internal_name: internalNameXLineEdit.text,
                sc_def_display_name: displayNameXLineEdit.text,
                sc_def_description: descriptionXTextEdit.document.toPlainText(),
                sc_def_data_type_id: superCharDataTypeXComboBox.id(),
                sc_def_is_searchable: isSearchableXCheckBox.checked
            };

            var newScId = MuseSuperChar.SuperChar.createSuperChar(scData);

            setPopulatedState(newScId);
        } else {
            scData = {sc_def_id: currSc.sc_def_id};

            if(internalNameXLineEdit.text != currSc.sc_def_internal_name) {
                scData.sc_def_internal_name = internalNameXLineEdit.text;    
            }

            if(displayNameXLineEdit.text != currSc.sc_def_display_name) {
                scData.sc_def_display_name = displayNameXLineEdit.text;
            }

            if(descriptionXTextEdit.document.toPlainText() != 
                currSc.sc_def_description) {
                scData.sc_def_description = 
                    descriptionXTextEdit.document.toPlainText();
            }

            if(isSearchableXCheckBox.checked != currSc.sc_def_is_searchable) {
                scData.sc_def_is_searchable = isSearchableXCheckBox.checked;
            }

            var updatedScId = MuseSuperChar.SuperChar.updateSuperChar(scData);
            
            setPopulatedState(updatedScId);
        }
    };

    var addLov = function() {
        // Get the new LOV window and the objects we care about.
        var dialogBox = toolbox.loadUi("museScNewListValue", mywindow);

        var valueXLineEdit = dialogBox.findChild("valueXLineEdit");
        var dialogButtonBox = dialogBox.findChild("dialogButtonBox");
        var okPushButton = dialogButtonBox.button(QDialogButtonBox.Ok);
        var cancelPushButton = dialogButtonBox.button(QDialogButtonBox.Cancel);

        okPushButton.clicked.connect(function() {
            var newLovList = currSc.sc_def_values_list.slice();
            
            if(MuseUtils.coalesce(valueXLineEdit.text,"") === "") {
                dialogBox.reject();
                return;
            }
            
            newLovList.push(valueXLineEdit.text);

            var scId = MuseSuperChar.SuperChar.updateSuperChar(
                {
                    sc_def_id: currSc.sc_def_id, 
                    sc_def_values_list: JSON.stringify(newLovList)
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
        if(MuseUtils.isValidId(listOfValuesXTreeWidget.id())) {
            var delLovIndex = listOfValuesXTreeWidget.id() - 1;
            var newLovList = currSc.sc_def_values_list.slice();
            newLovList.splice(delLovIndex, 1);

            var scId = MuseSuperChar.SuperChar.updateSuperChar(
                {
                    sc_def_id: currSc.sc_def_id, 
                    sc_def_values_list: JSON.stringify(newLovList)
                });

            setPopulatedState(scId);
        }

        return;
    };

    var moveLovValue = function(pMoveDirection) {
        if(MuseUtils.isValidId(listOfValuesXTreeWidget.id())) {
            var moveLovIndex = listOfValuesXTreeWidget.id() - 1;
            var movingValue = currSc.sc_def_values_list[moveLovIndex];
            var newLovList = currSc.sc_def_values_list.slice();
            newLovList.splice(moveLovIndex, 1);
            newLovList.splice(moveLovIndex + pMoveDirection, 0, movingValue);

            var scId = MuseSuperChar.SuperChar.updateSuperChar(
                {
                    sc_def_id: currSc.sc_def_id, 
                    sc_def_values_list: JSON.stringify(newLovList)
                });

            setPopulatedState(scId);
        }

        return;
    };
 
    //--------------------------------------------------------------------
    //  Public Interface -- Functions
    //--------------------------------------------------------------------
    

    //--------------------------------------------------------------------
    //  Public Interface -- Slots
    //--------------------------------------------------------------------
    pPublicApi.sSuperCharSelected = function(pSuperCharItem, pColumnId) {
        try {
            superCharSelected();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    pPublicApi.sLovValueSelected = function(pLovValueId, pColumnId) {
        try {
            setListOfValuesButtons();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    pPublicApi.sAddSc = function() {
        try {
            setNewState();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    pPublicApi.sCancelSc = function() {
        try {
            if(MuseUtils.isValidId(currSc.sc_def_id) && 
                superCharDeletePushButton.text == "Cancel") {
                setPopulatedState(currSc.sc_def_id);
            } else if(MuseUtils.isValidId(currSc.sc_def_id) && 
                superCharDeletePushButton.text == "Delete") {
                deleteSuperChar(currSc.sc_def_id);
                setSelectState();
            } else {
                setSelectState();
            }
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    pPublicApi.sFieldsUpdated = function() {
        try {
            setEditedState();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    pPublicApi.sSaveSc = function() {
        try {
            saveSuperChar();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    pPublicApi.sAddLov = function() {
        try {
            addLov();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    pPublicApi.sDeleteLov = function() {
        try {
            deleteLov();      
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    pPublicApi.sMoveDownLovValue = function() {
        try {
            moveLovValue(DOWN);
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    pPublicApi.sMoveUpLovValue = function() {
        try {
            moveLovValue(UP);
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    try {
        //--------------------------------------------------------------------
        //  Initialization Logic Setup 
        //  Subforms are different from standard xTuple forms in that they do not 
        //  call set and instead initialize on the constructor.  This should be OK 
        //  since we should not need to depend on the outside world for anything.
        //--------------------------------------------------------------------
        setSelectState();
        
        //----------------------------------------------------------------
        //  Connects/Disconnects
        //---------------------------------------------------------------- 
        superCharListXTreeWidget["itemClicked(XTreeWidgetItem *, int)"].connect(
            pPublicApi.sSuperCharSelected);
        listOfValuesXTreeWidget["itemClicked(XTreeWidgetItem *, int)"].connect(
            pPublicApi.sLovValueSelected);

        superCharAddPushButton.clicked.connect(pPublicApi.sAddSc);
        superCharSavePushButton.clicked.connect(pPublicApi.sSaveSc);
        superCharDeletePushButton.clicked.connect(pPublicApi.sCancelSc);

        listOfValuesAddPushButton.clicked.connect(pPublicApi.sAddLov);
        listOfValuesDeletePushButton.clicked.connect(pPublicApi.sDeleteLov);
        listOfValuesMoveDownPushButton.clicked.connect(pPublicApi.sMoveDownLovValue);
        listOfValuesMoveUpPushButton.clicked.connect(pPublicApi.sMoveUpLovValue);

        descriptionXTextEdit["textChanged()"].connect(pPublicApi.sFieldsUpdated);
        listQueryXTextEdit["textChanged()"].connect(pPublicApi.sFieldsUpdated);
        displayNameXLineEdit["editingFinished()"].connect(pPublicApi.sFieldsUpdated);
        internalNameXLineEdit["editingFinished()"].connect(pPublicApi.sFieldsUpdated);
        isSearchableXCheckBox.clicked.connect(pPublicApi.sFieldsUpdated);
        isSystemLockedXCheckBox.clicked.connect(pPublicApi.sFieldsUpdated);
        superCharDataTypeXComboBox["newID(int)"].connect(pPublicApi.sFieldsUpdated);
        
    } catch(e) {
        MuseUtils.displayError(e, mywindow);
        mywindow.close();
    }

})(this.MuseSuperChar.SuperCharMaint, this);

