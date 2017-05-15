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
                "SELECT   sc_def_id " +
                        ",sc_def_internal_name " +
                        ",sc_def_display_name " +
                        ",sc_def_description " +
                        ",sc_def_pkghead_id " +
                        ",sc_def_is_system_locked " +
                        ",sc_def_data_type_id " +
                        ",sc_def_values_list " +
                        ",sc_def_list_query " +
                        ",sc_def_is_searchable " +
                        ",pkghead_name AS sc_def_package_name " +
                "FROM    musesuperchar.sc_def " +
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
                        "sc_def_description) " +
                        "VALUES " +
                    '( <? value("sc_def_internal_name") ?> ' +
                     ',<? value("sc_def_display_name") ?> '  +
                     ',<? value("sc_def_description") ?> ' +
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
                "We encountered a problem ",
                "Fully Qualified Function Name",
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
                    '<? value("sc_def_values_list") ?> ');
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
            queryText =+ updateColumns.join(', ') +
                'WHERE sc_def_id = <? value("sc_def_id") ?> ' +
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
                return scQuery.value(sc_def_id);
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

    };

    pPublicApi.getSuperCharValidators = function(pSuperCharId) {

    };

    pPublicApi.getSuperCharLov = function(pSuperCharId) {

    };

    pPublicApi.saveSuperCharLov = function(pSuperCharId, pLovValues) {

    };

    pPublicApi.validateLovQuery = function(pSuperCharId) {

    };

    pPublicApi.getValidatorById = function(pValidatorId) {

    };

    pPublicApi.isValidatorSystemLocked = function(pValidatorId) {

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

    pPublicApi.createValidator = function(pValidatorData) {

    };

    pPublicApi.updateValidator = function(pValidatorData) {

    };

    pPublicApi.deleteValidator = function(pValidatorId) {

    };


})(this.MuseSuperChar.SuperChar);

    