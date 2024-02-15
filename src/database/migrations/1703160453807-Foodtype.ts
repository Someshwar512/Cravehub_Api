
import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { DatabaseTables,Status } from "../../constant";

export class Foodtype1703160453807 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.FOODTYPE,
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
                    length:"35",
                },
                {
                    name: "status",
                    type: "enum",
                    enum: Object.values(Status),
                    default: `'${Status.ACTIVE}'`,
                  },
                {
                    name: "created_on",
                    type: "datetime",
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "updated_on",
                    type: "datetime",
                    default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DatabaseTables.FOODTYPE);
    }
}
