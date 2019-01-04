// File:        museScLoader.js
// Location:    musesuperchar/client/scripts/libraries
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

    if (typeof MuseSuperChar.Loader === "undefined") {
        MuseSuperChar.Loader = {};
    }

    //////////////////////////////////////////////////////////////////////////
    //  Imports
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseUtils === "undefined") {
        include("museUtils");
    }

    MuseUtils.loadMuseUtils([
        MuseUtils.MOD_EXCEPTION,
        MuseUtils.MOD_DB,
        MuseUtils.MOD_JS,
        MuseUtils.MOD_JSPOLYFILL,
        MuseUtils.MOD_CONFIG
    ]);
} catch (e) {
    if (
        typeof MuseUtils !== "undefined" &&
        (MuseUtils.isMuseUtilsExceptionLoaded === true ? true : false)
    ) {
        var error = new MuseUtils.ScriptException(
            "musesuperchar",
            "We encountered a script level issue while processing MuseSuperChar.Loader.",
            "MuseSuperChar.Loader",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.Loader Script Error",
            "We encountered a script level issue while processing MuseSuperChar.Loader."
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
        var PREFIX = MuseUtils.getTextMetric("musesuperchar", "widgetPrefix");

        var entityObjectName;
        //--------------------------------------------------------------------
        //  Private Functional Logic
        //--------------------------------------------------------------------
        var getGroupWidget = function(pScGrpIntName) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pScGrpIntName: pScGrpIntName
            };

            try {
                var groupsWidget = toolbox.loadUi(PREFIX + "_" + pScGrpIntName);

                if (MuseUtils.realNull(groupsWidget) === null) {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not find the requested group form.",
                        "MuseSuperChar.Loader.getGroupWidget",
                        { params: funcParams },
                        MuseUtils.LOG_WARNING
                    );
                }

                return groupsWidget;
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We could not create the requested group widget.",
                    "MuseSuperChar.Loader.getGroupWidget",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getWidgetContainer = function(pGroupForms) {
            var groupsWidget;
            var groupsVBoxLayout;
            var groupsTabWidget;

            try {
                groupsWidget = new QWidget();
                groupsWidget.setObjectName(PREFIX + "ScGrpWidget");
                groupsVBoxLayout = new QBoxLayout(QBoxLayout.TopToBottom);
                groupsVBoxLayout.objectName = PREFIX + "ScGrpWidgetVBoxLayout";
                groupsWidget.setLayout(groupsVBoxLayout);
                groupsTabWidget = new QTabWidget();
                groupsVBoxLayout.addWidget(groupsTabWidget);
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to create a container widget for the desired " +
                        "entity/group(s).",
                    "MuseSuperChar.Loader.getSuperCharWidget",
                    { thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }

            groupsWidget.memberSetFuncs = [];
            groupsWidget.isInitialized = false;

            groupsWidget.initGroupForms = function() {
                try {
                    if (this.isInitialized) {
                        return;
                    }

                    for (var i = 0; i < pGroupForms.length; i++) {
                        var currScGrpIntName =
                            pGroupForms[i].scgrp_internal_name;
                        var currScGrpDispName =
                            pGroupForms[i].scgrp_display_name;
                        // Load the Group Widget UI
                        groupsTabWidget.addTab(
                            getGroupWidget(currScGrpIntName),
                            currScGrpDispName
                        );
                        var formObjectName = currScGrpIntName
                            .split("_")
                            .map(function(w) {
                                var ret =
                                    w[0].toUpperCase() +
                                    w.substr(1).toLowerCase();
                                return ret;
                            })
                            .join("");

                        if (
                            !MuseSuperChar.Groups ||
                            !MuseSuperChar.Groups[formObjectName]
                        ) {
                            include(PREFIX + "_" + currScGrpIntName);
                        }

                        this.memberSetFuncs.push(
                            MuseSuperChar.Groups[formObjectName].set
                        );
                    }

                    this.isInitialized = true;
                } catch (e) {
                    throw new MuseUtils.ApiException(
                        "musesuperchar",
                        "We found errors while calling an API function.",
                        "MuseSuperChar.Loader.groupsWidget.addGroup",
                        { thrownError: e },
                        MuseUtils.LOG_WARNING
                    );
                }
            };

            return groupsWidget;
        };

        var getScGrpData = function(pEntityDataTable, pScGrpIntName) {
            var scGrpParams = { pEntityDataTable: pEntityDataTable };

            if (pScGrpIntName !== null) {
                // We need to load all valid groups for the entity and put each
                // on a separate tab in the groups widget.
                scGrpParams.pScGrpIntName = pScGrpIntName;
            }

            var scGrpQry;

            try {
                scGrpQry = MuseUtils.executeQuery(
                    "SELECT   DISTINCT scgrp_internal_name " +
                        ",scgrp_display_name " +
                        "FROM musesuperchar.entity_scgrp_ass " +
                        "JOIN musesuperchar.entity " +
                        "ON entity_scgrp_ass_entity_id = entity_id " +
                        "JOIN musesuperchar.scgrp " +
                        "ON entity_scgrp_ass_scgrp_id = scgrp_id " +
                        "JOIN musesuperchar.scdef_scgrp_ass " +
                        "ON scdef_scgrp_ass_scgrp_id = scgrp_id " +
                        "WHERE entity_data_table = <? value('pEntityDataTable') ?> " +
                        "<? if exists('pScGrpIntName') ?> " +
                        "AND scgrp_internal_name = <? value('pScGrpIntName') ?> " +
                        "<? endif ?> " +
                        "AND scgrp_is_active " +
                        "AND entity_is_active " +
                        "AND entity_scgrp_ass_is_active " +
                        "AND scdef_scgrp_ass_is_active " +
                        "ORDER BY scgrp_display_name ",
                    scGrpParams
                );
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered problems trying to retrieve the Super Characteristic group data associated with the requested entity.",
                    "MuseSuperChar.Loader.getScGrpData",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }

            // We wanted to return only if we had rows... but the ability to reset
            // to before the first record has been denied us.  So just return
            // whatever.
            return scGrpQry;
        };

        var addExtendFuncsToWidget = function(pGroupsWidget, pEntityObject) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupsWidget: pGroupsWidget,
                pEntityObject: pEntityObject
            };

            // first we extend with the data related functions.
            var keys = Object.keys(pEntityObject);

            for (var i = 0; i < keys.length; i++) {
                if (typeof pEntityObject[keys[i]] == "function") {
                    pGroupsWidget[keys[i]] = pEntityObject[keys[i]];
                }
            }

            pGroupsWidget.dataRecId = -1;

            // Next we add our higher level management functions
            pGroupsWidget.initWidget = function(pFormMode, pParentRecId) {
                // Capture function parameters for later exception references.
                var funcParams = {
                    pFormMode: pFormMode,
                    pParentRecId: pParentRecId
                };

                if (!["new", "edit", "view"].includes(pFormMode)) {
                    throw new MuseUtils.ParameterException(
                        "musesuperchar",
                        "We could not tell if the form was being opened in 'new', 'edit' or 'view' mode.",
                        "MuseSuperChar.Loader.groupsWidget.initWidget",
                        { params: funcParams },
                        MuseUtils.LOG_WARNING
                    );
                }

                if (
                    MuseUtils.realNull(pParentRecId) !== null &&
                    !MuseUtils.isValidId(pParentRecId)
                ) {
                    throw new MuseUtils.ParameterException(
                        "musesuperchar",
                        "We did not understand the parent record id you passed to us.",
                        "MuseSuperChar.Loader.groupsWidget.initWidget",
                        { params: funcParams },
                        MuseUtils.LOG_WARNING
                    );
                }

                // Load the widget forms since we should be attached to "mywindow"
                // at this point.
                this.initGroupForms();

                // Initialize the data side, then call the form set functions.
                var dataRecId;

                try {
                    if (pParentRecId !== null) {
                        dataRecId = pEntityObject.initFormData(
                            pEntityObject.getDataRecIdByParentId(pParentRecId)
                        );
                    } else {
                        dataRecId = pEntityObject.initFormData();
                    }
                } catch (e) {
                    throw new MuseUtils.ApiException(
                        "musesuperchar",
                        "We failed to load the requested form data object.",
                        "MuseSuperChar.Loader.groupsWidget.initWidget",
                        { params: funcParams, thrownError: e },
                        MuseUtils.LOG_WARNING
                    );
                }

                var widgetParams = {
                    mode: pFormMode,
                    entity_object_name: entityObjectName,
                    data_record_id: dataRecId
                };

                try {
                    for (var i = 0; i < this.memberSetFuncs.length; i++) {
                        this.memberSetFuncs[i](widgetParams);
                    }
                } catch (e) {
                    throw new MuseUtils.ApiException(
                        "musesuperchar",
                        "We failed to initialize the group forms.",
                        "MuseSuperChar.Loader.groupsWidget.initWidget",
                        { params: funcParams, thrownError: e },
                        MuseUtils.LOG_WARNING
                    );
                }

                this.dataRecId = dataRecId;

                return dataRecId;
            };

            pGroupsWidget.save = function(pParentRecId, pModeAfterSave) {
                // Capture function parameters for later exception references.
                var funcParams = {
                    pParentRecId: pParentRecId,
                    pModeAfterSave: pModeAfterSave
                };

                if (
                    MuseUtils.realNull(pModeAfterSave) !== null &&
                    !["new", "edit", "view"].includes(pModeAfterSave)
                ) {
                    throw new MuseUtils.ParameterException(
                        "musesuperchar",
                        "We could not tell if the form was being opened in 'new', 'edit' or 'view' mode.",
                        "MuseSuperChar.Loader.groupsWidget.save",
                        { params: funcParams },
                        MuseUtils.LOG_WARNING
                    );
                }

                try {
                    if (MuseUtils.isValidId(pParentRecId)) {
                        pEntityObject.setParentRecId(
                            this.dataRecId,
                            pParentRecId
                        );
                    }

                    this.dataRecId = pEntityObject.saveFormData(this.dataRecId);
                } catch (e) {
                    throw new MuseUtils.ApiException(
                        "musesuperchar",
                        "We failed to save the Super Characteristic data as requested.",
                        "MuseSuperChar.Loader.groupsWidget.save",
                        { params: funcParams, thrownError: e },
                        MuseUtils.LOG_WARNING
                    );
                }

                var widgetParams = {
                    entity_object_name: entityObjectName,
                    data_record_id: this.dataRecId
                };

                if (MuseUtils.realNull(pModeAfterSave) !== null) {
                    widgetParams.mode = pModeAfterSave;
                }

                try {
                    for (var i = 0; i < this.memberSetFuncs.length; i++) {
                        this.memberSetFuncs[i](widgetParams);
                    }
                } catch (e) {
                    throw new MuseUtils.ApiException(
                        "musesuperchar",
                        "We failed to initialize the group forms.",
                        "MuseSuperChar.Loader.groupsWidget.save",
                        { params: funcParams, thrownError: e },
                        MuseUtils.LOG_WARNING
                    );
                }

                return this.dataRecId;
            };

            pGroupsWidget.getCurrentDataRecId = function() {
                return this.dataRecId;
            };

            // This function exists purely for side effects and as such there is
            // no return.
        };

        var getSuperCharWidget = function(pEntityDataTable, pScGrpIntName) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pEntityDataTable: pEntityDataTable,
                pScGrpIntName: pScGrpIntName
            };

            var scGrpQry = getScGrpData(pEntityDataTable, pScGrpIntName);

            // Next set up our widget
            // Create a widget which will be what we will ultimately return to the
            // caller.
            var groupsWidget;

            try {
                // We have to lazily load our group forms since the widget container
                // must be added to "mywindow" prior to loading the group form
                // scripts... (they all mywindow.findChild).  So we'll collect the
                // list of form widgets that we'll populate on initialize.  We need
                // an array since we want to guarantee query result order when we
                // build the forms.
                var groupForms = [];

                while (scGrpQry.next()) {
                    groupForms.push({
                        scgrp_internal_name: scGrpQry.value(
                            "scgrp_internal_name"
                        ),
                        scgrp_display_name: scGrpQry.value("scgrp_display_name")
                    });
                }

                if (groupForms.length === 0) {
                    return null;
                }

                groupsWidget = getWidgetContainer(groupForms);
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to generate the groups widget.",
                    "MuseSuperChar.Loader.getSuperCharWidget",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }

            entityObjectName = pEntityDataTable
                .split("_")
                .map(function(w) {
                    var ret = w[0].toUpperCase() + w.substr(1).toLowerCase();
                    return ret;
                })
                .join("");

            // Now load the correct data object
            if (!MuseSuperChar.Data || !MuseSuperChar.Data[entityObjectName]) {
                include(PREFIX + "_" + pEntityDataTable);
            }

            if (!MuseSuperChar.Data[entityObjectName]) {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We failed to verify that the entity data script was successfully loaded.",
                    "MuseSuperChar.Loader.getSuperCharWidget",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            // Add standard slots for signal connections, most of these will just
            // be restating the entity data script functions for convenience.
            addExtendFuncsToWidget(
                groupsWidget,
                MuseSuperChar.Data[entityObjectName]
            );

            // Return an Object to the caller that includes a reference to the
            // data object and the widget.
            return groupsWidget;
        };
        //--------------------------------------------------------------------
        //  Public Interface -- Functions
        //--------------------------------------------------------------------
        pPublicApi.getSuperCharWidget = function(
            pEntityDataTable,
            pScGrpIntName
        ) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pEntityDataTable: pEntityDataTable,
                pScGrpIntName: pScGrpIntName
            };

            if (MuseUtils.realNull(pEntityDataTable) === null) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which entity you wished to load into a form.",
                    "MuseSuperChar.Loader.pPublicApi.getSuperCharWidget",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            try {
                return getSuperCharWidget(
                    pEntityDataTable,
                    MuseUtils.realNull(pScGrpIntName)
                );
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "There were problems retrieving the requested entity Super Characteristic widget.",
                    "MuseSuperChar.Loader.pPublicApi.getSuperCharWidget",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };
    } catch (e) {
        var error = new MuseUtils.ModuleException(
            "musesuperchar",
            "We enountered a MuseSuperChar.Loader module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.Loader",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.Loader, this);
