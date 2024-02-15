
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { DatabaseTables } from "../../constant";
export class DishIngredients1703162936425 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create junction table for dish_ingredients
        await queryRunner.createTable(new Table({
            name: DatabaseTables.DISH_INGREDIENTS,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "ingredients_id",
                    type: "int",
                },
                {
                    name: "dish_id",
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
        await queryRunner.createForeignKey(DatabaseTables.DISH_INGREDIENTS, new TableForeignKey({
            columnNames: ["ingredients_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "ingredients",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey(DatabaseTables.DISH_INGREDIENTS, new TableForeignKey({
            columnNames: ["dish_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "dish",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DatabaseTables.DISH_INGREDIENTS);
    }
}
