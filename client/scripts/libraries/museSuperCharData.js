/*************************************************************************
 *************************************************************************
 **
 ** File:        museSuperCharData.js
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
this.MuseSuperChar.SuperChar = this.MuseSuperChar.SuperChar || {};

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
    var getSuperChars = function(pParams) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pParams: pParams
        };

        var whereClause = "WHERE true ";

        if(!MuseUtils.isTrue(pParams.isInactiveIncluded || false)) {
            whereClause = whereClause + " AND sc_def_is_active ";
        }
        
        if(pParams.hasOwnProperty("sc_def_id")) {
            whereClause = whereClause + 'AND sc_def_id = ' +
                '<? value("sc_def_id") ?> ';
        }

        if(pParams.hasOwnProperty("sc_def_internal_name")) {
            whereClause = whereClause + 'AND sc_def_internal_name = ' +
                '<? value("sc_def_internal_name") ?> ';
        }

        if(pParams.hasOwnProperty("sc_def_display_name")) {
            whereClause = whereClause + 'AND sc_def_display_name = ' +
                '<? value("sc_def_display_name") ?> ';
        }

        if(pParams.hasOwnProperty("sc_def_pkghead_id")) {
            whereClause = whereClause + 'AND sc_def_pkghead_id = ' +
                '<? value("sc_def_pkghead_id") ?> ';
        }

        if(pParams.hasOwnProperty("sc_def_is_system_locked")) {
            whereClause = whereClause + 'AND sc_def_is_system_locked = ' +
                '<? value("sc_def_is_system_locked") ?> ';
        }

        if(pParams.hasOwnProperty("sc_def_data_type_id")) {
            whereClause = whereClause + 'AND sc_def_data_type_id = ' +
                '<? value("sc_def_data_type_id") ?> ';
        }

        if(pParams.hasOwnProperty("sc_def_is_searchable")) {
            whereClause = whereClause + 'AND sc_def_is_searchable = ' +
                '<? value("sc_def_is_searchable") ?> ';
        }

        if(pParams.hasOwnProperty("sc_def_sc_group_ass_sc_group_id")) {
            whereClause = whereClause + 'AND sc_def_sc_group_ass_sc_group_id = ' +
                '<? value("sc_def_sc_group_ass_sc_group_id") ?> ';
        }

        if(pParams.hasOwnProperty("entity_sc_group_ass_entity_id")) {
            whereClause = whereClause + 'AND entity_sc_group_ass_entity_id = ' +
                '<? value("entity_sc_group_ass_entity_id") ?> ';
        }

        try {
            return MuseUtils.executeQuery(
                "SELECT   DISTINCT sc_def_id " +
                        ",sc_def_internal_name " +
                        ",sc_def_display_name " +
                        ",sc_def_description " +
                        ",sc_def_pkghead_id " +
                        ",sc_def_is_system_locked " +
                        ",data_type_id AS sc_def_data_type_id " +
                        ",data_type_display_name AS sc_def_data_type_display_name " +
                        ",data_type_internal_name AS sc_def_data_type_internal_name " +
                        ",data_type_is_text AS sc_defdata_type_is_text" +
                        ",data_type_is_numeric AS sc_defdata_type_is_numeric" +
                        ",data_type_is_date AS sc_defdata_type_is_date" +
                        ",data_type_is_flag AS sc_defdata_type_is_flag" +
                        ",data_type_is_array AS sc_defdata_type_is_array" +
                        ",data_type_is_lov_based AS sc_defdata_type_is_lov_based" +
                        ",array_to_string(sc_def_values_list, ', ') AS sc_def_values_list " +
                        ",sc_def_list_query " +
                        ",sc_def_is_searchable " +
                        ",pkghead_name AS sc_def_package_name " +
                        ",CASE " +
                                "WHEN sc_def_is_system_locked THEN " +
                                    "'bisque' " +
                                "ELSE " +
                                    "'palegreen' " +
                            " END AS sc_def_display_name_qtbackgroundrole " +
                "FROM    musesuperchar.sc_def " +
                    "JOIN musesuperchar.data_type " +
                        "ON sc_def_data_type_id = data_type_id " +
                    "LEFT OUTER JOIN public.pkghead " +
                        "ON sc_def_pkghead_id = pkghead_id  " +
                    "LEFT OUTER JOIN musesuperchar.sc_def_sc_group_ass " +
                        "ON sc_def_id = sc_def_sc_group_ass_sc_def_id " +
                    "LEFT OUTER JOIN musesuperchar.entity_sc_group_ass " +
                        "ON sc_def_sc_group_ass_sc_group_id = " +
                            "entity_sc_group_ass_sc_group_id " +
                whereClause, pParams);
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a database problem trying to retrieve a list of Super Characteristics per the given criteria.",
                "MuseSuperChar.SuperChar.getSuperChars",
                {params: funcParams, thrownError: e});
        }
    };

    var getSuperCharById = function(pSuperCharId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharId: pSuperCharId
        };
        
        try {
            var scQuery = getSuperChars(
                {
                    sc_def_id: pSuperCharId,
                    isInactiveIncluded: true
                });

            if(!scQuery.first() || 
                !MuseUtils.isValidId(scQuery.value("sc_def_id"))) {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We did not find the requested Super Characteristic.",
                    "MuseSuperChar.SuperChar.getSuperCharById",
                    {params: funcParams});
            }

            return scQuery.firstJson();
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to retrieve the requested Super Characteristic defintion.",
                "MuseSuperChar.SuperChar.getSuperCharById",
                {params: funcParams, thrownError: e});
        }
    };

    var isSuperCharSystemLocked = function(pSuperCharId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharId: pSuperCharId
        };

        try {
            var scQuery = MuseUtils.executeQuery(
                "SELECT sc_def_is_system_locked " +
                "FROM   musesuperchar.sc_def " +
                'WHERE sc_def_id = <? value("pSuperCharId") ?> ',
                {pSuperCharId: pSuperCharId});

            if(scQuery.first()) {
                return MuseUtils.isTrue(
                    scQuery.value("sc_def_is_system_locked"));
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We failed to find the system locked status of the requested Super Characteristic.",
                    "MuseSuperChar.SuperChar.isSuperCharSystemLocked",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem looking up the system locked status of a Super Characteristic.",
                "MuseSuperChar.SuperChar.isSuperCharSystemLocked",
                {params: funcParams, thrownError: e});
        }
    };

    var getSuperCharsByGroupId = function(pGroupId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId
        };

        try {
            return getSuperChars(
                {
                    sc_def_sc_group_ass_sc_group_id: pGroupId
                });
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to retrieve the Super Characteristics for the requested group.",
                "MuseSuperChar.SuperChar.getSuperCharsByGroupId",
                {params: funcParams, thrownError: e});
        }
    };

    var getSuperCharsByEntityId = function(pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityId: pEntityId
        };

        try {
            return getSuperChars(
                {
                    entity_sc_group_ass_entity_id: pEntityId
                });
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to retrieve the Super Characteristics associated with the provided entity.",
                "MuseSuperChar.SuperChar.getSuperCharsByEntityId",
                {params: funcParams, thrownError: e});
        }
    };

    var getSubjectObjectNonOverlappingEntities = function(pSubjectScId, 
        pObjectScId) {

        // Capture function parameters for later exception references.
        var funcParams = {
            pSubjectScId: pSubjectScId,
            pObjectScId: pObjectScId
        };

        try {
            var entitiesQuery = MuseUtils.executeQuery(
                "SELECT musesuperchar.get_superchar_non_overlapping_entities( " + 
                '<? value("pSubjectScId") ?>, <? value("pObjectScId") ?>) ' +
                "AS result",
                {pSubjectScId: pSubjectScId, pObjectScId: pObjectScId});

            if(entitiesQuery.first()) {
                return JSON.parse(entitiesQuery.firstJson().result);
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We did not receive the expected result from the database when requesting non-overlapping entities for the proposed subject/object SuperChars.",
                    "MuseSuperChar.SuperChar.getSubjectObjectNonOverlappingEntities",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem retrieving the non-overlapping entities for the given Subject/Object Super Characteristics.",
                "MuseSuperChar.SuperChar.getSubjectObjectNonOverlappingEntities",
                {params: funcParams, thrownError: e});
        }
    };

    var createSuperChar = function(pSuperCharData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharData: pSuperCharData
        };
        
        try {
            var scQuery = MuseUtils.executeQuery(
                "INSERT INTO musesuperchar.sc_def " +
                    "(sc_def_internal_name, sc_def_display_name, " +
                        "sc_def_description, sc_def_data_type_id, " +
                        "sc_def_is_searchable) " +
                        "VALUES " +
                    '( <? value("sc_def_internal_name") ?> ' +
                     ',<? value("sc_def_display_name") ?> '  +
                     ',<? value("sc_def_description") ?> ' +
                     ',<? value("sc_def_data_type_id") ?> ' +
                     ',<? value("sc_def_is_searchable") ?>) ' +
                     "RETURNING sc_def_id ",
                     pSuperCharData);

            if (!scQuery.first() || 
                !MuseUtils.isValidId(scQuery.value("sc_def_id"))) {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We did not verify that we successfully created the Super Characteristic as requested.",
                    "MuseSuperChar.SuperChar.createSuperChar",
                    {params: funcParams});
            }

            return scQuery.value("sc_def_id");
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem while saving the Super Characteristic.",
                "MuseSuperChar.SuperChar.createSuperChar",
                {params: funcParams, thrownError: e});
        }
    };

    var updateSuperChar = function(pSuperCharData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharData:pSuperCharData
        };

        var updateColumns = [];
        var queryText = "UPDATE musesuperchar.sc_def SET ";

        if (pSuperCharData.hasOwnProperty("sc_def_id")) {
            updateColumns.push(
                'sc_def_id = ' +
                    '<? value("sc_def_id") ?> ');
        }

        if (pSuperCharData.hasOwnProperty("sc_def_internal_name")) {
            updateColumns.push(
                'sc_def_internal_name = ' +
                    '<? value("sc_def_internal_name") ?> ');
        }

        if (pSuperCharData.hasOwnProperty("sc_def_display_name")) {
            updateColumns.push(
                'sc_def_display_name = ' +
                    '<? value("sc_def_display_name") ?> ');
        }

        if (pSuperCharData.hasOwnProperty("sc_def_description")) {
            updateColumns.push(
                'sc_def_description = ' +
                    '<? value("sc_def_description") ?> ');
        }

        if (pSuperCharData.hasOwnProperty("sc_def_is_system_locked")) {
            updateColumns.push(
                'sc_def_is_system_locked = ' +
                    '<? value("sc_def_is_system_locked") ?> ');
        }

        if (pSuperCharData.hasOwnProperty("sc_def_data_type_id")) {
            updateColumns.push(
                'sc_def_data_type_id = ' +
                    '<? value("sc_def_data_type_id") ?> ');
        }

        if (pSuperCharData.hasOwnProperty("sc_def_values_list")) {
            updateColumns.push(
                'sc_def_values_list = ' +
                    'translate(<? value("sc_def_values_list") ?>, ' +
                        "'[]', '{}')::text[] ");
        }

        if (pSuperCharData.hasOwnProperty("sc_def_list_query")) {
            updateColumns.push(
                'sc_def_list_query = ' +
                    '<? value("sc_def_list_query") ?> ');
        }

        if (pSuperCharData.hasOwnProperty("sc_def_is_searchable")) {
            updateColumns.push(
                'sc_def_is_searchable = ' +
                    '<? value("sc_def_is_searchable") ?> ');
        }

        if (pSuperCharData.hasOwnProperty("sc_def_is_active")) {
            updateColumns.push(
                'sc_def_is_active = ' +
                    '<? value("sc_def_is_active") ?> ');
        }

        try {
            queryText = queryText + updateColumns.join(', ') +
                ' WHERE sc_def_id = <? value("sc_def_id") ?> ' +
                'RETURNING sc_def_id';

            var scQuery = MuseUtils.executeQuery(queryText, pSuperCharData);

            if(scQuery.first() && 
                MuseUtils.isValidId(scQuery.value("sc_def_id"))) {
                return scQuery.value("sc_def_id");
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We could not verify that we successfully updated the Super Characteristic as requested.",
                    "MuseSuperChar.SuperChar.updateSuperChar",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a database problem while trying to update a Super Characteristic.",
                "MuseSuperChar.SuperChar.updateSuperChar",
                {params: funcParams, thrownError: e});
        }

    };

    var deleteSuperChar = function(pSuperCharId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharId: pSuperCharId
        };
        
        try {
            var scQuery = MuseUtils.executeQuery(
                "DELETE FROM musesuperchar.sc_def " +
                'WHERE sc_def_id = <? value("pSuperCharId") ?> ' +
                "RETURNING sc_def_id",
                {pSuperCharId: pSuperCharId});

            if(scQuery.first() && 
                MuseUtils.isValidId(scQuery.value("sc_def_id"))) {
                return scQuery.value("sc_def_id");
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We could not verify that we deleted the requested Super Characteristic.",
                    "MuseSuperChar.SuperChar.deleteSuperChar",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem while trying to delete the requested Super Characteristic.",
                "MuseSuperChar.SuperChar.deleteSuperChar",
                {params: funcParams, thrownError: e});
        }
    };

    var getSuperCharGroups = function(pSuperCharId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharId: pSuperCharId
        };
        
        try {
            return MuseUtils.executeQuery(
                "SELECT   sg.sc_group_id " +
                        ",sg.sc_group_internal_name " +
                        ",sg.sc_group_display_name " +
                        ",array_agg(e.entity_id) AS sc_group_entity_ids " +
                        ",string_agg(e.entity_display_name,', ') AS sc_group_entity_display_names " +
                "FROM    musesuperchar.sc_def_sc_group_ass sdsga  " +
                    "JOIN musesuperchar.sc_group sg  " +
                        "ON sdsga.sc_def_sc_group_ass_sc_group_id = sg.sc_group_id  " +
                            "AND sg.sc_group_is_active " +
                    "LEFT OUTER JOIN musesuperchar.entity_sc_group_ass esga  " +
                        "ON sg.sc_group_id = esga.entity_sc_group_ass_sc_group_id " +
                            "AND esga.entity_sc_group_ass_is_active " +
                    "LEFT OUTER JOIN musesuperchar.entity e  " +
                        "ON esga.entity_sc_group_ass_entity_id = e.entity_id " +
                            "AND e.entity_is_active " +
                "WHERE   sdsga.sc_def_sc_group_ass_is_active " +
                    'AND sdsga.sc_def_sc_group_ass_sc_def_id = ' +
                                '<? value("pSuperCharId") ?> ' +
                "GROUP BY  sg.sc_group_id " +
                         ",sg.sc_group_internal_name " +
                         ",sg.sc_group_display_name ",
                {pSuperCharId: pSuperCharId});
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem trying to retrieve the groups associated with a Super Characteristic.",
                "MuseSuperChar.SuperChar.getSuperCharGroups",
                {params: funcParams, thrownError: e});
        }
    };

    var isValidatorSystemLocked = function(pValidatorId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pValidatorId: pValidatorId
        };

        try {
            var condValQuery = MuseUtils.executeQuery(
                "SELECT conditional_validation_rule_is_system_locked " +
                "FROM  musesuperchar.conditional_validation_rule cvr " +
                "WHERE conditional_validation_rule_id = " +
                    '<? value("pValidatorId") ?> ',
                    {pValidatorId: pValidatorId});

            if(condValQuery.first()) {
                return MuseUtils.isTrue(condValQuery.value(
                    "conditional_validation_rule_is_system_locked"));
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We did not find the requested conditional validation rule while trying to check if it was system locked.",
                    "MuseSuperChar.SuperChar.isValidatorSystemLocked",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem trying to find if a conditional validator was system locked or not.",
                "MuseSuperChar.SuperChar.isValidatorSystemLocked",
                {params: funcParams, thrownError: e});
        }
        
    };

    var getDefaultScInternalName = function(pDisplayName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pDisplayName: pDisplayName
        };
        
        try {
            
            return pDisplayName.replace(/'/g,'')
                        .replace(/[^\w]+/g,'_')
                        .replace(/^_|_$/,'')
                        .toLowerCase();
        } catch(e) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "The provided text is not a JavaScript string.",
                "MuseSuperChar.SuperChar.getDefaultScInternalName",
                {params: funcParams, thrownError: e});
        }
    };

    var getSuperCharDeleteViolations = function(pSuperCharId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharId: pSuperCharId
        };
        
        try {
            var violationQuery = MuseUtils.executeQuery(
                "SELECT musesuperchar.get_superchar_delete_violations( " +
                '<? value("pSuperCharId") ?>) AS result',
                {pSuperCharId: pSuperCharId});

            if(violationQuery.first()) {
                return JSON.parse(violationQuery.firstJson().result);
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We did not receive the expected response from the database while checking for proprosed Super Character deletion validation violations.",
                    "MuseSuperChar.SuperChar.getSuperCharDeleteViolations",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem trying to retrieve Super Characteristic delete validator violations.",
                "MuseSuperChar.SuperChar.getSuperCharDeleteViolations",
                {params: funcParams, thrownError: e});
        }
    };

    //--------------------------------------------------------------------
    //  Public Interface -- Functions
    //--------------------------------------------------------------------
    pPublicApi.getSuperChars = function(pParams) {
        return getSuperChars(pParams || {});
    };

    pPublicApi.getSuperCharById = function(pSuperCharId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharId: pSuperCharId
        };
        
        if(!MuseUtils.isValidId(pSuperCharId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which Super Characteristic we were being asked to retrieve.",
                "MuseSuperChar.SuperChar.pPublicApi.getSuperCharById",
                {params: funcParams});
        }

        return getSuperCharById(pSuperCharId);
    };

    pPublicApi.isSuperCharSystemLocked = function(pSuperCharId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharId: pSuperCharId
        };
        
        if(!MuseUtils.isValidId(pSuperCharId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand for which Super Characteristic we should return the system locked status.",
                "MuseSuperChar.SuperChar.pPublicApi.isSuperCharSystemLocked",
                {params: funcParams});
        }

        return isSuperCharSystemLocked(pSuperCharId);
    };

    pPublicApi.getSuperCharsByGroupId = function(pGroupId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId
        };
        
        if(!MuseUtils.isValidId("pGroupId")) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand for which group to retrieve Super Characteristics.",
                "MuseSuperChar.SuperChar.pPublicApi.getSuperCharsByGroupId",
                {params: funcParams});
        }

        return getSuperCharsByGroupId(pGroupId);
    };

    pPublicApi.getSuperCharsByEntityId = function(pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityId: pEntityId
        };
        
        if(!MuseUtils.isValidId("pEntityId")) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand for which entity to retrieve Super Characteristics",
                "MuseSuperChar.SuperChar.pPublicApi.getSuperCharsByEntityId",
                {params: funcParams});
        }

        return getSuperCharsByEntityId(pEntityId);
    };
    
    pPublicApi.createSuperChar = function(pSuperCharData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharData: pSuperCharData
        };
        
        if(!privileges.check("maintainSuperCharateristics")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permissions to maintain Super Characteristics.",
                "MuseSuperChar.SuperChar.pPublicApi.createSuperChar",
                {params: funcParams});
        }

        if(!pSuperCharData.hasOwnProperty("sc_def_internal_name") ||
            MuseUtils.coalesce(pSuperCharData.sc_def_internal_name,"") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require an internal name for the Super Characteristic and did not receive one.",
                "MuseSuperChar.SuperChar.pPublicApi.createSuperChar",
                {params: funcParams});
        }

        if(!pSuperCharData.hasOwnProperty("sc_def_display_name") ||
            MuseUtils.coalesce(pSuperCharData.sc_def_display_name,"") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a display name for the Super Characteristic and did not receive one.",
                "MuseSuperChar.SuperChar.pPublicApi.createSuperChar",
                {params: funcParams});
        }

        if(!pSuperCharData.hasOwnProperty("sc_def_description") ||
            MuseUtils.coalesce(pSuperCharData.sc_def_description,"") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a description of the Super Characteristic and did not receive one.",
                "MuseSuperChar.SuperChar.pPublicApi.createSuperChar",
                {params: funcParams});
        }

        if(!pSuperCharData.hasOwnProperty("sc_def_data_type_id") ||
            !MuseUtils.isValidId(pSuperCharData.sc_def_data_type_id)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "New Super Characteristics must identify a valid data type and we did not understand which to use in from your request.",
                "MuseSuperChar.SuperChar.pPublicApi.createSuperChar",
                {params: funcParams});
        }

        pSuperCharData.sc_def_is_searchable = MuseUtils.isTrue(
            MuseUtils.coalesce(pSuperCharData.sc_def_is_searchable, false));

        return createSuperChar(pSuperCharData);
    };

    pPublicApi.updateSuperChar = function(pSuperCharData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharData: pSuperCharData
        };
        
        if (!pSuperCharData.hasOwnProperty("sc_def_id") || 
            !MuseUtils.isValidId(pSuperCharData.sc_def_id)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which Super Characteristic you wished to update.",
                "MuseSuperChar.SuperChar.pPublicApi.updateSuperChar",
                {params: funcParams});
        }

        if (!privileges.check("maintainSuperCharateristics")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to update Super Characteristics.",
                "MuseSuperChar.SuperChar.pPublicApi.updateSuperChar",
                {params: funcParams});
        } else if (isSuperCharSystemLocked(pSuperCharData.sc_def_id) && 
            !privileges.check("maintainSuperCharSysLockRecsManually")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to update system locked Super Characteristics.",
                "MuseSuperChar.SuperChar.pPublicApi.updateSuperChar",
                {params: funcParams});
        }

        if (pSuperCharData.hasOwnProperty("sc_def_internal_name") &&
            !privileges.check("maintainSuperCharInternalNames")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to update a Super Characteristic's internal name.",
                "MuseSuperChar.SuperChar.pPublicApi.updateSuperChar",
                {params: funcParams});
        }

        return updateSuperChar(pSuperCharData);
    };

    pPublicApi.deleteSuperChar = function(pSuperCharId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharId: pSuperCharId
        };
        
        if(!MuseUtils.isValidId(pSuperCharId)) { 
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We could not understand which SuperChar you wished to delete.",
                "MuseSuperChar.SuperChar.pPublicApi.deleteSuperChar",
                {params: funcParams});  
        }

        if(!privileges.check("maintainSuperCharateristics")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to delete Super Characteristics.",
                "MuseSuperChar.SuperChar.pPublicApi.pSuperCharId",
                {params: funcParams});
        } else if(isSuperCharSystemLocked(pSuperCharId) &&
            !privileges.check(maintainSuperCharSysLockRecsManually)) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to delete system locked Super Characteristics.",
                "MuseSuperChar.SuperChar.pPublicApi.deleteSuperChar",
                {params: funcParams});
        }

        return deleteSuperChar(pSuperCharId);
    };

    pPublicApi.getSuperCharGroups = function(pSuperCharId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharId: pSuperCharId
        };
        
        if(!MuseUtils.isValidId(pSuperCharId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which Super Characteristic for which you wanted to retrieve associated groups.",
                "MuseSuperChar.SuperChar.pPublicApi.getSuperCharGroups",
                {params: funcParams});
        }

        return getSuperCharGroups(pSuperCharId);
    };

    pPublicApi.getSuperCharValidators = function(pSuperCharId) {

    };

    pPublicApi.getSuperCharLov = function(pSuperCharId) {

    };

    pPublicApi.addSuperCharLovValue = function(pSuperCharId, pLovValue) {

    };

    pPublicApi.validateLovQuery = function(pSuperCharId) {

    };

    pPublicApi.getValidatorById = function(pValidatorId) {

    };

    pPublicApi.isValidatorSystemLocked = function(pValidatorId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pValidatorId: pValidatorId
        };
        
        if(!MuseUtils.isValidId(pValidatorId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which validator need checking for being systems locked.",
                "MuseSuperChar.SuperChar.pPublicApi.isValidatorSystemLocked",
                {params: funcParams});
        }

        return isValidatorSystemLocked(pValidatorId);
    };

    pPublicApi.getSubjectObjectNonOverlappingEntities = function(pSubjectScId, 
        pObjectScId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSubjectScId: pSubjectScId,
            pObjectScId: pObjectScId
        };

        if(!MuseUtils.isValidId(pSubjectScId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand for which subject Super Characteristic to check for non-overlapping entities.",
                "MuseSuperChar.SuperChar.pPublicApi.getSubjectObjectNonOverlappingEntities",
                {params: funcParams});
        }

        if(!MuseUtils.isValidId(pObjectScId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand for which object Super Characteristic to check for non-overlapping entities.",
                "MuseSuperChar.SuperChar.pPublicApi.getSubjectObjectNonOverlappingEntities",
                {params: funcParams});
        }
        
        return getSubjectObjectNonOverlappingEntities(pSubjectScId, pObjectScId);
    };

    pPublicApi.getSuperCharDeleteViolations = function(pSuperCharId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pSuperCharId: pSuperCharId
        };

        if(!MuseUtils.isValidId(pSuperCharId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which Super Characteristics you wanted to check for delete validator violations.",
                "MuseSuperChar.SuperChar.pPublicApi.getSuperCharDeleteViolations",
                {params: funcParams});
        }
        
        return getSuperCharDeleteViolations(pSuperCharId);
    };

    pPublicApi.createValidator = function(pValidatorData) {

    };

    pPublicApi.updateValidator = function(pValidatorData) {

    };

    pPublicApi.deleteValidator = function(pValidatorId) {

    };

    pPublicApi.getDefaultScInternalName = function(pDisplayName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pDisplayName: pDisplayName
        };

        if(MuseUtils.coalesce(pDisplayName,"") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require some text value from which to construct a default Super Characteristic internal name.",
                "MuseSuperChar.SuperChar.pPublicApi.getDefaultScInternalName",
                {params: funcParams});
        }

        return getDefaultScInternalName(pDisplayName);
    };

})(this.MuseSuperChar.SuperChar);

    