

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { DatabaseTables ,Status} from '../../constant';

export class Zipcodes1701668327597 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DatabaseTables.ZIPCODE,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'zipcode',
            type: 'varchar',
          },
          {
            name: 'city_id',
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
      DatabaseTables.ZIPCODE,
      new TableForeignKey({
        columnNames: ['city_id'],
        referencedColumnNames: ['id'],
        referencedTableName: DatabaseTables.CITY,
        onDelete: 'CASCADE',
        onUpdate:'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(DatabaseTables.ZIPCODE);
    // const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('city_id') !== -1);
    // if (foreignKey) {
    //   await queryRunner.dropForeignKey(DatabaseTables.ZIPCODE, foreignKey);
    // }
    await queryRunner.dropTable(DatabaseTables.ZIPCODE);
  }
}
