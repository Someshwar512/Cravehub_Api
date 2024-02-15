

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { DatabaseTables } from "../../constant";

export class Kitchen1702379311325 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.KITCHENS,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: false,
                    length:"25",
                },
                {
                    name: "description",
                    type: "text",
                    isNullable: true,
                    length:"255"
                },
                {
                    name: "address",
                    type: "varchar",
                    isNullable: true,
                    length:"100"
                },
                {
                    name: "zipcode_id",
                    type: "int",
                    
                },
                {
                    name: "latitude",
                    type: "float",
                    isNullable: true,
                },
                {
                    name: "longitude",
                    type: "float",
                    isNullable: true,
                },
                {
                    name: "chef_id",
                    type: "int",
                    
                },
                {
                    name: "chef_descriptions",
                    type: "text",
                    isNullable: false,
                    length:"200",
                },
                {
                    name: "food_pick_up_instructions",
                    type: "text",
                    isNullable: false,
                },
                {
                    name: "total_earnings",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: true,
                },
                {
                    name: "created_on",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "updated_on",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
                },
            ]
        }), true);

        await queryRunner.createForeignKey("Kitchen", new TableForeignKey({
            columnNames: ["zipcode_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "ZipCode",
            onDelete: "CASCADE",
            onUpdate:"CASCADE"
        }));

        await queryRunner.createForeignKey("Kitchen", new TableForeignKey({
            columnNames: ["chef_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
            onDelete: "CASCADE",
            onUpdate:"CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("Kitchen");
    }
}

