
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { DatabaseTables } from "../../constant"; // Import your constant file if needed

export class KitchenPhotos1702883872189 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.KITCHEN_PHOTOS,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "image_url",
                    type: "varchar",
                    isNullable: true,
                    length:"255",
                },
                {
                    name: "kitchen_id",
                    type: "int",
                    isNullable: false,
                },
            ],
        }), true);

        await queryRunner.createForeignKey(DatabaseTables.KITCHEN_PHOTOS, new TableForeignKey({
            columnNames: ["kitchen_id"],
            referencedColumnNames: ["id"],
            referencedTableName: DatabaseTables.KITCHENS,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(DatabaseTables.KITCHEN_PHOTOS, "kitchen_id");
        await queryRunner.dropTable(DatabaseTables.KITCHEN_PHOTOS);
    }
}
