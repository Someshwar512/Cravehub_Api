
import { MigrationInterface, QueryRunner, Table,TableForeignKey } from 'typeorm';
import { DatabaseTables } from '../../constant';
export class DishDietary1703222871118 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DatabaseTables.DISH_DIETARY,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'dish_id',
            type: 'int',
          },
          {
            name: 'dietary_id',
            type: 'int',
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
      }),
      true
    );

    await queryRunner.createForeignKey(
      DatabaseTables.DISH_DIETARY,
      new TableForeignKey({
        columnNames: ['dish_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'dish', 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      DatabaseTables.DISH_DIETARY,
      new TableForeignKey({
        columnNames: ['dietary_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'dietary', 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
   
    await queryRunner.dropTable(DatabaseTables.DISH_DIETARY);
  }
}
