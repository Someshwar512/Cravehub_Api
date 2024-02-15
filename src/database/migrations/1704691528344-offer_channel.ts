import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { DatabaseTables,Status } from "../../constant";


export class CreateOfferTables1704691528344 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create offer_zipcode_types table
        await queryRunner.createTable(new Table({
            name: DatabaseTables.OFFER_ZIPCODE_TYPES,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "name", type: "varchar", length: "35" },
                {
                    name: "status",
                    type: "enum",
                    enum: Object.values(Status),
                    default: `'${Status.ACTIVE}'`,
                  },{
                    name: "created_on",
                    type: "datetime",
                    default: "CURRENT_TIMESTAMP",
                  },
                  {
                    name: "updated_on",
                    type: "datetime",
                    default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
                  },            ],
        }), true);

        // Create offer_type table
        await queryRunner.createTable(new Table({
            name: DatabaseTables.OFFER_TYPE,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "name", type: "varchar", length: "35" },{
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
        }), true);

        // Create offer_channel table
        await queryRunner.createTable(new Table({
            name: DatabaseTables.OFFER_CHANNEL,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "name", type: "varchar", length: "35" },
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
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order to avoid foreign key constraints issues
        await queryRunner.dropTable("offer_channel", true, true, true);
        await queryRunner.dropTable("offer_type", true, true, true);
        await queryRunner.dropTable("offer_zipcode_types", true, true, true);
    }

}
