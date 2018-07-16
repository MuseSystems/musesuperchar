/*************************************************************************
 *************************************************************************
 **
 ** File:        museScCreateEntity.js
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

    if (typeof MuseSuperChar.CreateEntity === "undefined") {
        MuseSuperChar.CreateEntity = {};
    }

    //////////////////////////////////////////////////////////////////////////
    //  Imports
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseUtils === "undefined") {
        include("museUtils");
    }

    MuseUtils.loadMuseUtils([MuseUtils.MOD_JS, MuseUtils.MOD_EXCEPTION]);

    if (typeof MuseSuperChar.Entity === "undefined") {
        include("museScEntityData");
    }
} catch (e) {
    if (
        typeof MuseUtils !== "undefined" &&
        (MuseUtils.isMuseUtilsExceptionLoaded === true ? true : false)
    ) {
        var error = new MuseUtils.ScriptException(
            "musesuperchar",
            "We encountered a script level issue while processing MuseSuperChar.CreateEntity.",
            "MuseSuperChar.CreateEntity",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.CreateEntity Script Error",
            "We encountered a script level issue while processing MuseSuperChar.CreateEntity."
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

        //--------------------------------------------------------------------
        //  Get Object References From Screen Definitions
        //--------------------------------------------------------------------
        var formLayout = mywindow.findChild("formLayout");
        var schemaXLabel = mywindow.findChild("schemaXLabel");
        var schemaXComboBox = mywindow.findChild("schemaXComboBox");
        var tableXLabel = mywindow.findChild("tableXLabel");
        var tableXComboBox = mywindow.findChild("tableXComboBox");
        var keyXLabel = mywindow.findChild("keyXLabel");
        var keyXComboBox = mywindow.findChild("keyXComboBox");
        var saveDialogButtonBox = mywindow.findChild("saveDialogButtonBox");
        var displayNameXLabel = mywindow.findChild("displayNameXLabel");
        var displayNameXLineEdit = mywindow.findChild("displayNameXLineEdit");

        // Get standard button references.
        var saveQPushButton = saveDialogButtonBox.button(QDialogButtonBox.Save);

        //--------------------------------------------------------------------
        //  Custom Screen Objects and Starting GUI Manipulation
        //--------------------------------------------------------------------
        schemaXComboBox.allowNull = true;
        schemaXComboBox.nullStr = "-- Please Select --";
        tableXComboBox.allowNull = false;
        keyXComboBox.allowNull = false;

        //--------------------------------------------------------------------
        //  Private Functional Logic
        //--------------------------------------------------------------------
        var clear = function() {
            schemaXLabel.clear();
            tableXComboBox.clear();
            keyXComboBox.clear();
        };

        var setNewMode = function() {
            mode = "new";
            schemaXComboBox.enabled = true;
            tableXComboBox.enabled = true;
            keyXComboBox.enabled = true;
            displayNameXLineEdit.enabled = true;
        };

        var setEditMode = function(pEntityId) {
            mode = "edit";
            schemaXComboBox.enabled = false;
            tableXComboBox.enabled = false;
            displayNameXLineEdit.enabled = true;

            if (!MuseSuperChar.Entity.isSuperCharTablePopulated(pEntityId)) {
                keyXComboBox.enabled = true;
            } else {
                keyXComboBox.enabled = false;
            }
        };

        var populateSchemata = function() {
            schemaXComboBox.populate(MuseSuperChar.Entity.getSchemata());
        };

        var populateTables = function() {
            // If no schema has been selected, just return since we only populate
            // tables when we know the schema.
            if (!MuseUtils.isValidId(schemaXComboBox.id())) {
                return;
            }

            tableXComboBox.populate(
                MuseSuperChar.Entity.getTablesBySchema(
                    schemaXComboBox.text,
                    true
                )
            );
        };

        var populateKeys = function() {
            // If no table has been selected, just return since we only populate
            // unique keys when we know the table.
            if (!MuseUtils.isValidId(tableXComboBox.id())) {
                return;
            }

            keyXComboBox.populate(
                MuseSuperChar.Entity.getUniqueKeysByTable(
                    schemaXComboBox.text,
                    tableXComboBox.text
                )
            );
        };

        var setButtons = function() {
            if (
                MuseUtils.isValidId(keyXComboBox.id()) &&
                displayNameXLineEdit.text.length > 1
            ) {
                saveQPushButton.enabled = true;
            } else {
                saveQPushButton.enabled = false;
            }
        };

        var populateEntity = function(pEntityId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pEntityId: pEntityId
            };

            var entityData = MuseSuperChar.Entity.getEntityById(pEntityId);

            schemaXComboBox.clear();
            schemaXComboBox.append(1, entityData.entity_schema);
            schemaXComboBox.setId(1);

            tableXComboBox.clear();
            tableXComboBox.append(1, entityData.entity_table);
            tableXComboBox.setId(1);

            populateKeys();
            keyXComboBox.setText(entityData.entity_pk_column);

            if (keyXComboBox.text != entityData.entity_pk_column) {
                throw new MuseUtils.OutOfBoundsException(
                    "musesuperchar",
                    "We could not properly set the unique key field as requested,",
                    "MuseSuperChar.CreateEntity.populateEntity",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            displayNameXLineEdit.text = entityData.entity_display_name;
        };

        var saveEntity = function() {
            var entityData = {
                entity_schema: schemaXComboBox.text,
                entity_table: tableXComboBox.text,
                entity_display_name: displayNameXLineEdit.text,
                entity_pk_column: keyXComboBox.text
            };

            var savedEntityId;

            if (mode == "new") {
                if (
                    !MuseUtils.isValidId(
                        MuseSuperChar.Entity.createEntity(entityData)
                    )
                ) {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We could not confirm that we successfully saved a new entity record as requested.",
                        "MuseSuperChar.CreateEntity.saveEntity",
                        { context: { entityData: entityData } },
                        MuseUtils.LOG_WARNING
                    );
                }
            } else if (mode == "edit") {
                var updateTarget = MuseSuperChar.Entity.getEntitiesBySchemaTable(
                    entityData.entity_schema,
                    entityData.entity_table
                );

                entityData.entity_id = updateTarget.entity_id;
                if (
                    !MuseUtils.isValidId(
                        MuseSuperChar.Entity.updateEntity(entityData)
                    )
                ) {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We could not confirm that we successfully updated an entity record as requested.",
                        "MuseSuperChar.CreateEntity.saveEntity",
                        { context: { entityData: entityData } },
                        MuseUtils.LOG_WARNING
                    );
                }
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We could not successfully save the entity record as requested.",
                    "MuseSuperChar.CreateEntity.saveEntity",
                    { context: { entityData: entityData } },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        //--------------------------------------------------------------------
        //  Public Interface -- Slots
        //--------------------------------------------------------------------
        pPublicApi.sCancel = function() {
            mywindow.close();
        };

        pPublicApi.sSave = function() {
            try {
                saveEntity();
                mywindow.close();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to a request to save a record.",
                    "MuseSuperChar.CreateEntity.pPublicApi.sSave",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sSchemaUpdated = function(pSchemaOid) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSchemaOid: pSchemaOid
            };

            try {
                populateTables();
                populateKeys();
                setButtons();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to an update to the schema field.",
                    "MuseSuperChar.CreateEntity.pPublicApi.sSchemaUpdated",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sTableUpdated = function(pTableOid) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pTableOid: pTableOid
            };

            try {
                populateKeys();
                setButtons();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to an update to the table field.",
                    "MuseSuperChar.CreateEntity.pPublicApi.sTableUpdated",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sKeyUpdated = function(pColumnRowNum) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pColumnRowNum: pColumnRowNum
            };

            try {
                setButtons();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to an updated key column field.",
                    "MuseSuperChar.CreateEntity.pPublicApi.sKeyUpdated",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
            }
        };

        pPublicApi.sDisplayNameUpdated = function() {
            try {
                setButtons();
            } catch (e) {
                var error = new MuseUtils.FormException(
                    "musesuperchar",
                    "We found problems while responding to an update to the display name field.",
                    "MuseSuperChar.CreateEntity.pPublicApi.sDisplayNameUpdated",
                    { thrownError: e },
                    MuseUtils.LOG_CRITICAL
                );
                MuseUtils.displayError(error, mywindow);
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
                populateSchemata();
                populateTables();
                populateKeys();
                setNewMode();
            } else if (pParams.mode == "edit") {
                if (!MuseUtils.isValidId(pParams.entity_id)) {
                    throw new MuseUtils.ParameterException(
                        "musesuperchar",
                        "We did not understand which entity you wished to edit.",
                        "MuseSuperChar.CreateEntity.pPublicApi.set",
                        { params: funcParams },
                        MuseUtils.LOG_WARNING
                    );
                }

                populateEntity(pParams.entity_id);
                setEditMode(pParams.entity_id);
            } else {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand what mode to use for the form.",
                    "Fully Qualified Function Name",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            setButtons();
            //----------------------------------------------------------------
            //  Set Timed Connects/Disconnects
            //----------------------------------------------------------------
            saveDialogButtonBox["rejected()"].connect(pPublicApi.sCancel);
            saveDialogButtonBox["accepted()"].connect(pPublicApi.sSave);
            schemaXComboBox["newID(int)"].connect(pPublicApi.sSchemaUpdated);
            tableXComboBox["newID(int)"].connect(pPublicApi.sTableUpdated);
            keyXComboBox["newID(int)"].connect(pPublicApi.sKeyUpdated);
            displayNameXLineEdit["editingFinished()"].connect(
                pPublicApi.sDisplayNameUpdated
            );
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
                mywindow.close();
            }
        };
    } catch (e) {
        var error = new MuseUtils.ModuleException(
            "musesuperchar",
            "We enountered a MuseSuperChar.CreateEntity module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.CreateEntity",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.CreateEntity, this);
