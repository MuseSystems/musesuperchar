/*************************************************************************
 *************************************************************************
 **
 ** File:        museScCreateEntity.js
 ** Project:     Muse Systems xTuple Super Characteristic
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
this.MuseSuperChar.CreateEntity = this.MuseSuperChar.CreateEntity || {};

//////////////////////////////////////////////////////////////////////////
//  Imports
//////////////////////////////////////////////////////////////////////////

if(!this.MuseUtils) {
    include("museUtils");
}

if(!this.MuseSuperChar.Entity) {
    include("museScEntityData");
}

//////////////////////////////////////////////////////////////////////////
//  Module Defintion
//////////////////////////////////////////////////////////////////////////

(function(pPublicApi, pGlobal) {

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
    //  "Private" Functional Logic
    //--------------------------------------------------------------------
    var clear = function() {
        schemaXLabel.clear();
        tableXComboBox.clear();
        keyXComboBox.clear();
    };

    var populateSchemata = function() {
        schemaXComboBox.populate(MuseSuperChar.Entity.getSchemata());
    };

    var populateTables = function() {
        // If no schema has been selected, just return since we only populate
        // tables when we know the schema.
        if(!MuseUtils.isValidId(schemaXComboBox.id())) {
            return;
        }

        tableXComboBox.populate(MuseSuperChar.Entity.getTablesBySchema(
            schemaXComboBox.text, true));
    };

    var populateKeys = function() {
        // If no table has been selected, just return since we only populate
        // unique keys when we know the table.
        if(!MuseUtils.isValidId(tableXComboBox.id())) {
            return;
        }

        keyXComboBox.populate(MuseSuperChar.Entity.getUniqueKeysByTable(
            schemaXComboBox.text, tableXComboBox.text));
    };

    var setButtons = function() {
        if(MuseUtils.isValidId(keyXComboBox.id()) && 
            displayNameXLineEdit.text.length > 1) {
            saveQPushButton.enabled = true;
        } else {
            saveQPushButton.enabled = false;
        }
    };

    var saveEntity = function() {
        var entityData = {
                entity_schema: schemaXComboBox.text,
                entity_table: tableXComboBox.text,
                entity_display_name: displayNameXLineEdit.text,
                entity_pk_column: keyXComboBox.text
            };

        if(!MuseUtils.isValidId(MuseSuperChar.Entity.createEntity(entityData))) {
            throw new MuseUtils.NotFoundException(
                "musesuperchar",
                "We could not confirm that we successfully created the new entity record as requested.",
                "MuseSuperChar.CreateEntity.saveEntity",
                {});
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
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    pPublicApi.sSchemaUpdated = function(pSchemaOid) {
        try {
            populateTables();
            populateKeys();
            setButtons();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    pPublicApi.sTableUpdated = function(pTableOid) {
        try {
            populateKeys();
            setButtons();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    pPublicApi.sKeyUpdated = function(pColumnRowNum) {
        try {
            setButtons();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };

    pPublicApi.sDisplayNameUpdated = function() {
        try {
            setButtons();
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
        }
    };


    //--------------------------------------------------------------------
    //  Public Interface -- Functions
    //--------------------------------------------------------------------
    
    /**
     * Form startup initialization.  Standard part of the xTuple ERP 
     * startup process.
     * @param {Object} pParams An associative array of values passed from
     *                         the xTuple C++ forms which contain context
     *                         setting information.
     */
    pPublicApi.set = function(pParams) {
        populateSchemata();
        populateTables();
        populateKeys();
        setButtons();
        
        //----------------------------------------------------------------
        //  Connects/Disconnects
        //----------------------------------------------------------------
        saveDialogButtonBox["rejected()"].connect(pPublicApi.sCancel);
        saveDialogButtonBox["accepted()"].connect(pPublicApi.sSave);
        schemaXComboBox["newID(int)"].connect(pPublicApi.sSchemaUpdated);
        tableXComboBox["newID(int)"].connect(pPublicApi.sTableUpdated);
        keyXComboBox["newID(int)"].connect(pPublicApi.sKeyUpdated);
        displayNameXLineEdit["editingFinished()"].connect(
            pPublicApi.sDisplayNameUpdated);
    };
    
    //--------------------------------------------------------------------
    //  Foreign Script "Set" Handling
    //--------------------------------------------------------------------

    // "Set" handling base on suggestion of Gil Moskowitz/xTuple.
    var foreignSetFunc;

    // Lower graded scripts should be loaded prior to our call and as such we 
    // should be able to intercept their set functions.
    if(pGlobal.set === "function") {
        foreignSetFunc = pGlobal.set;
    } else {
        foreignSetFunc = function() {};
    }

    pGlobal.set = function(pParams) {
        try {
            foreignSetFunc(pParams);
            pPublicApi.set(pParams);
        } catch(e) {
            MuseUtils.displayError(e, mywindow);
            mywindow.close();
        }
        
    };

})(this.MuseSuperChar.CreateEntity, this);