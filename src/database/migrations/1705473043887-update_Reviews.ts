import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';
import { DatabaseTables } from '../../constant';

export class UpdateReviews1705473043887 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add dish_id column to reviews table
    await queryRunner.addColumn(DatabaseTables.REVIEWS, new TableColumn({
      name: 'dish_id',
      type: 'int',
      isNullable: true,
    }));

    // Add foreign key constraint for dish_id
    await queryRunner.createForeignKey(DatabaseTables.REVIEWS, new TableForeignKey({
      columnNames: ['dish_id'],
      referencedColumnNames: ['id'],
      referencedTableName: DatabaseTables.DISH,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }));

    // Modify column name user_id to chef_id
    await queryRunner.changeColumn(DatabaseTables.REVIEWS, 'user_id', new TableColumn({
      name: 'chef_id',
      type: 'int',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint for dish_id
    await queryRunner.dropForeignKey(DatabaseTables.REVIEWS, 'FK_3430d672177b304cf4916eaddfd');

    // Drop the dish_id column from the reviews table
    await queryRunner.dropColumn(DatabaseTables.REVIEWS, 'dish_id');

    // Revert column name chef_id to user_id
    await queryRunner.changeColumn(DatabaseTables.REVIEWS, 'chef_id', new TableColumn({
      name: 'user_id',
      type: 'int',
      isNullable: true,
    }));
  }
}
