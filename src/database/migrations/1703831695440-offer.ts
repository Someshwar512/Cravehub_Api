import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { DatabaseTables, Deleted_Status,Status } from "../../constant";

export class Offer1703831695440 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.OFFER,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "code",
                    type: "varchar",
                },
                {
                    name: "description",
                    type: "varchar",
                },
                {
                    name: "discount_percentage",
                    type: "decimal",
                },
                {
                    name: "flat_discount",
                    type: "decimal",
                },
                {
                    name: "start_date",
                    type: "datetime",
                },
                {
                    name: "end_date",
                    type: "datetime",
                },
                {
                    name: "status",
                    type: "enum",
                    enum: Object.values(Status),
                    default: `'${Status.ACTIVE}'`,
                },
                {
                    name: "is_deleted",
                    type: "enum",
                    enum: Object.values(Deleted_Status),
                    default: `'${Deleted_Status.NOT_DELETED}'`,
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
        await queryRunner.dropTable(DatabaseTables.OFFER);
    }

}
