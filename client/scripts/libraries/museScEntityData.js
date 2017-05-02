/*************************************************************************
 *************************************************************************
 **
 ** File:        museScEntityData.js
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
this.MuseSuperChar.Entity = this.MuseSuperChar.Entity || {};

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

    var getEntitiesSqlQuery = function(pParams) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pParams: pParams
        };

        var whereClause = "WHERE true ";

        if(!MuseUtils.isTrue(pParams.isInactiveIncluded || false)) {
            whereClause = whereClause + "AND entity_is_active ";
        }

        if(pParams.hasOwnProperty("entity_id")) {
            whereClause = whereClause + 
                'AND entity_id = <? value("entity_id") ?> ';
        }

        if(pParams.hasOwnProperty("entity_schema")) {
            whereClause = whereClause + 
                'AND entity_schema = <? value("entity_schema") ?> ';
        }

        if(pParams.hasOwnProperty("entity_table")) {
            whereClause = whereClause + 
                'AND entity_table = <? value("entity_table") ?> ';
        }

        if(pParams.hasOwnProperty("entity_is_system_locked")) {
            whereClause = whereClause + 
                'AND entity_is_system_locked = <? value("entity_is_system_locked") ?> ';
        }

        if(pParams.hasOwnProperty("entity_pkghead_id")) {
            whereClause = whereClause + 
                'AND entity_pkghead_id = <? value("entity_pkghead_id") ?> ';
        }

        try {
            return MuseUtils.executeQuery(
                "SELECT      e.entity_id " +
                           ",e.entity_schema " +
                           ",e.entity_table " +
                           ",e.entity_pk_column " +
                           ",e.entity_display_name " +
                           ",e.entity_is_system_locked " +
                           ",e.entity_is_active " +
                           ",e.entity_date_created " +
                           ",e.entity_role_created " +
                           ",e.entity_date_modified " +
                           ",e.entity_wallclock_modified " +
                           ",e.entity_role_modified " +
                           ",e.entity_date_deactivated " +
                           ",e.entity_role_deactivated " +
                           ",e.entity_row_version_number " +
                           ",string_agg(pkghead_name, ', ') " +
                                "AS entity_package_names " +
                           ",array_agg(pkghead_id) " +
                                "AS entity_package_ids " +
                "FROM        musesuperchar.entity e " +
                    "LEFT OUTER JOIN musesuperchar.entity_package ep " +
                        "ON e.entity_id = ep.entity_package_entity_id " +
                    "LEFT OUTER JOIN public.pkghead ph " +
                        "ON ep.entity_package_pkghead_id = ph.pkghead_id " +
                whereClause +
                "GROUP BY    e.entity_id " +
                           ",e.entity_schema " +
                           ",e.entity_table " +
                           ",e.entity_pk_column " +
                           ",e.entity_display_name " +
                           ",e.entity_is_system_locked " +
                           ",e.entity_is_active " +
                           ",e.entity_date_created " +
                           ",e.entity_role_created " +
                           ",e.entity_date_modified " +
                           ",e.entity_wallclock_modified " +
                           ",e.entity_role_modified " +
                           ",e.entity_date_deactivated " +
                           ",e.entity_role_deactivated " +
                           ",e.entity_row_version_number ",
                           pParams);
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered an error querying for Super Characteristic known record types.",
                "MuseSuperChar.Entity.getEntitiesSqlQuery",
                {pParams: funcParams, thrownError: e});
        }
    };

    var getEntityByEntityId = function(pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityId: pEntityId
        };

        try {
            var entityQuery = getEntitiesSqlQuery(
                {
                    entity_id: pEntityId,
                    isInactiveIncluded: true
                });

            return entityQuery.firstJson();
        } catch(e) {
            throw new MuseUtils.NotFoundException(
                "musesuperchar",
                "We could not find the requested super characteristic entity record.",
                "MuseSuperChar.Entity.getEntityByEntityId",
                {params: funcParams, thrownError: e});
        }

    };

    var getEntitiesBySchemaTable = function(pSchema, pTable) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSchema: pSchema,
            pTable: pTable
        };

        try {
            var entityQuery = getEntitiesSqlQuery(
                {
                    entity_schema: pSchema,
                    entity_table: pTable, 
                    isInactiveIncluded: true
                });

            return entityQuery.firstJson();
        } catch(e) {
            throw new MuseUtils.NotFoundException(
                "musesuperchar",
                "We could not find the requested super characteristic entity record.",
                "MuseSuperChar.Entity.getEntitiesBySchemaTable",
                {params: funcParams, thrownError: e});
        }
    };

    var getEntitiesBySchema = function(pSchema, pIsInactiveIncluded) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSchema: pSchema,
            pIsInactiveIncluded: pIsInactiveIncluded
        };

        try {
            return getEntitiesSqlQuery(
                {
                    entity_schema: pSchema,
                    isInactiveIncluded: pIsInactiveIncluded
                });
        } catch(e) {
            throw new MuseUtils.NotFoundException(
                "musesuperchar",
                "We could not find the entity records for the requested schema.",
                "MuseSuperChar.Entity.getEntitiesBySchemaTable",
                {params: funcParams, thrownError: e});
        }
    };

    var createEntity = function(pEntityData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityData: pEntityData
        };
        
        var entityQuery;

        try {
            entityQuery = MuseUtils.executeQuery(
                "SELECT musesuperchar.create_entity( " +
                    ' <? value("entity_schema") ?> ' +
                    ',<? value("entity_table") ?> ' +
                    ',<? value("entity_display_name")?> ' +
                    ',<? value("entity_pk_column") ?> ) AS entity_id ',
                    pEntityData);
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We failed to create a new entity record in the database.",
                "MuseSuperChar.Entity.createEntity",
                {params: funcParams, thrownError: e});
        }

        var entityResult = entityQuery.firstJson() || {};

        if(!MuseUtils.isValidId(entityResult.entity_id)) {
            throw new MuseUtils.NotFoundException(
                "musesuperchar",
                "We failed to verify that our new entity record was created.",
                "MuseSuperChar.Entity.createEntity",
                {params: funcParams, entityResult: entityResult});
        }

        return entityResult.entity_id;
    };

    var updateEntity = function(pEntityData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityData: pEntityData
        };

        var updateColumns = [];
        var queryText = "UPDATE musesuperchar.entity SET ";
        updateColumns.push(
                'entity_id = <? value("entity_id") ?> ');

        if(pEntityData.hasOwnProperty("entity_schema")) {
            updateColumns.push(
                'entity_schema = <? value("entity_schema") ?> ');
        }

        if(pEntityData.hasOwnProperty("entity_table")) {
            updateColumns.push(
                'entity_table = <? value("entity_table") ?> ');
        }

        if(pEntityData.hasOwnProperty("entity_pk_column")) {
            updateColumns.push(
                'entity_pk_column = <? value("entity_pk_column") ?> ');
        }

        if(pEntityData.hasOwnProperty("entity_display_name")) {
            updateColumns.push(
                'entity_display_name = <? value("entity_display_name") ?> ');
        }

        if(pEntityData.hasOwnProperty("entity_is_system_locked")) {
            updateColumns.push(
                'entity_is_system_locked = <? value("entity_is_system_locked") ?> ');
        }

        if(pEntityData.hasOwnProperty("entity_is_active")) {
            updateColumns.push(
                'entity_is_active = <? value("entity_is_active") ?> ');
        }

        try {
            // Assemble the query text.
            queryText = queryText + updateColumns .join(",") +
                'WHERE entity_id = <? value("entity_id") ?> ' +
                "RETURNING entity_id";
            
            var entityQuery = MuseUtils.executeQuery(queryText, pEntityData);

            if(entityQuery.first() && 
                MuseUtils.isValidId(entityQuery.value("entity_id"))) {
                return entityQuery.value("entity_id");
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We could not verify that we made the requested changes to the targeted entity record.",
                    "MuseSuperChar.Entity.updateEntity",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem updating the requested entity record.",
                "MuseSuperChar.Entity.updateEntity",
                {params: funcParams, thrownError: e});
        }
    };

    var deleteEntity = function(pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityId: pEntityId
        };

        try {
            var entityQuery = MuseUtils.executeQuery(
                "DELETE FROM musesuperchar.entity "+
                'WHERE entity_id = <? value("pEntityId") ?> ' +
                "RETURNING entity_id ",
                {pEntityId: pEntityId});

            if(entityQuery.first() && 
                MuseUtils.isValidId(entityQuery.value("entity_id"))) {
                return entityQuery.value("entity_id");
            } else {

            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered problems trying to delete a super characteristic entity record.",
                "MuseSuperChar.Entity.deleteEntity",
                {params: funcParams, thrownError: e});
        }
        
    };

    var getSchemata = function(pSchema) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSchema: pSchema
        };

        if(MuseUtils.realNull(pSchema) === null) {
            try {
                return MuseUtils.executeQuery(
                    "SELECT oid AS schema_id " +
                        ",nspname AS schema_name " +
                    "FROM pg_catalog.pg_namespace " +
                    "WHERE nspname != 'pg_catalog' " +
                        "AND NOT nspname ~ '^pg_' " +
                    "ORDER BY nspname ",
                    {pSchema: pSchema});
            } catch(e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem retrieving the list of schemata from the database.",
                    "MuseSuperChar.Entity.getSchemata",
                    {params: funcParams, thrownError: e});
            }
        } else {
            try {
                return MuseUtils.executeQuery(
                    "SELECT oid AS schema_id " +
                        ",nspname AS schema_name " +
                    "FROM pg_catalog.pg_namespace " +
                    'WHERE nspname = <? value("pSchema") ?> ' +
                    "ORDER BY nspname ",
                    {pSchema: pSchema});
            } catch(e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem while retrieving the requested schema.",
                    "MuseSuperChar.Entity.getSchemata",
                    {params: funcParams, thrownError: e});
            }
        }
    };

    var getTablesBySchema = function(pSchema, pIsOnlyNonEntity) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSchema: pSchema,
            pIsOnlyNonEntity: pIsOnlyNonEntity
        };

        if(MuseUtils.coalesce(pIsOnlyNonEntity, true)) {
            try {
                return MuseUtils.executeQuery(
                    "SELECT table_oid AS table_id "+
                        ",table_name " +
                    "FROM   musextputils.v_basic_catalog " +
                        "LEFT OUTER JOIN musesuperchar.entity " +
                            "ON entity_schema = table_schema_name " +
                                "AND entity_table = table_name " +
                    'WHERE  table_schema_name = <? value("pSchema") ?> ' +
                        "AND table_kind = 'TABLE' " +
                        "AND table_persistence = 'PERMANENT' " +
                        "AND entity_id IS NULL " +
                    "ORDER BY table_name ",
                    {pSchema: pSchema});
            } catch(e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered problems trying to retrieve the table names associated with the requested schema.",
                    "MuseSuperChar.Entity.getTablesBySchema",
                    {params: funcParams, thrownError: e});
            }
        } else {
            try {
                return MuseUtils.executeQuery(
                    "SELECT table_oid AS table_id "+
                        ",table_name " +
                    "FROM   musextputils.v_basic_catalog " +
                    'WHERE  table_schema_name = <? value("pSchema") ?> ' +
                        "AND table_kind = 'TABLE' " +
                        "AND table_persistence = 'PERMANENT' " +
                    "ORDER BY table_name ",
                    {pSchema: pSchema});
            } catch(e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered problems trying to retrieve the table names associated with the requested schema.",
                    "MuseSuperChar.Entity.getTablesBySchema",
                    {params: funcParams, thrownError: e});
            }
        }

    };

    var getUniqueKeysByTable = function(pSchema, pTable) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSchema: pSchema,
            pTable: pTable
        };
        
        try {
            return MuseUtils.executeQuery(
                "WITH source AS (SELECT   tc.table_schema " +
                "                        ,tc.table_name " +
                "                        ,tc.constraint_type " +
                "                        ,kcu.column_name " +
                "                        ,c.data_type " +
                "                        ,count(kcu.column_name) OVER (PARTITION BY tc.table_schema,tc.table_name,kcu.constraint_name) AS col_count " +
                "                FROM    information_schema.table_constraints tc " +
                "                    JOIN information_schema.key_column_usage kcu " +
                "                        ON  kcu.table_name = tc.table_name  " +
                "                            AND kcu.table_schema = tc.table_schema  " +
                "                            AND kcu.constraint_name = tc.constraint_name " +
                "                    JOIN information_schema.columns c " +
                "                        ON  c.table_schema = kcu.table_schema " +
                "                            AND c.table_name = kcu.table_name " +
                "                            AND c.column_name = kcu.column_name " +
                "                WHERE   (tc.constraint_type = 'PRIMARY KEY' OR tc.constraint_type = 'UNIQUE') " +
                                    ' AND tc.table_schema = <? value("pSchema") ?> ' +
                                    ' AND tc.table_name = <? value("pTable") ?> ' +
                "                ORDER BY tc.table_schema " +
                "                        ,tc.table_name " +
                "                        ,tc.constraint_type " +
                "                        ,kcu.column_name) " +
                "SELECT   row_number() OVER () AS row_id " +
                "        ,column_name " +
                "FROM    source " +
                "WHERE   col_count = 1  " +
                "    AND (data_type = 'integer' OR data_type = 'bigint') ",
                funcParams);
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem retrieving the available key columns for the requested database table.",
                "MuseSuperChar.Entity.getUniqueKeysByTable",
                {params: funcParams, thrownError: e});
        }
    };

    var isEntitySystemLocked = function(pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityId: pEntityId
        };

        try {
            var syslockQry = MuseUtils.executeQuery(
                "SELECT entity_is_system_locked " +
                "FROM musesuperchar.entity " +
                'WHERE entity_id = <? value("pEntityId") ?>',
                {pEntityId: pEntityId});

            if(syslockQry.first()) {
                var result = syslockQry.firstJson();
                return result.entity_is_system_locked;
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We did not receive a value while checking if an entity was system locked.",
                    "MuseSuperChar.Entity.isEntitySystemLocked",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem while checking if an entity was system locked.",
                "MuseSuperChar.Entity.isEntitySystemLocked",
                {params: funcParams, thrownError: e});
        }
        
    };

    //--------------------------------------------------------------------
    //  Public Interface -- Functions
    //--------------------------------------------------------------------
    pPublicApi.isEntitySystemLocked = function(pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityId: pEntityId
        };

        if(!MuseUtils.isValidId(pEntityId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which entity you wanted to see might be system locked.",
                "MuseSuperChar.Entity.pPublicApi.isEntitySystemLocked",
                {params: funcParams});
        }

        try {
            return isEntitySystemLocked(pEntityId);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to find out if an entity was system locked or not.",
                "MuseSuperChar.Entity.pPublicApi.isEntitySystemLocked",
                {params: funcParams, thrownError: e});
        }
        
    };

    pPublicApi.getEntitiesSqlQuery = function(pParams) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pParams: pParams
        };
        
        try {
            return getEntitiesSqlQuery(pParams || {});
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We could not retrieve a list of known Super Characteristic record types.",
                "MuseSuperChar.Entity.pPublicApi.getEntitiesSqlQuery",
                {params: funcParams, thrownError: e});
        }
    };

    pPublicApi.getEntityByEntityId = function(pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityId: pEntityId
        };

        // Sanity check our parameters
        if(!MuseUtils.isValidId(pEntityId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We could not understand for which entity we were asked to retrieve data.",
                "MuseSuperChar.Entity.pPublicApi.getEntityByEntityId",
                {params: funcParams});      
        }
            
        try {
            return getEntityByEntityId(pEntityId);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We could not retrieve the requested super characteristic entity record.",
                "MuseSuperChar.Entity.pPublicApi.getEntityByEntityId",
                {thrownError: e, params: funcParams});
        }
    };

    pPublicApi.getEntitiesBySchemaTable = function(pSchema, pTable) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSchema: pSchema,
            pTable: pTable
        };

        // Sanity check our parameters
        if(MuseUtils.realNull(pSchema) === null) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We could not understand for which schema you wished entity data.",
                "MuseSuperChar.Entity.pPublicApi.getEntitiesBySchemaTable",
                {params: funcParams});      
        } else if(MuseUtils.realNull(pTable) === null) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We could not understand for which table you wished entity data.",
                "MuseSuperChar.Entity.pPublicApi.getEntitiesBySchemaTable",
                {params: funcParams}); 
        }
            
        try {
            return getEntitiesBySchemaTable(pSchema, pTable);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We could not retrieve the requested super characteristic entity record.",
                "MuseSuperChar.Entity.pPublicApi.getEntitiesBySchemaTable",
                {thrownError: e, params: funcParams});
        }
    };

    pPublicApi.getEntitiesBySchema = function(pSchema, pIsInactiveIncluded) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSchema: pSchema,
            pIsInactiveIncluded: pIsInactiveIncluded
        };

        // Sanity check our parameters
        if(MuseUtils.realNull(pSchema) === null) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand from which schema you wanted to find known entity records.",
                "MuseSuperChar.Entity.pPublicApi.getEntitiesBySchema",
                {params: funcParams});
        }
        
        try {
            return getEntitiesBySchema(pSchema, (pIsInactiveIncluded || false));
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We could not retrieve entity records for the requested schema.",
                "MuseSuperChar.Entity.pPublicApi.getEntitiesBySchema",
                {thrownError: e});
        }
    };

    pPublicApi.createEntity = function(pEntityData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityData: pEntityData
        };

        pEntityData =  pEntityData || {};

        // Run a permissions check on the function.
        if(!privileges.check("maintainSuperCharEntities")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to create super characteristic entities. Requires maintainSuperCharEntities.",
                "MuseSuperChar.Entity.pPublicApi.createEntity",
                {params: funcParams});
        }

        // Verify that we have all parameters and that they're sane.
        if(!pEntityData.hasOwnProperty("entity_schema") || 
            MuseUtils.coalesce(pEntityData.entity_schema, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a schema name for entity record creation and did not receive one.",
                "MuseSuperChar.Entity.pPublicApi.createEntity",
                {params: funcParams});    
        }

        if(!pEntityData.hasOwnProperty("entity_table") || 
            MuseUtils.coalesce(pEntityData.entity_table, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a table name for entity record creation and did not receive one.",
                "MuseSuperChar.Entity.pPublicApi.createEntity",
                {params: funcParams});  
        }

        if(!pEntityData.hasOwnProperty("entity_pk_column") || 
            MuseUtils.coalesce(pEntityData.entity_pk_column, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a primary key column name for entity record creation and did not receive one.",
                "MuseSuperChar.Entity.pPublicApi.createEntity",
                {params: funcParams}); 
        }
        
        try {
            return createEntity(pEntityData);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "",
                "MuseSuperChar.Entity.pPublicApi.createEntity",
                {thrownError: e});
        }
    };

    pPublicApi.updateEntity = function(pEntityData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityData: pEntityData
        };

        pEntityData = pEntityData || {};

        // Validate our required parameters
        if(!pEntityData.hasOwnProperty("entity_id") || 
            !MuseUtils.isValidId(pEntityData.entity_id)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require at least a way of identifying which record you wish to update.",
                "MuseSuperChar.Entity.pPublicApi.updateEntity",
                {params: funcParams});
        }

        // Check permissions
        if(!privileges.check("maintainSuperCharEntities")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to update super characteristic entities.  Requires maintainSuperCharEntities.",
                "MuseSuperChar.Entity.pPublicApi.updateEntity",
                {params: funcParams});
        } else if(isEntitySystemLocked(pEntityData.entity_id) &&
                    !privileges.check("maintainSuperCharSysLockRecsManually")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to update a system locked record.  Requires maintainSuperCharSysLockRecsManually.",
                "MuseSuperChar.Entity.pPublicApi.updateEntity",
                {params: funcParams, thrownError: e});
        }   

        try {
            return updateEntity(pEntityData);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to update the requested super characteristic entity record.",
                "MuseSuperChar.Entity.pPublicApi.updateEntity",
                {params: funcParams, thrownError: e});
        }
    };

    pPublicApi.deleteEntity = function(pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityId: pEntityId
        };

        // Check that the parameters are valid.
        if(!MuseUtils.isValidId(pEntityId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not which super characteristic entity record you wished to delete.",
                "MuseSuperChar.Entity.pPublicApi.deleteEntity",
                {params: funcParams});
        }

        // Check permissions
        if(!privileges.check("maintainSuperCharEntities")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to delete super characteristic entity records. Requires maintainSuperCharEntities.",
                "MuseSuperChar.Entity.pPublicApi.deleteEntity",
                {params: funcParams});
        } else if(isEntitySystemLocked(pEntityId) && 
                    !privileges.check("maintainSuperCharSysLockRecsManually")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to delete system locked entity records.  Requires maintainSuperCharSysLockRecsManually.",
                "Fully Qualified Function Name",
                {params: funcParams, thrownError: e});
        }

        try {
            deleteEntity(pEntityId);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to delete the requested entity.",
                "MuseSuperChar.pPublicApi.deleteEntity",
                {params: funcParams, thrownError: e});
        }
        
    };

    pPublicApi.getSchemata = function(pSchema) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSchema: pSchema
        };

        try {
            return getSchemata(pSchema);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to retrieve schema data as requested.",
                "MuseSuperChar.Entity.pPublicApi.getSchemata",
                {params: funcParams, thrownError: e});
        }
        
    };

    pPublicApi.getUniqueKeysByTable = function(pSchema, pTable) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSchema: pSchema,
            pTable: pTable
        };

        // Validate that we have both a schema and a table
        if(MuseUtils.coalesce(pSchema, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a schema name by which to filter table unique keys.",
                "MuseSuperChar.Entity.pPublicApi.getUniqueKeysByTable",
                {params: funcParams});
        } else if(MuseUtils.coalesce(pTable, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a table name by which to filter the available unique keys.",
                "MuseSuperChar.Entity.pPublicApi.getUniqueKeysByTable",
                {params: funcParams});
        }
        
        // Try the function call.
        try {
            return getUniqueKeysByTable(pSchema, pTable);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to retrieve the requested list of unique keys.",
                "MuseSuperChar.Entity.pPublicApi.getUniqueKeysByTable",
                {params: funcParams, thrownError: e});
        }
    };

    pPublicApi.getTablesBySchema = function(pSchema, pIsOnlyNonEntity) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSchema: pSchema,
            pIsOnlyNonEntity: pIsOnlyNonEntity
        };
        
        if(MuseUtils.coalesce(pSchema, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a schema name by which to filter table names.",
                "MuseSuperChar.Entity.pPublicApi.getTablesBySchema",
                {params: funcParams});
        }

        try {
            return getTablesBySchema(pSchema, pIsOnlyNonEntity);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to retrieve the desired table records.",
                "MuseSuperChar.Entity.pPublicApi.getTablesBySchema",
                {params: funcParams, thrownError: e});
        }
    };

    
})(this.MuseSuperChar.Entity);
