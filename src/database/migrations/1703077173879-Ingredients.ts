
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DatabaseTables } from '../../constant';

export class Ingredients1703077173879 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: DatabaseTables.INGREDIENTS,
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'name',
          type: 'varchar',
          length: '35',
        },
       
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(DatabaseTables.INGREDIENTS);
  }
}
