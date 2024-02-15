
import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { DatabaseTables } from "../../constant";
export class Cuisine1702884468122 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.CUISINE,
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
                    length: "35",
                    isNullable: false,
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DatabaseTables.CUISINE);
    }
}
