
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { DatabaseTables } from "../../constant";

export class Updatecolumn1703158194187 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const tables = [
            DatabaseTables.CUISINE,
            DatabaseTables.TAGS,
            DatabaseTables.CHEF_TAGS,
            DatabaseTables.CHEF_CUISINE,
            DatabaseTables.KITCHEN_PHOTOS,
            DatabaseTables.INGREDIENTS,
        ];

        // Loop through each table and add 'created_on' and 'updated_on' columns
        for (const tableName of tables) {
            await queryRunner.addColumn(
                tableName,
                new TableColumn({
                    name: "created_on",
                    type: "datetime",
                    default: "CURRENT_TIMESTAMP",
                })
            );

            await queryRunner.addColumn(
                tableName,
                new TableColumn({
                    name: "updated_on",
                    type: "datetime",
                    default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tables = [
            DatabaseTables.CUISINE,
            DatabaseTables.TAGS,
            DatabaseTables.CHEF_TAGS,
            DatabaseTables.CHEF_CUISINE,
            DatabaseTables.KITCHEN_PHOTOS,
            DatabaseTables.INGREDIENTS,
        ];

        // Loop through each table and drop 'created_on' and 'updated_on' columns
        for (const tableName of tables) {
            await queryRunner.dropColumn(tableName, "created_on");
            await queryRunner.dropColumn(tableName, "updated_on");
        }
    }
}
