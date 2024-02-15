
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";
import { DatabaseTables } from "../../constant";

export class OrderItems1705395450315 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
     
        await queryRunner.createTable(new Table({
            name:DatabaseTables.ORDER_ITEMS,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "order_id", type: "int" },
                { name: "dish_id", type: "int" },
                { name: "quantity", type: "int" },
                { name: "dish_price", type: "decimal", precision: 10, scale: 2 },
                { name: "created_on", type: "datetime", default: "CURRENT_TIMESTAMP" },
                { name: "updated_on", type: "datetime", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" },
            ],
        }), true);

        // Add foreign key constraint for order_id
        await queryRunner.createForeignKey(DatabaseTables.ORDER_ITEMS, new TableForeignKey({
            columnNames: ["order_id"],
            referencedColumnNames: ["id"],
            referencedTableName: DatabaseTables.ORDER_TABLE,
            onDelete: "CASCADE",
        }));

        // Add foreign key constraint for dish_id
        await queryRunner.createForeignKey(DatabaseTables.ORDER_ITEMS, new TableForeignKey({
            columnNames: ["dish_id"],
            referencedColumnNames: ["id"],
            referencedTableName: DatabaseTables.DISH,
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    
        await queryRunner.dropTable(DatabaseTables.ORDER_ITEMS);
    }
}

