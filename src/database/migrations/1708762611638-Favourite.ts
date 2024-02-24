import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import { DatabaseTables } from "../../constant";

export class CreateFavouritesTable1708762611638 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.FAVOURITES,
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
                    name: "dish_id",
                    type: "int"
                },
                {
                    name: "type",
                    type: "varchar"
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
            ]
        }), true);

        // Add foreign keys
        await queryRunner.createForeignKey(DatabaseTables.FAVOURITES, new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: DatabaseTables.USERS,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));

        await queryRunner.createForeignKey(DatabaseTables.FAVOURITES, new TableForeignKey({
            columnNames: ["dish_id"],
            referencedColumnNames: ["id"],
            referencedTableName: DatabaseTables.DISH,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropTable(DatabaseTables.FAVOURITES);
    }

}
