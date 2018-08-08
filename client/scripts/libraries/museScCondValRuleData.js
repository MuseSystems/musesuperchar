/*************************************************************************
 *************************************************************************
 **
 ** File:        museScCondValRuleData.js
 ** Project:     Muse Systems Super Characteristics for xTuple ERP
 ** Author:      Steven C. Buttgereit
 **
 ** (C) 2017-2018 Lima Buttgereit Holdings LLC d/b/a Muse Systems
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

    if (typeof MuseSuperChar.CondValRule === "undefined") {
        MuseSuperChar.CondValRule = {};
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
        MuseUtils.MOD_JS
    ]);
} catch (e) {
    if (
        typeof MuseUtils !== "undefined" &&
        (MuseUtils.isMuseUtilsExceptionLoaded === true ? true : false)
    ) {
        var error = new MuseUtils.ScriptException(
            "musesuperchar",
            "We encountered a script level issue while processing MuseSuperChar.CondValRule.",
            "MuseSuperChar.CondValRule",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );

        MuseUtils.displayError(error, mainwindow);
    } else {
        QMessageBox.critical(
            mainwindow,
            "MuseSuperChar.CondValRule Script Error",
            "We encountered a script level issue while processing MuseSuperChar.CondValRule."
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
        pPublicApi.REGEXP = "regexp";
        pPublicApi.NUMERICEQUAL = "numericequal";
        pPublicApi.NUMERICLESSTHAN = "numericlessthan";
        pPublicApi.NUMERICGREATERTHAN = "numericgreaterthan";
        pPublicApi.NUMERICGREATERTHANOREQUALTO = "numericgreaterthanorequalto";
        pPublicApi.NUMERICLESSTHANOREQUALTO = "numericlessthanorequalto";
        pPublicApi.DATEEQUAL = "dateequal";
        pPublicApi.DATELESSTHAN = "datelessthan";
        pPublicApi.DATELESSTHANOREQUALTO = "datelessthanorequalto";
        pPublicApi.DATEGREATERTHAN = "dategreaterthan";
        pPublicApi.DATEGREATERTHANOREQUALTO = "dategreaterthanorequalto";
        pPublicApi.NUMERICBETWEENINCLUSIVE = "numericbetweeninclusive";
        pPublicApi.DATEBETWEENINCLUSIVE = "datebetweeninclusive";
        pPublicApi.FLAGISTRUE = "flagistrue";
        pPublicApi.FLAGISFALSE = "flagisfalse";

        pPublicApi.VALIDATORTYPES = [
            "regexp",
            "numericequal",
            "numericlessthan",
            "numericgreaterthan",
            "numericgreaterthanorequalto",
            "numericlessthanorequalto",
            "dateequal",
            "datelessthan",
            "datelessthanorequalto",
            "dategreaterthan",
            "dategreaterthanorequalto",
            "numericbetweeninclusive",
            "datebetweeninclusive",
            "flagistrue",
            "flagisfalse"
        ];
        //--------------------------------------------------------------------
        //  Private Functional Logic
        //--------------------------------------------------------------------
        var getValidators = function(pParams) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pParams: pParams
            };

            whereClause = "WHERE true ";

            if (!MuseUtils.isTrue(pParams.isInactiveIncluded || false)) {
                whereClause = whereClause + " AND condvalrule_is_active ";
            }

            if (pParams.hasOwnProperty("condvalrule_id")) {
                whereClause +=
                    "AND condvalrule_id = " + '<? value("condvalrule_id") ?> ';
            }

            if (pParams.hasOwnProperty("condvalrule_subject_scdef_id")) {
                whereClause +=
                    "AND condvalrule_subject_scdef_id = " +
                    '<? value("condvalrule_subject_scdef_id") ?> ';
            }

            if (pParams.hasOwnProperty("condvalrule_object_scdef_id")) {
                whereClause +=
                    "AND condvalrule_object_scdef_id = " +
                    '<? value("condvalrule_object_scdef_id") ?> ';
            }

            if (
                pParams.hasOwnProperty("condvalrule_object_scdef_display_name")
            ) {
                whereClause +=
                    "AND sd.scdef_display_name = " +
                    '<? value("condvalrule_object_scdef_display_name") ?> ';
            }

            if (
                pParams.hasOwnProperty("condvalrule_object_scdef_internal_name")
            ) {
                whereClause +=
                    "AND sd.scdef_internal_name = " +
                    '<? value("condvalrule_object_scdef_internal_name") ?> ';
            }

            try {
                return MuseUtils.executeQuery(
                    "SELECT   cvr.condvalrule_id " +
                        ",cvr.condvalrule_subject_scdef_id " +
                        ",cvr.condvalrule_object_scdef_id " +
                        ",osc.scdef_display_name AS condvalrule_object_scdef_display_name " +
                        ",osc.scdef_internal_name AS condvalrule_object_scdef_internal_name " +
                        ",odt.datatype_display_name AS condvalrule_object_scdef_datatype " +
                        ",ssc.scdef_display_name AS condvalrule_subject_scdef_display_name " +
                        ",ssc.scdef_internal_name AS condvalrule_subject_scdef_internal_name " +
                        ",sdt.datatype_display_name AS condvalrule_subject_scdef_datatype " +
                        ",cvr.condvalrule_if_valtype_id " +
                        ",ifvt.valtype_display_name AS condvalrule_if_valtype_display_name " +
                        ",ifvt.valtype_internal_name AS condvalrule_if_valtype_internal_name " +
                        ",thenvt.valtype_display_name AS condvalrule_then_valtype_display_name " +
                        ",thenvt.valtype_internal_name AS condvalrule_then_valtype_internal_name " +
                        ",cvr.condvalrule_ifval_regexp " +
                        ",cvr.condvalrule_ifval_numrange " +
                        ",upper(condvalrule_ifval_numrange) AS condvalrule_ifval_numeric_upper " +
                        ",lower(condvalrule_ifval_numrange) AS condvalrule_ifval_numeric_lower " +
                        ",CASE " +
                        "WHEN coalesce(upper(condvalrule_ifval_numrange) = lower(condvalrule_ifval_numrange), false) THEN " +
                        "lower(condvalrule_ifval_numrange) " +
                        "ELSE  " +
                        "null " +
                        "END AS condvalrule_ifval_numeric " +
                        ",cvr.condvalrule_ifval_daterange " +
                        ",upper(condvalrule_ifval_daterange) AS condvalrule_ifval_date_upper " +
                        ",lower(condvalrule_ifval_daterange) AS condvalrule_ifval_date_lower " +
                        ",CASE " +
                        "WHEN coalesce(upper(condvalrule_ifval_daterange) = lower(condvalrule_ifval_daterange), false) THEN " +
                        "lower(condvalrule_ifval_daterange) " +
                        "ELSE  " +
                        "null " +
                        "END AS condvalrule_ifval_date " +
                        ",cvr.condvalrule_then_valtype_id " +
                        ",cvr.condvalrule_thenval_regexp " +
                        ",cvr.condvalrule_thenval_numrange " +
                        ",upper(condvalrule_thenval_numrange) AS condvalrule_thenval_numeric_upper " +
                        ",lower(condvalrule_thenval_numrange) AS condvalrule_thenval_numeric_lower " +
                        ",CASE " +
                        "WHEN coalesce(upper(condvalrule_thenval_numrange) = lower(condvalrule_thenval_numrange), false) THEN " +
                        "lower(condvalrule_thenval_numrange) " +
                        "ELSE  " +
                        "null " +
                        "END AS condvalrule_thenval_numeric " +
                        ",cvr.condvalrule_thenval_daterange " +
                        ",upper(condvalrule_thenval_daterange) AS condvalrule_thenval_date_upper " +
                        ",lower(condvalrule_thenval_daterange) AS condvalrule_thenval_date_lower " +
                        ",CASE " +
                        "WHEN coalesce(upper(condvalrule_thenval_daterange) = lower(condvalrule_thenval_daterange), false) THEN " +
                        "lower(condvalrule_thenval_daterange) " +
                        "ELSE  " +
                        "null " +
                        "END AS condvalrule_thenval_date " +
                        ",cvr.condvalrule_fails_message_text " +
                        ",cvr.condvalrule_is_system_locked " +
                        ",cvr.condvalrule_pkghead_id " +
                        ",ph.pkghead_name AS condvalrule_package_name " +
                        ",cvr.condvalrule_is_active " +
                        ",'If ' ||  osc.scdef_display_name || ' is ' || ifvt.valtype_display_name || ' ' || " +
                        "CASE " +
                        "WHEN coalesce(upper(condvalrule_ifval_numrange) = lower(condvalrule_ifval_numrange), false) THEN " +
                        "lower(condvalrule_ifval_numrange)::text " +
                        "WHEN upper(condvalrule_ifval_numrange) IS NOT NULL AND lower(condvalrule_ifval_numrange) IS NOT NULL THEN " +
                        "lower(condvalrule_ifval_numrange)::text ||' and '|| upper(condvalrule_ifval_numrange)::text " +
                        "WHEN condvalrule_ifval_numrange IS NOT NULL THEN " +
                        "coalesce(lower(condvalrule_ifval_numrange)::text,upper(condvalrule_ifval_numrange)::text)" +
                        "WHEN coalesce(upper(condvalrule_ifval_daterange) = lower(condvalrule_ifval_daterange), false) THEN " +
                        "lower(condvalrule_ifval_daterange)::text " +
                        "WHEN upper(condvalrule_ifval_daterange) IS NOT NULL AND lower(condvalrule_ifval_daterange) IS NOT NULL THEN " +
                        "lower(condvalrule_ifval_daterange)::text ||' and '|| upper(condvalrule_ifval_daterange)::text " +
                        "WHEN condvalrule_ifval_daterange IS NOT NULL THEN " +
                        "coalesce(lower(condvalrule_ifval_daterange)::text,upper(condvalrule_ifval_daterange)::text) " +
                        "ELSE " +
                        "'' " +
                        "END || ' then ' ||  ssc.scdef_display_name || ' must be ' || thenvt.valtype_display_name || ' ' || " +
                        "CASE " +
                        "WHEN coalesce(upper(condvalrule_thenval_numrange) = lower(condvalrule_thenval_numrange), false) THEN " +
                        "lower(condvalrule_thenval_numrange)::text " +
                        "WHEN upper(condvalrule_thenval_numrange) IS NOT NULL AND lower(condvalrule_thenval_numrange) IS NOT NULL THEN " +
                        "lower(condvalrule_thenval_numrange)::text ||' and '|| upper(condvalrule_thenval_numrange)::text " +
                        "WHEN condvalrule_thenval_numrange IS NOT NULL THEN " +
                        "coalesce(lower(condvalrule_thenval_numrange)::text,upper(condvalrule_thenval_numrange)::text) " +
                        "WHEN coalesce(upper(condvalrule_thenval_daterange) = lower(condvalrule_thenval_daterange), false) THEN " +
                        "lower(condvalrule_thenval_daterange)::text " +
                        "WHEN upper(condvalrule_thenval_daterange) IS NOT NULL AND lower(condvalrule_thenval_daterange) IS NOT NULL THEN " +
                        "lower(condvalrule_thenval_daterange)::text ||' and '|| upper(condvalrule_thenval_daterange)::text " +
                        "WHEN condvalrule_thenval_daterange IS NOT NULL THEN " +
                        "coalesce(lower(condvalrule_thenval_daterange)::text,upper(condvalrule_thenval_daterange)::text) " +
                        "ELSE " +
                        "'' " +
                        "END || '.' AS validator_description " +
                        "FROM    musesuperchar.condvalrule cvr " +
                        "JOIN musesuperchar.valtype ifvt " +
                        "ON cvr.condvalrule_if_valtype_id = ifvt.valtype_id " +
                        "JOIN musesuperchar.valtype thenvt " +
                        "ON cvr.condvalrule_then_valtype_id = thenvt.valtype_id " +
                        "JOIN musesuperchar.scdef ssc " +
                        "ON cvr.condvalrule_subject_scdef_id = ssc.scdef_id " +
                        "JOIN musesuperchar.scdef osc " +
                        "ON cvr.condvalrule_object_scdef_id = osc.scdef_id " +
                        "JOIN musesuperchar.datatype odt " +
                        "ON osc.scdef_datatype_id = odt.datatype_id " +
                        "JOIN musesuperchar.datatype sdt " +
                        "ON ssc.scdef_datatype_id = sdt.datatype_id " +
                        "LEFT OUTER JOIN public.pkghead ph " +
                        "ON cvr.condvalrule_pkghead_id = ph.pkghead_id " +
                        whereClause,
                    pParams
                );
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem retrieving the requested conditional validation rules.",
                    "MuseSuperChar.CondValRule.getValidators",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getValidatorById = function(pValidatorId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pValidatorId: pValidatorId
            };

            try {
                var cvrQry = getValidators({ condvalrule_id: pValidatorId });

                if (cvrQry.first()) {
                    return cvrQry.firstJson();
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not find the requested Conditional Validation Rule.",
                        "MuseSuperChar.CondValRule.getValidatorById",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.ApiException(
                    "musesuperchar",
                    "We failed to retrieve the requested Conditional Validation Rule.",
                    "MuseSuperChar.CondValRule.getValidatorById",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var isValidatorSystemLocked = function(pValidatorId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pValidatorId: pValidatorId
            };

            try {
                var condValQuery = MuseUtils.executeQuery(
                    "SELECT condvalrule_is_system_locked " +
                        "FROM  musesuperchar.condvalrule cvr " +
                        "WHERE condvalrule_id = " +
                        '<? value("pValidatorId") ?> ',
                    { pValidatorId: pValidatorId }
                );

                if (condValQuery.first()) {
                    return MuseUtils.isTrue(
                        condValQuery.value("condvalrule_is_system_locked")
                    );
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We did not find the requested conditional validation rule while trying to check if it was system locked.",
                        "MuseSuperChar.CondValRule.isValidatorSystemLocked",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem trying to find if a conditional validator was system locked or not.",
                    "MuseSuperChar.CondValRule.isValidatorSystemLocked",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var getValTypeById = function(pValTypeId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pValTypeId: pValTypeId
            };

            try {
                var valtypeQry = MuseUtils.executeQuery(
                    "SELECT   valtype_id " +
                        ",valtype_internal_name " +
                        ",valtype_display_name " +
                        ",valtype_description " +
                        ",valtype_is_user_visible " +
                        ",valtype_is_text " +
                        ",valtype_is_numeric " +
                        ",valtype_is_date " +
                        ",valtype_is_flag " +
                        ",valtype_display_order " +
                        ",valtype_is_active " +
                        "FROM    musesuperchar.valtype " +
                        'WHERE   valtype_id = <? value("pValTypeId") ?>',
                    { pValTypeId: pValTypeId }
                );

                if (valtypeQry.first()) {
                    return valtypeQry.firstJson();
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We failed to find the requested Validation Type even though we had an ID for it.",
                        "MuseSuperChar.CondValRule.getValTypeById",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a database problem trying to retrieve a validator type record.",
                    "MuseSuperChar.CondValRule.getValTypeById",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var upsertValidator = function(pValidatorData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pValidatorData: pValidatorData
            };

            var ifValType = {};
            var thenValType = {};

            try {
                if (
                    pValidatorData.hasOwnProperty(
                        "condvalrule_if_valtype_internal_name"
                    )
                ) {
                    ifValType.valtype_internal_name =
                        pValidatorData.condvalrule_if_valtype_internal_name;
                } else {
                    ifValType = getValTypeById(
                        pValidatorData.condvalrule_if_valtype_id
                    );
                }

                if (
                    pValidatorData.hasOwnProperty(
                        "condvalrule_then_valtype_internal_name"
                    )
                ) {
                    thenValType.valtype_internal_name =
                        pValidatorData.condvalrule_then_valtype_internal_name;
                } else {
                    thenValType = getValTypeById(
                        pValidatorData.condvalrule_then_valtype_id
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered problems retrieving the validator types associated with your new validator.",
                    "MuseSuperChar.CondValRule.createValidator",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }

            var columnsList = [
                "condvalrule_object_scdef_id",
                "condvalrule_subject_scdef_id",
                "condvalrule_if_valtype_id",
                "condvalrule_then_valtype_id",
                "condvalrule_fails_message_text"
            ];
            var valuesList = [
                '<? value("condvalrule_object_scdef_id") ?>',
                '<? value("condvalrule_subject_scdef_id") ?>',
                '<? value("condvalrule_if_valtype_id") ?>',
                '<? value("condvalrule_then_valtype_id") ?>',
                '<? value("condvalrule_fails_message_text") ?>'
            ];

            switch (ifValType.valtype_internal_name) {
                case pPublicApi.REGEXP:
                    columnsList.push("condvalrule_ifval_regexp");
                    valuesList.push('<? value("condvalrule_ifval_regexp") ?>');
                    break;
                case pPublicApi.NUMERICEQUAL:
                    columnsList.push("condvalrule_ifval_numrange");
                    valuesList.push(
                        'numrange(<? value("condvalrule_ifval_numeric") ?>, <? value("condvalrule_ifval_numeric") ?>,$$[]$$)'
                    );
                    break;
                case pPublicApi.NUMERICLESSTHAN:
                    columnsList.push("condvalrule_ifval_numrange");
                    valuesList.push(
                        'numrange(null, <? value("condvalrule_ifval_numeric_upper") ?>, $$[)$$)'
                    );
                    break;
                case pPublicApi.NUMERICLESSTHANOREQUALTO:
                    columnsList.push("condvalrule_ifval_numrange");
                    valuesList.push(
                        'numrange(null, <? value("condvalrule_ifval_numeric_upper") ?>, $$[]$$)'
                    );
                    break;
                case pPublicApi.NUMERICGREATERTHAN:
                    columnsList.push("condvalrule_ifval_numrange");
                    valuesList.push(
                        'numrange(<? value("condvalrule_ifval_numeric_lower") ?>, null, $$(]$$)'
                    );
                    break;
                case pPublicApi.NUMERICGREATERTHANOREQUALTO:
                    columnsList.push("condvalrule_ifval_numrange");
                    valuesList.push(
                        'numrange(<? value("condvalrule_ifval_numeric_lower") ?>, null, $$[]$$)'
                    );
                    break;
                case pPublicApi.NUMERICBETWEENINCLUSIVE:
                    columnsList.push("condvalrule_ifval_numrange");
                    valuesList.push(
                        'numrange(<? value("condvalrule_ifval_numeric_lower") ?>, <? value("condvalrule_ifval_numeric_upper") ?>, $$[]$$)'
                    );
                    break;
                case pPublicApi.DATEEQUAL:
                    columnsList.push("condvalrule_ifval_daterange");
                    valuesList.push(
                        'daterange((<? value("condvalrule_ifval_date") ?>)::date, <? (value("condvalrule_ifval_date"))::date ?>,$$[]$$)'
                    );
                    break;
                case pPublicApi.DATELESSTHAN:
                    columnsList.push("condvalrule_ifval_daterange");
                    valuesList.push(
                        'daterange(null, (<? value("condvalrule_ifval_date_upper") ?>)::date, $$[)$$)'
                    );
                    break;
                case pPublicApi.DATELESSTHANOREQUALTO:
                    columnsList.push("condvalrule_ifval_daterange");
                    valuesList.push(
                        'daterange(null, (<? value("condvalrule_ifval_date_upper") ?>)::date, $$[]$$)'
                    );
                    break;
                case pPublicApi.DATEGREATERTHAN:
                    columnsList.push("condvalrule_ifval_daterange");
                    valuesList.push(
                        'daterange((<? value("condvalrule_ifval_date_lower") ?>)::date, null, $$(]$$)'
                    );
                    break;
                case pPublicApi.DATEGREATERTHANOREQUALTO:
                    columnsList.push("condvalrule_ifval_daterange");
                    valuesList.push(
                        'daterange((<? value("condvalrule_ifval_date_lower") ?>)::date, null, $$[]$$)'
                    );
                    break;
                case pPublicApi.DATEBETWEENINCLUSIVE:
                    columnsList.push("condvalrule_ifval_daterange");
                    valuesList.push(
                        'daterange((<? value("condvalrule_ifval_date_lower") ?>)::date, (<? value("condvalrule_ifval_date_upper") ?>)::date, $$[]$$)'
                    );
                    break;
                default:
                // We do have cases where a type has no additional value so an empty
                // default is completely reasonable.
            }

            switch (thenValType.valtype_internal_name) {
                case pPublicApi.REGEXP:
                    columnsList.push("condvalrule_thenval_regexp");
                    valuesList.push(
                        '<? value("condvalrule_thenval_regexp") ?>'
                    );
                    break;
                case pPublicApi.NUMERICEQUAL:
                    columnsList.push("condvalrule_thenval_numrange");
                    valuesList.push(
                        'numrange(<? value("condvalrule_thenval_numeric") ?>, <? value("condvalrule_thenval_numeric") ?>,$$[]$$)'
                    );
                    break;
                case pPublicApi.NUMERICLESSTHAN:
                    columnsList.push("condvalrule_thenval_numrange");
                    valuesList.push(
                        'numrange(null, <? value("condvalrule_thenval_numeric_upper") ?>, $$[)$$)'
                    );
                    break;
                case pPublicApi.NUMERICLESSTHANOREQUALTO:
                    columnsList.push("condvalrule_thenval_numrange");
                    valuesList.push(
                        'numrange(null, <? value("condvalrule_thenval_numeric_upper") ?>, $$[]$$)'
                    );
                    break;
                case pPublicApi.NUMERICGREATERTHAN:
                    columnsList.push("condvalrule_thenval_numrange");
                    valuesList.push(
                        'numrange(<? value("condvalrule_thenval_numeric_lower") ?>, null, $$(]$$)'
                    );
                    break;
                case pPublicApi.NUMERICGREATERTHANOREQUALTO:
                    columnsList.push("condvalrule_thenval_numrange");
                    valuesList.push(
                        'numrange(<? value("condvalrule_thenval_numeric_lower") ?>, null, $$[]$$)'
                    );
                    break;
                case pPublicApi.NUMERICBETWEENINCLUSIVE:
                    columnsList.push("condvalrule_thenval_numrange");
                    valuesList.push(
                        'numeric(<? value("condvalrule_thenval_numeric_lower") ?>, <? value("condvalrule_thenval_numeric_upper") ?>, $$[]$$)'
                    );
                    break;
                case pPublicApi.DATEEQUAL:
                    columnsList.push("condvalrule_thenval_daterange");
                    valuesList.push(
                        'daterange((<? value("condvalrule_thenval_date") ?>)::date, <? (value("condvalrule_thenval_date"))::date ?>,$$[]$$)'
                    );
                    break;
                case pPublicApi.DATELESSTHAN:
                    columnsList.push("condvalrule_thenval_daterange");
                    valuesList.push(
                        'daterange(null, (<? value("condvalrule_thenval_date_upper") ?>)::date, $$[)$$)'
                    );
                    break;
                case pPublicApi.DATELESSTHANOREQUALTO:
                    columnsList.push("condvalrule_thenval_daterange");
                    valuesList.push(
                        'daterange(null, (<? value("condvalrule_thenval_date_upper") ?>)::date, $$[]$$)'
                    );
                    break;
                case pPublicApi.DATEGREATERTHAN:
                    columnsList.push("condvalrule_thenval_daterange");
                    valuesList.push(
                        'daterange((<? value("condvalrule_thenval_date_lower") ?>)::date, null, $$(]$$)'
                    );
                    break;
                case pPublicApi.DATEGREATERTHANOREQUALTO:
                    columnsList.push("condvalrule_thenval_daterange");
                    valuesList.push(
                        'daterange((<? value("condvalrule_thenval_date_lower") ?>)::date, null, $$[]$$)'
                    );
                    break;
                case pPublicApi.DATEBETWEENINCLUSIVE:
                    columnsList.push("condvalrule_thenval_daterange");
                    valuesList.push(
                        'daterange((<? value("condvalrule_thenval_date_lower") ?>)::date, (<? value("condvalrule_thenval_date_upper") ?>)::date, $$[]$$)'
                    );
                    break;
                default:
                // We do have cases where a type has no additional value so an empty
                // default is completely reasonable.
            }
            var queryString;

            if (
                pValidatorData.hasOwnProperty("condvalrule_id") &&
                MuseUtils.isValidId(pValidatorData.condvalrule_id)
            ) {
                columnsList.push("condvalrule_id");
                valuesList.push("condvalrule_id");
                var updateList = [];
                for (var i_upd = 0; i_upd < columnsList.length; i_upd++) {
                    updateList.push(
                        columnsList[i_upd] + " = " + valuesList[i_upd]
                    );
                }

                queryString =
                    "UPDATE musesuperchar.condvalrule SET " +
                    updateList.join(",") +
                    ' WHERE condvalrule_id = <? value("condvalrule_id" ?> ' +
                    "RETURNING condvalrule_id";
            } else {
                queryString =
                    "INSERT INTO musesuperchar.condvalrule (" +
                    columnsList.join(",") +
                    ") VALUES (" +
                    valuesList.join(",") +
                    ") RETURNING condvalrule_id ";
            }

            try {
                var cvrQry = MuseUtils.executeQuery(
                    queryString,
                    pValidatorData
                );

                if (cvrQry.first()) {
                    return cvrQry.value("condvalrule_id");
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We failed to verify that we upserted a new conditional validation rule as expected.",
                        "MuseSuperChar.CondValRule.createValidator",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem trying to upsert a conditional validation rule.",
                    "MuseSuperChar.CondValRule.createValidator",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        var deleteValidator = function(pValidatorId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pValidatorId: pValidatorId
            };

            try {
                var cvrQry = MuseUtils.executeQuery(
                    "DELETE FROM musesuperchar.condvalrule " +
                        'WHERE condvalrule_id = <? value("pValidatorId") ?> ' +
                        "RETURNING condvalrule_id ",
                    { pValidatorId: pValidatorId }
                );

                if (cvrQry.first()) {
                    return cvrQry.value("condvalrule_id");
                } else {
                    throw new MuseUtils.NotFoundException(
                        "musesuperchar",
                        "We failed to verify that we deleted a Conditional Validation Rule.",
                        "MuseSuperChar.CondValRule.deleteValidator",
                        { params: funcParams },
                        MuseUtils.LOG_INFO
                    );
                }
            } catch (e) {
                throw new MuseUtils.DatabaseException(
                    "musesuperchar",
                    "We encountered a problem trying to delete a Conditional Validation Rule.",
                    "MuseSuperChar.CondValRule.deleteValidator",
                    { params: funcParams, thrownError: e },
                    MuseUtils.LOG_WARNING
                );
            }
        };

        //--------------------------------------------------------------------
        //  Public Interface -- Functions
        //--------------------------------------------------------------------
        pPublicApi.getValidators = function(pParams) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pParams: pParams
            };

            return getValidators(pParams);
        };

        pPublicApi.getValidatorById = function(pValidatorId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pValidatorId: pValidatorId
            };

            if (!MuseUtils.isValidId(pValidatorId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Conditional Validation Rule you wanted us to look up.",
                    "MuseSuperChar.CondValRule.pPublicApi.isValidId",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return getValidatorById(pValidatorId);
        };

        pPublicApi.isValidatorSystemLocked = function(pValidatorId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pValidatorId: pValidatorId
            };

            if (!MuseUtils.isValidId(pValidatorId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which validator need checking for being systems locked.",
                    "MuseSuperChar.CondValRule.pPublicApi.isValidatorSystemLocked",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return isValidatorSystemLocked(pValidatorId);
        };

        pPublicApi.createValidator = function(pValidatorData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pValidatorData: pValidatorData
            };

            if (
                !pValidatorData.hasOwnProperty(
                    "condvalrule_subject_scdef_id"
                ) ||
                !MuseUtils.isValidId(
                    pValidatorData.condvalrule_subject_scdef_id
                )
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require a valid Subject SuperChar ID in order to create a new Super Characteristic Validation Rule.",
                    "MuseSuperChar.CondValRule.pPublicApi.createValidator",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                !pValidatorData.hasOwnProperty("condvalrule_object_scdef_id") ||
                !MuseUtils.isValidId(pValidatorData.condvalrule_object_scdef_id)
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require a valid Object SuperChar ID in order to create a new Super Characteristic Validation Rule.",
                    "MuseSuperChar.CondValRule.pPublicApi.createValidator",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                (!pValidatorData.hasOwnProperty("condvalrule_if_valtype_id") ||
                    !MuseUtils.isValidId(
                        pValidatorData.condvalrule_if_valtype_id
                    )) &&
                (!pValidatorData.hasOwnProperty(
                    "condvalrule_if_valtype_internal_name"
                ) ||
                    MuseUtils.coalesce(
                        pValidatorData.condvalrule_if_valtype_internal_name,
                        ""
                    ) === "")
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require a valid 'If' Validator Type ID or internal name in order to create a new Super Characteristic Validation Rule.",
                    "MuseSuperChar.CondValRule.pPublicApi.createValidator",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                (!pValidatorData.hasOwnProperty(
                    "condvalrule_then_valtype_id"
                ) ||
                    !MuseUtils.isValidId(
                        pValidatorData.condvalrule_then_valtype_id
                    )) &&
                (!pValidatorData.hasOwnProperty(
                    "condvalrule_then_valtype_internal_name"
                ) ||
                    MuseUtils.coalesce(
                        pValidatorData.condvalrule_then_valtype_internal_name,
                        ""
                    ) === "")
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require a valid 'Then' Validator Type ID or internal name in order to create a new Super Characteristic Validation Rule.",
                    "MuseSuperChar.CondValRule.pPublicApi.createValidator",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            if (
                !pValidatorData.hasOwnProperty(
                    "condvalrule_fails_message_text"
                ) ||
                MuseUtils.coalesce(
                    pValidatorData.condvalrule_fails_message_text,
                    ""
                ) === ""
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We require a valid message we can give the user when something doesn't validate in order to create a new Super Characteristic Validation Rule.",
                    "MuseSuperChar.CondValRule.pPublicApi.createValidator",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return upsertValidator(pValidatorData);
        };

        pPublicApi.updateValidator = function(pValidatorData) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pValidatorData: pValidatorData
            };

            if (
                !pValidatorData.hasOwnProperty("condvalrule_id") ||
                !MuseUtils.isValidId(pValidatorData.condvalrule_id)
            ) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Conditional Validation Rule you wished to update.",
                    "MuseSuperChar.CondValRule.pPublicApi.updateValidator",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return upsertValidator(pValidatorData);
        };

        pPublicApi.deleteValidator = function(pValidatorId) {
            // Capture function parameters for later exception references.
            var funcParams = {
                pValidatorId: pValidatorId
            };

            if (!MuseUtils.isValidId(pValidatorId)) {
                throw new MuseUtils.ParameterException(
                    "musesuperchar",
                    "We did not understand which Conditional Validation Rule you wished to delete.",
                    "MuseSuperChar.CondValRule.pPublicApi.deleteValidator",
                    { params: funcParams },
                    MuseUtils.LOG_WARNING
                );
            }

            return deleteValidator(pValidatorId);
        };
    } catch (e) {
        var error = new MuseUtils.ModuleException(
            "musesuperchar",
            "We enountered a MuseSuperChar.CondValRule module error that wasn't otherwise caught and handled.",
            "MuseSuperChar.CondValRule",
            { thrownError: e },
            MuseUtils.LOG_FATAL
        );
        MuseUtils.displayError(error, mainwindow);
    }
})(MuseSuperChar.CondValRule, this);
