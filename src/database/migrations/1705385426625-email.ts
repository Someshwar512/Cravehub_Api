import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { DatabaseTables } from '../../constant';
import { Status ,Deleted_Status} from "../../constant";

export class Email1705385426625 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add any migration steps for the 'up' direction
        await queryRunner.createTable(new Table({
            name: DatabaseTables.EMAIL_TEMPLATE,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "title",
                    type: "varchar",
                    length: '25', 

                },
                {
                    name: "slug",
                    type: "varchar",
                    length: '25', 

                },
                {
                    name: "subject",
                    type: "varchar",
                    length: '100', 

                },
                {
                    name: "content",
                    type: "text",
                },
                {
                    name: "status",
                    type: "enum",
                enum: Object.values(Status),
                default: `'${Status.ACTIVE}'`,
                },
                {
                    name: "created_on",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "updated_on",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                },
                {
                    name: "is_deleted",
                    type: "enum",
                    enum: Object.values(Deleted_Status),
                    default: `'${Deleted_Status.NOT_DELETED}'`,
                  },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add any migration steps for the 'down' direction
        await queryRunner.dropTable(DatabaseTables.EMAIL_TEMPLATE);
    }
}
