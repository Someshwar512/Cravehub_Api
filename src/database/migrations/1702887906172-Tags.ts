
import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { DatabaseTables } from "../../constant";

export class Tags1702887906172 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.TAGS,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "tag_type",
                    type: "varchar",
                    length: "35",
                    isNullable: false,
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DatabaseTables.TAGS);
    }
}
