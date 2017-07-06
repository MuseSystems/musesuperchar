/*************************************************************************
 *************************************************************************
 **
 ** File:        museScWidget.js
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
this.MuseSuperChar.Widget = this.MuseSuperChar.Widget || {};

this.MuseSuperChar.Data = this.MuseSuperChar.Data || {};
this.MuseSuperChar.Data.Entities = this.MuseSuperChar.Data.Entities || {};

//////////////////////////////////////////////////////////////////////////
//  Imports
//////////////////////////////////////////////////////////////////////////

if(!this.MuseUtils) {
    include("museUtils");
}



//////////////////////////////////////////////////////////////////////////
//  Module Defintion
//////////////////////////////////////////////////////////////////////////

(function(pPublicApi) {
    //--------------------------------------------------------------------
    //  Public Interface -- Constants
    //--------------------------------------------------------------------
    
    // The values of these constants should match the musesuperchar.datatype
    // internal names.
    pPublicApi.TEXTFIELD = "textfield";
    pPublicApi.TEXTAREA = "textarea";
    pPublicApi.DATECLUSTER = "datecluster";
    pPublicApi.CHECKBOX = "checkbox";
    pPublicApi.COMBOBOX = "combobox";
    pPublicApi.WHOLENUMBER = "wholenumber";
    pPublicApi.DECIMALNUMBER = "decimalnumber";
    pPublicApi.QTY = "qty";
    pPublicApi.COST = "cost";
    pPublicApi.PURCHPRICE = "purchprice";
    pPublicApi.SALESPRICE = "salesprice";
    pPublicApi.EXTPRICE = "extprice";
    pPublicApi.WEIGHT = "weight";
    pPublicApi.PERCENT = "percent";
    pPublicApi.FILECLUSTER = "filecluster";
    pPublicApi.IMAGECLUSTER = "imagecluster";

    pPublicApi.WIDGETTYPES = [
        pPublicApi.TEXTFIELD,
        pPublicApi.TEXTAREA,
        pPublicApi.DATECLUSTER,
        pPublicApi.CHECKBOX,
        pPublicApi.COMBOBOX,
        pPublicApi.WHOLENUMBER,
        pPublicApi.DECIMALNUMBER,
        pPublicApi.QTY,
        pPublicApi.COST,
        pPublicApi.PURCHPRICE,
        pPublicApi.SALESPRICE,
        pPublicApi.EXTPRICE,
        pPublicApi.WEIGHT,
        pPublicApi.PERCENT,
        pPublicApi.FILECLUSTER,
        pPublicApi.IMAGECLUSTER
    ];

    // Ensure that our 

    //--------------------------------------------------------------------
    //  "Private" Functional Logic
    //--------------------------------------------------------------------
    var MSSCViolationsDialog = function(pViolationData, pParent) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pViolationData: pViolationData
        };

        // Load the UI & get form references.
        var dialogBox;

        if(MuseUtils.realNull(pParent) === null) {
            dialogBox = toolbox.loadUi("msScViolationsDialog");
        } else {
            dialogBox = toolbox.loadUi("msScViolationsDialog", pParent);
        }

        var verticalLayout = dialogBox.findChild("verticalLayout");
        var messageTextXLabel = dialogBox.findChild("messageTextXLabel");
        var violationsXTreeWidget = dialogBox.findChild("violationsXTreeWidget");
        var ackButtonBox = dialogBox.findChild("ackButtonBox");
        var okPushButton = ackButtonBox.button(QDialogButtonBox.Ok);

        // Add columns to the XTreeWidget
        violationsXTreeWidget.addColumn("Validation Rule ID", 45, Qt.AlignCenter, false, "condvalrule_id");
        violationsXTreeWidget.addColumn("Validation Rule", 400, Qt.AlignLeft, true, "condvalrule_fails_message_text");
        violationsXTreeWidget.addColumn("If Validator ID", 45, Qt.AlignCenter, false, "if_valtype_id");
        violationsXTreeWidget.addColumn("If Validator", 150, Qt.AlignLeft, false, "if_valtype_display_name");
        violationsXTreeWidget.addColumn("Then Validator ID", 45, Qt.AlignCenter, false, "then_valtype_id");
        violationsXTreeWidget.addColumn("Then Validator", 150, Qt.AlignLeft, false, "then_valtype_display_name");
        violationsXTreeWidget.addColumn("Entity ID", 45, Qt.AlignCenter, false, "entity_id");
        violationsXTreeWidget.addColumn("Entity Data Table", 150, Qt.AlignLeft, false, "entity_data_table");
        violationsXTreeWidget.addColumn("Entity", 150, Qt.AlignLeft, true, "entity_display_name");
        violationsXTreeWidget.addColumn("SuperChar ID", 45, Qt.AlignCenter, false, "scdef_id");
        violationsXTreeWidget.addColumn("SuperChar Internal Name", 150, Qt.AlignLeft, false, "scdef_internal_name");
        violationsXTreeWidget.addColumn("SuperChar", 150, Qt.AlignLeft, true, "scdef_display_name");

        // Update the data
        messageTextXLabel.text = "The proposed actions would cause " + 
            pViolationData.violation_count + " violations.\n\n" +
            "The violations that would occur are listed below.";

        for(var i = 0; i < pViolationData.violations.length; i++) {
            var currXTreeWidgetItem = new XTreeWidgetItem(violationsXTreeWidget, i);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("condvalrule_id"), 
                pViolationData.violations[i].condvalrule_id);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("condvalrule_fails_message_text"), 
                pViolationData.violations[i].condvalrule_fails_message_text);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("if_valtype_id"), 
                pViolationData.violations[i].if_valtype_id);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("if_valtype_display_name"), 
                pViolationData.violations[i].if_valtype_display_name);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("then_valtype_id"), 
                pViolationData.violations[i].then_valtype_id);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("then_valtype_display_name"), 
                pViolationData.violations[i].then_valtype_display_name);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("entity_id"), 
                pViolationData.violations[i].entity_id);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("entity_data_table"), 
                pViolationData.violations[i].entity_data_table);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("entity_display_name"), 
                pViolationData.violations[i].entity_display_name);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("scdef_id"), 
                pViolationData.violations[i].scdef_id);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("scdef_internal_name"), 
                pViolationData.violations[i].scdef_internal_name);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("scdef_display_name"), 
                pViolationData.violations[i].scdef_display_name);
        }
        
        // Connect the dialog OK button to a close function.
        okPushButton.clicked.connect(
            function() {
                dialogBox.accept();
            });

        return dialogBox;
    };

    var getSectionGroupBox = function(pSectionName, pColumns, pData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSectionName: pSectionName,
            pColumns: pColumns,
            pData: pData
        };

        try {
            //Create the GroupBox and the 
            var section_internal_name = MuseUtils.getNormalizedString(pSectionName);
            var sectionGroupBox = toolbox.createWidget("QGroupBox",null,
                section_internal_name+"_groupbox");
            sectionGroupBox.title = pSectionName;
            var sectionHBoxLayout = new QBoxLayout(QBoxLayout.LeftToRight);
            sectionHBoxLayout.objectName = section_internal_name + 
                "_hboxlayout";
            sectionGroupBox.setLayout(sectionHBoxLayout);
            sectionHBoxLayout.addSpacing(-1,0);

            // Add column QFormLayouts
            for(var i_col = pColumns.length - 1; i_col >= 0; i_col--) {
                var currColumFormLayout = new QFormLayout();
                currColumFormLayout.objectName = 
                    section_internal_name + "_column_" + 
                    ("00" + i_col).slice(("00" + i_col).length - 2, ("00" + i_col).length);
                sectionHBoxLayout.insertLayout(0, currColumFormLayout);

                var currColData = pColumns[i_col];
                for(var i_dat = 0; i_dat < currColData.length; i_dat++) {
                    var currDatLabel = toolbox.createWidget("XLabel", null, 
                        currColData[i_dat].scdef_internal_name + '_xlabel');
                    currDatLabel.text = currColData[i_dat].scdef_display_name;

                    var currDatWidget = 
                        pData[currColData[i_dat].scdef_internal_name];
                    currColumFormLayout.addRow(currDatLabel, currDatWidget);
                }

            }

            return sectionGroupBox;
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to create the QGroupBox for the requested section.",
                "MuseSuperChar.Widget.getSectionGroupBox",
                {params: funcParams, thrownError: e});
        }
    };

    var generateSpaceConservedWidget = function(pStructure, pData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pStructure: pStructure,
            pData: pData
        };
        
        // Create a widget which will be what we will ultimately return to the
        // caller.
        var groupWidget;
        var groupVBoxLayout;

        try {
            groupWidget = new QWidget();
            groupWidget.setObjectName(
                MuseUtils.getNormalizedString(pStructure.scgrp_internal_name) + "_widget");
            groupVBoxLayout = new QBoxLayout(QBoxLayout.TopToBottom);
            groupVBoxLayout.objectName = MuseUtils.getNormalizedString(
                pStructure.scgrp_internal_name) + "_vboxlayout";
            groupWidget.setLayout(groupVBoxLayout);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to create a space conserving base widget in which to " +
                "contain the various Super Characteristic sections.",
                "MuseSuperChar.Widget.generateSpaceConservedWidget",
                {params: funcParams, thrownError: e});
        }

        try {
            var layoutSections = pStructure.layout;

            layoutSections.sort(function(a, b) {
                if(a.section_column_count > b.section_column_count) {
                    return -1;
                } else if(a.section_column_count < b.section_column_count) {
                    return 1;
                } else if(a.section_name > b.section_name) {
                    return 1;
                } else {
                    return -1;
                }
            });
            
            var maxColumnCount = layoutSections[0].section_column_count;
            var seenSections = [];
            var hboxCount = 0; 
            for(var i_sec = 0; i_sec < layoutSections.length; i_sec++) {
                var curSecName = layoutSections[i_sec].section_name;
                var curCols = layoutSections[i_sec].columns;
                
                if(seenSections.includes(curSecName)) {
                    continue;
                } else if(curCols.length == maxColumnCount) {
                    // add the section group box to the layout.
                    groupVBoxLayout.addWidget(getSectionGroupBox(curSecName, 
                        curCols, pData));
                    seenSections.push(curSecName);
                } else {
                    var leftOverCols = maxColumnCount - curCols.length;
                    var curHBoxLayout = new QBoxLayout(QBoxLayout.LeftToRight);
                    curHBoxLayout.objectName = 
                        MuseUtils.getNormalizedString(pStructure.scgrp_internal_name) + 
                        "_hboxlayout_" +
                        ("00" + hboxCount).slice(
                            ("00" + hboxCount).length - 2, 
                            ("00" + hboxCount).length);
                    groupVBoxLayout.addLayout(curHBoxLayout);
                    hboxCount++;
                    curHBoxLayout.addWidget(getSectionGroupBox(curSecName, 
                        curCols, pData));
                    seenSections.push(curSecName);
    
                    for(var i_sub = 0; i_sub < layoutSections.length; i_sub++) {
                        var curSubSecName = layoutSections[i_sub].section_name;
                        var curSubCols = layoutSections[i_sub].columns;
    
                        if(seenSections.includes(curSecName)) {
                            continue;
                        } else if(curSubCols.length <= leftOverCols) {
                            // add the section group box to the layout.
                            curHBoxLayout.addWidget(getSectionGroupBox(curSubSecName, 
                                curSubCols, pData));
                            seenSections.push(curSubSecName);
                            leftOverCols =- curSubCols.length;
                        }
    
                        if(leftOverCols <= 0) {
                            break;
                        }
                    }
    
                    if(leftOverCols > 0) {
                        for(; leftOverCols > 0; leftOverCols--) {
                            curHBoxLayout.addSpacing();
                        }
                    }
                }
            }
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We found errors trying to perform the space conserving group widget generating algorithm.",
                "MuseSuperChar.Widget.generateSpaceConservedWidget",
                {params: funcParams, thrownError: e});
        }

        return groupWidget;
    };

    var generateSpaceNonConservedWidget = function(pStructure, pData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pStructure: pStructure,
            pData: pData
        };

        // Create a widget which will be what we will ultimately return to the
        // caller.
        var groupWidget;
        var groupVBoxLayout;

        try {
            groupWidget = new QWidget();
            groupWidget.setObjectName(
                MuseUtils.getNormalizedString(pStructure.scgrp_internal_name) + "_widget");
            groupVBoxLayout = new QBoxLayout(QBoxLayout.TopToBottom);
            groupVBoxLayout.objectName = MuseUtils.getNormalizedString(
                pStructure.scgrp_internal_name) + "_vboxlayout";
            groupWidget.setLayout(groupVBoxLayout);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to create a space conserving base widget in which to " +
                "contain the various Super Characteristic sections.",
                "MuseSuperChar.Widget.generateSpaceNonConservedWidget",
                {params: funcParams, thrownError: e});
        }

        try {
            var layoutSections = pStructure.layout;
    
            var maxColumnCount = 0;
            for(var i1 = 0; i1 < layoutSections.length; i1++) {
                if(maxColumnCount < layoutSections[i1].section_column_count) {
                    maxColumnCount = layoutSections[i1].section_column_count;
                }
            }
    
            var seenSections = [];
            var hboxCount = 0;
            for(var i_sec = 0; i_sec < layoutSections.length; i_sec++) {
                var curSecName = layoutSections[i_sec].section_name;
                var curCols = layoutSections[i_sec].columns;
                
                if(seenSections.includes(curSecName)) {
                    continue;
                } else if(curCols.length == maxColumnCount) {
                    // add the section group box to the layout.
                    groupVBoxLayout.addWidget(getSectionGroupBox(curSecName, 
                        curCols, pData));
                    seenSections.push(curSecName);
                } else {
                    var leftOverCols = maxColumnCount - curCols.length;
                    var curHBoxLayout = new QBoxLayout(QBoxLayout.LeftToRight);
                    curHBoxLayout.objectName = 
                        MuseUtils.getNormalizedString(pStructure.scgrp_internal_name) + 
                        "_hboxlayout_" +
                        ("00" + hboxCount).slice(
                            ("00" + hboxCount).length - 2, 
                            ("00" + hboxCount).length);
                    groupVBoxLayout.addLayout(curHBoxLayout);
                    hboxCount++;
                    curHBoxLayout.addWidget(getSectionGroupBox(curSecName, 
                        curCols, pData));
                    seenSections.push(curSecName);
    
                    for(var i_sub = i_sec + 1; i_sub < layoutSections.length; i_sub++) {
                        var curSubSecName = layoutSections[i_sub].section_name;
                        var curSubCols = layoutSections[i_sub].columns;
    
                        if(curSubCols.length <= leftOverCols) {
                            // add the section group box to the layout.
                            curHBoxLayout.addWidget(getSectionGroupBox(curSubSecName, 
                                curSubCols, pData));
                            seenSections.push(curSubSecName);
                            leftOverCols =- curSubCols.length;
                        } else {
                            break;
                        }
    
                        if(leftOverCols <= 0) {
                            break;
                        }
                    }
    
                    if(leftOverCols > 0) {
                        for(; leftOverCols > 0; leftOverCols--) {
                            curHBoxLayout.addSpacing();
                        }
                    }
                }
            }
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We found errors trying to perform the non-space conserving group widget generating algorithm.",
                "MuseSuperChar.Widget.generateSpaceNonConservedWidget",
                {params: funcParams, thrownError: e});
        }

        return groupWidget;
    };

    var generateWidget = function(pStructure, pData, pIsLayoutSpaceConserved) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pStructure: pStructure,
            pData: pData,
            pIsLayoutSpaceConserved: pIsLayoutSpaceConserved
        };

        // Determine how far to take autolayout, including to make the most of 
        // the space.
        var isSpaceConserved;
        if(MuseUtils.realNull(pIsLayoutSpaceConserved) === null) {
            isSpaceConserved = MuseUtils.getFlagMetric("musesuperchar",
                "isLayoutSpaceConserved");
        } else {
            isSpaceConserved = pIsLayoutSpaceConserved;
        }

        try {
            if(isSpaceConserved) {
                return generateSpaceConservedWidget(pStructure, pData);
            } else {
                return generateSpaceNonConservedWidget(pStructure, pData);
            }
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to layout the various sections of our base window correctly.",
                "MuseSuperChar.Widget.generateWidget",
                {params: funcParams, thrownError: e});
        }
    };

    var extendFieldWidget = function(pFieldWidget) {
        if(MuseUtils.realNull(pFieldWidget.MSSC) !== null) {
            return;
        }

        pFieldWidget.MSSC = (function() {
            // set up our internal state
            var validationFunctions = [];

            var getValidationFailures = function() {
                var validationFailures = null;
                for(var i = 0; i < validationFunctions.length; i++) {
                    
                    var currFunc = validationFunctions[i];
                    var currFuncResult = currFunc();
                    
                    if(currFuncResult !== null) {
                        validationFailures = 
                            MuseUtils.coalesce(validationFailures,"") + 
                            currFuncResult + "\n";
                    }
                }

                return validationFailures;
            };

            var pushValidationFunction = function(pValFunc) {
                if(typeof pValFunc !== "function") {
                    throw new MuseUtils.ParameterException(
                        "musesuperchar",
                        "We can only accept parameterless functions and only " +
                        "those that return a validation failure message or " +
                        "null on success.",
                        "MSSC.pushValidationFunction",
                        {params: funcParams});
                }

                validationFunctions.push(pValFunc);
            };

            var clearValidationFunctions = function() {
                validationFunctions = [];
            };

            return {
                getValidationFailures: getValidationFailures,
                pushValidationFunction: pushValidationFunction,
                clearValidationFunctions: clearValidationFunctions
            };

        })();
    };

    var generateScWidget = function(pDataTypeIntName, pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pDataTypeIntName: pDataTypeIntName,
            pScInternalName: pScInternalName
        };

        var returnWidget;

        try {
            switch(pDataTypeIntName) {
            case pPublicApi.TEXTFIELD:
                returnWidget = toolbox.createWidget("XLineEdit", null, 
                    pScInternalName);
                break;
            case pPublicApi.TEXTAREA:
                returnWidget = toolbox.createWidget("XTextEdit",null,
                    pScInternalName);
                break;
            case pPublicApi.DATECLUSTER:
                returnWidget = toolbox.createWidget("DLineEdit", null,
                    pScInternalName);
                break;
            case pPublicApi.CHECKBOX:
                returnWidget = new XCheckBox();
                returnWidget.objectName = pScInternalName;
                break;
            case pPublicApi.COMBOBOX:
                returnWidget = new XComboBox(null, pScInternalName);
                returnWidget.allowNull = true;
                returnWidget.nullStr = "--Please Select--";
                break;
            case pPublicApi.WHOLENUMBER:
                returnWidget = MuseUtils.createNumericLineEdit(pScInternalName,
                    null, 0);
                break;
            case pPublicApi.DECIMALNUMBER:
                returnWidget = MuseUtils.createNumericLineEdit(pScInternalName,
                    null, 8);
                break;
            case pPublicApi.QTY:
                returnWidget = MuseUtils.createNumericLineEdit(pScInternalName,
                    null, toolbox.decimalPlaces("qty"));
                break;
            case pPublicApi.COST:
                returnWidget = MuseUtils.createNumericLineEdit(pScInternalName,
                    null, toolbox.decimalPlaces("cost"));
                break;
            case pPublicApi.PURCHPRICE:
                returnWidget = MuseUtils.createNumericLineEdit(pScInternalName,
                    null, toolbox.decimalPlaces("purchprice"));
                break;
            case pPublicApi.SALESPRICE:
                returnWidget = MuseUtils.createNumericLineEdit(pScInternalName,
                    null, toolbox.decimalPlaces("salesprice"));
                break;
            case pPublicApi.EXTPRICE:
                returnWidget = MuseUtils.createNumericLineEdit(pScInternalName,
                    null, toolbox.decimalPlaces("extprice"));
                break;
            case pPublicApi.WEIGHT:
                returnWidget = MuseUtils.createNumericLineEdit(pScInternalName,
                    null, toolbox.decimalPlaces("weight"));
                break;
            case pPublicApi.PERCENT:
                returnWidget = MuseUtils.createNumericLineEdit(pScInternalName,
                    null, toolbox.decimalPlaces("percent"));
                break;
            case pPublicApi.FILECLUSTER:
                returnWidget = toolbox.createWidget("FileCluster", null,
                    pScInternalName);
                break;
            case pPublicApi.IMAGECLUSTER:
                returnWidget = toolbox.createWidget("ImageCluster", null, 
                    pScInternalName);
                break;
            default:
                throw new MuseUtils.OutOfBoundsException(
                    "musesuperchar",
                    "We did not understand what kind of Super Characteristic widget to create.",
                    "MuseSuperChar.Widget.generateScWidget",
                    {params: funcParams});
            }

            extendFieldWidget(returnWidget);
            return returnWidget;
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to create the requested Super Characteristic widget.",
                "MuseSuperChar.Widget.generateScWidget",
                {params: funcParams, thrownError: e});
        }
    };

    var returnValidatorExceptions = function(pScDefs) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScDefs: pScDefs
        };

        var returnValExcept = null;

        for(var currSc in pScDefs) {
            if(pScDefs.hasOwnProperty(currSc) && 
                pScDefs[currSc].hasOwnProperty("MSSC")) {
                var currResult;
                try {
                    currResult = pScDefs[currSc].MSSC.getValidationFailures();
                } catch(e) {
                    throw new MuseUtils.ApiException(
                        "musesuperchar",
                        "We encountered an error while executing a Super Characteristic's validation functions.",
                        "MuseSuperChar.Widget.returnValidatorExceptions",
                        {params: funcParams, thrownError: e});
                }
                if(currResult !== null) {
                    returnValExcept = MuseUtils.coalesce(returnValExcept, "") +
                        currResult;
                }
            }
        }

        return returnValExcept;
    };

    var returnAllValidatorExceptions = function() {
        var returnValExcept = null;
        for(var currEntity in MuseSuperChar.Data.Entities) {
            if(MuseSuperChar.Data.Entities.hasOwnProperty(currEntity) &&
                MuseSuperChar.Data.Entities[currEntity].hasOwnProperty("scdefs")) {
                var currResult = returnValidatorExceptions(
                    MuseSuperChar.Data.Entities[currEntity].scdefs);
                if(currResult !== null) {
                    returnValExcept = MuseUtils.coalesce(returnValExcept, "") +
                        currResult;
                }
            }
        }

        return returnValExcept;
    };


    //--------------------------------------------------------------------
    //  Public Interface -- Functions
    //--------------------------------------------------------------------
    pPublicApi.MSSCViolationsDialog = function(pViolationData, pParent) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pViolationData: pViolationData
        };
        
        if(!pViolationData.hasOwnProperty("violation_count")) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "The violations data passed to us in not in a format we understand.",
                "MuseSuperChar.Widget.pPublicApi.MSSCViolationsDialog",
                {params: funcParams});
        } else if(pViolationData.violation_count === 0) {
            throw new MuseUtils.OutOfBoundsException(
                "musesuperchar",
                "We cannot display validator violations when there are no violations.",
                "MuseSuperChar.Widget.pPublicApi.MSSCViolationsDialog",
                {params: funcParams});
        }

        return MSSCViolationsDialog(pViolationData, pParent);
    };

    pPublicApi.generateWidget = function(pStructure, pData, pIsLayoutSpaceConserved) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pStructure: pStructure,
            pData: pData,
            pIsLayoutSpaceConserved: pIsLayoutSpaceConserved
        };
        
        if(MuseUtils.realNull(pStructure) === null ||
            !pStructure.hasOwnProperty("scgrp_internal_name") ||
            !pStructure.hasOwnProperty("layout")) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not receive a well formed structure object from which we can generate a Group Widget.",
                "MuseSuperChar.Widget.pPublicApi.generateWidget",
                {params: funcParams});
        }

        if(MuseUtils.realNull(pData) === null ||
            !(pData instanceof Object)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not receive a well formed data object from which we can generate a Group Widget.",
                "MuseSuperChar.Widget,pPublicApi.generateWidget",
                {params: funcParams});
        }

        return generateWidget(pStructure, pData, pIsLayoutSpaceConserved);
    };

    pPublicApi.generateTextFieldWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateTextFieldWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.TEXTFIELD, pScInternalName);
    };

    pPublicApi.generateTextAreaWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateTextAreaWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.TEXTAREA, pScInternalName);
    };

    pPublicApi.generateDateClusterWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateDateClusterWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.DATECLUSTER, pScInternalName);
    };

    pPublicApi.generateCheckBoxWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateCheckBoxWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.CHECKBOX, pScInternalName);
    };

    pPublicApi.generateComboBoxWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        

        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateComboBoxWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.COMBOBOX, pScInternalName);
    };

    pPublicApi.generateWholeNumberWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateWholeNumberWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.WHOLENUMBER, pScInternalName);
    };

    pPublicApi.generateDecimalNumberWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateDecimalNumberWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.DECIMALNUMBER, pScInternalName);
    };

    pPublicApi.generateQtyWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateQtyWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.QTY, pScInternalName);
    };

    pPublicApi.generateCostWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateCostWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.COST, pScInternalName);
    };

    pPublicApi.generatePurchPriceWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generatePurchPriceWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.PURCHPRICE, pScInternalName);
    };

    pPublicApi.generateSalesPriceWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateSalesPriceWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.SALESPRICE, pScInternalName);
    };

    pPublicApi.generateExtPriceWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateExtPriceWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.EXTPRICE, pScInternalName);
    };

    pPublicApi.generateWeightWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateWeightWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.WEIGHT, pScInternalName);
    };

    pPublicApi.generatePercentWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generatePercentWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.PERCENT, pScInternalName);
    };

    pPublicApi.generateFileClusterWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateFileClusterWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.FILECLUSTER, pScInternalName);
    };

    pPublicApi.generateImageClusterWidget = function(pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScInternalName: pScInternalName
        };
        
        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateImageClusterWidget",
                {params: funcParams});
        }

        return generateScWidget(pPublicApi.IMAGECLUSTER, pScInternalName);
    };

    pPublicApi.generateScWidget = function(pDataTypeIntName, pScInternalName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pDataTypeIntName: pDataTypeIntName,
            pScInternalName: pScInternalName
        };

        if(!pPublicApi.WIDGETTYPES.includes(pDataTypeIntName)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid data type in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateScWidget",
                {params: funcParams});
        }

        if(MuseUtils.coalesce(pScInternalName, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid name in order to create the desired Super Characteristic widget.",
                "MuseSuperChar.Widget.pPublicApi.generateScWidget",
                {params: funcParams});
        }

        return generateScWidget(pDataTypeIntName, pScInternalName);
    };

    pPublicApi.returnValidatorExceptions = function(pScDefs) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScDefs: pScDefs
        };

        if(MuseUtils.realNull(pScDefs) === null) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a valid data object to look for Super Characteristic validation exceptions.",
                "MuseSuperChar.Widget.pPublicApi.returnValidatorExceptions",
                {params: funcParams});
        }

        return returnValidatorExceptions(pScDefs);
    };

    pPublicApi.returnAllValidatorExceptions = function() {
        return returnAllValidatorExceptions();
    };


})(this.MuseSuperChar.Widget);

