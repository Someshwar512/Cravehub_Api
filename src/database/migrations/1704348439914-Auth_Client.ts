import { MigrationInterface, QueryRunner,Table } from "typeorm"
import { Status } from "../../constant"
import { DeviceType } from "../../constant"
import { DatabaseTables } from "../../constant";
import { Deleted_Status } from "../../constant";
export class AuthClient1704348439914 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.AUTH_CLIENT,
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'app_id',
                    type: 'varchar',
                    length:"40"
                },
                {
                    name: 'app_secret',
                    type: 'varchar',
                    length:"40"
                },
                {
                    name: "platform",
                    type: "enum",
                     enum: Object.values(DeviceType),
                    // default: `'${DeviceType.ANDRIOD}'`,
                    isNullable:true,
                   
                  },

                {
                    name: "status",
                    type: "enum",
                    enum: Object.values(Status),
                    default: `'${Status.ACTIVE}'`,
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
        await queryRunner.dropTable(DatabaseTables.AUTH_CLIENT);
    }

}
