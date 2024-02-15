
import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";
import { DatabaseTables } from "../../constant";
export class DishUpdatecolumn1703227052499 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
     
        await queryRunner.dropColumn('Dish', 'portion_size');

        // Add the new 'portion_size_id' column
        await queryRunner.addColumn(
            DatabaseTables.DISH,
            new TableColumn({
                name: 'portion_size_id',
                type: 'int',
                isNullable: true, 
            }),
        );

        // Create foreign key constraint for 'portion_size_id' referencing 'portion_size' table
        await queryRunner.createForeignKey(
            DatabaseTables.DISH,
            new TableForeignKey({
                columnNames: ['portion_size_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'portion_size', 
                onDelete: 'CASCADE', 
                onUpdate: 'CASCADE', 
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the foreign key constraint
        await queryRunner.dropForeignKey('Dish', 'FK_Dish_PortionSize');

        // Drop the 'portion_size_id' column
        await queryRunner.dropColumn('Dish', 'portion_size_id');

        // Recreate the 'portion_size' column
        await queryRunner.addColumn(
            DatabaseTables.DISH,
            new TableColumn({
                name: 'portion_size',
                type: 'int',
                isNullable: true, // Modify based on your requirements
            }),
        );
    }
}

