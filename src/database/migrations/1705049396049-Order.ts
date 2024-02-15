import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { DatabaseTables, OrderStatus } from "../../constant";

export class Order1705049396049 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.ORDER_TABLE,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "user_id",
                    type: "int",
                  
                },
                {
                    name: "subtotal",
                    type: "decimal",
                    
                },
                {
                    name: "total_amount",
                    type: "decimal",
                   
                },
                {
                    name: "discount_amount",
                    type: "decimal",
                    
                },
                {
                    name: "offer_code_id",
                    type: "int",
                  
                },
                {
                    name: "order_status",
                    type: "enum",
                    enum: Object.values(OrderStatus),
                    default: `'${OrderStatus.INPROGRESS}'`,
                },
                {
                    name: "tax_amount",
                    type: "decimal",
                   
                },
                {
                    name: "delivery_fees",
                    type: "decimal",
                  
                },
                {
                    name: "pickupwindow_id",
                    type: "int",
                
                },
                {
                    name: "order_instruction",
                    type: "text",
                    isNullable: true,
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
            foreignKeys: [
                {
                    columnNames: ["user_id"],
                    referencedTableName: DatabaseTables.USERS,
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                },
                {
                    columnNames: ["offer_code_id"],
                    referencedTableName: DatabaseTables.OFFER,
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                },
                {
                    columnNames: ["pickupwindow_id"],
                    referencedTableName: DatabaseTables.PICKUP_WINDOW,
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DatabaseTables.ORDER_TABLE, true, true, true);
    }
}
