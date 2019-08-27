-- File:        add_entity_data_table_unique_const.sql
-- Location:    /home/scb/source/products/xtuple/musesuperchar/database/misc
-- Project:     Muse Systems Super Characteristics for xTuple ERP
--
-- Licensed to Lima Buttgereit Holdings LLC (d/b/a Muse Systems) under one or
-- more agreements.  Muse Systems licenses this file to you under the Apache
-- License, Version 2.0.
--
-- See the LICENSE file in the project root for license terms and conditions.
-- See the NOTICE file in the project root for copyright ownership information.
--
-- muse.information@musesystems.com  :: https://muse.systems

DO
    $BODY$
        DECLARE
            vCurrEntity musesuperchar.entity;
            vEntityFkColmnName text;
            vEntityFkUnqCnstName text;
        BEGIN
            FOR vCurrEntity IN
                SELECT *
                FROM musesuperchar.entity
                    LEFT OUTER JOIN information_schema.table_constraints
                        ON  constraint_type = 'UNIQUE'
                            AND table_schema = 'musesuperchar'
                            AND table_name = entity_data_table
                WHERE constraint_name IS NULL
            LOOP
                vEntityFkColmnName := vCurrEntity.entity_data_table || '_' || vCurrEntity.entity_table || '_id';
                vEntityFkUnqCnstName := vCurrEntity.entity_data_table || '_' || vCurrEntity.entity_table || '_id_unq';

                EXECUTE format('ALTER TABLE musesuperchar.%1$I ADD CONSTRAINT %2$I UNIQUE (%3$I)',
                    vCurrEntity.entity_data_table, vEntityFkUnqCnstName, vEntityFkColmnName);
                EXECUTE format('COMMENT ON CONSTRAINT %1$I ON musesuperchar.%2$I IS $DOC$Enforces the one-to-one relationship between records in the the supercharacteristic entity data table and its parent entity table.$DOC$',
                    vEntityFkUnqCnstName, vCurrEntity.entity_data_table);
            END LOOP;
        END;
    $BODY$;
