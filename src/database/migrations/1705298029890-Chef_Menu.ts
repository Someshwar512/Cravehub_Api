
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { DatabaseTables } from '../../constant';

export class ChefMenu1705298029890 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.CHEF_MENU,
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'servings',
                    type: 'int',
                },
                {
                    name: 'user_id',
                    type: 'int',
                },
                {
                    name: 'dish_id',
                    type: 'int',
                },
                {
                    name: 'window_id',
                    type: 'int',
                },
                {
                    name: 'orderby_date',
                    type: 'date',
                },
                {
                    name: 'orderby_time',
                    type: 'time',
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
        }), true);

        // Adding foreign keys
        await queryRunner.createForeignKey(DatabaseTables.CHEF_MENU, new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: DatabaseTables.USERS,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate:'CASCADE',
        }));

        await queryRunner.createForeignKey(DatabaseTables.CHEF_MENU, new TableForeignKey({
            columnNames: ['dish_id'],
            referencedTableName:DatabaseTables.DISH,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate:'CASCADE',
        }));

        await queryRunner.createForeignKey(DatabaseTables.CHEF_MENU, new TableForeignKey({
            columnNames: ['window_id'],
            referencedTableName: DatabaseTables.PICKUP_WINDOW,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate:'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop table
        await queryRunner.dropTable(DatabaseTables.CHEF_MENU);
    }
}
