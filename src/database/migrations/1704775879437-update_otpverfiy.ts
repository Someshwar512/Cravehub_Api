
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { DatabaseTables } from "../../constant";
import { Status } from "../../constant";
export class UpdateOtpverfiy1704775879437 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            DatabaseTables.OTP_VERFIY,
            new TableColumn({
                name: "status",
                type: "enum",
                enum: Object.values(Status),
                default: `'${Status.ACTIVE}'`,

            })
        );

        await queryRunner.addColumn(
            DatabaseTables.DISH,
            new TableColumn({
                name: "status",
                type: "enum",
                enum: Object.values(Status),
                default: `'${Status.ACTIVE}'`,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(DatabaseTables.OTP_VERFIY, 'status');
        await queryRunner.dropColumn(DatabaseTables.DISH, 'status');
    }
}
