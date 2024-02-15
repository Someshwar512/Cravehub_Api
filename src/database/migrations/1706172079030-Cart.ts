
import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { DatabaseTables } from "../../constant";

export class Cart1706172079030 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.CART,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "user_Id",
                    type: "int"
                },
                {
                    name: "dish_id",
                    type: "int"
                },
                {
                    name: "total_quantity",
                    type: "int"
                },
                {
                    name: "total_price",
                    type: "decimal", 
                    precision: 10,
                     scale: 2,
                     isNullable: true
                },
                {
                    name: "delivery_date",
                    type: "date"
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
                    columnNames: ["user_Id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: DatabaseTables.USERS,
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                },
                {
                    columnNames: ["dish_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: DatabaseTables.DISH,
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DatabaseTables.CART);
    }
}
