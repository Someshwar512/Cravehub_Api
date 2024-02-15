
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { DatabaseTables } from "../../constant";
export class Dish1703161892901 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.DISH,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "foodtype_id",
                    type: "int",
                },
                {
                    name: "name",
                    type: "varchar",
                    length:"25"
                },
                {
                    name: "chef_id",
                    type: "int",
                },
                {
                    name: "cuisine_id",
                    type: "int",
                },
                {
                    name: "dish_description",
                    type: "text",
                },
                {
                    name: "dish_price",
                    type: "decimal",
                },
                {
                    name: "chef_price",
                    type: "decimal",
                    isNullable:true,
                },
                {
                    name: "wannaeat_price",
                    type: "decimal",
                    isNullable:true,
                },
                {
                    name: "preparation_time",
                    type: "int",
                },
                {
                    name: "image_url",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "portion_size",
                    type: "int",
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

        // Adding Foreign Keys
        await queryRunner.createForeignKey(DatabaseTables.DISH, new TableForeignKey({
            columnNames: ["foodtype_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "foodtype",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey(DatabaseTables.DISH, new TableForeignKey({
            columnNames: ["chef_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey(DatabaseTables.DISH, new TableForeignKey({
            columnNames: ["cuisine_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "cuisine",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DatabaseTables.DISH);
    }
}
