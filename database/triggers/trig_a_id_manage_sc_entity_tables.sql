/*************************************************************************
 *************************************************************************
 **
 ** File:         trig_a_id_manage_sc_entity_tables.sql
 ** Project:      Muse Systems xTuple Super Characteristics
 ** Author:       Steven C. Buttgereit
 **
 ** (C) 2017 Lima Buttgereit Holdings LLC d/b/a Muse Systems
 **
 ** Contact:
 ** muse.information@musesystems.com  :: https://muse.systems
 ** 
 ** Licensing restrictions apply.  Please refer to your Master Services
 ** Agreement or governing Statement of Work for complete terms and 
 ** conditions.
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
                vEntityTableName text;
                vEntityPkColmnName text;
                vEntityFkColmnName text;
                vEntityDataColmnName text;

                vEntityDefaultGroupId bigint;
            BEGIN

                -- If we're being called on a new record insert, we'll create
                -- an super characteristic table for the entity.  If we're called
                -- on delete we drop the table.
                IF TG_OP = 'INSERT' THEN

                    vEntityTableName := NEW.entity_schema || '_' || NEW.entity_table;
                    vEntityPkColmnName := vEntityTableName || '_id';
                    vEntityFkColmnName := vEntityTableName || '_' || NEW.entity_table || '_id';
                    vEntityDataColmnName := vEntityTableName || '_data';

                    EXECUTE format('CREATE TABLE musesuperchar.%1$I ( ' ||
                        ' %2$I bigserial PRIMARY KEY ' ||
                        ',%3$I bigint NOT NULL REFERENCES %4$I.%5$I (%6$I) ' ||
                        $q$,%7$I jsonb NOT NULL DEFAULT '{}'::jsonb) $q$,
                        vEntityTableName,vEntityPkColmnName,vEntityFkColmnName,
                        NEW.entity_schema, NEW.entity_table, NEW.entity_pk_column,
                        vEntityDataColmnName);
                    EXECUTE format('ALTER TABLE musesuperchar.%1$I OWNER TO admin',
                        vEntityTableName);
                    EXECUTE format('REVOKE ALL ON TABLE musesuperchar.%1$I FROM public',
                        vEntityTableName);
                    EXECUTE format('GRANT ALL ON TABLE musesuperchar.%1$I TO admin',
                        vEntityTableName);
                    EXECUTE format('GRANT ALL ON TABLE musesuperchar.%1$I TO xtrole',
                        vEntityTableName);

                    EXECUTE format('COMMENT ON TABLE musesuperchar.%1$I IS ' ||
                        '$DOC$A table holding super characteristic data for %2$s (%3$s) records.$DOC$',
                        vEntityTableName, NEW.entity_display_name, 
                        NEW.entity_schema || '.' || NEW.entity_table);

                    EXECUTE format('COMMENT ON COLUMN musesuperchar.%1$I.%2$I IS ' ||
                        '$DOC$A surrogate key by which to uniquely identify each record. This is the primary key.$DOC$',
                        vEntityTableName, vEntityPkColmnName);

                    EXECUTE format('COMMENT ON COLUMN musesuperchar.%1$I.%2$I IS ' ||
                        '$DOC$A reference to the owning table/record to which these super characteristic values belong.$DOC$',
                        vEntityTableName, vEntityFkColmnName);

                    EXECUTE format('COMMENT ON COLUMN musesuperchar.%1$I.%2$I IS ' ||
                        '$DOC$The super characteristic data.$DOC$',
                        vEntityTableName, vEntityDataColmnName);

                    PERFORM musextputils.add_common_table_columns(   
                         'musesuperchar'
                        ,vEntityTableName
                        ,vEntityTableName || '_date_created'
                        ,vEntityTableName || '_role_created'
                        ,vEntityTableName || '_date_deactivated'
                        ,vEntityTableName || '_role_deactivated' 
                        ,vEntityTableName || '_date_modified'
                        ,vEntityTableName || '_wallclock_modified'
                        ,vEntityTableName || '_role_modified'
                        ,vEntityTableName || '_row_version_number'
                        ,vEntityTableName || '_is_active');

                    -- Now we check if we set up auditing on our newly created table.
                    IF musextputils.get_musemetric(  'musesuperchar'
                                       ,'isEntityMuseUtilsAuditingDefaulted'
                                       ,null::boolean) THEN 

                        PERFORM musextputils.add_table_auditing(
                            'musesuperchar', 
                            vEntityTableName, 
                            vEntityPkColmnName,
                            musextputils.get_musemetric('musesuperchar'
                                ,'defaultEntityMuseUtilsAuditingEvents'
                                ,null::text[]));

                    END IF;

                    -- Next setup the default group for the entity.
                    -- First create the group and then do the assignment.  These
                    -- are system locked since we manage them with the entity.
                    INSERT INTO musesuperchar.sc_group (
                             sc_group_internal_name
                            ,sc_group_display_name
                            ,sc_group_description
                            ,sc_group_is_system_locked)
                        VALUES
                            (vEntityTableName ||'_mssc_dflt_grp'
                            ,NEW.entity_display_name ||' General'
                            ,'A general purpose group for characteristics assigned to the ' ||
                                NEW.entity_display_name ||' record type.'
                            ,true)
                        RETURNING sc_group_id INTO vEntityDefaultGroupId;

                    INSERT INTO musesuperchar.entity_sc_group_ass (
                             entity_sc_group_ass_entity_id
                            ,entity_sc_group_ass_sc_group_id
                            ,entity_sc_group_ass_is_system_locked)
                        VALUES 
                            (NEW.entity_id
                            ,vEntityDefaultGroupId
                            ,true);

                    -- Now we return
                    RETURN NEW;
                
                ELSIF TG_OP = 'DELETE' THEN

                    vEntityTableName := OLD.entity_schema || '_' || OLD.entity_table;;

                    -- Check to see if we have audit triggers applied.  If so,
                    -- we'll delete all records prior to dropping the table.
                    IF EXISTS(SELECT true 
                              FROM musextputils.v_catalog_triggers
                              WHERE     table_schema_name = 'musesuperchar'
                                    AND table_name = vEntityTableName
                                    AND function_schema_name = 'musextputils'
                                    AND function_name = 'trig_b_iu_audit_field_maintenance') THEN 

                        EXECUTE format('DELETE FROM musesuperchar.%1$I',
                            vEntityTableName);

                    END IF;

                    -- The table drop.
                    EXECUTE format('DROP TABLE musesuperchar.%1$I',
                            vEntityTableName);

                    -- Finally delete the default group and related entity/group
                    -- assignments.
                    DELETE FROM musesuperchar.entity_sc_group_ass
                        WHERE entity_sc_group_ass_entity_id = OLD.entity_id;

                    DELETE FROM musesuperchar.sc_group 
                        WHERE sc_group_internal_name = 
                                vEntityTableName || '_mssc_dflt_grp';

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
