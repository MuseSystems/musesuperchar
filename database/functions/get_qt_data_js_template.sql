/*************************************************************************
 *************************************************************************
 **
 ** File:         get_qt_data_js_template.sql
 ** Project:      Muse Systems Super Characteristics for xTuple ERP
 ** Author:       Steven C. Buttgereit
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
 
--
-- Returns the standard Super Characteristic Data Library JS Template.  We keep
-- it here since it just clutters the code where the specialization logic
-- resides.
--

CREATE OR REPLACE FUNCTION musesuperchar.get_qt_data_js_template() 
    RETURNS text AS
        $BODY$
            SELECT
$JS$
/*************************************************************************
 *************************************************************************
 **
 ** File:        %7$s%5$s
 ** Project:     Muse Systems Super Characteristics for xTuple ERP
 ** Author:      %4$s Script Automatically Generated On %8$s
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
this.MuseSuperChar.Data = this.MuseSuperChar.Data || {};
this.MuseSuperChar.Data.%5$s = this.MuseSuperChar.Data.%5$s || {};

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
    //  "Private" Constants & Data Structures
    //--------------------------------------------------------------------
    // Constants
    var DATA_STRUCT = 
        {
%1$s        };
    var PREFIX = MuseUtils.getTextMetric("musesuperchar", "widgetPrefix");
    var ENTITY_SCHEMA = "%2$s";
    var ENTITY_TABLE = "%3$s";
    var ENTITY_DISPLAY_NAME = "%4$s";
    var ENTITY_OBJECT_NAME = "%5$s";
    var SC_DATA_TABLE = "%6$s";
    var SC_DATA_TABLE_PK = SC_DATA_TABLE + "_id";
    var SC_DATA_TABLE_FK = SC_DATA_TABLE + "_" + ENTITY_TABLE + "_id";
    var METASQL_INSERT = PREFIX + "_" + SC_DATA_TABLE + "_insert";
    var METASQL_UPDATE = PREFIX + "_" + SC_DATA_TABLE + "_update";
    var METASQL_DELETE = PREFIX + "_" + SC_DATA_TABLE + "_delete";
    var METASQL_SELECT = PREFIX + "_" + SC_DATA_TABLE + "_select";
    
    // Mutable Data
    var data = {};

    // Hook Function Containers
    var onNewFuncs = [];
    var onLoadFuncs = [];
    var beforeSetFuncs = {};
    var afterSetFuncs = {};
    var beforeSaveFuncs = [];
    var afterSaveFuncs = [];

    //--------------------------------------------------------------------
    //  "Private" Functional Logic
    //--------------------------------------------------------------------
    
    var addOnNewHookFunc = function(pFunc) {
        onNewFuncs.push(pFunc);
    };

    var addOnLoadHookFunc = function(pFunc) {
        onLoadFuncs.push(pFunc);
    };

    var addBeforeSetHookFunc = function(pScIntName, pFunc) {
        beforeSetFuncs[pScIntName].push(pFunc);
    };

    var addAfterSetHookFunc = function(pScIntName, pFunc) {
        afterSetFuncs[pScIntName].push(pFunc);
    };

    var addBeforeSaveHookFunc = function(pFunc) {
        beforeSaveFuncs.push(pFunc);
    };

    var addAfterSaveHookFunc = function(pFunc) {
        afterSaveFuncs.push(pFunc);
    };

    var hookRunner = function(pHookFuncArray, pDataRecId, pNewValue) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pHookFuncArray: pHookFuncArray,
            pDataRecId: pDataRecId,
            pNewValue: pNewValue
        };

        var wrkObjCopy;
        Object.assign(wrkObjCopy, data[SC_DATA_TABLE + "_" + pDataRecId].working); 
        var returnText = "";

        for(var i = 0; i < pHookFuncArray.length; i++) {
            var hookReturn = "";
            
            if(typeof pHookFuncArray[i] === "function") {
                try {
                    hookReturn = pHookFuncArray[i](wrkObjCopy, pNewValue);
                } catch(e) {
                    throw new MuseUtils.ApiException(
                        "musesuperchar",
                        "We encountered a problem while running a 'hook' function.",
                        "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".hookRunner",
                        {params: funcParams, thrownError: e});
                }
            }

            if(MuseUtils.realNull(hookReturn) !== null) {
                returnText += (hookReturn + "\n\n");
            } 
        }

        return MuseUtils.realNull(returnText);
    };

    var loadFormData = function(pDataRecId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pDataRecId: pDataRecId
        };

        var recObjName = SC_DATA_TABLE + "_" + pDataRecId;
        
        try {
            var qryParams = Object.keys(DATA_STRUCT).reduce(
                function(acc, val) {
                    acc["select_" + val] = true;
                    return acc; 
                }, {});

            qryParams["where_" + SC_DATA_TABLE + "_id"] = pDataRecId;

            var entQry = MuseUtils.executeDbQuery("musesuperchar",METASQL_SELECT,qryParams);

            if(entQry.first()) {
                data[recObjName].database = entQry.firstJson();
                Object.assign(data[recObjName].working, data[recObjName].database);
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We failed to find the requested " + ENTITY_DISPLAY_NAME + 
                    " Super Characteristic data record.",
                    "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".loadFormData",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem loading " + ENTITY_DISPLAY_NAME + " form data.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".loadFormData",
                {params: funcParams, thrownError: e});
        }

        try {
            // Run our On Load Hooks.  If we get a non-null result, we display 
            // the message to the user.
            var onLoadResultMsg = hookRunner(onLoadFuncs, pDataRecId);

            if(onLoadResultMsg !== null) {
                QMessageBox.information(mywindow, "On " + 
                    ENTITY_DISPLAY_NAME + " Load Notices", onLoadResultMsg);
            }
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We received errors from on load hook function execution.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".loadFormData",
                {params: funcParams, thrownError: e});
        }

        try {
            mainwindow.sEmitSignal(
                "_@"+PREFIX+"@@"+ENTITY_OBJECT_NAME+"@@"+pDataRecId+"@_",
                "update_all");
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We received errors while signalling that we loaded data.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".loadFormData",
                {params: funcParams, thrownError: e});
        }
    };

    var insertEntityData = function(pDataRecId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pDataRecId: pDataRecId
        };
        
        var recObjName = SC_DATA_TABLE + "_" + pDataRecId;

        if(!data.hasOwnProperty(recObjName)) {
            throw new MuseUtils.NotFoundException(
                "musesuperchar",
                "The Super Characteristic Entity record you are trying to save has not been initialized.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".insertEntityData",
                {params: funcParams});
        }

        if(!MuseUtils.isValidId(data[recObjName].working[SC_DATA_TABLE_FK])) {
            throw new MuseUtils.NotFoundException(
                "musesuperchar",
                "A new Super Characteristic Entity record must have a valid " + 
                SC_DATA_TABLE_FK + " value set in order to save it.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".insertEntityData",
                {params: funcParams});
        }

        var insertParams = {};
        var fields = Object.keys(DATA_STRUCT);

        for(var ins = 0; ins < fields.length; ins++) {
            if(data[recObjName].database[fields[ins]] != 
                data[recObjName].working[fields[ins]]) {
                insertParams[fields[ins]] = 
                    data[recObjName].working[fields[ins]];
            }
        }

        try {
            var entQry = MuseUtils.executeDbQuery("musesuperchar",METASQL_INSERT,
                insertParams);

            if(!entQry.first() || 
                !MuseUtils.isValidId(entQry.value(SC_DATA_TABLE_PK))) {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We failed to verify that we created entity data record " +
                    recObjName,
                    "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".insertEntityData",
                    {params: funcParams, context: {insertParams: insertParams}});
            }

            delete data[recObjName];
            return entQry.value(SC_DATA_TABLE_PK);
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a database problem trying to save " + 
                recObjName,
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".insertEntityData",
                {params: funcParams, thrownError: e, context: {data: data}});
        }
    };

    var updateEntityData = function(pDataRecId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pDataRecId: pDataRecId
        };
        
        var recObjName = SC_DATA_TABLE + "_" + pDataRecId;
        data[recObjName] = {};
        if(!data.hasOwnProperty(recObjName)) {
            throw new MuseUtils.NotFoundException(
                "musesuperchar",
                "The Super Characteristic Entity record you are trying to save has not been initialized.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".updateEntityData",
                {params: funcParams});
        }

        if(!MuseUtils.isValidId(data[recObjName].working[SC_DATA_TABLE_PK])) {
            throw new MuseUtils.NotFoundException(
                "musesuperchar",
                "An updated Super Characteristic Entity record must have a " +
                " valid " + SC_DATA_TABLE_PK + " value set in order to save it.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".updateEntityData",
                {params: funcParams});
        }

        var updateParams = {};
        updateParams["where_"+SC_DATA_TABLE_PK] = 
            data[recObjName].working[SC_DATA_TABLE_PK];
        fields = Object.keys(DATA_STRUCT);
        for(var ups = 0; ups < fields.length; ups++) {
            if(data[recObjName].database[fields[ups]] != 
                data[recObjName].working[fields[ups]]) {
                updateParams["update_" + fields[ups]] = 
                    data[recObjName].working[fields[ups]];
            }
        }

        try {
            entQry = MuseUtils.executeDbQuery("musesuperchar",METASQL_UPDATE,
                updateParams);
            if(!entQry.first() || 
                !MuseUtils.isValidId(entQry.value(SC_DATA_TABLE_PK))) {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We failed to verify that we updated entity data record " +
                    recObjName,
                    "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".updateEntityData",
                    {params: funcParams, context: {updateParams: updateParams}});
            }

            return entQry.value(SC_DATA_TABLE_PK);
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a database problem trying to save " + 
                recObjName,
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".updateEntityData",
                {params: funcParams, thrownError: e, context: {data: data}});
        }
    };

    var saveFormData = function(pDataRecId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pDataRecId: pDataRecId
        };
        
        try {
            // Run our Before Save Hooks.  If we get a non-null result, we  
            // display the message to the user and abort the save.
            var beforeSaveHookResultMsg = hookRunner(beforeSaveFuncs, pDataRecId);

            if(beforeSaveHookResultMsg !== null) {
                QMessageBox.critical(mywindow, "Cannot Save " + 
                    ENTITY_DISPLAY_NAME + " Data", beforeSaveHookResultMsg);

                return pDataRecId;
            }
        } catch(e) {
            throw new MuseUtils.ApiException(
                 "musesuperchar",
                 "We encountered errors running 'Before Save' hook functions.",
                 "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".saveFormData",
                 {params: funcParams, thrownError: e});
        }

        var newDataRecId;

        // If the pDataRecId parameter starts with "new" we insert,
        // otherwise it's an update.
        try { 
            if(pDataRecId.match(/^new/) !== null) {
                newDataRecId = insertEntityData(pDataRecId);
            } else {
                newDataRecId = updateEntityData(pDataRecId);
            }
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to save entity record data.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".saveFormData",
                {params: funcParams, thrownError: e});
        }
        
        try {
            // Run our After Save Hooks.  If we get a non-null result, we display 
            // the message to the user.
            var afterSaveHookResultMsg = hookRunner(afterSaveFuncs, pDataRecId);

            if(afterSaveHookResultMsg !== null) {
                QMessageBox.information(mywindow, "After Save " + 
                    ENTITY_DISPLAY_NAME + " Notices", afterSaveHookResultMsg);
            }
        } catch(e) {
            throw new MuseUtils.ApiException(
                 "musesuperchar",
                 "We encountered errors running 'After Save' hook functions.",
                 "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".saveFormData",
                 {params: funcParams, thrownError: e});
        }

        try {
            loadFormData(newDataRecId);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to load Entity data record " + SC_DATA_TABLE + 
                "_" + newDataRecId + "(" + pDataRecId + ") after saving.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".saveFormData",
                {params: funcParams, thrownError: e});
        }

        return newDataRecId;
    };

    var initFormData = function(pDataRecId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pDataRecId: pDataRecId
        };

        // Create setValue hook objects
        var keys = Object.keys(DATA_STRUCT);
        for(var i = 0; i < keys.length; i++) {
            beforeSetFuncs[keys[i]] = [];
            afterSetFuncs[keys[i]] = [];
        }
        
        if(MuseUtils.realNull(pDataRecId) === null) {
            var newRecHandle = "new" + Date.now();
            
            data[SC_DATA_TABLE + "_" + newRecHandle] = {
                database: Object.assign({},DATA_STRUCT),
                working: Object.assign({},DATA_STRUCT),
                validators: []
            };

            try {
                // Run our On New Hooks.  If we get a non-null result, we 
                // display the message to the user.
                var onNewHookMsg = hookRunner(onNewFuncs, newRecHandle);

                if(onNewHookMsg !== null) {
                    QMessageBox.information(mywindow, "New " + 
                        ENTITY_DISPLAY_NAME + " Notices", 
                        onNewHookMsg);
                }
            } catch(e) {
                throw new MuseUtils.ApiException(
                     "musesuperchar",
                     "We encountered errors running 'On New' hook functions.",
                     "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".initFormData",
                     {params: funcParams, thrownError: e});
            }

            return newRecHandle;
        } else {
            data[SC_DATA_TABLE + "_" + pDataRecId] = {
                database: {},
                working: {},
                validators: []
            };
            try {
                
            } catch(e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to initialize an existing Super Characteristic data record.",
                    "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".initFormData",
                    {params: funcParams, thrownError: e});
            }
            
            loadFormData(pDataRecId);

            return pDataRecId;
        }
    };

    var getValue = function(pScIntName, pDataRecId) {
        return data[SC_DATA_TABLE + "_" + pDataRecId].working[pScIntName];
    };

    var setValue = function(pScIntName, pDataRecId, pValue) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScIntName: pScIntName,
            pDataRecId: pDataRecId,
            pValue: pValue
        };

        if(data[SC_DATA_TABLE + "_" + pDataRecId].working[pScIntName] == pValue) {
            // Nothing changed. Don't do anything else.  We need this to help 
            // stop recursive set/signal loops, especially with XTextEdit.
            return;
        }

        try {
            // Run our Before Set Hooks.  If we get a non-null result, we  
            // display the message to the user and abort the save.
            var beforeSetValueHookMsg = hookRunner(beforeSetFuncs, pDataRecId, 
                pValue);

            if(beforeSetValueHookMsg !== null) {
                QMessageBox.critical(mywindow, "Value Not Set", 
                    beforeSetValueHookMsg);

                return;
            }
        } catch(e) {
            throw new MuseUtils.ApiException(
                 "musesuperchar",
                 "We encountered errors running 'Before Set Value' hook functions.",
                 "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".setValue",
                 {params: funcParams, thrownError: e});
        }

        data[SC_DATA_TABLE + "_" + pDataRecId].working[pScIntName] = pValue;
        
        try {
            // Run our After Set Hooks.  If we get a non-null result, we display 
            // the message to the user.
            var afterSetValueHookMsg = hookRunner(afterSetFuncs, pDataRecId,
                pValue);

            if(afterSetValueHookMsg !== null) {
                QMessageBox.information(mywindow, "After Set Value Notices", 
                    afterSetValueHookMsg);
            }
        } catch(e) {
            throw new MuseUtils.ApiException(
                 "musesuperchar",
                 "We encountered errors running 'After Set Value' hook functions.",
                 "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".setValue",
                 {params: funcParams, thrownError: e});
        }

        try {
            mainwindow.sEmitSignal(
                "_@"+PREFIX+"@@"+ENTITY_OBJECT_NAME+"@@"+pDataRecId+"@@"+pScIntName"@_",
                "update");
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We received errors while signalling that we set a value.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".setValue",
                {params: funcParams, thrownError: e});
        }
    };

    var getDataRecIdByParentId = function(pEntityFkId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityFkId: pEntityFkId
        };

        try {
            var entQry = MuseUtils.executeQuery(
                "SELECT " + SC_DATA_TABLE_PK + " AS result " +
                "FROM musesuperchar." + SC_DATA_TABLE + " " +
                "WHERE " + SC_DATA_TABLE_FK + ' = <? value("pEntityFkId") ?>',
                {pEntityFkId: pEntityFkId});

            if(entQry.first()) {
                return entQry.value("result");
            } else {
                return null;
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a database problem trying to retrieve the entity data record primary key id based on the foreign key id.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + ".getDataRecIdByParentId",
                {params: funcParams, thrownError: e});
        }
        
    };

    var getDataStructure = function() {
        var returnDataObj = {};
        Object.assign(returnDataObj, DATA_STRUCT);
        return returnDataObj;
    };
    
    //--------------------------------------------------------------------
    //  Public Interface -- Functions
    //--------------------------------------------------------------------
    pPublicApi.getEntitySchemaName = function() {
        return ENTITY_SCHEMA;
    };

    pPublicApi.getEntityTableName = function() {
        return ENTITY_TABLE;
    };

    pPublicApi.getEntityDisplayName = function() {
        return ENTITY_DISPLAY_NAME;
    };

    pPublicApi.getEntityDataTableName = function() {
        return SC_DATA_TABLE;
    };

    pPublicApi.getEntityDataTablePkName = function() {
        return SC_DATA_TABLE_PK;
    };

    pPublicApi.getEntityDataTableFkName = function() {
        return SC_DATA_TABLE_FK;
    };

    pPublicApi.getValue = function(pScIntName, pDataRecId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScIntName: pScIntName,
            pDataRecId: pDataRecId
        };

        if(!DATA_STRUCT.hasOwnProperty(pScIntName)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand for which Super Characteristic we should retrieve a value.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.getValue",
                {params: funcParams});
        }

        if(!MuseUtils.isValidId(pDataRecId) &&
            MuseUtils.coalesce(pDataRecId,"").toString().match(/^new/) === null) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We must have a valid entity data record identifier.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.getValue",
                {params: funcParams});
        }

        if(!data.hasOwnProperty(SC_DATA_TABLE + "_" +pDataRecId)) {
            throw new MuseUtils.NotFoundException(
                "musesuperchar",
                "The requested entity data record is not currently initialized.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.getValue",
                {params: funcParams});
        }

        return getValue(pScIntName, pDataRecId);
    };

    pPublicApi.setValue = function(pScIntName, pDataRecId, pValue) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pScIntName: pScIntName,
            pDataRecId: pDataRecId
        };

        if(!DATA_STRUCT.hasOwnProperty(pScIntName)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand for which Super Characteristic you wished to set a value.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.setValue",
                {params: funcParams});
        }

        if(!MuseUtils.isValidId(pDataRecId) &&
            MuseUtils.coalesce(pDataRecId,"").toString().match(/^new/) === null) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We must have a valid entity data record identifier.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.setValue",
                {params: funcParams});
        }

        if(!data.hasOwnProperty(SC_DATA_TABLE + "_" +pDataRecId)) {
            throw new MuseUtils.NotFoundException(
                "musesuperchar",
                "The requested entity data record is not currently initialized.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.setValue",
                {params: funcParams});
        }

        return setValue(pScIntName, pDataRecId, pValue);
    };

    pPublicApi.getDataRecIdByParentId = function(pEntityFkId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityFkId: pEntityFkId
        };
        
        if(!MuseUtils.isValidId(pEntityFkId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand for which parent record id you wished to retrieve its child entity data record id.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.getDataRecIdByParentId",
                {params: funcParams});
        }

        return getDataRecIdByParentId(pEntityFkId);
    };

    pPublicApi.getDataStructure = function() {
        return getDataStructure();
    };

    pPublicApi.initFormData = function(pDataRecId) {
        return initFormData(pDataRecId);
    };

    pPublicApi.saveFormData = function(pDataRecId) {
        if(!MuseUtils.isValidId(pDataRecId) &&
            MuseUtils.coalesce(pDataRecId,"").toString().match(/^new/) === null) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We must have a valid entity data record identifier.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.saveFormData",
                {params: funcParams});
        }

        return saveFormData(pDataRecId);
    };

    pPublicApi.loadFormData = function(pDataRecId) {
        if(!MuseUtils.isValidId(pDataRecId) &&
            MuseUtils.coalesce(pDataRecId,"").toString().match(/^new/) === null) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We must have a valid entity data record identifier.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.saveFormData",
                {params: funcParams});
        }

        return loadFormData(pDataRecId);
    };

    pPublicApi.addOnNewHookFunc = function(pFunc) {
        funcParams = {
            pFunc: pFunc
        };

        if(typeof pFunc !== "function") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not find a function to add to the event processing sequence.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.addOnNewHookFunc",
                {params: funcParams});
        }

        addOnNewHookFunc(pFunc);
    };

    pPublicApi.addOnLoadHookFunc = function(pFunc) {
        funcParams = {
            pFunc: pFunc
        };

        if(typeof pFunc !== "function") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not find a function to add to the event processing sequence.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.addOnLoadHookFunc",
                {params: funcParams});
        }

        addOnLoadHookFunc(pFunc);
    };

    pPublicApi.addBeforeSetHookFunc = function(pScIntName, pFunc) {
        funcParams = {
            pScIntName: pScIntName,
            pFunc: pFunc
        };

        if(!DATA_STRUCT.hasOwnProperty(pScIntName)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand to which Super Characteristic you wished to apply a function.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.addBeforeSetHookFunc",
                {params: funcParams});
        }

        if(typeof pFunc !== "function") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not find a function to add to the event processing sequence.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.addBeforeSetHookFunc",
                {params: funcParams});
        }

        addBeforeSetHookFunc(pScIntName, pFunc);
    };

    pPublicApi.addAfterSetHookFunc = function(pScIntName, pFunc) {
        funcParams = {
            pScIntName: pScIntName,
            pFunc: pFunc
        };

        if(!DATA_STRUCT.hasOwnProperty(pScIntName)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand to which Super Characteristic you wished to apply a function.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.addAfterSetHookFunc",
                {params: funcParams});
        }

        if(typeof pFunc !== "function") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not find a function to add to the event processing sequence.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.addAfterSetHookFunc",
                {params: funcParams});
        }

        addAfterSetHookFunc(pScIntName, pFunc);
    };

    pPublicApi.addBeforeSaveHookFunc = function(pFunc) {
        funcParams = {
            pFunc: pFunc
        };

        if(typeof pFunc !== "function") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not find a function to add to the event processing sequence.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.addBeforeSaveHookFunc",
                {params: funcParams});
        }

        addBeforeSaveHookFunc(pFunc);
    };

    pPublicApi.addAfterSaveHookFunc = function(pFunc) {
        funcParams = {
            pFunc: pFunc
        };

        if(typeof pFunc !== "function") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not find a function to add to the event processing sequence.",
                "MuseSuperChar.Data." + ENTITY_OBJECT_NAME + "pPublicApi.addAfterSaveHookFunc",
                {params: funcParams});
        }

        addAfterSaveHookFunc(pFunc);
    };
})(this.MuseSuperChar.Data.%5$s);

$JS$::text;
        $BODY$
    LANGUAGE sql IMMUTABLE;

ALTER FUNCTION musesuperchar.get_qt_data_js_template()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.get_qt_data_js_template() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_data_js_template() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.get_qt_data_js_template() TO xtrole;


COMMENT ON FUNCTION musesuperchar.get_qt_data_js_template() 
    IS $DOC$Returns the standard Super Characteristic Data Library JS Template.  We keep it here since it just clutters the code where the specialization logic resides.$DOC$;
