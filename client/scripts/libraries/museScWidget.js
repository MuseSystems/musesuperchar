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
        violationsXTreeWidget.addColumn("Validation Rule ID", 45, Qt.AlignCenter, false, "conditional_validation_rule_id");
        violationsXTreeWidget.addColumn("Validation Rule", 400, Qt.AlignLeft, true, "conditional_validation_rule_fails_message_text");
        violationsXTreeWidget.addColumn("If Validator ID", 45, Qt.AlignCenter, false, "if_validator_type_id");
        violationsXTreeWidget.addColumn("If Validator", 150, Qt.AlignLeft, false, "if_validator_type_display_name");
        violationsXTreeWidget.addColumn("Then Validator ID", 45, Qt.AlignCenter, false, "then_validator_type_id");
        violationsXTreeWidget.addColumn("Then Validator", 150, Qt.AlignLeft, false, "then_validator_type_display_name");
        violationsXTreeWidget.addColumn("Entity ID", 45, Qt.AlignCenter, false, "entity_id");
        violationsXTreeWidget.addColumn("Entity Data Table", 150, Qt.AlignLeft, false, "entity_data_table");
        violationsXTreeWidget.addColumn("Entity", 150, Qt.AlignLeft, true, "entity_display_name");
        violationsXTreeWidget.addColumn("SuperChar ID", 45, Qt.AlignCenter, false, "sc_def_id");
        violationsXTreeWidget.addColumn("SuperChar Internal Name", 150, Qt.AlignLeft, false, "sc_def_internal_name");
        violationsXTreeWidget.addColumn("SuperChar", 150, Qt.AlignLeft, true, "sc_def_display_name");

        // Update the data
        messageTextXLabel.text = "The proposed actions would cause " + 
            pViolationData.violation_count + " violations.\n\n" +
            "The violations that would occur are listed below.";

        for(var i = 0; i < pViolationData.violations.length; i++) {
            var currXTreeWidgetItem = new XTreeWidgetItem(violationsXTreeWidget, i);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("conditional_validation_rule_id"), 
                pViolationData.violations[i].conditional_validation_rule_id);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("conditional_validation_rule_fails_message_text"), 
                pViolationData.violations[i].conditional_validation_rule_fails_message_text);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("if_validator_type_id"), 
                pViolationData.violations[i].if_validator_type_id);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("if_validator_type_display_name"), 
                pViolationData.violations[i].if_validator_type_display_name);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("then_validator_type_id"), 
                pViolationData.violations[i].then_validator_type_id);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("then_validator_type_display_name"), 
                pViolationData.violations[i].then_validator_type_display_name);
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
                violationsXTreeWidget.column("sc_def_id"), 
                pViolationData.violations[i].sc_def_id);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("sc_def_internal_name"), 
                pViolationData.violations[i].sc_def_internal_name);
            currXTreeWidgetItem.setText(
                violationsXTreeWidget.column("sc_def_display_name"), 
                pViolationData.violations[i].sc_def_display_name);
        }
        
        // Connect the dialog OK button to a close function.
        okPushButton.clicked.connect(
            function() {
                dialogBox.accept();
            });

        return dialogBox;
    };

    //--------------------------------------------------------------------
    //  Public Interface -- Functions
    //--------------------------------------------------------------------
    pPublicApi.MSSCViolationsDialog = function(pViolationData, pParent) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pViolationData: pViolationData
        };
        QMessageBox.warning(mywindow, "DEBUG", JSON.stringify(pViolationData));
        
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
    
})(this.MuseSuperChar.Widget);

