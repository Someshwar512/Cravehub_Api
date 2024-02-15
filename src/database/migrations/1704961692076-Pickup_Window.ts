
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DatabaseTables } from '../../constant';

export class PickupWindow1704961692076 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: DatabaseTables.PICKUP_WINDOW,
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'window',
                        type: 'varchar',
                        length: '25', 
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
        await queryRunner.dropTable(DatabaseTables.PICKUP_WINDOW);
    }

}
