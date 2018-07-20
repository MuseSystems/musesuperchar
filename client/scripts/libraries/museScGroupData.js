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

try {
    //////////////////////////////////////////////////////////////////////////
    //  Namespace Definition
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseSuperChar === "undefined") {
        MuseSuperChar = {};
    }

    if (typeof MuseSuperChar.Group === "undefined") {
        MuseSuperChar.Group = {};
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
        MuseUtils.MOD_JSPOLYFILL
    ]);
} catch (e) {
    if (
        typeof MuseUtils !== "undefined" &&
        (MuseUtils.isMuseUtilsExceptionLoaded === true ? true : false)
    ) {
        var error = new MuseUtils.ScriptException(
            "musesuperchar",
            "We encountered a script level issue while processing MuseSuperChar.Group.",
            "MuseSuperChar.Group",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.Group Script Error",
            "We encountered a script level issue while processing MuseSuperChar.Group."
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
        //  Private Functional Logic
        //--------------------------------------------------------------------
        var isGroupSystemLocked = function(pGroupId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId
            };

            try {
                var groupQuery = MuseUtils.executeQuery(
                    "SELECT scgrp_is_system_locked " +
                        "FROM musesuperchar.scgrp " +
                        "WHERE scgrp_id = <? value(pGroupId) ?> ",
                    { pGroupId: pGroupId }
                );
                if (groupQuery.first()) {
                    return MuseUtils.isTrue(
                        groupQuery.value("scgrp_is_system_locked")
                    );
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We didn't receive a result from the database while checking if the requested group was system locked.",
                        "Fully Qualified Function Name",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a database problem checking if the requested group was system locked.",
                    "MuseSuperChar.Group.isGroupSystemLocked",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getGroups = function(pParams) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pParams: pParams
            };

            var whereClause = "WHERE true ";

            if (!MuseUtils.isTrue(pParams.isInactiveIncluded || false)) {
                whereClause = whereClause + "AND scgrp_is_active ";
            }

            if (pParams.hasOwnProperty("scgrp_id")) {
                whereClause =
                    whereClause + 'AND scgrp_id = <? value("scgrp_id") ?> ';
            }

            if (pParams.hasOwnProperty("scgrp_internal_name")) {
                whereClause =
                    whereClause +
                    "AND scgrp_internal_name = " +
                    '<? value("scgrp_internal_name") ?> ';
            }

            if (pParams.hasOwnProperty("scgrp_display_name")) {
                whereClause =
                    whereClause +
                    "AND scgrp_display_name = " +
                    '<? value("scgrp_display_name") ?> ';
            }

            if (pParams.hasOwnProperty("scgrp_pkghead_id")) {
                whereClause =
                    whereClause +
                    'AND scgrp_pkghead_id = <? value("scgrp_pkghead_id") ?> ';
            }

            if (pParams.hasOwnProperty("scgrp_package_name")) {
                whereClause =
                    whereClause +
                    'AND pkghead_name = <? value("pkghead_name") ?> ';
            }

            if (pParams.hasOwnProperty("scgrp_is_system_locked")) {
                whereClause =
                    whereClause +
                    "AND scgrp_is_system_locked = " +
                    '<? value("scgrp_is_system_locked") ?> ';
            }

            try {
                return MuseUtils.executeQuery(
                    "SELECT       scgrp_id " +
                        ",scgrp_internal_name " +
                        ",scgrp_display_name " +
                        ",scgrp_description " +
                        ",scgrp_pkghead_id " +
                        ",scgrp_is_system_locked " +
                        ",scgrp_min_columns " +
                        ",scgrp_is_space_conserved " +
                        ",scgrp_is_row_expansion_allowed" +
                        ",scgrp_is_active " +
                        ",scgrp_date_created " +
                        ",scgrp_role_created " +
                        ",scgrp_date_modified " +
                        ",scgrp_wallclock_modified " +
                        ",scgrp_role_modified " +
                        ",scgrp_date_deactivated " +
                        ",scgrp_role_deactivated " +
                        ",scgrp_row_version_number " +
                        ",pkghead_name AS scgrp_package_name " +
                        ",CASE " +
                        "WHEN scgrp_is_system_locked THEN " +
                        "'bisque' " +
                        "ELSE " +
                        "'palegreen' " +
                        " END AS scgrp_display_name_qtbackgroundrole " +
                        "FROM   musesuperchar.scgrp " +
                        "LEFT OUTER JOIN public.pkghead " +
                        "ON scgrp_pkghead_id = pkghead_id " +
                        whereClause,
                    pParams
                );
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem retrieving the list of groups from the database.",
                    "MuseSuperChar.Group.getGroups",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getGroupById = function(pGroupId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId
            };

            try {
                var groupQuery = getGroups({
                    scgrp_id: pGroupId,
                    isInactiveIncluded: true
                });

                if (groupQuery.first()) {
                    return groupQuery.firstJson();
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not find the requested group in the database.",
                        "MuseSuperChar.Group.getGroupById",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to retrieve the requested group record.",
                    "MuseSuperChar.Group.getGroupById",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
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
                        "WHEN entity_scgrp_ass_is_system_locked THEN " +
                        "'bisque' " +
                        "ELSE " +
                        "'palegreen' " +
                        " END AS entity_display_name_qtbackgroundrole " +
                        "FROM   musesuperchar.entity " +
                        "JOIN musesuperchar.entity_scgrp_ass " +
                        "ON entity_id = entity_scgrp_ass_entity_id " +
                        "WHERE  entity_is_active AND entity_scgrp_ass_is_active " +
                        'AND entity_scgrp_ass_scgrp_id = <? value("pGroupId") ?>',
                    { pGroupId: pGroupId }
                );
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem retrieving the request entity records for the identified group.",
                    "MuseSuperChar.Group.getGroupEntities",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
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
                        "WHEN entity_scgrp_ass_is_system_locked THEN " +
                        "'bisque' " +
                        "ELSE " +
                        "'palegreen' " +
                        " END AS entity_display_name_qtbackgroundrole " +
                        "FROM   musesuperchar.entity " +
                        "LEFT OUTER JOIN musesuperchar.entity_scgrp_ass " +
                        "ON entity_id = entity_scgrp_ass_entity_id " +
                        "AND entity_scgrp_ass_is_active " +
                        "AND entity_scgrp_ass_scgrp_id = " +
                        '<? value("pGroupId") ?> ' +
                        "WHERE  entity_is_active  " +
                        "AND entity_scgrp_ass_id IS NULL",
                    { pGroupId: pGroupId }
                );
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered problems retrieving the list of entities not associated with the identified group.",
                    "MuseSuperChar.Group.getNonGroupEntities",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getDefaultGroupInternalName = function(pDisplayName) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pDisplayName: pDisplayName
            };

            try {
                return pDisplayName
                    .replace(/'/g, "")
                    .replace(/[^\w]+/g, "_")
                    .replace(/^_|_$/, "")
                    .toLowerCase();
            } catch (e) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "The provided text is not a JavaScript string.",
                    "MuseSuperChar.Group.getDefaultGroupInternalName",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var createGroup = function(pGroupData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupData: pGroupData
            };

            try {
                var groupQuery = MuseUtils.executeQuery(
                    "INSERT INTO musesuperchar.scgrp " +
                        "(scgrp_internal_name, scgrp_display_name, " +
                        "scgrp_description, scgrp_min_columns, " +
                        "scgrp_is_space_conserved, scgrp_is_row_expansion_allowed) " +
                        "VALUES " +
                        '( <? value("scgrp_internal_name") ?> ' +
                        ',<? value("scgrp_display_name") ?> ' +
                        ',<? value("scgrp_description") ?> ' +
                        ',<? value("scgrp_min_columns") ?> ' +
                        ',<? value("scgrp_is_space_conserved") ?> ' +
                        ',<? value("scgrp_is_row_expansion_allowed") ?> ' +
                        ") " +
                        "RETURNING scgrp_id",
                    pGroupData
                );

                if (
                    !groupQuery.first() ||
                    !MuseUtils.isValidId(groupQuery.value("scgrp_id"))
                ) {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not verify that the new group was created properly.",
                        "MuseSuperChar.createGroup",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }

                return groupQuery.value("scgrp_id");
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem trying to create a new group.",
                    "MuseSuperChar.Group.createGroup",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var updateGroup = function(pGroupData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupData: pGroupData
            };

            var updateColumns = [];
            var queryText = "UPDATE musesuperchar.scgrp SET ";

            if (pGroupData.hasOwnProperty("scgrp_id")) {
                updateColumns.push('scgrp_id = <? value("scgrp_id" ?> ');
            }

            if (pGroupData.hasOwnProperty("scgrp_display_name")) {
                updateColumns.push(
                    "scgrp_display_name = " +
                        '<? value("scgrp_display_name") ?> '
                );
            }

            if (pGroupData.hasOwnProperty("scgrp_description")) {
                updateColumns.push(
                    "scgrp_description = " + '<? value("scgrp_description") ?> '
                );
            }

            if (pGroupData.hasOwnProperty("scgrp_is_system_locked")) {
                updateColumns.push(
                    "scgrp_is_system_locked = " +
                        '<? value("scgrp_is_system_locked") ?> '
                );
            }

            if (pGroupData.hasOwnProperty("scgrp_is_active")) {
                updateColumns.push(
                    'scgrp_is_active = <? value("scgrp_is_active") ?> '
                );
            }

            if (pGroupData.hasOwnProperty("scgrp_min_columns")) {
                updateColumns.push(
                    'scgrp_min_columns = <? value("scgrp_min_columns") ?> '
                );
            }

            if (pGroupData.hasOwnProperty("scgrp_is_space_conserved")) {
                updateColumns.push(
                    'scgrp_is_space_conserved = <? value("scgrp_is_space_conserved") ?> '
                );
            }

            if (pGroupData.hasOwnProperty("scgrp_is_row_expansion_allowed")) {
                updateColumns.push(
                    'scgrp_is_row_expansion_allowed = <? value("scgrp_is_row_expansion_allowed") ?> '
                );
            }

            try {
                queryText =
                    queryText +
                    updateColumns.join(", ") +
                    'WHERE scgrp_id = <? value("scgrp_id") ?> ' +
                    "RETURNING scgrp_id";

                var groupQuery = MuseUtils.executeQuery(queryText, pGroupData);

                if (
                    groupQuery.first() &&
                    MuseUtils.isValidId(groupQuery.value("scgrp_id"))
                ) {
                    return groupQuery.value("scgrp_id");
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We could not verify that we have successfully updated the super characteristic group as directed.",
                        "MuseSuperChar.Group.updateGroup",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem trying to update a Super Characteristic group.",
                    "MuseSuperChar.Group.updateGroup",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var deleteGroup = function(pGroupId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId
            };

            try {
                var groupQuery = MuseUtils.executeQuery(
                    "DELETE FROM musesuperchar.scgrp " +
                        'WHERE scgrp_id = <? value("pGroupId") ?> ' +
                        "RETURNING scgrp_id",
                    { pGroupId: pGroupId }
                );

                if (
                    groupQuery.first() &&
                    MuseUtils.isValidId(groupQuery.value("scgrp_id"))
                ) {
                    return groupQuery.value("scgrp_id");
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We falied to verify that we deleted the super characteristic group as directed.",
                        "MuseSuperChar.Group.deleteGroup",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem trying to delete a super characteristic group.",
                    "MuseSuperChar.Group.deleteGroup",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
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
                    { pGroupId: pGroupId, pEntityId: pEntityId }
                );

                if (
                    !groupQuery.first() ||
                    !MuseUtils.isValidId(groupQuery.value("result"))
                ) {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not verify that we have successfully created the new group/entity association.",
                        "MuseSuperChar.Group.addGroupEntityAssc",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }

                return groupQuery.value("result");
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a database problem while adding a group/entity association.",
                    "MuseSuperChar.Group.addGroupEntityAssc",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
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
                    { pGroupId: pGroupId, pEntityId: pEntityId }
                );

                if (
                    !groupQuery.first() ||
                    !MuseUtils.isValidId(groupQuery.value("result"))
                ) {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We failed to verify that we deleted the group/entity association as requested.",
                        "MuseSuperChar.Group.deleteGroupEntityAssc",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }

                return groupQuery.value("result");
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a database problem while deleting a group/entity association.",
                    "MuseSuperChar.Group.deleteGroupEntityAssc",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
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
                    "SELECT entity_scgrp_ass_is_system_locked " +
                        "FROM musesuperchar.entity_scgrp_ass " +
                        'WHERE entity_scgrp_ass_scgrp_id = <? value("pGroupId") ?> ' +
                        'AND entity_scgrp_ass_entity_id = <? value("pEntityId") ?> ',
                    { pGroupId: pGroupId, pEntityId: pEntityId }
                );
                if (groupQuery.first()) {
                    return MuseUtils.isTrue(
                        groupQuery.value("entity_scgrp_ass_is_system_locked")
                    );
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not find the requested Group/Entity Association.",
                        "MuseSuperChar.Group.isGroupEntityAsscSystemLocked",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem trying to find out if a Group/Entity Association is system locked.",
                    "MuseSuperChar.Group.isGroupEntityAsscSystemLocked",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
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
                    { pGroupId: pGroupId, pEntityId: pEntityId }
                );
                if (violationQuery.first()) {
                    return JSON.parse(violationQuery.firstJson().result);
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not receive the expected response from the database while checking for proprosed Group/Entity validation violations.",
                        "MuseSuperChar.Group.getGroupEntityAsscAddViolations",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem trying to find whether a proposed group/entity association would cause validator violations.",
                    "MuseSuperChar.Group.getGroupEntityAsscAddViolations",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getGroupEntityAsscDeleteViolations = function(pGroupId, pEntityId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId,
                pEntityId: pEntityId
            };

            try {
                var violationQuery = MuseUtils.executeQuery(
                    "SELECT musesuperchar.get_group_entity_remove_violations( " +
                        '<? value("pGroupId") ?>, <? value("pEntityId") ?>) ' +
                        "AS result ",
                    { pGroupId: pGroupId, pEntityId: pEntityId }
                );
                if (violationQuery.first()) {
                    return JSON.parse(violationQuery.firstJson().result);
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not receive the expected response from the database while checking for proprosed Group/Entity remove validation violations.",
                        "MuseSuperChar.Group.getGroupEntityAsscDeleteViolations",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem trying to find whether a proposed group/entity disassociation would cause validator violations.",
                    "MuseSuperChar.Group.getGroupEntityAsscDeleteViolations",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getGroupLayoutItems = function(pParams) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pParams: pParams
            };

            var whereClause = "WHERE true ";

            if (!MuseUtils.isTrue(pParams.isInactiveIncluded || false)) {
                whereClause = whereClause + " AND scdef_scgrp_ass_is_active ";
            }

            if (
                pParams.hasOwnProperty("scdef_scgrp_ass_id") &&
                MuseUtils.isValidId(pParams.scdef_scgrp_ass_id)
            ) {
                whereClause +=
                    'AND scdef_scgrp_ass_id = <? value("scdef_scgrp_ass_id") ?> ';
            }

            if (
                pParams.hasOwnProperty("scdef_scgrp_ass_scgrp_id") &&
                MuseUtils.isValidId(pParams.scdef_scgrp_ass_scgrp_id)
            ) {
                whereClause +=
                    "AND scdef_scgrp_ass_scgrp_id = " +
                    '<? value("scdef_scgrp_ass_scgrp_id") ?> ';
            }

            if (
                pParams.hasOwnProperty("scdef_scgrp_ass_section_name") &&
                MuseUtils.coalesce(pParams.scdef_scgrp_ass_section_name, "") !==
                    ""
            ) {
                whereClause +=
                    "AND scdef_scgrp_ass_section_name = " +
                    '<? value("scdef_scgrp_ass_section_name") ?> ';
            }

            try {
                return MuseUtils.executeQuery(
                    "SELECT   ssa.scdef_scgrp_ass_id " +
                        ",ssa.scdef_scgrp_ass_scdef_id " +
                        ",sc.scdef_internal_name AS scdef_scgrp_ass_scdef_internal_name " +
                        ",sc.scdef_display_name AS scdef_scgrp_ass_scdef_display_name " +
                        ",ssa.scdef_scgrp_ass_scgrp_id " +
                        ",sg.scgrp_internal_name AS scdef_scgrp_ass_scgrp_internal_name " +
                        ",sg.scgrp_display_name AS scdef_scgrp_ass_scgrp_display_name " +
                        ",ssa.scdef_scgrp_ass_sequence " +
                        ",ssa.scdef_scgrp_ass_section_name " +
                        ",ssa.scdef_scgrp_ass_is_column_start " +
                        ",ssa.scdef_scgrp_ass_width " +
                        ",ssa.scdef_scgrp_ass_height " +
                        ",ssa.scdef_scgrp_ass_pkghead_id " +
                        ",ssa.scdef_scgrp_ass_is_system_locked " +
                        ",CASE " +
                        "WHEN scdef_scgrp_ass_is_system_locked THEN " +
                        "'bisque' " +
                        "ELSE " +
                        "'palegreen' " +
                        " END AS qtbackgroundrole " +
                        "FROM    musesuperchar.scdef_scgrp_ass ssa  " +
                        "JOIN musesuperchar.scdef sc  " +
                        "ON ssa.scdef_scgrp_ass_scdef_id = sc.scdef_id " +
                        "JOIN musesuperchar.scgrp sg  " +
                        "ON ssa.scdef_scgrp_ass_scgrp_id = sg.scgrp_id  " +
                        whereClause +
                        "ORDER BY scdef_scgrp_ass_sequence ",
                    pParams
                );
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered an error getting group layout items.",
                    "MuseSuperChar.Group.getGroupLayoutItems",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getGroupLayoutItemById = function(pGroupLayoutItemId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutItemId: pGroupLayoutItemId
            };

            try {
                var gliQry = getGroupLayoutItems({
                    scdef_scgrp_ass_id: pGroupLayoutItemId,
                    isInactiveIncluded: true
                });

                if (gliQry.first()) {
                    return gliQry.firstJson();
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not find the requested Group Layout Item.",
                        "MuseSuperChar.Group.getGroupLayoutItemById",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to retieve the requested Group Layout Item.",
                    "MuseSuperChar.Group.getGroupLayoutItemById",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getGroupLayoutItemsByGroupId = function(pGroupId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId
            };

            try {
                return getGroupLayoutItems({
                    scdef_scgrp_ass_scgrp_id: pGroupId
                });
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to retrieve the Group Layout Items for the requested Group.",
                    "MuseSuperChar.getGroupLayoutItemsByGroupId",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var createGroupLayoutItem = function(pGroupLayoutData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutData: pGroupLayoutData
            };

            var columnList = [
                "scdef_scgrp_ass_scdef_id",
                "scdef_scgrp_ass_scgrp_id"
            ];
            var valueList = [
                '<? value("scdef_scgrp_ass_scdef_id") ?>',
                '<? value("scdef_scgrp_ass_scgrp_id") ?>'
            ];

            if (
                pGroupLayoutData.hasOwnProperty(
                    "scdef_scgrp_ass_section_name"
                ) &&
                MuseUtils.coalesce(
                    pGroupLayoutData.scdef_scgrp_ass_section_name
                ) !== ""
            ) {
                columnList.push("scdef_scgrp_ass_section_name");
                valueList.push('<? value("scdef_scgrp_ass_section_name") ?>');
            }

            if (
                pGroupLayoutData.hasOwnProperty(
                    "scdef_scgrp_ass_is_column_start"
                ) &&
                MuseUtils.realNull(
                    pGroupLayoutData.scdef_scgrp_ass_is_column_start
                ) !== null
            ) {
                columnList.push("scdef_scgrp_ass_is_column_start");
                valueList.push(
                    '<? value("scdef_scgrp_ass_is_column_start") ?>'
                );
            }

            if (
                pGroupLayoutData.hasOwnProperty("scdef_scgrp_ass_width") &&
                Number.isInteger(pGroupLayoutData.scdef_scgrp_ass_width) &&
                pGroupLayoutData.scdef_scgrp_ass_width > 0
            ) {
                columnList.push("scdef_scgrp_ass_width");
                valueList.push('<? value("scdef_scgrp_ass_width") ?>');
            }

            if (
                pGroupLayoutData.hasOwnProperty("scdef_scgrp_ass_height") &&
                Number.isInteger(pGroupLayoutData.scdef_scgrp_ass_height) &&
                pGroupLayoutData.scdef_scgrp_ass_height > 0
            ) {
                columnList.push("scdef_scgrp_ass_height");
                valueList.push('<? value("scdef_scgrp_ass_height") ?>');
            }

            try {
                var gliQry = MuseUtils.executeQuery(
                    "INSERT INTO musesuperchar.scdef_scgrp_ass " +
                        "(" +
                        columnList.join(",") +
                        ") VALUES " +
                        "(" +
                        valueList.join(",") +
                        ") " +
                        "RETURNING scdef_scgrp_ass_id",
                    pGroupLayoutData
                );

                if (
                    gliQry.first() &&
                    MuseUtils.isValidId(gliQry.value("scdef_scgrp_ass_id"))
                ) {
                    return gliQry.value("scdef_scgrp_ass_id");
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We failed to verify that we created a new Group Layout Item.",
                        "MuseSuperChar.Group.createGroupLayoutItem",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a database problem trying to save a new Group Layout Item.",
                    "MuseSuperChar.Group.createGroupLayoutItem",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var updateGroupLayoutItem = function(pGroupLayoutData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutData: pGroupLayoutData
            };

            var queryText =
                "UPDATE musesuperchar.scdef_scgrp_ass " +
                "SET scdef_scgrp_ass_id = scdef_scgrp_ass_id ";

            if (
                pGroupLayoutData.hasOwnProperty("scdef_scgrp_ass_section_name")
            ) {
                queryText +=
                    ",scdef_scgrp_ass_section_name = " +
                    '<? value("scdef_scgrp_ass_section_name") ?> ';
            }

            if (
                pGroupLayoutData.hasOwnProperty(
                    "scdef_scgrp_ass_is_column_start"
                )
            ) {
                queryText +=
                    ",scdef_scgrp_ass_is_column_start = " +
                    '<? value("scdef_scgrp_ass_is_column_start") ?> ';
            }

            if (
                pGroupLayoutData.hasOwnProperty("scdef_scgrp_ass_width") &&
                Number.isInteger(pGroupLayoutData.scdef_scgrp_ass_width) &&
                pGroupLayoutData.scdef_scgrp_ass_width > 0
            ) {
                queryText +=
                    ",scdef_scgrp_ass_width = " +
                    '<? value("scdef_scgrp_ass_width") ?> ';
            } else if (
                pGroupLayoutData.hasOwnProperty("scdef_scgrp_ass_width") &&
                Number.isInteger(pGroupLayoutData.scdef_scgrp_ass_width) &&
                pGroupLayoutData.scdef_scgrp_ass_width < 1
            ) {
                queryText += ",scdef_scgrp_ass_width = " + "null ";
            }

            if (
                pGroupLayoutData.hasOwnProperty("scdef_scgrp_ass_height") &&
                Number.isInteger(pGroupLayoutData.scdef_scgrp_ass_height) &&
                pGroupLayoutData.scdef_scgrp_ass_height > 0
            ) {
                queryText +=
                    ",scdef_scgrp_ass_height = " +
                    '<? value("scdef_scgrp_ass_height") ?> ';
            } else if (
                pGroupLayoutData.hasOwnProperty("scdef_scgrp_ass_height") &&
                Number.isInteger(pGroupLayoutData.scdef_scgrp_ass_height) &&
                pGroupLayoutData.scdef_scgrp_ass_height < 1
            ) {
                queryText += ",scdef_scgrp_ass_height = " + "null ";
            }

            queryText +=
                "WHERE scdef_scgrp_ass_id = " +
                '<? value("scdef_scgrp_ass_id") ?> ' +
                "RETURNING scdef_scgrp_ass_id";

            try {
                var gliQry = MuseUtils.executeQuery(
                    queryText,
                    pGroupLayoutData
                );

                if (
                    gliQry.first() &&
                    MuseUtils.isValidId(gliQry.value("scdef_scgrp_ass_id"))
                ) {
                    return gliQry.value("scdef_scgrp_ass_id");
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We failed to verify that we successfully updated the requeste Group Layout Item.",
                        "MuseSuperChar.Group.moveUpGroupLayoutItem",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a database problem trying to update a Group Layout Item.",
                    "MuseSuperChar.Group.updateGroupLayoutItem",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var deleteGroupLayoutItem = function(pGroupLayoutItemId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutItemId: pGroupLayoutItemId
            };

            try {
                var gliQry = MuseUtils.executeQuery(
                    "DELETE FROM musesuperchar.scdef_scgrp_ass " +
                        'WHERE scdef_scgrp_ass_id = <? value("pGroupLayoutItemId") ?> ' +
                        "RETURNING scdef_scgrp_ass_id ",
                    { pGroupLayoutItemId: pGroupLayoutItemId }
                );

                if (
                    gliQry.first() &&
                    MuseUtils.isValidId(gliQry.value("scdef_scgrp_ass_id"))
                ) {
                    return gliQry.value("scdef_scgrp_ass_id");
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem trying to delete a Group Layout Item.",
                    "MuseSuperChar.Group.deleteGroupLayoutItem",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var isGroupLayoutItemSystemLocked = function(pGroupLayoutItemId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutItemId: pGroupLayoutItemId
            };

            try {
                var gliQry = MuseUtils.executeQuery(
                    "SELECT scdef_scgrp_ass_is_system_locked " +
                        "FROM musesuperchar.scdef_scgrp_ass " +
                        'WHERE scdef_scgrp_ass_id = <? value("pGroupLayoutItemId") ?>',
                    { pGroupLayoutItemId: pGroupLayoutItemId }
                );

                if (gliQry.first()) {
                    return MuseUtils.isTrue(
                        gliQry.value("scdef_scgrp_ass_is_system_locked")
                    );
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We failed to find the requested Group Layout Item while checking its system lock status.",
                        "MuseSuperChar.Group.isGroupLayoutItemSystemLocked",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a database problem trying to determine if a Group Layout Item is system locked.",
                    "MuseSuperChar,Group.isGroupLayoutItemSystemLocked",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var moveUpGroupLayoutItem = function(pGroupLayoutItemId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutItemId: pGroupLayoutItemId
            };

            try {
                var gliQry = MuseUtils.executeQuery(
                    "SELECT musesuperchar.move_group_layout_item_up( " +
                        '<? value("pGroupLayoutItemId") ?>) AS result ',
                    { pGroupLayoutItemId: pGroupLayoutItemId }
                );

                if (
                    gliQry.first() &&
                    MuseUtils.isValidId(gliQry.value("result"))
                ) {
                    return gliQry.value("result");
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We failed to verify that we moved the requested Group Layout Item up in the layout.",
                        "MuseSuperChar.Group.moveUpGroupLayoutItem",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered problems trying to move a Group Layout Item up in the layout.",
                    "MuseSuperChar.Group.moveUpGroupLayoutItem",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var moveDownGroupLayoutItem = function(pGroupLayoutItemId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutItemId: pGroupLayoutItemId
            };

            try {
                var gliQry = MuseUtils.executeQuery(
                    "SELECT musesuperchar.move_group_layout_item_down( " +
                        '<? value("pGroupLayoutItemId") ?>) AS result ',
                    { pGroupLayoutItemId: pGroupLayoutItemId }
                );

                if (
                    gliQry.first() &&
                    MuseUtils.isValidId(gliQry.value("result"))
                ) {
                    return gliQry.value("result");
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We failed to verify that we moved the requested Group Layout Item down in the layout.",
                        "MuseSuperChar.Group.moveDownGroupLayoutItem",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered problems trying to move a Group Layout Item down in the layout.",
                    "MuseSuperChar.Group.moveDownGroupLayoutItem",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getGroupList = function() {
            try {
                return MuseUtils.executeQuery(
                    "SELECT   scgrp_id " +
                        ",scgrp_display_name " +
                        ",scgrp_internal_name " +
                        "FROM musesuperchar.scgrp " +
                        "WHERE scgrp_is_active " +
                        "ORDER BY scgrp_display_name"
                );
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a database problem retrieving the list of groups.",
                    "MuseSuperChar.Group.getGroupList",
                    { thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getGroupLayoutSectionNames = function(pGroupId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId
            };

            try {
                var secQry = MuseUtils.executeQuery(
                    "SELECT   row_number() OVER (ORDER BY section_name) " +
                        "AS section_id " +
                        ",section_name " +
                        ",section_code " +
                        "FROM " +
                        "(SELECT   DISTINCT scdef_scgrp_ass_section_name " +
                        "AS section_name " +
                        ",scdef_scgrp_ass_section_name " +
                        "AS section_code " +
                        "FROM musesuperchar.scdef_scgrp_ass " +
                        "WHERE scdef_scgrp_ass_scgrp_id = " +
                        '<? value("pGroupId") ?> ' +
                        "ORDER BY scdef_scgrp_ass_section_name) q",
                    { pGroupId: pGroupId }
                );

                if (secQry.first()) {
                    return secQry;
                } else {
                    return MuseUtils.executeQuery(
                        "SELECT 1 AS section_id, 'General' AS section_name, " +
                            "'General' AS section_coded"
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered problem retrieving the list of section names for the given Group ID.",
                    "MuseSuperChar.Group.getGroupLayoutSectionNames",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getGroupUnAssignedSuperChars = function(pGroupId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId
            };

            try {
                return MuseUtils.executeQuery(
                    "SELECT   scdef_id " +
                        ",CASE WHEN nullif(regexp_replace(scdef_display_name,'[[:space:]]','','g'),'') IS NOT NULL THEN " +
                        "scdef_display_name || ' (' || scdef_internal_name || ')' ELSE " +
                        "'(' || scdef_internal_name || ')'  END AS scdef_list_name " +
                        ",scdef_internal_name " +
                        "FROM    musesuperchar.scdef " +
                        "LEFT OUTER JOIN musesuperchar.scdef_scgrp_ass  " +
                        "ON scdef_id = scdef_scgrp_ass_scdef_id  " +
                        "AND scdef_scgrp_ass_is_active " +
                        "AND scdef_scgrp_ass_scgrp_id =  " +
                        '<? value("pGroupId") ?> ' +
                        "WHERE   scdef_is_active " +
                        "AND scdef_scgrp_ass_id IS NULL " +
                        "ORDER BY " +
                        "coalesce(nullif(regexp_replace(scdef_display_name,'[[:space:]]','','g'),''), scdef_internal_name) " +
                        ",scdef_internal_name",
                    { pGroupId: pGroupId }
                );
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem retrieving the list of unassigned Super Characteristics for the requested group.",
                    "MuseSuperChar.Group.getGroupUnAssignedSuperChars",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var isGroupLayoutItemAtBotton = function(pGroupLayoutItemId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutItemId: pGroupLayoutItemId
            };

            try {
                var gliQry = MuseUtils.executeQuery(
                    "SELECT scdef_scgrp_ass_sequence = " +
                        "musesuperchar.get_group_layout_item_max_sequence(" +
                        "scdef_scgrp_ass_scgrp_id) AS result " +
                        "FROM musesuperchar.scdef_scgrp_ass " +
                        'WHERE scdef_scgrp_ass_id = <? value("pGroupLayoutItemId") ?>',
                    { pGroupLayoutItemId: pGroupLayoutItemId }
                );

                if (gliQry.first()) {
                    return MuseUtils.isTrue(gliQry.value("result"));
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We could not find a result when we asked if a Group Layout Item was at the bottom of the layout.",
                        "MuseSuperChar.Group.isGroupLayoutItemAtBotton",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem trying to find if the requested Group Layout Item is already at the bottom of its layout.",
                    "MuseSuperChar.Group.isGroupLayoutItemAtBotton",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
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

            if (!MuseUtils.isValidId(pGroupId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which group to check as being system locked or not.",
                    "MuseSuperChar.Group.pPublicApi.isGroupSystemLocked",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
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

            if (!MuseUtils.isValidId(pGroupId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which group you wanted to retrieve.",
                    "MuseSuperChar.Group.pPublicApi.getGroupById",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
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
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getGroupEntities(pGroupId);
        };

        pPublicApi.getNonGroupEntities = function(pGroupId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId
            };

            if (!MuseUtils.isValidId(pGroupId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand for which group you wished to retrieve the non-associated entities list.",
                    "MuseSuperChar.Group.pPublicApi.getNonGroupEntities",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getNonGroupEntities(pGroupId);
        };

        pPublicApi.addGroupEntityAssc = function(pGroupId, pEntityId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId,
                pEntityId: pEntityId
            };

            if (!MuseUtils.isValidId(pGroupId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which group you wanted to associate with the requested entity.",
                    "MuseSuperChar.Group.pPublicApi.addGroupEntityAssc",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (!MuseUtils.isValidId(pEntityId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which entity you wanted to associate with the requested group.",
                    "MuseSuperChar.Group.pPublicApi.addGroupEntityAssc",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return addGroupEntityAssc(pGroupId, pEntityId);
        };

        pPublicApi.deleteGroupEntityAssc = function(pGroupId, pEntityId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId,
                pEntityId: pEntityId
            };

            if (!MuseUtils.isValidId(pGroupId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which group you wanted to disassociate with the requested entity.",
                    "MuseSuperChar.Group.pPublicApi.deleteGroupEntityAssc",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (!MuseUtils.isValidId(pEntityId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which entity you wanted to disassociate with the requested group.",
                    "MuseSuperChar.Group.pPublicApi.deleteGroupEntityAssc",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return deleteGroupEntityAssc(pGroupId, pEntityId);
        };

        pPublicApi.isGroupEntityAsscSystemLocked = function(
            pGroupId,
            pEntityId
        ) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId,
                pEntityId: pEntityId
            };

            if (!MuseUtils.isValidId(pGroupId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand for which group you wanted to check a group/entity association for being system locked.",
                    "MuseSuperChar.Group.pPublicApi.isGroupEntityAsscSystemLocked",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (!MuseUtils.isValidId(pEntityId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand for which entity you wanted to check a group/entity association for being system locked.",
                    "MuseSuperChar.Group.pPublicApi.isGroupEntityAsscSystemLocked",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return isGroupEntityAsscSystemLocked(pGroupId, pEntityId);
        };

        pPublicApi.getGroupLayoutItems = function(pParams) {
            return getGroupLayoutItems(pParams || {});
        };

        pPublicApi.getGroupLayoutItemById = function(pGroupLayoutItemId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutItemId: pGroupLayoutItemId
            };

            if (!MuseUtils.isValidId(pGroupLayoutItemId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Group Layout Item we should look up for you.",
                    "MuseSuperChar.Group.pPublicApi.getGroupLayoutItemById",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getGroupLayoutItemById(pGroupLayoutItemId);
        };

        pPublicApi.getGroupLayoutItemsByGroupId = function(pGroupId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId
            };

            if (!MuseUtils.isValidId(pGroupId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand for which group you wished to retrieve related Group Layout Items.",
                    "MuseSuperChar.Group.pPublicApi.getGroupLayoutItemsByGroupId",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getGroupLayoutItemsByGroupId(pGroupId);
        };

        pPublicApi.isGroupLayoutItemSystemLocked = function(
            pGroupLayoutItemId
        ) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutItemId: pGroupLayoutItemId
            };

            if (!MuseUtils.isValidId(pGroupLayoutItemId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Group Layout Item you wanted to check for being system locked.",
                    "MuseSuperChar.Group.pPublicApi.isGroupLayoutItemSystemLocked",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return isGroupLayoutItemSystemLocked(pGroupLayoutItemId);
        };

        pPublicApi.getDefaultGroupInternalName = function(pDisplayName) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pDisplayName: pDisplayName
            };

            if (MuseUtils.coalesce(pDisplayName, "") === "") {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require some text value from which to construct a default group internal name.",
                    "MuseSuperChar.Group.pPublicApi.getDefaultGroupInternalName",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getDefaultGroupInternalName(pDisplayName);
        };

        pPublicApi.getGroupEntityAsscAddViolations = function(
            pGroupId,
            pEntityId
        ) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId,
                pEntityId: pEntityId
            };

            if (!MuseUtils.isValidId(pGroupId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which group you wanted to test for entity association validity.",
                    "MuseSuperChar.Group.pPublicApi.getGroupEntityAsscAddViolations",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (!MuseUtils.isValidId(pEntityId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which entity you wanted to see if you could add a group without validator violations.",
                    "MuseSuperChar.Group.pPublicApi.getGroupEntityAsscAddViolations",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getGroupEntityAsscAddViolations(pGroupId, pEntityId);
        };

        pPublicApi.getGroupEntityAsscDeleteViolations = function(
            pGroupId,
            pEntityId
        ) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId,
                pEntityId: pEntityId
            };

            if (!MuseUtils.isValidId(pGroupId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which group you wanted to test for entity disassociation validity.",
                    "MuseSuperChar.Group.pPublicApi.getGroupEntityAsscDeleteViolations",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (!MuseUtils.isValidId(pEntityId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which entity you wanted to see if you could delete a group from without validator violations.",
                    "MuseSuperChar.Group.pPublicApi.getGroupEntityAsscDeleteViolations",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getGroupEntityAsscDeleteViolations(pGroupId, pEntityId);
        };

        pPublicApi.createGroup = function(pGroupData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupData: pGroupData
            };

            if (!privileges.check("maintainSuperCharGroups")) {
                throw new MuseUtils.PermissionException(
                    "musesuperchar",
                    "You do not have permission to create new groups.",
                    "MuseSuperChar.Group.pPublicApi.createGroup",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                !pGroupData.hasOwnProperty("scgrp_internal_name") ||
                MuseUtils.coalesce(pGroupData.scgrp_internal_name, "") === ""
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require at least a plausable internal name for the new group.",
                    "MuseSuperChar.Group.pPublicApi.createGroup",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                !pGroupData.hasOwnProperty("scgrp_display_name") ||
                MuseUtils.coalesce(pGroupData.scgrp_display_name, "") === ""
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require a display name for the new group.",
                    "MuseSuperChar.Group.pPublicApi.createGroup",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                !pGroupData.hasOwnProperty("scgrp_description") ||
                MuseUtils.coalesce(pGroupData.scgrp_description, "") === ""
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "You must provide a group description when creating a new group.",
                    "MuseSuperChar.Group.pPublicApi.createGroup",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                !pGroupData.hasOwnProperty("scgrp_min_columns") ||
                !Number.isInteger(Number(pGroupData.scgrp_min_columns)) ||
                pGroupData.scgrp_min_columns < 0
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "You must provide a minimum number of columns that the group must support, though this number can be zero.",
                    "MuseSuperChar.Group.pPublicApi.createGroup",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                !pGroupData.hasOwnProperty("scgrp_is_space_conserved") ||
                typeof pGroupData.scgrp_is_space_conserved !== "boolean"
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "You must provide a value for whether or not a group layout is to undergo space preservation or not.",
                    "MuseSuperChar.Group.pPublicApi.createGroup",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                !pGroupData.hasOwnProperty("scgrp_is_row_expansion_allowed") ||
                typeof pGroupData.scgrp_is_row_expansion_allowed !== "boolean"
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "You must provide a value for whether or not group sections may take all available space.",
                    "MuseSuperChar.Group.pPublicApi.createGroup",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return createGroup(pGroupData);
        };

        pPublicApi.updateGroup = function(pGroupData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupData: pGroupData
            };

            if (
                !pGroupData.hasOwnProperty("scgrp_id") ||
                !MuseUtils.isValidId(pGroupData.scgrp_id)
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which super characteristic group you wished to update.",
                    "MuseSuperChar.Group.pPublicApi.updateGroup",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (!privileges.check("maintainSuperCharGroups")) {
                throw new MuseUtils.PermissionException(
                    "musesuperchar",
                    "You do not have permission to update super characteristic groups.",
                    "MuseSuperChar.Group.pPublicApi.updateGroup",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            } else if (
                isGroupSystemLocked(pGroupData.scgrp_id) &&
                !privileges.check("maintainSuperCharSysLockRecsManually")
            ) {
                throw new MuseUtils.PermissionException(
                    "musesuperchar",
                    "You do not have permission to update system locked super characteristic groups.",
                    "MuseSuperChar.Group.pPublicApi.updateGroup",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return updateGroup(pGroupData);
        };

        pPublicApi.deleteGroup = function(pGroupId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId
            };

            if (!MuseUtils.isValidId(pGroupId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which super characteristic group you wished to delete.",
                    "MuseSuperChar.Group.pPublicApi.deleteGroup",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (!privileges.check("maintainSuperCharGroups")) {
                throw new MuseUtils.PermissionException(
                    "musesuperchar",
                    "You do not have permission to delete super characteristic groups.",
                    "MuseSuperChar.Group.pPublicApi.deleteGroup",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            } else if (
                isGroupSystemLocked(pGroupId) &&
                !privileges.check("maintainSuperCharSysLockRecsManually")
            ) {
                throw new MuseUtils.PermissionException(
                    "musesuperchar",
                    "You do not have permission to delete a system locked super characteristic groups.",
                    "MuseSuperChar.Group.pPublicApi.deleteGroup",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return deleteGroup(pGroupId);
        };

        pPublicApi.createGroupLayoutItem = function(pGroupLayoutData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutData: pGroupLayoutData
            };

            if (
                !pGroupLayoutData.hasOwnProperty("scdef_scgrp_ass_scdef_id") ||
                !MuseUtils.isValidId(pGroupLayoutData.scdef_scgrp_ass_scdef_id)
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Super Characteristic you wished to add to a Group Layout.",
                    "MuseSuperChar.Group.pPublicApi.createGroupLayoutItem",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                !pGroupLayoutData.hasOwnProperty("scdef_scgrp_ass_scgrp_id") ||
                !MuseUtils.isValidId(pGroupLayoutData.scdef_scgrp_ass_scgrp_id)
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand to which Group's Layout you wanted to add a Super Characteristic.",
                    "MuseSuperChar.Group.pPublicApi.createGroupLayoutItem",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return createGroupLayoutItem(pGroupLayoutData);
        };

        pPublicApi.updateGroupLayoutItem = function(pGroupLayoutData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutData: pGroupLayoutData
            };

            if (
                !pGroupLayoutData.hasOwnProperty("scdef_scgrp_ass_id") ||
                !MuseUtils.isValidId(pGroupLayoutData.scdef_scgrp_ass_id)
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Group Layout Item you wished to update.",
                    "MuseSuperChar.Group.pPublicApi.updateGroupLayoutItem",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return updateGroupLayoutItem(pGroupLayoutData);
        };

        pPublicApi.deleteGroupLayoutItem = function(pGroupLayoutItemId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutItemId: pGroupLayoutItemId
            };

            if (!MuseUtils.isValidId(pGroupLayoutItemId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Group Layout Item you wished to delete.",
                    "MuseSuperChar.Group.pPublicApi.deleteGroupLayoutItem",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return deleteGroupLayoutItem(pGroupLayoutItemId);
        };

        pPublicApi.moveUpGroupLayoutItem = function(pGroupLayoutItemId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutItemId: pGroupLayoutItemId
            };

            if (!MuseUtils.isValidId(pGroupLayoutItemId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Group Layout Item you wished to move up in the layout.",
                    "MuseSuperChar.Group.pPublicApi.moveUpGroupLayoutItem",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return moveUpGroupLayoutItem(pGroupLayoutItemId);
        };

        pPublicApi.moveDownGroupLayoutItem = function(pGroupLayoutItemId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutItemId: pGroupLayoutItemId
            };

            if (!MuseUtils.isValidId(pGroupLayoutItemId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Group Layout Item you wished to move down in the layout.",
                    "MuseSuperChar.Group.pPublicApi.moveDownGroupLayoutItem",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return moveDownGroupLayoutItem(pGroupLayoutItemId);
        };

        pPublicApi.getGroupLayoutSectionNames = function(pGroupId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId
            };

            if (!MuseUtils.isValidId(pGroupId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand for which group you wished to retrieve section names.",
                    "MuseSuperChar.Group.pPublicApi.getGroupLayoutSectionNames",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getGroupLayoutSectionNames(pGroupId);
        };

        pPublicApi.isGroupLayoutItemAtBotton = function(pGroupLayoutItemId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupLayoutItemId: pGroupLayoutItemId
            };

            if (!MuseUtils.isValidId(pGroupLayoutItemId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Group Layout Item you wished to see was already at the bottom of the layout.",
                    "MuseSuperChar.Group.pPublicApi.isGroupLayoutItemAtBotton",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return isGroupLayoutItemAtBotton(pGroupLayoutItemId);
        };

        pPublicApi.getGroupUnAssignedSuperChars = function(pGroupId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId
            };

            if (!MuseUtils.isValidId(pGroupId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand for which Group we should retrieve the unassigned Super Characteristics list.",
                    "MuseSuperChar.Group.pPublicApi.getGroupUnAssignedSuperChars",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getGroupUnAssignedSuperChars(pGroupId);
        };

        pPublicApi.getGroupList = function() {
            return getGroupList();
        };
    } catch (e) {
        var error = new MuseUtils.ModuleException(
            "musesuperchar",
            "We enountered a MuseSuperChar.Group module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.Group",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.Group, this);
