

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { DatabaseTables } from '../../constant';

export class UserAddress1701672447230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DatabaseTables.USER_ADDRESS,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'address_line_1',
            type: 'varchar',
            length:"255",
          },
          {
            name: 'address_line_2',
            type: 'varchar',
            length:"255",

          },
          {
            name: 'latitude',
            type: 'float',
            isNullable:true,
         

          },
          {
            name: 'longitude',
            type: 'float',
            isNullable:true,
         
          },
          {
            name: 'zipcode_id',
            type: 'int',
          },
          {
            name: 'user_id',
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
          
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      DatabaseTables.USER_ADDRESS,
      new TableForeignKey({
        columnNames: ['zipcode_id'],
        referencedColumnNames: ['id'],
        referencedTableName: DatabaseTables.ZIPCODE,
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      DatabaseTables.USER_ADDRESS,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: DatabaseTables.USERS,
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    var table = await queryRunner.getTable(DatabaseTables.USER_ADDRESS);
    // var foreignKeyZip = table.foreignKeys.find(fk => fk.columnNames.indexOf('zipcode_id') !== -1);
    // var foreignKeyUser = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);

    // if (foreignKeyZip) {
    //   await queryRunner.dropForeignKey(DatabaseTables.USER_ADDRESS, foreignKeyZip);
    // }

    // if (foreignKeyUser) {
    //   await queryRunner.dropForeignKey(DatabaseTables.USER_ADDRESS, foreignKeyUser);
    // }

    await queryRunner.dropTable(DatabaseTables.USER_ADDRESS);
  }
}
