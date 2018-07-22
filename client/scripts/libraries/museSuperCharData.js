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

try {
    //////////////////////////////////////////////////////////////////////////
    //  Namespace Definition
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseSuperChar === "undefined") {
        MuseSuperChar = {};
    }

    if (typeof MuseSuperChar.SuperChar === "undefined") {
        MuseSuperChar.SuperChar = {};
    }

    //////////////////////////////////////////////////////////////////////////
    //  Imports
    //////////////////////////////////////////////////////////////////////////

    if (typeof MuseUtils === "undefined") {
        include("museUtils");
    }

    MuseUtils.loadMuseUtils([
        MuseUtils.MOD_EXCEPTION,
        MuseUtils.MOD_JS,
        MuseUtils.MOD_DB
    ]);
} catch (e) {
    if (
        typeof MuseUtils !== "undefined" &&
        (MuseUtils.isMuseUtilsExceptionLoaded === true ? true : false)
    ) {
        var error = new MuseUtils.ScriptException(
            "musesuperchar",
            "We encountered a script level issue while processing MuseSuperChar.SuperChar.",
            "MuseSuperChar.SuperChar",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.SuperChar Script Error",
            "We encountered a script level issue while processing MuseSuperChar.SuperChar."
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
        var getSuperChars = function(pParams) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pParams: pParams
            };

            var whereClause = "WHERE true ";

            if (!MuseUtils.isTrue(pParams.isInactiveIncluded || false)) {
                whereClause = whereClause + " AND scdef_is_active ";
            }

            if (pParams.hasOwnProperty("scdef_id")) {
                whereClause =
                    whereClause +
                    "AND scdef_id = " +
                    '<? value("scdef_id") ?> ';
            }

            if (pParams.hasOwnProperty("scdef_internal_name")) {
                whereClause =
                    whereClause +
                    "AND scdef_internal_name = " +
                    '<? value("scdef_internal_name") ?> ';
            }

            if (pParams.hasOwnProperty("scdef_display_name")) {
                whereClause =
                    whereClause +
                    "AND scdef_display_name = " +
                    '<? value("scdef_display_name") ?> ';
            }

            if (pParams.hasOwnProperty("scdef_pkghead_id")) {
                whereClause =
                    whereClause +
                    "AND scdef_pkghead_id = " +
                    '<? value("scdef_pkghead_id") ?> ';
            }

            if (pParams.hasOwnProperty("scdef_is_system_locked")) {
                whereClause =
                    whereClause +
                    "AND scdef_is_system_locked = " +
                    '<? value("scdef_is_system_locked") ?> ';
            }

            if (pParams.hasOwnProperty("scdef_datatype_id")) {
                whereClause =
                    whereClause +
                    "AND scdef_datatype_id = " +
                    '<? value("scdef_datatype_id") ?> ';
            }

            if (pParams.hasOwnProperty("scdef_is_searchable")) {
                whereClause =
                    whereClause +
                    "AND scdef_is_searchable = " +
                    '<? value("scdef_is_searchable") ?> ';
            }

            if (pParams.hasOwnProperty("scdef_is_display_only")) {
                whereClause =
                    whereClause +
                    "AND scdef_is_display_only = " +
                    '<? value("scdef_is_display_only") ?> ';
            }

            if (pParams.hasOwnProperty("scdef_is_virtual")) {
                whereClause =
                    whereClause +
                    "AND scdef_is_virtual = " +
                    '<? value("scdef_is_virtual") ?> ';
            }

            if (pParams.hasOwnProperty("scdef_scgrp_ass_scgrp_id")) {
                whereClause =
                    whereClause +
                    "AND scdef_scgrp_ass_scgrp_id = " +
                    '<? value("scdef_scgrp_ass_scgrp_id") ?> ';
            }

            if (pParams.hasOwnProperty("entity_scgrp_ass_entity_id")) {
                whereClause =
                    whereClause +
                    "AND entity_scgrp_ass_entity_id = " +
                    '<? value("entity_scgrp_ass_entity_id") ?> ';
            }

            try {
                return MuseUtils.executeQuery(
                    "SELECT   DISTINCT scdef_id " +
                        ",scdef_internal_name " +
                        ",scdef_display_name " +
                        ",scdef_description " +
                        ",scdef_pkghead_id " +
                        ",scdef_is_system_locked " +
                        ",datatype_id AS scdef_datatype_id " +
                        ",datatype_display_name AS scdef_datatype_display_name " +
                        ",datatype_internal_name AS scdef_datatype_internal_name " +
                        ",datatype_is_text AS scdefdatatype_is_text" +
                        ",datatype_is_numeric AS scdefdatatype_is_numeric" +
                        ",datatype_is_date AS scdefdatatype_is_date" +
                        ",datatype_is_flag AS scdefdatatype_is_flag" +
                        ",datatype_is_array AS scdefdatatype_is_array" +
                        ",datatype_is_lov_based AS scdefdatatype_is_lov_based" +
                        ",array_to_string(scdef_values_list, ',') AS scdef_values_list " +
                        ",scdef_list_query " +
                        ",scdef_is_searchable " +
                        ",scdef_is_display_only " +
                        ",scdef_is_virtual " +
                        ",pkghead_name AS scdef_package_name " +
                        ",CASE " +
                        "WHEN scdef_is_system_locked THEN " +
                        "'bisque' " +
                        "ELSE " +
                        "'palegreen' " +
                        " END AS scdef_display_name_qtbackgroundrole " +
                        "FROM    musesuperchar.scdef " +
                        "JOIN musesuperchar.datatype " +
                        "ON scdef_datatype_id = datatype_id " +
                        "LEFT OUTER JOIN public.pkghead " +
                        "ON scdef_pkghead_id = pkghead_id  " +
                        "LEFT OUTER JOIN musesuperchar.scdef_scgrp_ass " +
                        "ON scdef_id = scdef_scgrp_ass_scdef_id " +
                        "LEFT OUTER JOIN musesuperchar.entity_scgrp_ass " +
                        "ON scdef_scgrp_ass_scgrp_id = " +
                        "entity_scgrp_ass_scgrp_id " +
                        whereClause,
                    pParams
                );
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a database problem trying to retrieve a list of Super Characteristics per the given criteria.",
                    "MuseSuperChar.SuperChar.getSuperChars",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getSuperCharById = function(pSuperCharId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharId: pSuperCharId
            };

            try {
                var scQuery = getSuperChars({
                    scdef_id: pSuperCharId,
                    isInactiveIncluded: true
                });

                if (
                    !scQuery.first() ||
                    !MuseUtils.isValidId(scQuery.value("scdef_id"))
                ) {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not find the requested Super Characteristic.",
                        "MuseSuperChar.SuperChar.getSuperCharById",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }

                return scQuery.firstJson();
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to retrieve the requested Super Characteristic defintion.",
                    "MuseSuperChar.SuperChar.getSuperCharById",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var isSuperCharSystemLocked = function(pSuperCharId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharId: pSuperCharId
            };

            try {
                var scQuery = MuseUtils.executeQuery(
                    "SELECT scdef_is_system_locked " +
                        "FROM   musesuperchar.scdef " +
                        'WHERE scdef_id = <? value("pSuperCharId") ?> ',
                    { pSuperCharId: pSuperCharId }
                );

                if (scQuery.first()) {
                    return MuseUtils.isTrue(
                        scQuery.value("scdef_is_system_locked")
                    );
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We failed to find the system locked status of the requested Super Characteristic.",
                        "MuseSuperChar.SuperChar.isSuperCharSystemLocked",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem looking up the system locked status of a Super Characteristic.",
                    "MuseSuperChar.SuperChar.isSuperCharSystemLocked",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getSuperCharsByGroupId = function(pGroupId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId
            };

            try {
                return getSuperChars({
                    scdef_scgrp_ass_scgrp_id: pGroupId
                });
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to retrieve the Super Characteristics for the requested group.",
                    "MuseSuperChar.SuperChar.getSuperCharsByGroupId",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getSuperCharsByEntityId = function(pEntityId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pEntityId: pEntityId
            };

            try {
                return getSuperChars({
                    entity_scgrp_ass_entity_id: pEntityId
                });
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to retrieve the Super Characteristics associated with the provided entity.",
                    "MuseSuperChar.SuperChar.getSuperCharsByEntityId",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getSubjectObjectNonOverlappingEntities = function(
            pSubjectScId,
            pObjectScId
        ) {
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
                    { pSubjectScId: pSubjectScId, pObjectScId: pObjectScId }
                );

                if (entitiesQuery.first()) {
                    return JSON.parse(entitiesQuery.firstJson().result);
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not receive the expected result from the database when requesting non-overlapping entities for the proposed subject/object SuperChars.",
                        "MuseSuperChar.SuperChar.getSubjectObjectNonOverlappingEntities",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem retrieving the non-overlapping entities for the given Subject/Object Super Characteristics.",
                    "MuseSuperChar.SuperChar.getSubjectObjectNonOverlappingEntities",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var createSuperChar = function(pSuperCharData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharData: pSuperCharData
            };

            try {
                var scQuery = MuseUtils.executeQuery(
                    "INSERT INTO musesuperchar.scdef " +
                        "(scdef_internal_name, scdef_display_name, " +
                        "scdef_description, scdef_datatype_id, " +
                        "scdef_is_searchable, scdef_is_display_only, " +
                        "scdef_is_virtual) " +
                        "VALUES " +
                        '( <? value("scdef_internal_name") ?> ' +
                        ',<? value("scdef_display_name") ?> ' +
                        ',<? value("scdef_description") ?> ' +
                        ',<? value("scdef_datatype_id") ?> ' +
                        ',<? value("scdef_is_searchable") ?> ' +
                        ',<? value("scdef_is_display_only") ?> ' +
                        ',<? value("scdef_is_virtual") ?> )' +
                        "RETURNING scdef_id ",
                    pSuperCharData
                );

                if (
                    !scQuery.first() ||
                    !MuseUtils.isValidId(scQuery.value("scdef_id"))
                ) {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not verify that we successfully created the Super Characteristic as requested.",
                        "MuseSuperChar.SuperChar.createSuperChar",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }

                return scQuery.value("scdef_id");
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem while saving the Super Characteristic.",
                    "MuseSuperChar.SuperChar.createSuperChar",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var updateSuperChar = function(pSuperCharData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharData: pSuperCharData
            };

            var updateColumns = [];
            var queryText = "UPDATE musesuperchar.scdef SET ";

            if (pSuperCharData.hasOwnProperty("scdef_id")) {
                updateColumns.push("scdef_id = " + '<? value("scdef_id") ?> ');
            }

            if (pSuperCharData.hasOwnProperty("scdef_display_name")) {
                updateColumns.push(
                    "scdef_display_name = " +
                        '<? value("scdef_display_name") ?> '
                );
            }

            if (pSuperCharData.hasOwnProperty("scdef_description")) {
                updateColumns.push(
                    "scdef_description = " + '<? value("scdef_description") ?> '
                );
            }

            if (pSuperCharData.hasOwnProperty("scdef_is_system_locked")) {
                updateColumns.push(
                    "scdef_is_system_locked = " +
                        '<? value("scdef_is_system_locked") ?> '
                );
            }

            if (pSuperCharData.hasOwnProperty("scdef_datatype_id")) {
                updateColumns.push(
                    "scdef_datatype_id = " + '<? value("scdef_datatype_id") ?> '
                );
            }

            if (pSuperCharData.hasOwnProperty("scdef_values_list")) {
                updateColumns.push(
                    "scdef_values_list = " +
                        'translate(<? value("scdef_values_list") ?>, ' +
                        "'[]', '{}')::text[] "
                );
            }

            if (pSuperCharData.hasOwnProperty("scdef_list_query")) {
                updateColumns.push(
                    "scdef_list_query = " + '<? value("scdef_list_query") ?> '
                );
            }

            if (pSuperCharData.hasOwnProperty("scdef_is_searchable")) {
                updateColumns.push(
                    "scdef_is_searchable = " +
                        '<? value("scdef_is_searchable") ?> '
                );
            }

            if (pSuperCharData.hasOwnProperty("scdef_is_active")) {
                updateColumns.push(
                    "scdef_is_active = " + '<? value("scdef_is_active") ?> '
                );
            }

            try {
                queryText =
                    queryText +
                    updateColumns.join(", ") +
                    ' WHERE scdef_id = <? value("scdef_id") ?> ' +
                    "RETURNING scdef_id";

                var scQuery = MuseUtils.executeQuery(queryText, pSuperCharData);

                if (
                    scQuery.first() &&
                    MuseUtils.isValidId(scQuery.value("scdef_id"))
                ) {
                    return scQuery.value("scdef_id");
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We could not verify that we successfully updated the Super Characteristic as requested.",
                        "MuseSuperChar.SuperChar.updateSuperChar",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a database problem while trying to update a Super Characteristic.",
                    "MuseSuperChar.SuperChar.updateSuperChar",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var deleteSuperChar = function(pSuperCharId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharId: pSuperCharId
            };

            try {
                var scQuery = MuseUtils.executeQuery(
                    "DELETE FROM musesuperchar.scdef " +
                        'WHERE scdef_id = <? value("pSuperCharId") ?> ' +
                        "RETURNING scdef_id",
                    { pSuperCharId: pSuperCharId }
                );

                if (
                    scQuery.first() &&
                    MuseUtils.isValidId(scQuery.value("scdef_id"))
                ) {
                    return scQuery.value("scdef_id");
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We could not verify that we deleted the requested Super Characteristic.",
                        "MuseSuperChar.SuperChar.deleteSuperChar",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem while trying to delete the requested Super Characteristic.",
                    "MuseSuperChar.SuperChar.deleteSuperChar",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getSuperCharGroups = function(pSuperCharId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharId: pSuperCharId
            };

            try {
                return MuseUtils.executeQuery(
                    "SELECT   sg.scgrp_id " +
                        ",sg.scgrp_internal_name " +
                        ",sg.scgrp_display_name " +
                        ",array_agg(e.entity_id) AS scgrp_entity_ids " +
                        ",string_agg(e.entity_display_name,', ') AS scgrp_entity_display_names " +
                        "FROM    musesuperchar.scdef_scgrp_ass sdsga  " +
                        "JOIN musesuperchar.scgrp sg  " +
                        "ON sdsga.scdef_scgrp_ass_scgrp_id = sg.scgrp_id  " +
                        "AND sg.scgrp_is_active " +
                        "LEFT OUTER JOIN musesuperchar.entity_scgrp_ass esga  " +
                        "ON sg.scgrp_id = esga.entity_scgrp_ass_scgrp_id " +
                        "AND esga.entity_scgrp_ass_is_active " +
                        "LEFT OUTER JOIN musesuperchar.entity e  " +
                        "ON esga.entity_scgrp_ass_entity_id = e.entity_id " +
                        "AND e.entity_is_active " +
                        "WHERE   sdsga.scdef_scgrp_ass_is_active " +
                        "AND sdsga.scdef_scgrp_ass_scdef_id = " +
                        '<? value("pSuperCharId") ?> ' +
                        "GROUP BY  sg.scgrp_id " +
                        ",sg.scgrp_internal_name " +
                        ",sg.scgrp_display_name ",
                    { pSuperCharId: pSuperCharId }
                );
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem trying to retrieve the groups associated with a Super Characteristic.",
                    "MuseSuperChar.SuperChar.getSuperCharGroups",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getDefaultScInternalName = function(pDisplayName) {
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
                    "MuseSuperChar.SuperChar.getDefaultScInternalName",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
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
                    { pSuperCharId: pSuperCharId }
                );

                if (violationQuery.first()) {
                    return JSON.parse(violationQuery.firstJson().result);
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not receive the expected response from the database while checking for proprosed Super Character deletion validation violations.",
                        "MuseSuperChar.SuperChar.getSuperCharDeleteViolations",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem trying to retrieve Super Characteristic delete validator violations.",
                    "MuseSuperChar.SuperChar.getSuperCharDeleteViolations",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getSuperCharList = function(pSuperCharId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharId: pSuperCharId
            };

            try {
                if (MuseUtils.isValidId(pSuperCharId)) {
                    return MuseUtils.executeQuery(
                        "SELECT     scdef_id " +
                            ",scdef_display_name " +
                            ",scdef_internal_name " +
                            "FROM   musesuperchar.scdef " +
                            'WHERE  scdef_id = <? value("pSuperCharId") ?> ',
                        { pSuperCharId: pSuperCharId }
                    );
                } else {
                    return MuseUtils.executeQuery(
                        "SELECT     scdef_id " +
                            ",scdef_display_name " +
                            ",scdef_internal_name " +
                            "FROM   musesuperchar.scdef " +
                            "WHERE  scdef_is_active " +
                            "ORDER BY scdef_display_name "
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem retrieving a simple list of Super Characteristics.",
                    "MuseSuperChar.SuperChar.getSuperCharList",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getValidatorTypesForSuperChar = function(pSuperCharId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharId: pSuperCharId
            };

            try {
                return MuseUtils.executeQuery(
                    "SELECT   vt.valtype_id " +
                        ",vt.valtype_display_name " +
                        ",vt.valtype_internal_name " +
                        "FROM    musesuperchar.scdef sd " +
                        "JOIN musesuperchar.datatype dt " +
                        "ON sd.scdef_datatype_id = dt.datatype_id " +
                        "JOIN musesuperchar.valtype vt " +
                        "ON  (dt.datatype_is_text = vt.valtype_is_text " +
                        "AND dt.datatype_is_text = true) " +
                        "OR (dt.datatype_is_numeric = vt.valtype_is_numeric " +
                        "AND dt.datatype_is_numeric = true) " +
                        "OR (dt.datatype_is_date = vt.valtype_is_date " +
                        "AND dt.datatype_is_date = true) " +
                        "OR (dt.datatype_is_flag = vt.valtype_is_flag " +
                        "AND dt.datatype_is_flag = true) " +
                        'WHERE  scdef_id = <? value("pSuperCharId") ?> ' +
                        "AND vt.valtype_is_active " +
                        "AND vt.valtype_is_user_visible " +
                        "ORDER BY vt.valtype_display_order ",
                    { pSuperCharId: pSuperCharId }
                );
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem retrieving the list of available validator types for the requested Super Characteristic/",
                    "MuseSuperChar.SuperChar.getValidatorTypesForSuperChar",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
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

            if (!MuseUtils.isValidId(pSuperCharId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Super Characteristic we were being asked to retrieve.",
                    "MuseSuperChar.SuperChar.pPublicApi.getSuperCharById",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getSuperCharById(pSuperCharId);
        };

        pPublicApi.isSuperCharSystemLocked = function(pSuperCharId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharId: pSuperCharId
            };

            if (!MuseUtils.isValidId(pSuperCharId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand for which Super Characteristic we should return the system locked status.",
                    "MuseSuperChar.SuperChar.pPublicApi.isSuperCharSystemLocked",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return isSuperCharSystemLocked(pSuperCharId);
        };

        pPublicApi.getSuperCharsByGroupId = function(pGroupId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pGroupId: pGroupId
            };

            if (!MuseUtils.isValidId("pGroupId")) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand for which group to retrieve Super Characteristics.",
                    "MuseSuperChar.SuperChar.pPublicApi.getSuperCharsByGroupId",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getSuperCharsByGroupId(pGroupId);
        };

        pPublicApi.getSuperCharsByEntityId = function(pEntityId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pEntityId: pEntityId
            };

            if (!MuseUtils.isValidId("pEntityId")) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand for which entity to retrieve Super Characteristics",
                    "MuseSuperChar.SuperChar.pPublicApi.getSuperCharsByEntityId",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getSuperCharsByEntityId(pEntityId);
        };

        pPublicApi.getSuperCharList = function(pSuperCharId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharId: pSuperCharId
            };

            return getSuperCharList(pSuperCharId);
        };

        pPublicApi.createSuperChar = function(pSuperCharData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharData: pSuperCharData
            };

            if (!privileges.check("maintainSuperCharateristics")) {
                throw new MuseUtils.PermissionException(
                    "musesuperchar",
                    "You do not have permissions to maintain Super Characteristics.",
                    "MuseSuperChar.SuperChar.pPublicApi.createSuperChar",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                !pSuperCharData.hasOwnProperty("scdef_internal_name") ||
                MuseUtils.coalesce(pSuperCharData.scdef_internal_name, "") ===
                    ""
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require an internal name for the Super Characteristic and did not receive one.",
                    "MuseSuperChar.SuperChar.pPublicApi.createSuperChar",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                !pSuperCharData.hasOwnProperty("scdef_display_name") ||
                MuseUtils.coalesce(pSuperCharData.scdef_display_name, "") === ""
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require a display name for the Super Characteristic and did not receive one.",
                    "MuseSuperChar.SuperChar.pPublicApi.createSuperChar",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                !pSuperCharData.hasOwnProperty("scdef_description") ||
                MuseUtils.coalesce(pSuperCharData.scdef_description, "") === ""
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require a description of the Super Characteristic and did not receive one.",
                    "MuseSuperChar.SuperChar.pPublicApi.createSuperChar",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                !pSuperCharData.hasOwnProperty("scdef_datatype_id") ||
                !MuseUtils.isValidId(pSuperCharData.scdef_datatype_id)
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "New Super Characteristics must identify a valid data type and we did not understand which to use in from your request.",
                    "MuseSuperChar.SuperChar.pPublicApi.createSuperChar",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            pSuperCharData.scdef_is_searchable = MuseUtils.isTrue(
                MuseUtils.coalesce(pSuperCharData.scdef_is_searchable, false)
            );

            pSuperCharData.scdef_is_display_only = MuseUtils.isTrue(
                MuseUtils.coalesce(pSuperCharData.scdef_is_display_only, false)
            );

            pSuperCharData.scdef_is_virtual = MuseUtils.isTrue(
                MuseUtils.coalesce(pSuperCharData.scdef_is_virtual, false)
            );

            return createSuperChar(pSuperCharData);
        };

        pPublicApi.updateSuperChar = function(pSuperCharData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharData: pSuperCharData
            };

            if (
                !pSuperCharData.hasOwnProperty("scdef_id") ||
                !MuseUtils.isValidId(pSuperCharData.scdef_id)
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Super Characteristic you wished to update.",
                    "MuseSuperChar.SuperChar.pPublicApi.updateSuperChar",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (!privileges.check("maintainSuperCharateristics")) {
                throw new MuseUtils.PermissionException(
                    "musesuperchar",
                    "You do not have permission to update Super Characteristics.",
                    "MuseSuperChar.SuperChar.pPublicApi.updateSuperChar",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            } else if (
                isSuperCharSystemLocked(pSuperCharData.scdef_id) &&
                !privileges.check("maintainSuperCharSysLockRecsManually")
            ) {
                throw new MuseUtils.PermissionException(
                    "musesuperchar",
                    "You do not have permission to update system locked Super Characteristics.",
                    "MuseSuperChar.SuperChar.pPublicApi.updateSuperChar",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return updateSuperChar(pSuperCharData);
        };

        pPublicApi.deleteSuperChar = function(pSuperCharId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharId: pSuperCharId
            };

            if (!MuseUtils.isValidId(pSuperCharId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We could not understand which SuperChar you wished to delete.",
                    "MuseSuperChar.SuperChar.pPublicApi.deleteSuperChar",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (!privileges.check("maintainSuperCharateristics")) {
                throw new MuseUtils.PermissionException(
                    "musesuperchar",
                    "You do not have permission to delete Super Characteristics.",
                    "MuseSuperChar.SuperChar.pPublicApi.pSuperCharId",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            } else if (
                isSuperCharSystemLocked(pSuperCharId) &&
                !privileges.check(maintainSuperCharSysLockRecsManually)
            ) {
                throw new MuseUtils.PermissionException(
                    "musesuperchar",
                    "You do not have permission to delete system locked Super Characteristics.",
                    "MuseSuperChar.SuperChar.pPublicApi.deleteSuperChar",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return deleteSuperChar(pSuperCharId);
        };

        pPublicApi.getSuperCharGroups = function(pSuperCharId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharId: pSuperCharId
            };

            if (!MuseUtils.isValidId(pSuperCharId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Super Characteristic for which you wanted to retrieve associated groups.",
                    "MuseSuperChar.SuperChar.pPublicApi.getSuperCharGroups",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getSuperCharGroups(pSuperCharId);
        };

        pPublicApi.getSuperCharValidators = function(pSuperCharId) {};

        pPublicApi.getSuperCharLov = function(pSuperCharId) {};

        pPublicApi.addSuperCharLovValue = function(pSuperCharId, pLovValue) {};

        pPublicApi.validateLovQuery = function(pSuperCharId) {};

        pPublicApi.getValidatorById = function(pValidatorId) {};

        pPublicApi.getValidatorTypesForSuperChar = function(pSuperCharId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharId: pSuperCharId
            };

            if (!MuseUtils.isValidId(pSuperCharId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand for which Super Characteristic we should retrieve validation types.",
                    "MuseSuperChar.SuperChar.pPublicApi.getValidatorTypesForSuperChar",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getValidatorTypesForSuperChar(pSuperCharId);
        };

        pPublicApi.getSubjectObjectNonOverlappingEntities = function(
            pSubjectScId,
            pObjectScId
        ) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSubjectScId: pSubjectScId,
                pObjectScId: pObjectScId
            };

            if (!MuseUtils.isValidId(pSubjectScId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand for which subject Super Characteristic to check for non-overlapping entities.",
                    "MuseSuperChar.SuperChar.pPublicApi.getSubjectObjectNonOverlappingEntities",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (!MuseUtils.isValidId(pObjectScId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand for which object Super Characteristic to check for non-overlapping entities.",
                    "MuseSuperChar.SuperChar.pPublicApi.getSubjectObjectNonOverlappingEntities",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getSubjectObjectNonOverlappingEntities(
                pSubjectScId,
                pObjectScId
            );
        };

        pPublicApi.getSuperCharDeleteViolations = function(pSuperCharId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pSuperCharId: pSuperCharId
            };

            if (!MuseUtils.isValidId(pSuperCharId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Super Characteristics you wanted to check for delete validator violations.",
                    "MuseSuperChar.SuperChar.pPublicApi.getSuperCharDeleteViolations",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getSuperCharDeleteViolations(pSuperCharId);
        };

        pPublicApi.getDefaultScInternalName = function(pDisplayName) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pDisplayName: pDisplayName
            };

            if (MuseUtils.coalesce(pDisplayName, "") === "") {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require some text value from which to construct a default Super Characteristic internal name.",
                    "MuseSuperChar.SuperChar.pPublicApi.getDefaultScInternalName",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getDefaultScInternalName(pDisplayName);
        };
    } catch (e) {
        var error = new MuseUtils.ModuleException(
            "musesuperchar",
            "We enountered a MuseSuperChar.SuperChar module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.SuperChar",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.SuperChar, this);
