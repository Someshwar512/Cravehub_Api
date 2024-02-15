
import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import { DatabaseTables } from "../../constant";

export class ChefCuisine1703075514432 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.CHEF_CUISINE,
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'cuisine_id',
                    type: 'int'
                },
                {
                    name: 'chef_id',
                    type: 'int'
                }
            ]
        }));

        // Creating Foreign Keys
        await queryRunner.createForeignKey(DatabaseTables.CHEF_CUISINE, new TableForeignKey({
            columnNames: ['cuisine_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'cuisine',
            onDelete: 'CASCADE',
            onUpdate:'CASCADE',
        }));

        await queryRunner.createForeignKey(DatabaseTables.CHEF_CUISINE, new TableForeignKey({
            columnNames: ['chef_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
            onUpdate:'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Dropping Table
        await queryRunner.dropTable(DatabaseTables.CHEF_CUISINE);
    }
}
