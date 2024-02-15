
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { DatabaseTables,Deleted_Status } from "../../constant";
export class UpdateIsDeleted1703763307717 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            DatabaseTables.DISH,
            new TableColumn({
                name: "is_deleted",
                type: "enum",
                enum: Object.values(Deleted_Status),
                default: `'${Deleted_Status.NOT_DELETED}'`,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(DatabaseTables.DISH, 'is_deleted');
    }
}
