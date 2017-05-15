/*************************************************************************
 *************************************************************************
 **
 ** File:        museScGroupData.js
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
this.MuseSuperChar.Group = this.MuseSuperChar.Group || {};

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
    var isGroupSystemLocked = function(pGroupId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId
        };

        try {
            var groupQuery = MuseUtils.executeQuery(
                "SELECT sc_group_is_system_locked " +
                "FROM musesuperchar.sc_group " +
                'WHERE sc_group_id = <? value(pGroupId) ?> ',
                {pGroupId: pGroupId});
            if(groupQuery.first()) {
                return MuseUtils.isTrue(
                    groupQuery.value("sc_group_is_system_locked"));
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We didn't receive a result from the database while checking if the requested group was system locked.",
                    "Fully Qualified Function Name",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a database problem checking if the requested group was system locked.",
                "MuseSuperChar.Group.isGroupSystemLocked",
                {params: funcParams, thrownError: e});
        }
    };

    var getGroups = function(pParams) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pParams: pParams
        };

        var whereClause = "WHERE true ";

        if(!MuseUtils.isTrue(pParams.isInactiveIncluded || false)) {
            whereClause = whereClause + "AND sc_group_is_active ";
        }

        if(pParams.hasOwnProperty("sc_group_id")) {
            whereClause = whereClause + 
                'AND sc_group_id = <? value("sc_group_id") ?> ';
        }

        if(pParams.hasOwnProperty("sc_group_internal_name")) {
            whereClause = whereClause +
                'AND sc_group_internal_name = ' +
                '<? value("sc_group_internal_name") ?> ';
        }

        if(pParams.hasOwnProperty("sc_group_display_name")) {
            whereClause = whereClause +
                'AND sc_group_display_name = ' +
                '<? value("sc_group_display_name") ?> ';
        }

        if(pParams.hasOwnProperty("sc_group_pkghead_id")) {
            whereClause = whereClause +
                'AND sc_group_pkghead_id = <? value("sc_group_pkghead_id") ?> ';
        }

        if(pParams.hasOwnProperty("sc_group_package_name")) {
            whereClause = whereClause +
                'AND pkghead_name = <? value("pkghead_name") ?> ';
        }

        if(pParams.hasOwnProperty("sc_group_is_system_locked")) {
            whereClause = whereClause + 
                'AND sc_group_is_system_locked = ' +
                '<? value("sc_group_is_system_locked") ?> ';
        }

        try {
            return MuseUtils.executeQuery(
                "SELECT       sc_group_id " +
                            ",sc_group_internal_name " +
                            ",sc_group_display_name " +
                            ",sc_group_description " +
                            ",sc_group_pkghead_id " +
                            ",sc_group_is_system_locked " +
                            ",sc_group_is_active " +
                            ",sc_group_date_created " +
                            ",sc_group_role_created " +
                            ",sc_group_date_modified " +
                            ",sc_group_wallclock_modified " +
                            ",sc_group_role_modified " +
                            ",sc_group_date_deactivated " +
                            ",sc_group_role_deactivated " +
                            ",sc_group_row_version_number " +
                            ",pkghead_name AS sc_group_package_name " +
                            ",CASE " +
                                "WHEN sc_group_is_system_locked THEN " +
                                    "'bisque' " +
                                "ELSE " +
                                    "'palegreen' " +
                            " END AS sc_group_display_name_qtbackgroundrole " +
                "FROM   musesuperchar.sc_group " + 
                    "LEFT OUTER JOIN public.pkghead " + 
                        "ON sc_group_pkghead_id = pkghead_id " + whereClause,
                pParams);
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem retrieving the list of groups from the database.",
                "MuseSuperChar.Group.getGroups",
                {params: funcParams, thrownError: e});
        }
    };

    var getGroupById = function(pGroupId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId
        };
        
        try {
            var groupQuery = getGroups(
                {
                    sc_group_id: pGroupId, 
                    isInactiveIncluded: true
                });

            if(groupQuery.first()) {
                return groupQuery.firstJson();
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We did not find the requested group in the database.",
                    "MuseSuperChar.Group.getGroupById",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to retrieve the requested group record.",
                "MuseSuperChar.Group.getGroupById",
                {params: funcParams, thrownError: e});
        }
    };

    var getGroupEntities = function(pGroupId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId
        };
        
        try {
            return MuseUtils.executeQuery(
                "SELECT       entity_id " +
                            ",entity_display_name " +
                            ",entity_schema || '.' || entity_table AS entity_code" +
                            ",CASE " +
                                "WHEN entity_sc_group_ass_is_system_locked THEN " +
                                    "'bisque' " +
                                "ELSE " +
                                    "'palegreen' " +
                           " END AS entity_display_name_qtbackgroundrole " +
                "FROM   musesuperchar.entity " +
                    "JOIN musesuperchar.entity_sc_group_ass " +
                        "ON entity_id = entity_sc_group_ass_entity_id " + 
                "WHERE  entity_is_active AND entity_sc_group_ass_is_active " +
                    'AND entity_sc_group_ass_sc_group_id = <? value("pGroupId") ?>',
                {pGroupId: pGroupId});
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem retrieving the request entity records for the identified group.",
                "MuseSuperChar.Group.getGroupEntities",
                {params: funcParams, thrownError: e});
        }
    };

    var getNonGroupEntities = function(pGroupId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId
        };
        
        try {
            return MuseUtils.executeQuery(
                "SELECT       entity_id " +
                            ",entity_display_name " +
                            ",entity_schema || '.' || entity_table AS entity_code" +
                            ",CASE " +
                                "WHEN entity_sc_group_ass_is_system_locked THEN " +
                                    "'bisque' " +
                                "ELSE " +
                                    "'palegreen' " +
                           " END AS entity_display_name_qtbackgroundrole " +
                "FROM   musesuperchar.entity " +
                    "LEFT OUTER JOIN musesuperchar.entity_sc_group_ass " +
                        "ON entity_id = entity_sc_group_ass_entity_id " + 
                            "AND entity_sc_group_ass_is_active " +
                            'AND entity_sc_group_ass_sc_group_id = ' +
                                '<? value("pGroupId") ?> ' +
                "WHERE  entity_is_active  " +
                    "AND entity_sc_group_ass_id IS NULL",
                {pGroupId: pGroupId});
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered problems retrieving the list of entities not associated with the identified group.",
                "MuseSuperChar.Group.getNonGroupEntities",
                {params: funcParams, thrownError: e});
        }
    };

    var getDefaultGroupInternalName = function(pDisplayName) {
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
                "MuseSuperChar.Group.getDefaultGroupInternalName",
                {params: funcParams});
        }
    };

    var createGroup = function(pGroupData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupData: pGroupData
        };
        
        try {
            var groupQuery = MuseUtils.executeQuery(
                "INSERT INTO musesuperchar.sc_group " +
                    "(sc_group_internal_name, sc_group_display_name, " +
                        "sc_group_description) " +
                        "VALUES " +
                    '( <? value("sc_group_internal_name") ?> ' +
                    ',<? value("sc_group_display_name") ?> ' +
                    ',<? value("sc_group_description") ?>) ' +
                    "RETURNING sc_group_id",
                pGroupData);

            if(!groupQuery.first() || 
                !MuseUtils.isValidId(groupQuery.value("sc_group_id"))) {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We did not verify that the new group was created properly.",
                    "MuseSuperChar.createGroup",
                    {params: funcParams});
            }

            return groupQuery.value("sc_group_id");
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem trying to create a new group.",
                "MuseSuperChar.Group.createGroup",
                {params: funcParams, thrownError: e});
        }
    };

    var updateGroup = function(pGroupData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupData: pGroupData
        };

        var updateColumns = [];
        var queryText = "UPDATE musesuperchar.sc_group SET ";

        if(pGroupData.hasOwnProperty("sc_group_id")) {
            updateColumns.push(
                'sc_group_id = <? value("sc_group_id" ?> ');
        }

        if(pGroupData.hasOwnProperty("sc_group_internal_name")) {
            updateColumns.push(
                'sc_group_internal_name = ' +
                    '<? value("sc_group_internal_name") ?> ');
        }

        if(pGroupData.hasOwnProperty("sc_group_display_name")) {
            updateColumns.push(
                'sc_group_display_name = ' +
                    '<? value("sc_group_display_name") ?> ');
        }

        if(pGroupData.hasOwnProperty("sc_group_description")) {
            updateColumns.push(
                'sc_group_description = ' +
                    '<? value("sc_group_description") ?> ');
        }

        if(pGroupData.hasOwnProperty("sc_group_is_system_locked")) {
            updateColumns.push(
                'sc_group_is_system_locked = ' +
                    '<? value("sc_group_is_system_locked") ?> ');
        }

        if(pGroupData.hasOwnProperty("sc_group_is_active")) {
            updateColumns.push(
                'sc_group_is_active = <? value("sc_group_is_active") ?> ');
        }

        try {
            queryText = queryText + updateColumns.join(', ') + 
                'WHERE sc_group_id = <? value("sc_group_id") ?> ' +
                'RETURNING sc_group_id';

            var groupQuery = MuseUtils.executeQuery(queryText, pGroupData);

            if(groupQuery.first() && 
                MuseUtils.isValidId(groupQuery.value("sc_group_id"))) {
                return groupQuery.value("sc_group_id");
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We could not verify that we have successfully updated the super characteristic group as directed.",
                    "MuseSuperChar.Group.updateGroup",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem trying to update a Super Characteristic group.",
                "MuseSuperChar.Group.updateGroup",
                {params: funcParams, thrownError: e});
        }
    };

    var deleteGroup = function(pGroupId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId
        };
        
        try {
            var groupQuery = MuseUtils.executeQuery(
                "DELETE FROM musesuperchar.sc_group " +
                'WHERE sc_group_id = <? value("pGroupId") ?> ' +
                "RETURNING sc_group_id",
                {pGroupId: pGroupId});
            
            if(groupQuery.first() && 
                MuseUtils.isValidId(groupQuery.value("sc_group_id"))) {
                return groupQuery.value("sc_group_id");
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We falied to verify that we deleted the super characteristic group as directed.",
                    "MuseSuperChar.Group.deleteGroup",
                    {params: funcParams});  
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem trying to delete a super characteristic group.",
                "MuseSuperChar.Group.deleteGroup",
                {params: funcParams, thrownError: e});
        }
    };

    var addGroupEntityAssc = function(pGroupId, pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId,
            pEntityId: pEntityId
        };

        try {
            var groupQuery = MuseUtils.executeQuery(
                "SELECT musesuperchar.add_group_entity_association( " +
                    '<? value("pGroupId") ?>, <? value("pEntityId") ?> ) ' +
                    "AS result",
                    {pGroupId: pGroupId, pEntityId: pEntityId});

            if(!groupQuery.first() || 
                !MuseUtils.isValidId(groupQuery.value("result"))) {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We did not verify that we have successfully created the new group/entity association.",
                    "MuseSuperChar.Group.addGroupEntityAssc",
                    {params: funcParams});
            }

            return groupQuery.value("result");
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a database problem while adding a group/entity association.",
                "MuseSuperChar.Group.addGroupEntityAssc",
                {params: funcParams, thrownError: e});
        }
    };

    var deleteGroupEntityAssc = function(pGroupId, pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId,
            pEntityId: pEntityId
        };
        
        try {
            var groupQuery = MuseUtils.executeQuery(
                "SELECT musesuperchar.delete_group_entity_association( " +
                    '<? value("pGroupId") ?>, <? value("pEntityId") ?> ) ' +
                    "AS result",
                    {pGroupId: pGroupId, pEntityId: pEntityId});
            
            if(!groupQuery.first() ||
                    !MuseUtils.isValidId(groupQuery.value("result"))) {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We failed to verify that we deleted the group/entity association as requested.",
                    "MuseSuperChar.Group.deleteGroupEntityAssc",
                    {params: funcParams});
            }

            return groupQuery.value("result");
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a database problem while deleting a group/entity association.",
                "MuseSuperChar.Group.deleteGroupEntityAssc",
                {params: funcParams, thrownError: e});
        }
    };

    var isGroupEntityAsscSystemLocked = function(pGroupId, pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId,
            pEntityId: pEntityId
        };

        try {
            var groupQuery = MuseUtils.executeQuery(
                "SELECT entity_sc_group_ass_is_system_locked " +
                "FROM musesuperchar.entity_sc_group_ass " +
                'WHERE entity_sc_group_ass_sc_group_id = <? value("pGroupId") ?> ' +
                    'AND entity_sc_group_ass_entity_id = <? value("pEntityId") ?> ',
                    {pGroupId: pGroupId, pEntityId: pEntityId});
            if(groupQuery.first()) {
                return MuseUtils.isTrue(
                    groupQuery.value("entity_sc_group_ass_is_system_locked"));
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We did not find the requested Group/Entity Association.",
                    "MuseSuperChar.Group.isGroupEntityAsscSystemLocked",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem trying to find out if a Group/Entity Association is system locked.",
                "MuseSuperChar.Group.isGroupEntityAsscSystemLocked",
                {params: funcParams, thrownError: e});
        }
    };

    var getGroupEntityAsscAddViolations = function(pGroupId, pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId,
            pEntityId: pEntityId
        };
        
        try {
            var violationQuery = MuseUtils.executeQuery(
                "SELECT musesuperchar.get_group_entity_add_violations( " +
                    '<? value("pGroupId") ?>, <? value("pEntityId") ?>) ' +
                    "AS result ",
                    {pGroupId: pGroupId, pEntityId: pEntityId});
            if(violationQuery.first()) {
                return JSON.parse(violationQuery.firstJson().result);
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We did not receive the expected response from the database while checking for proprosed Group/Entity validation violations.",
                    "MuseSuperChar.Group.getGroupEntityAsscAddViolations",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem trying to find whether a proposed group/entity association would cause validator violations.",
                "MuseSuperChar.Group.getGroupEntityAsscAddViolations",
                {params: funcParams, thrownError: e});
        }
    };

    //--------------------------------------------------------------------
    //  Public Interface -- Functions
    //--------------------------------------------------------------------
    pPublicApi.isGroupSystemLocked = function(pGroupId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId
        };

        if(!MuseUtils.isValidId(pGroupId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which group to check as being system locked or not.",
                "MuseSuperChar.Group.pPublicApi.isGroupSystemLocked",
                {params: funcParams});
        }

        return isGroupSystemLocked(pGroupId);
    };

    pPublicApi.getGroups = function(pParams) {
        return getGroups(pParams || {});
    };

    pPublicApi.getGroupById = function(pGroupId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId
        };

        if(!MuseUtils.isValidId(pGroupId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which group you wanted to retrieve.",
                "MuseSuperChar.Group.pPublicApi.getGroupById",
                {params: funcParams});
        }

        return getGroupById(pGroupId);
    };

    pPublicApi.getGroupEntities = function(pGroupId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId
        };
        
        if (!MuseUtils.isValidId(pGroupId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand for which group you wished to retrieve entity records.",
                "MuseSuperChar.Group.pPublicApi.getGroupEntities",
                {params: funcParams});
        }

        return getGroupEntities(pGroupId);
    };

    pPublicApi.getNonGroupEntities = function(pGroupId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId
        };
        
        if(!MuseUtils.isValidId(pGroupId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand for which group you wished to retrieve the non-associated entities list.",
                "MuseSuperChar.Group.pPublicApi.getNonGroupEntities",
                {params: funcParams});
        }

        return getNonGroupEntities(pGroupId);
    };

    pPublicApi.addGroupEntityAssc = function(pGroupId, pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId,
            pEntityId: pEntityId
        };

        if(!MuseUtils.isValidId(pGroupId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which group you wanted to associate with the requested entity.",
                "MuseSuperChar.Group.pPublicApi.addGroupEntityAssc",
                {params: funcParams});
        }

        if(!MuseUtils.isValidId(pEntityId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which entity you wanted to associate with the requested group.",
                "MuseSuperChar.Group.pPublicApi.addGroupEntityAssc",
                {params: funcParams});
        }

        return addGroupEntityAssc(pGroupId, pEntityId);
    };

    pPublicApi.deleteGroupEntityAssc = function(pGroupId, pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId,
            pEntityId: pEntityId
        };

        if(!MuseUtils.isValidId(pGroupId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which group you wanted to disassociate with the requested entity.",
                "MuseSuperChar.Group.pPublicApi.deleteGroupEntityAssc",
                {params: funcParams});
        }

        if(!MuseUtils.isValidId(pEntityId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which entity you wanted to disassociate with the requested group.",
                "MuseSuperChar.Group.pPublicApi.deleteGroupEntityAssc",
                {params: funcParams});
        }

        return deleteGroupEntityAssc(pGroupId, pEntityId);
    };

    pPublicApi.isGroupEntityAsscSystemLocked = function(pGroupId, pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId,
            pEntityId: pEntityId
        };

        if(!MuseUtils.isValidId(pGroupId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand for which group you wanted to check a group/entity association for being system locked.",
                "MuseSuperChar.Group.pPublicApi.isGroupEntityAsscSystemLocked",
                {params: funcParams});
        }
        
        if(!MuseUtils.isValidId(pEntityId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand for which entity you wanted to check a group/entity association for being system locked.",
                "MuseSuperChar.Group.pPublicApi.isGroupEntityAsscSystemLocked",
                {params: funcParams});
        }

        return isGroupEntityAsscSystemLocked(pGroupId, pEntityId);
    };

    pPublicApi.getGroupLayoutItems = function() {

    };

    pPublicApi.getGroupLayoutItemById = function() {

    };

    pPublicApi.isGroupLayoutItemSystemLocked = function() {

    };

    pPublicApi.getDefaultGroupInternalName = function(pDisplayName) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pDisplayName: pDisplayName
        };

        if(MuseUtils.coalesce(pDisplayName,"") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require some text value from which to construct a default group internal name.",
                "MuseSuperChar.Group.pPublicApi.getDefaultGroupInternalName",
                {params: funcParams});
        }

        return getDefaultGroupInternalName(pDisplayName);
    };

    pPublicApi.getGroupEntityAsscAddViolations = function(pGroupId, pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId,
            pEntityId: pEntityId
        };

        if(!MuseUtils.isValidId(pGroupId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which group you wanted to test for entity association validity.",
                "MuseSuperChar.Group.pPublicApi.getGroupEntityAsscAddViolations",
                {params: funcParams});
        }

        if (!MuseUtils.isValidId(pEntityId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which entity you wanted to see if you could add a group without validator violations.",
                "MuseSuperChar.Group.pPublicApi.getGroupEntityAsscAddViolations",
                {params: funcParams});
        }

        return getGroupEntityAsscAddViolations(pGroupId, pEntityId);
    };

    pPublicApi.createGroup = function(pGroupData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupData: pGroupData
        };

        if(!privileges.check("maintainSuperCharGroups")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to create new groups.",
                "MuseSuperChar.Group.pPublicApi.createGroup",
                {params: funcParams});
        }
        
        if(!pGroupData.hasOwnProperty("sc_group_internal_name") ||
            MuseUtils.coalesce(pGroupData.sc_group_internal_name, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require at least a plausable internal name for the new group.",
                "MuseSuperChar.Group.pPublicApi.createGroup",
                {params: funcParams});
        }

        if(!pGroupData.hasOwnProperty("sc_group_display_name") ||
            MuseUtils.coalesce(pGroupData.sc_group_display_name,"") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We require a display name for the new group.",
                "MuseSuperChar.Group.pPublicApi.createGroup",
                {params: funcParams});
        }

        if(!pGroupData.hasOwnProperty("sc_group_description") ||
            MuseUtils.coalesce(pGroupData.sc_group_description, "") === "") {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "You must provide a group description when creating a new group.",
                "MuseSuperChar.Group.pPublicApi.createGroup",
                {params: funcParams});
        }

        return createGroup(pGroupData);
    };

    pPublicApi.updateGroup = function(pGroupData) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupData: pGroupData
        };

        if(!pGroupData.hasOwnProperty("sc_group_id") ||
            !MuseUtils.isValidId(pGroupData.sc_group_id)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which super characteristic group you wished to update.",
                "MuseSuperChar.Group.pPublicApi.updateGroup",
                {params: funcParams});
        }

        if(!privileges.check("maintainSuperCharGroups")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to update super characteristic groups.",
                "MuseSuperChar.Group.pPublicApi.updateGroup",
                {params: funcParams});
        } else if(isGroupSystemLocked(pGroupData.sc_group_id) &&
                    !privileges.check("maintainSuperCharSysLockRecsManually")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to update system locked super characteristic groups.",
                "MuseSuperChar.Group.pPublicApi.updateGroup",
                {params: funcParams});
        }

        if(pGroupData.hasOwnProperty("sc_group_internal_name") && 
            !privileges.check("maintainSuperCharInternalNames")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You have asked to update a group's internal name and you do not have permission to make such an update.",
                "MuseSuperChar.Group.pPublicApi.updateGroup",
                {params: funcParams});
        }

        return updateGroup(pGroupData);
    };

    pPublicApi.deleteGroup = function(pGroupId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pGroupId: pGroupId
        };
        
        if(!MuseUtils.isValidId(pGroupId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which super characteristic group you wished to delete.",
                "MuseSuperChar.Group.pPublicApi.deleteGroup",
                {params: funcParams});
        }

        if(!privileges.check("maintainSuperCharGroups")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to delete super characteristic groups.",
                "MuseSuperChar.Group.pPublicApi.deleteGroup",
                {params: funcParams});
        } else if(isGroupSystemLocked(pGroupId) &&
                    !privileges.check("maintainSuperCharSysLockRecsManually")) {
            throw new MuseUtils.PermissionException(
                "musesuperchar",
                "You do not have permission to delete a system locked super characteristic groups.",
                "MuseSuperChar.Group.pPublicApi.deleteGroup",
                {params: funcParams});
        }

        return deleteGroup(pGroupId);
    };

    pPublicApi.createGroupLayoutItem = function() {

    };

    pPublicApi.updateGroupLayoutItem = function() {

    };

    pPublicApi.deleteGroupLayoutItem = function() {

    };

    pPublicApi.moveUpGroupLayoutItem = function() {

    };

    pPublicApi.moveDownGroupLayoutItem = function() {

    };

})(this.MuseSuperChar.Group);