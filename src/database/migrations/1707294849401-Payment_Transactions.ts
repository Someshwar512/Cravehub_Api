
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { DatabaseTables } from "../../constant";

export class PaymentTransactions1707294849401 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the PaymentTransactions table
        await queryRunner.createTable(new Table({
            name: DatabaseTables.PAYMENT_TRANSACTIONS,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "user_id",
                    type: "int"
                },
                {
                    name: "order_id",
                    type: "int"
                },
                {
                    name: "payment_method",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "status",
                    type: "varchar"
                },
                {
                    name: "razor_payment_id",
                    type: "varchar"
                },
                {
                    name: "razor_pay_order_id",
                    type: "varchar"
                },
                {
                    name: "created_on",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updated_on",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ],
            foreignKeys: [
                {
                    columnNames: ["user_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: DatabaseTables.USERS,
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                },
                {
                    columnNames: ["order_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: DatabaseTables.ORDER_TABLE,
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                }
            ]
        }));

        // Modify the order_table to make offer_code_id nullable
        await queryRunner.changeColumn(
            DatabaseTables.ORDER_TABLE,
            "offer_code_id",
            new TableColumn({
                name: "offer_code_id",
                type: "int",
                isNullable: true,
            })
        );
// add column order table
        await queryRunner.addColumn(
            DatabaseTables.ORDER_TABLE,
            new TableColumn({
                name: 'payment_status',
                type: 'varchar',
               isNullable:true,

            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the changes made in the up method
        await queryRunner.dropTable(DatabaseTables.PAYMENT_TRANSACTIONS);

        // Revert the changes made to the order_table
        await queryRunner.changeColumn(
            DatabaseTables.ORDER_TABLE,
            "offer_code_id",
            new TableColumn({
                name: "offer_code_id",
                type: "int",
                isNullable: false,
            })
        );
    }
}
