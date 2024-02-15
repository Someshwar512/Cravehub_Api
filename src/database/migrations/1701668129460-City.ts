

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { DatabaseTables,Status } from '../../constant';

export class City1701668129460 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DatabaseTables.CITY,
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
            length:"25"
          },
          {
            name: 'state_id',
            type: 'int',
          },
          {
            name: 'created_on',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_on',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: "status",
            type: "enum",
            enum: Object.values(Status),
            default: `'${Status.ACTIVE}'`,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      DatabaseTables.CITY,
      new TableForeignKey({
        columnNames: ['state_id'],
        referencedColumnNames: ['id'],
        referencedTableName: DatabaseTables.STATE,
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // const table = await queryRunner.getTable(DatabaseTables.CITY);
    // const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('state_id') !== -1);
    // if (foreignKey) {
    //   await queryRunner.dropForeignKey(DatabaseTables.CITY, foreignKey);
    // }
    await queryRunner.dropTable(DatabaseTables.CITY);
  }
}
