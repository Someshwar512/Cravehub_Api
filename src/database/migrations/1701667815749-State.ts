
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';
import { DatabaseTables,Status } from '../../constant';

export class State1701667815749 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DatabaseTables.STATE,
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
            name: 'country_id',
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
      DatabaseTables.STATE,
      new TableForeignKey({
        columnNames: ['country_id'],
        referencedColumnNames: ['id'],
        referencedTableName: DatabaseTables.COUNTRY,
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // const table = await queryRunner.getTable(DatabaseTables.STATE);
    // const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('country_id') !== -1);
    // if (foreignKey) {
    //   await queryRunner.dropForeignKey(DatabaseTables.STATE, foreignKey);
    // }
    await queryRunner.dropTable(DatabaseTables.STATE);
  }
}
