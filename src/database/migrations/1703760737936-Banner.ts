import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { DatabaseTables, Deleted_Status, BannerType} from "../../constant";

export class Banner1703760737936 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.BANNER,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "image_url",
                    type: "varchar",
                    isNullable:true,
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "25",
                },
                {
                    name: "start_date",
                    type: "datetime",
                },
                {
                    name: "end_date",
                    type: "datetime",
                },
                {
                    name: "description",
                    type: "text",
                },
                {
                    name: "type",
                    type: "enum",
                    enum: Object.values(BannerType),
                    default: `'${BannerType.MARKETING}'`,
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
        await queryRunner.dropTable(DatabaseTables.BANNER);
    }
}
