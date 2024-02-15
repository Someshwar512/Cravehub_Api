// import { MigrationInterface, QueryRunner } from "typeorm"

// export class Undefined1706078111582 implements MigrationInterface {

//     public async up(queryRunner: QueryRunner): Promise<void> {
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//     }

// }

import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';
import { DatabaseTables } from '../../constant';

export class Undefined1706078111582 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add columns
    await queryRunner.addColumn(DatabaseTables.ORDER_TABLE, new TableColumn({
      name: 'cancelled_by',
      type: 'varchar',
      isNullable: true,
    }));

    await queryRunner.addColumn(DatabaseTables.ORDER_TABLE, new TableColumn({
      name: 'reason_of_cancellation',
      type: 'varchar',
      isNullable: true,
    }));

    await queryRunner.addColumn(DatabaseTables.ORDER_TABLE, new TableColumn({
      name: 'chef_id',
      type: 'int',
      isNullable: true,
    }));

    await queryRunner.addColumn(DatabaseTables.ORDER_TABLE, new TableColumn({
      name: 'user_address_id',
      type: 'int',
      isNullable: true,
    }));

    // Add foreign key constraints
    await queryRunner.createForeignKey(DatabaseTables.ORDER_TABLE, new TableForeignKey({
        columnNames: ['chef_id'],
        referencedColumnNames: ['id'],
        referencedTableName: DatabaseTables.USERS,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }));

    await queryRunner.createForeignKey(DatabaseTables.ORDER_TABLE, new TableForeignKey({
      columnNames: ['user_address_id'],
      referencedColumnNames: ['id'],
      referencedTableName: DatabaseTables.USER_ADDRESS,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
  
  }
}
