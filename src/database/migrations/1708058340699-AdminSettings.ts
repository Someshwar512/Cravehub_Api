import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { DatabaseTables } from "../../constant";

export class AdminSettings1708058340699 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.ADMIN_SETTINGS,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "fb_link",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "instagram_link",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "delivery_charges",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: true,
                },
                {
                    name: "tax",
                    type: "decimal",
                    precision: 5, 
                    scale: 2,
                    isNullable: true,
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DatabaseTables.ADMIN_SETTINGS);
    }
}
