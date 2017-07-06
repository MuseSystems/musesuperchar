/*************************************************************************
 *************************************************************************
 **
 ** File:         trig_a_id_manage_sc_entity_tables.sql
 ** Project:      Muse Systems Super Characteristics for xTuple ERP
 ** Author:       Steven C. Buttgereit
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

--
-- Manages the creation and dropping of entities which are valid for super
-- characteristics.
--

CREATE OR REPLACE FUNCTION musesuperchar.trig_a_id_manage_sc_entity_tables() 
    RETURNS trigger AS
        $BODY$
            DECLARE
                vEntityPkColmnName text;
                vEntityFkColmnName text;
                vEntityDataColmnName text;

                vEntityDefaultGroupId bigint;
            BEGIN

                -- If we're being called on a new record insert, we'll create
                -- an super characteristic table for the entity.  If we're called
                -- on delete we drop the table.
                IF TG_OP = 'INSERT' THEN

                    vEntityPkColmnName := NEW.entity_data_table || '_id';
                    vEntityFkColmnName := NEW.entity_data_table || '_' || NEW.entity_table || '_id';
                    vEntityDataColmnName := NEW.entity_data_table || '_data';

                    EXECUTE format('CREATE TABLE musesuperchar.%1$I ( ' ||
                        ' %2$I bigserial PRIMARY KEY ' ||
                        ',%3$I bigint NOT NULL REFERENCES %4$I.%5$I (%6$I) ' ||
                        $q$,%7$I jsonb NOT NULL DEFAULT '{}'::jsonb) $q$,
                        NEW.entity_data_table,vEntityPkColmnName,vEntityFkColmnName,
                        NEW.entity_schema, NEW.entity_table, NEW.entity_pk_column,
                        vEntityDataColmnName);
                    EXECUTE format('ALTER TABLE musesuperchar.%1$I OWNER TO admin',
                        NEW.entity_data_table);
                    EXECUTE format('REVOKE ALL ON TABLE musesuperchar.%1$I FROM public',
                        NEW.entity_data_table);
                    EXECUTE format('GRANT ALL ON TABLE musesuperchar.%1$I TO admin',
                        NEW.entity_data_table);
                    EXECUTE format('GRANT ALL ON TABLE musesuperchar.%1$I TO xtrole',
                        NEW.entity_data_table);

                    EXECUTE format('COMMENT ON TABLE musesuperchar.%1$I IS ' ||
                        '$DOC$A table holding super characteristic data for %2$s (%3$s) records.$DOC$',
                        NEW.entity_data_table, NEW.entity_display_name, 
                        NEW.entity_schema || '.' || NEW.entity_table);

                    EXECUTE format('COMMENT ON COLUMN musesuperchar.%1$I.%2$I IS ' ||
                        '$DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$',
                        NEW.entity_data_table, vEntityPkColmnName);

                    EXECUTE format('COMMENT ON COLUMN musesuperchar.%1$I.%2$I IS ' ||
                        '$DOC$A reference to the owning table/record to which these super characteristic values belong.$DOC$',
                        NEW.entity_data_table, vEntityFkColmnName);

                    EXECUTE format('COMMENT ON COLUMN musesuperchar.%1$I.%2$I IS ' ||
                        '$DOC$The super characteristic data.$DOC$',
                        NEW.entity_data_table, vEntityDataColmnName);

                    PERFORM musextputils.add_common_table_columns(   
                         'musesuperchar'
                        ,NEW.entity_data_table
                        ,NEW.entity_data_table || '_date_created'
                        ,NEW.entity_data_table || '_role_created'
                        ,NEW.entity_data_table || '_date_deactivated'
                        ,NEW.entity_data_table || '_role_deactivated' 
                        ,NEW.entity_data_table || '_date_modified'
                        ,NEW.entity_data_table || '_wallclock_modified'
                        ,NEW.entity_data_table || '_role_modified'
                        ,NEW.entity_data_table || '_row_version_number'
                        ,NEW.entity_data_table || '_is_active');

                    -- Now we check if we set up auditing on our newly created table.
                    IF musextputils.get_musemetric(  'musesuperchar'
                                       ,'isEntityMuseUtilsAuditingDefaulted'
                                       ,null::boolean) THEN 

                        PERFORM musextputils.add_table_auditing(
                            'musesuperchar', 
                            NEW.entity_data_table, 
                            vEntityPkColmnName,
                            musextputils.get_musemetric('musesuperchar'
                                ,'defaultEntityMuseUtilsAuditingEvents'
                                ,null::text[]));

                    END IF;

                    -- Now we return
                    RETURN NEW;
                
                ELSIF TG_OP = 'DELETE' THEN
                    -- Check to see if we have audit triggers applied.  If so,
                    -- we'll delete all records prior to dropping the table.
                    IF EXISTS(SELECT true 
                              FROM musextputils.v_catalog_triggers
                              WHERE     table_schema_name = 'musesuperchar'
                                    AND table_name = OLD.entity_data_table
                                    AND function_schema_name = 'musextputils'
                                    AND function_name = 'trig_a_iud_record_audit_logging') THEN 

                        EXECUTE format('DELETE FROM musesuperchar.%1$I',
                            OLD.entity_data_table);

                    END IF;

                    -- The table drop.
                    EXECUTE format('DROP TABLE musesuperchar.%1$I',
                            OLD.entity_data_table);

                    -- Now we return.
                    RETURN OLD;

                ELSE
                    RAISE EXCEPTION 
                        'The trigger was called on an invalid operation. (FUNC: musesuperchar.trig_a_id_manage_sc_entity_tables) (Operation: %)'
                        ,TG_OP;
                END IF; 

            END;
        $BODY$
    LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

ALTER FUNCTION musesuperchar.trig_a_id_manage_sc_entity_tables()
    OWNER TO admin;

REVOKE EXECUTE ON FUNCTION musesuperchar.trig_a_id_manage_sc_entity_tables() FROM public;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_id_manage_sc_entity_tables() TO admin;
GRANT EXECUTE ON FUNCTION musesuperchar.trig_a_id_manage_sc_entity_tables() TO xtrole;


COMMENT ON FUNCTION musesuperchar.trig_a_id_manage_sc_entity_tables() 
    IS $DOC$Manages the creation and dropping of entities which are valid for super characteristics.$DOC$;

-- Add the trigger to the target table(s).
DROP TRIGGER IF EXISTS a10_trig_a_id_manage_sc_entity_tables ON musesuperchar.entity;

CREATE TRIGGER a10_trig_a_id_manage_sc_entity_tables AFTER INSERT OR DELETE
    ON musesuperchar.entity FOR EACH ROW 
    EXECUTE PROCEDURE musesuperchar.trig_a_id_manage_sc_entity_tables();
                