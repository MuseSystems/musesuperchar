// File:        museScUnifiedSetup.js
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

    if (typeof MuseSuperChar.UnifiedSetup === "undefined") {
        MuseSuperChar.UnifiedSetup = {};
    }

    //////////////////////////////////////////////////////////////////////////
    //  Imports
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseUtils === "undefined") {
        include("museUtils");
    }

    MuseUtils.loadMuseUtils([MuseUtils.MOD_EXCEPTION]);
} catch (e) {
    if (
        typeof MuseUtils !== "undefined" &&
        (MuseUtils.isMuseUtilsExceptionLoaded === true ? true : false)
    ) {
        var error = new MuseUtils.ScriptException(
            "musesuperchar",
            "We encountered a script level issue while processing MuseSuperChar.UnifiedSetup.",
            "MuseSuperChar.UnifiedSetup",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.UnifiedSetup Script Error",
            "We encountered a script level issue while processing MuseSuperChar.UnifiedSetup."
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
        var museScUnifiedSetup = mywindow.findChild("museScUnifiedSetup");
        var superCharSetupTabWidget = mywindow.findChild(
            "superCharSetupTabWidget"
        );
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
        if (!this.MuseSuperChar.GroupMaint) {
            include("museScGroupMaint");
        }

        var superCharMaint = toolbox.loadUi("museSuperCharMaint");
        superCharTabVBoxLayout.addWidget(superCharMaint);
        if (!this.MuseSuperChar.SuperCharMaint) {
            include("museSuperCharMaint");
        }

        groupsTab.enabled = privileges.check("maintainSuperCharGroups");
        superCharTab.enabled = privileges.check("maintainSuperCharateristics");

        //--------------------------------------------------------------------
        //  Private Functional Logic
        //--------------------------------------------------------------------

        //--------------------------------------------------------------------
        //  Public Interface -- Functions
        //--------------------------------------------------------------------
    } catch (e) {
        var error = new MuseUtils.ModuleException(
            "musesuperchar",
            "We enountered a MuseSuperChar.UnifiedSetup module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.UnifiedSetup",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.UnifiedSetup, this);
