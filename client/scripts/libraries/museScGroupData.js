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
                "FROM   musesuperchar.sc_group " + 
                    "LEFT OUTER JOIN public.pkghead " + 
                        "ON sc_group_pkghead_id = pkghead_id " + whereClause,
                {pParams: pParams});
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

            return groupQuery.firstJson();
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
                    ',<? value("sc_group_description") ?>)' +
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
            queryText = queryText + updateColumns.join(',') + 
                'WHERE sc_group_id = <? value("sc_group_id") >? ' +
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

        try {
            return isGroupSystemLocked(pGroupId);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to find out whether a group was system locked.",
                "MuseSuperChar.Group.pPublicApi.isGroupSystemLocked",
                {params: funcParams, thrownError: e});
        }
    };

    pPublicApi.getGroups = function(pParams) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pParams: pParams
        };
        
        try {
            return getGroups(pParams);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to retrieve the list of groups as requested.",
                "MuseSuperChar.Group.pPublicApi.getGroups",
                {params: funcParams, thrownError: e});
        }
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

        try {
            return getGroupById(pGroupId);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to retrieve the requested group record.",
                "MuseSuperChar.Group.pPublicApi.getGroupById",
                {params: funcParams, thrownError: e});
        }
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

        try {
            return getGroupEntities(pGroupId);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to retrieve the list of entities associated with the requested group.",
                "MuseSuperChar.Group.pPublicApi.getGroupEntities",
                {params: funcParams, thrownError: e});
        }
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

        try {
            return getNonGroupEntities(pGroupId);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to retrieve the non-associated entities list for the requested group.",
                "MuseSuperChar.Group.pPublicApi.getNonGroupEntities",
                {params: funcParams, thrownError: e});
        }
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

        try {
            return getDefaultGroupInternalName(pDisplayName);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to derive an appropriate and valid default group internal name.",
                "MuseSuperChar.Group.pPublicApi.getDefaultGroupInternalName",
                {params: funcParams, thrownError: e});
        }
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

        try {
            return createGroup(pGroupData);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to verify that we created your new group as requested.",
                "MuseSuperChar.Group.pPublicApi.createGroup",
                {params: funcParams, thrownError: e});
        }
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

        try {
            return updateGroup(pGroupData);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to verify that we updated the requested super characteristic group as directed.",
                "MuseSuperChar.Group.pPublicApi.updateGroup",
                {params: funcParams, thrownError: e});
        }
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

        try {
            return deleteGroup(pGroupId);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to delete the requested super characteristic group.",
                "MuseSuperChar.Group.pPublicApi.deleteGroup",
                {params: funcParams, thrownError: e});
        }
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