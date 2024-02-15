
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DatabaseTables } from '../../constant';
export class Dietary1703222658435 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DatabaseTables.DIETARY,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'type',
            type: 'varchar',
            length:"35",
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(DatabaseTables.DIETARY);
  }
}
