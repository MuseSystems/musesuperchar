// File:        museScCreateGroupLayoutItem.js
// Location:    musesuperchar/client/scripts/forms/custom
// Project:     Muse Systems Super Characteristics for xTuple ERP
//
// Licensed to Lima Buttgereit Holdings LLC (d/b/a Muse Systems) under one or
// more agreements.  Muse Systems licenses this file to you under the Apache
// License, Version 2.0.
//
// See the LICENSE file in the project root for license terms and conditions.
// See the NOTICE file in the project root for copyright ownership information.
//
// muse.information@musesystems.com  :: https://muse.systems

try {
    //////////////////////////////////////////////////////////////////////////
    //  Namespace Definition
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseSuperChar === "undefined") {
        MuseSuperChar = {};
    }

    if (typeof MuseSuperChar.CreateGroupLayout === "undefined") {
        MuseSuperChar.CreateGroupLayout = {};
    }

    //////////////////////////////////////////////////////////////////////////
    //  Imports
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseUtils === "undefined") {
        include("museUtils");
    }

    MuseUtils.loadMuseUtils([
        MuseUtils.MOD_JS,
        MuseUtils.MOD_EXCEPTION,
        MuseUtils.MOD_QT
    ]);

    if (typeof MuseSuperChar.Group === "undefined") {
        include("museScGroupData");
    }

    if (typeof MuseSuperChar.SuperChar === "undefined") {
        include("museSuperCharData");
    }
} catch (e) {
    if (
        typeof MuseUtils !== "undefined" &&
        (MuseUtils.isMuseUtilsExceptionLoaded === true ? true : false)
    ) {
        var error = new MuseUtils.ScriptException(
            "musesuperchar",
            "We encountered a script level issue while processing MuseSuperChar.CreateGroupLayout.",
            "MuseSuperChar.CreateGroupLayout",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.CreateGroupLayout Script Error",
            "We encountered a script level issue while processing MuseSuperChar.CreateGroupLayout."
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
        var mode;

        var currGroupLayoutItem = {
            scdef_scgrp_ass_id: null,
            scdef_scgrp_ass_scdef_id: null,
            scdef_scgrp_ass_scdef_internal_name: null,
            scdef_scgrp_ass_scdef_display_name: null,
            scdef_scgrp_ass_scgrp_id: null,
            scdef_scgrp_ass_scgrp_internal_name: null,
            scdef_scgrp_ass_scgrp_display_name: null,
            scdef_scgrp_ass_sequence: null,
            scdef_scgrp_ass_section_name: null,
            scdef_scgrp_ass_is_column_start: null,
            scdef_scgrp_ass_width: null,
            scdef_scgrp_ass_max_width: null,
            scdef_scgrp_ass_height: null,
            scdef_scgrp_ass_max_height: null,
            scdef_scgrp_ass_pkghead_id: null,
            scdef_scgrp_ass_is_system_locked: null
        };

        //--------------------------------------------------------------------
        //  Get Object References From Screen Definitions
        //--------------------------------------------------------------------
        var fieldsHBoxLayout = mywindow.findChild("fieldsHBoxLayout");
        var leftFieldsFormLayout = mywindow.findChild("leftFieldsFormLayout");
        var rightFieldsFormLayout = mywindow.findChild("rightFieldsFormLayout");
        var verticalLayout = mywindow.findChild("verticalLayout");
        var groupComboBox = mywindow.findChild("groupComboBox");
        var sectionComboBox = mywindow.findChild("sectionComboBox");
        var superCharComboBox = mywindow.findChild("superCharComboBox");
        var heightXLineEdit = mywindow.findChild("heightXLineEdit");
        var maxHeightXLineEdit = mywindow.findChild("maxHeightXLineEdit");
        var widthXLineEdit = mywindow.findChild("widthXLineEdit");
        var maxWidthXLineEdit = mywindow.findChild("maxWidthXLineEdit");
        var isNewColumnCheckBox = mywindow.findChild("isNewColumnCheckBox");
        var groupXLabel = mywindow.findChild("groupXLabel");
        var heightXLabel = mywindow.findChild("heightXLabel");
        var maxHeightXLabel = mywindow.findChild("maxHeightXLabel");
        var saveButtonBox = mywindow.findChild("saveButtonBox");
        var sectionXLabel = mywindow.findChild("sectionXLabel");
        var seqValueXLabel = mywindow.findChild("seqValueXLabel");
        var seqXLabel = mywindow.findChild("seqXLabel");
        var superCharXLabel = mywindow.findChild("superCharXLabel");
        var widthXLabel = mywindow.findChild("widthXLabel");
        var maxWidthXLabel = mywindow.findChild("maxWidthXLabel");

        var cancelPushButton = saveButtonBox.button(QDialogButtonBox.Cancel);
        var savePushButton = saveButtonBox.button(QDialogButtonBox.Save);

        //--------------------------------------------------------------------
        //  Custom Screen Objects and Starting GUI Manipulation
        //--------------------------------------------------------------------
        groupComboBox.allowNull = true;
        groupComboBox.nullStr = "-- Please Select --";

        superCharComboBox.allowNull = true;
        superCharComboBox.nullStr = "-- Please Select --";

        sectionComboBox.allowNull = false;

        MuseUtils.numericLineEdit(heightXLineEdit, 0);
        MuseUtils.numericLineEdit(maxHeightXLineEdit, 0);
        MuseUtils.numericLineEdit(widthXLineEdit, 0);
        MuseUtils.numericLineEdit(maxWidthXLineEdit, 0);

        cancelPushButton.enabled = true;
        savePushButton.enabled = false;

        seqValueXLabel.alignment = Qt.AlignRight;

        //--------------------------------------------------------------------
        //  Private Functional Logic
        //--------------------------------------------------------------------
        var clear = function() {
            groupComboBox.clear();
            // We expect groupComboBox to always be populated.
            groupComboBox.populate(MuseSuperChar.Group.getGroupList());
            sectionComboBox.clear();
            superCharComboBox.clear();
            heightXLineEdit.clear();
            maxHeightXLineEdit.clear();
            seqValueXLabel.clear();
            widthXLineEdit.clear();
            maxWidthXLineEdit.clear();
            isNewColumnCheckBox.checked = false;
        };

        var isGroupLayoutItemValid = function() {
            return (
                MuseUtils.isValidId(groupComboBox.id()) &&
                MuseUtils.isValidId(superCharComboBox.id()) &&
                MuseUtils.coalesce(sectionComboBox.code, "") !== ""
            );
        };

        var setButtons = function() {
            if (mode != "view" && isGroupLayoutItemValid()) {
                savePushButton.enabled = true;
                cancelPushButton.enabled = true;
            } else {
                savePushButton.enabled = false;
                cancelPushButton.enabled = true;
            }
        };

        var setSelectGroupState = function() {
            clear();
            groupComboBox.enabled = true;
            sectionComboBox.enabled = false;
            superCharComboBox.enabled = false;
            heightXLineEdit.enabled = false;
            maxHeightXLineEdit.enabled = false;
            widthXLineEdit.enabled = false;
            maxWidthXLineEdit.enabled = false;
            isNewColumnCheckBox.enabled = false;
            setButtons();
        };

        var setSelectSuperCharState = function() {
            // We don't alter the state of groupComboBox since we may be entering
            // the form with a preselected group.  We'll let the set mode functions
            // deal with that.
            superCharComboBox.enabled = true;
            superCharComboBox.clear();
            sectionComboBox.enabled = false;
            sectionComboBox.clear();
            heightXLineEdit.enabled = false;
            heightXLineEdit.clear();
            maxHeightXLineEdit.enabled = false;
            maxHeightXLineEdit.clear();
            seqValueXLabel.clear();
            widthXLineEdit.enabled = false;
            widthXLineEdit.clear();
            maxWidthXLineEdit.enabled = false;
            maxWidthXLineEdit.clear();
            isNewColumnCheckBox.enabled = false;
            isNewColumnCheckBox.checked = false;
            superCharComboBox.populate(
                MuseSuperChar.Group.getGroupUnAssignedSuperChars(
                    groupComboBox.id()
                )
            );
            setButtons();
        };

        var setEditAttributesState = function() {
            // We don't alter the state of groupComboBox or superCharComboBox since
            // we may be entering the form with a preselected group/superchar.
            // We'll let the set mode functions deal with that.
            sectionComboBox.clear();
            heightXLineEdit.clear();
            maxHeightXLineEdit.clear();
            seqValueXLabel.clear();
            widthXLineEdit.clear();
            maxWidthXLineEdit.clear();
            isNewColumnCheckBox.checked = false;

            if (MuseUtils.isValidId(currGroupLayoutItem.scdef_scgrp_ass_id)) {
                groupComboBox.setId(
                    currGroupLayoutItem.scdef_scgrp_ass_scgrp_id
                );
                groupComboBox.enabled = false;

                superCharComboBox.populate(
                    MuseSuperChar.SuperChar.getSuperCharList(
                        currGroupLayoutItem.scdef_scgrp_ass_scdef_id
                    )
                );
                superCharComboBox.setId(
                    currGroupLayoutItem.scdef_scgrp_ass_scdef_id
                );
                superCharComboBox.enabled = false;

                sectionComboBox.populate(
                    MuseSuperChar.Group.getGroupLayoutSectionNames(
                        groupComboBox.id()
                    )
                );
                sectionComboBox.code =
                    currGroupLayoutItem.scdef_scgrp_ass_section_name;

                seqValueXLabel.text =
                    currGroupLayoutItem.scdef_scgrp_ass_sequence;
                heightXLineEdit.setFormattedText(
                    currGroupLayoutItem.scdef_scgrp_ass_height
                );
                maxHeightXLineEdit.setFormattedText(
                    currGroupLayoutItem.scdef_scgrp_ass_max_height
                );
                widthXLineEdit.setFormattedText(
                    currGroupLayoutItem.scdef_scgrp_ass_width
                );
                maxWidthXLineEdit.setFormattedText(
                    currGroupLayoutItem.scdef_scgrp_ass_max_width
                );

                isNewColumnCheckBox.checked = MuseUtils.isTrue(
                    currGroupLayoutItem.scdef_scgrp_ass_is_column_start
                );

                sectionComboBox.enabled = true && mode != "view";
                heightXLineEdit.enabled = true && mode != "view";
                maxHeightXLineEdit.enabled = true && mode != "view";
                widthXLineEdit.enabled = true && mode != "view";
                maxWidthXLineEdit.enabled = true && mode != "view";
                isNewColumnCheckBox.enabled = true && mode != "view";
            } else {
                sectionComboBox.populate(
                    MuseSuperChar.Group.getGroupLayoutSectionNames(
                        groupComboBox.id()
                    )
                );

                seqValueXLabel.text = "Not Yet Assigned";
                heightXLineEdit.setFormattedText(0);
                maxHeightXLineEdit.setFormattedText(0);
                widthXLineEdit.setFormattedText(0);
                maxWidthXLineEdit.setFormattedText(0);
                isNewColumnCheckBox.checked = MuseUtils.isTrue(
                    currGroupLayoutItem.scdef_scgrp_ass_is_column_start
                );

                sectionComboBox.enabled = true && mode != "view";
                heightXLineEdit.enabled = true && mode != "view";
                maxHeightXLineEdit.enabled = true && mode != "view";
                widthXLineEdit.enabled = true && mode != "view";
                maxWidthXLineEdit.enabled = true && mode != "view";
                isNewColumnCheckBox.enabled = true && mode != "view";
            }

            setButtons();
        };

        var save = function() {
            if (mode == "view" || !isGroupLayoutItemValid()) {
                return;
            }

            var groupLayoutData = {
                scdef_scgrp_ass_scdef_id: superCharComboBox.id(),
                scdef_scgrp_ass_scgrp_id: groupComboBox.id(),
                scdef_scgrp_ass_section_name: MuseUtils.getCleanTextLine(
                    sectionComboBox.text
                ),
                scdef_scgrp_ass_is_column_start: isNewColumnCheckBox.checked,
                scdef_scgrp_ass_width: widthXLineEdit.getNumericValue(),
                scdef_scgrp_ass_max_width: maxWidthXLineEdit.getNumericValue(),
                scdef_scgrp_ass_height: heightXLineEdit.getNumericValue(),
                scdef_scgrp_ass_max_height: maxHeightXLineEdit.getNumericValue()
            };

            try {
                if (mode == "edit") {
                    groupLayoutData.scdef_scgrp_ass_id =
                        currGroupLayoutItem.scdef_scgrp_ass_id;
                    MuseSuperChar.Group.updateGroupLayoutItem(groupLayoutData);
                } else if (mode == "new") {
                    MuseSuperChar.Group.createGroupLayoutItem(groupLayoutData);
                } else {
                    throw new MuseUtils.OutOfBoundsException(
                        "musesuperchar",
                        "We did not understand the mode that the form was suppose to be in.",
                        "MuseSuperChar.CreateGroupLayout.save",
                        { context: { mode: mode } },
                        MuseUtils.LOG_WARNING
                    );
                }

                mydialog.accept();
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to successfully save the Group Layout Item.",
                    "MuseSuperChar.CreateGroupLayout.save",
                    { thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var setNewMode = function(pParams) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pParams: pParams
            };

            mode = "new";

            if (
                pParams.hasOwnProperty("scdef_scgrp_ass_scgrp_id") &&
                MuseUtils.isValidId(pParams.scdef_scgrp_ass_scgrp_id)
            ) {
                groupComboBox.setId(pParams.scdef_scgrp_ass_scgrp_id);
                groupComboBox.enabled = false;
                setSelectSuperCharState();
            } else {
                setSelectGroupState();
            }
        };

        var setEditMode = function(pParams) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pParams: pParams
            };

            mode = "edit";

            groupComboBox.enabled = false;
            superCharComboBox.enabled = false;

            currGroupLayoutItem = MuseSuperChar.Group.getGroupLayoutItemById(
                pParams.scdef_scgrp_ass_id
            );

            setEditAttributesState();
        };

        var setViewMode = function(pParams) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pParams: pParams
            };

            mode = "view";

            groupComboBox.enabled = false;
            superCharComboBox.enabled = false;

            currGroupLayoutItem = MuseSuperChar.Group.getGroupLayoutItemById(
                pParams.scdef_scgrp_ass_id
            );

            setEditAttributesState();
        };

        var groupUpdated = function() {
            if (MuseUtils.isValidId(groupComboBox.id())) {
                setSelectSuperCharState();
            } else {
                setSelectGroupState();
            }
        };

        var superCharUpdated = function() {
            if (MuseUtils.isValidId(superCharComboBox.id())) {
                setEditAttributesState();
            } else {
                setSelectSuperCharState();
            }
        };
        //--------------------------------------------------------------------
        //  Public Interface -- Slots
        //--------------------------------------------------------------------
        pPublicApi.sGroupUpdated = function() {
            try {
                groupUpdated();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a group field update.",
                    "MuseSuperChar.CreateGroupLayout.pPublicApi.sGroupUpdated",
                    { thrownError: e },
                    MuseUtils.LOG_FATAL
                );
                MuseUtils.displayError(error, mywindow);
                mydialog.reject();
            }
        };

        pPublicApi.sSuperCharUpdated = function() {
            try {
                superCharUpdated();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a Super Characteristic field update.",
                    "MuseSuperChar.CreateGroupLayout.pPublicApi.sSuperCharUpdated",
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
                    "We found problems while responding to a save request.",
                    "MuseSuperChar.CreateGroupLayout.pPublicApi.sSave",
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

            clear();

            if (!pParams.hasOwnProperty("mode")) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We could not understand in which mode you wished to initial the form.",
                    "MuseSuperChar.CreateGroupLayout.pPublicApi.set",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            } else if (pParams.mode == "new") {
                setNewMode(pParams);
            } else if (pParams.mode == "edit") {
                if (
                    !pParams.hasOwnProperty("scdef_scgrp_ass_id") ||
                    !MuseUtils.isValidId(pParams.scdef_scgrp_ass_id)
                ) {
                    throw new MuseUtils.ApiException(
                        "musesuperchar",
                        "We did not understand which Group Layout Item you wished to edit.",
                        "MuseSuperChar.CreateGroupLayout.pPublicApi.set",
                        { params: funcParams },
                        MuseUtils.LOG_WARNING
                    );
                }
                setEditMode(pParams);
            } else if (pParams.mode == "view") {
                if (
                    !pParams.hasOwnProperty("scdef_scgrp_ass_id") ||
                    !MuseUtils.isValidId(pParams.scdef_scgrp_ass_id)
                ) {
                    throw new MuseUtils.ApiException(
                        "musesuperchar",
                        "We did not understand which Group Layout Item you wished to view.",
                        "MuseSuperChar.CreateGroupLayout.pPublicApi.set",
                        { params: funcParams },
                        MuseUtils.LOG_WARNING
                    );
                }
                setViewMode(pParams);
            } else {
                throw new MuseUtils.OutOfBoundsException(
                    "musesuperchar",
                    "We did not find the requested mode for initializing the form.  " +
                        "Valid values are new, edit, and view.",
                    "MuseSuperChar.CreateGroupLayout.pPublicApi.set",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }
            //----------------------------------------------------------------
            //  Set Timed Connects/Disconnects
            //----------------------------------------------------------------
            groupComboBox["activated(int)"].connect(pPublicApi.sGroupUpdated);
            superCharComboBox["activated(int)"].connect(
                pPublicApi.sSuperCharUpdated
            );

            savePushButton.clicked.connect(pPublicApi.sSave);
            cancelPushButton.clicked.connect(function() {
                mydialog.reject();
            });
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
            "We enountered a MuseSuperChar.CreateGroupLayout module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.CreateGroupLayout",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.CreateGroupLayout, this);
