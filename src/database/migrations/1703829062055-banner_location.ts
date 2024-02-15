import { MigrationInterface, QueryRunner, Table,TableForeignKey } from 'typeorm';
import { DatabaseTables } from '../../constant';

export class BannerLocation1703829062055 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: DatabaseTables.BANNER_ZIPCODE,
            columns: [
              {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'banner_id',
                type: 'int',
              },
              {
                name: 'zipcode_id',
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
          DatabaseTables.BANNER_ZIPCODE,
          new TableForeignKey({
            columnNames: ['banner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'banner', 
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          })
        );
    
        await queryRunner.createForeignKey(
          DatabaseTables.BANNER_ZIPCODE,
          new TableForeignKey({
            columnNames: ['zipcode_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'zipcode', 
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          })
        );
      }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DatabaseTables.BANNER_ZIPCODE);
    }

}
