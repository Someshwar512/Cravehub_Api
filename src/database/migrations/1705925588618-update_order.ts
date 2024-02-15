import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { DatabaseTables, Deleted_Status,DeliveryPreference } from "../../constant";

export class UpdateOrder1705925588618 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns(
            DatabaseTables.ORDER_TABLE,
            [
                new TableColumn({
                    name: 'order_scheduled_date',
                    type: 'datetime',
                    isNullable: true,
                }),
                
                new TableColumn({
                    name: "delivery_preference",
                    type: "enum",
                    enum: Object.values(DeliveryPreference),
                    default: `'${DeliveryPreference.DELIVERY}'`,
                }),
            ]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DatabaseTables.ORDER_TABLE);
    }

}
