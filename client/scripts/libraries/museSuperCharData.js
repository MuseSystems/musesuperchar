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
    var isSuperCharTablePopulated = function(pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityId: pEntityId
        };
        
        try {
            var scExistsQuery = MuseUtils.executeQuery(
                "SELECT musesuperchar.is_superchar_table_populated( " + 
                    '<? value("pEntityId") ?>) AS result',
                    {pEntityId: pEntityId});
            if(scExistsQuery.first()) {
                return MuseUtils.isTrue(scExistsQuery.value("result"));
            } else {
                throw new MuseUtils.NotFoundException(
                    "musesuperchar",
                    "We didn't receive a result from the database when we asked whether or not a super characteristic data table was still populated.",
                    "MuseSuperChar.SuperChar.isSuperCharTablePopulated",
                    {params: funcParams});
            }
        } catch(e) {
            throw new MuseUtils.DatabaseException(
                "musesuperchar",
                "We encountered a problem checking for the presense of super characteristics for the requested entity.",
                "MuseSuperChar.SuperChar",
                {params: funcParams, thrownError: e});
        }
    };

    //--------------------------------------------------------------------
    //  Public Interface -- Functions
    //--------------------------------------------------------------------
    pPublicApi.isSuperCharTablePopulated = function(pEntityId) {
        // Capture function parameters for later exception references.
        var funcParams = {
            pEntityId: pEntityId
        };

        if(!MuseUtils.isValidId(pEntityId)) {
            throw new MuseUtils.ParameterException(
                "musesuperchar",
                "We did not understand which entity you wanted to check for super characteristic population.",
                "MuseSuperChar.SuperChar.pPublicApi.isSuperCharTablePopulated",
                {params: funcParams});
        }
        
        try {
            return isSuperCharTablePopulated(pEntityId);
        } catch(e) {
            throw new MuseUtils.ApiException(
                "musesuperchar",
                "We failed to look up whether a super characteristic table had records or not.",
                "MuseSuperChar.SuperChar.pPublicApi.isSuperCharTablePopulated",
                {params: funcParams, thrownError: e});
        }
    };
    
})(this.MuseSuperChar.SuperChar);

    