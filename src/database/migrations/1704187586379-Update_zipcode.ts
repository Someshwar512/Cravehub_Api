
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { DatabaseTables,Deleted_Status } from "../../constant";
export class UpdateZipcode1704187586379 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            DatabaseTables.ZIPCODE,
            new TableColumn({
                name: "is_deleted",
                type: "enum",
                enum: Object.values(Deleted_Status),
                default: `'${Deleted_Status.NOT_DELETED}'`,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(DatabaseTables.ZIPCODE, 'is_deleted');
    }
}
