/*************************************************************************
 *************************************************************************
 **
 ** File:         trig_a_d_entitypkg_manage_entity_syslock.sql
 ** Project:      Muse Systems Super Characteristics for xTuple ERP
 ** Author:       Steven C. Buttgereit
 **
 ** (C) 2017-2018 Lima Buttgereit Holdings LLC d/b/a Muse Systems
 **
 ** Contact:
 ** muse.information@musesystems.com  :: https://muse.systems
 **
 ************************************************************************/

--
-- When the last managing package is deleted, set the related entity record to
-- being not system locked.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_a_d_entitypkg_manage_entity_syslock()
    RETURNS trigger AS
        $BODY$
            DECLARE

            BEGIN

                IF NOT EXISTS (SELECT   true
                                FROM    musesuperchar.entitypkg
                                WHERE   entitypkg_entity_id =
                                            OLD.entitypkg_entity_id
                                    AND entitypkg_id !=
                                            OLD.entitypkg_id) THEN
                    -- If we don't have any more managing packages, set the
                    -- system lock to be not locked so the user can manage.
                    UPDATE musesuperchar.entity
                        SET entity_is_system_locked = false
                        WHERE entity_is_system_locked
                            AND entity_id = OLD.entitypkg_entity_id;

                END IF;

                RETURN OLD;

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

ALTER FUNCTION musesuperchar.trig_a_d_entitypkg_manage_entity_syslock()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_a_d_entitypkg_manage_entity_syslock() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_d_entitypkg_manage_entity_syslock() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_d_entitypkg_manage_entity_syslock() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_a_d_entitypkg_manage_entity_syslock()
    IS $DOC$When the last managing package is deleted, set the related entity record to being not system locked.$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS
    a10_trig_a_d_entitypkg_manage_entity_syslock
    ON musesuperchar.entitypkg;

CREATE TRIGGER a10_trig_a_d_entitypkg_manage_entity_syslock
    AFTER DELETE
    ON musesuperchar.entitypkg FOR EACH ROW
    EXECUTE PROCEDURE musesuperchar.trig_a_d_entitypkg_manage_entity_syslock();