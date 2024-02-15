
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DatabaseTables, UpdateType } from '../../constant';
import { Status } from '../../constant';
import { DeviceType } from '../../constant';
import { Deleted_Status } from '../../constant';
export class AppVersions1704347185049 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.APP_VERSIONS,
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'version_number',
                    type: 'varchar',
                },
                {
                    name: "status",
                    type: "enum",
                    enum: Object.values(Status),
                    default: `'${Status.ACTIVE}'`,
                  },
                  {
                    name: "platform",
                    type: "enum",
                     enum: Object.values(DeviceType),
                    // default: `'${DeviceType.ANDRIOD}'`,
                    isNullable:true,
                   
                  },
                {
                    name: 'update_type',
                    type: 'enum',
                   enum:Object.values(UpdateType),
                //  default: `'${UpdateType.OPTIONAL}'`,
                },
                {
                    name: "is_deleted",
                    type: "enum",
                    enum: Object.values(Deleted_Status),
                    default: `'${Deleted_Status.NOT_DELETED}'`,
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
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('app_versions');
    }

}
