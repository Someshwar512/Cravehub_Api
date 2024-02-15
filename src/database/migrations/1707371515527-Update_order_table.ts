

import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { DatabaseTables, PaymentStatus } from "../../constant";

export class UpdateOrderTable1707371515527 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the existing payment_status column
        await queryRunner.dropColumn(DatabaseTables.ORDER_TABLE, "payment_status");

        // Create a new payment_status column with default value CREATED
        await queryRunner.addColumn(DatabaseTables.ORDER_TABLE, new TableColumn({
            name: "payment_status",
            type: "enum",
            enum: Object.values(PaymentStatus),
            default: `'${PaymentStatus.CREATED}'`,
           
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the new payment_status column
        await queryRunner.dropColumn(DatabaseTables.ORDER_ITEMS, "payment_status");

        // Recreate the old payment_status column
        await queryRunner.addColumn(DatabaseTables.ORDER_TABLE, new TableColumn({
            name: "payment_status",
            type: "varchar",
            isNullable: true,
        }));
    }

}
