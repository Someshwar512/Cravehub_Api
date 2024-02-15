import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";
import { DatabaseTables,AutoApplied ,DiscountType,Deleted_Status,Status} from "../../constant";


export class UpdateOfferTable1704692558884 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the existing "offer" table
        await queryRunner.dropTable(DatabaseTables.OFFER, true, true, true);

        // Create a new "offer" table with the added columns
        await queryRunner.createTable(new Table({
            name: DatabaseTables.OFFER,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "code", type: "varchar" },
                { name: "description", type: "text" },
                { name: "discount_type", type: "enum", 
                enum: Object.values(DiscountType)},
                { name: "discount", type: "decimal", precision: 10, scale: 2 },
                { name: "start_date", type: "datetime" },
                { name: "end_date", type: "datetime" },
                { name: "max_amount", type: "decimal", precision: 10, scale: 2 },
                { name: "min_amount", type: "decimal", precision: 10, scale: 2 },
                { name: "status", type: "enum",enum: Object.values(Status),default: `'${Status.ACTIVE}'`, },
                { name: "is_deleted", type: "enum", 
                enum: Object.values(Deleted_Status) },
                { name: "offer_zipcode_types_id", type: "int" },
                { name: "usage_limit", type: "int" },
                { name: "discount_reason", type: "text" },
                { name: "offer_type_id", type: "int" },
                { name: "offer_channel_id", type: "int" },
                { name: "auto_applied", type: "enum",
                 enum: Object.values(AutoApplied),default: `'${AutoApplied.FALSE}'`,},
                { name: "created_on", type: "datetime",default: "CURRENT_TIMESTAMP", },
                { name: "updated_on", type: "datetime",default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP", },
            ],
        }), true);

        // Add foreign key constraints
        await queryRunner.createForeignKey(DatabaseTables.OFFER, new TableForeignKey({
            columnNames: ["offer_zipcode_types_id"],
            referencedColumnNames: ["id"],
            referencedTableName: DatabaseTables.OFFER_ZIPCODE_TYPES,
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey(DatabaseTables.OFFER, new TableForeignKey({
            columnNames: ["offer_type_id"],
            referencedColumnNames: ["id"],
            referencedTableName: DatabaseTables.OFFER_TYPE,
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey(DatabaseTables.OFFER, new TableForeignKey({
            columnNames: ["offer_channel_id"],
            referencedColumnNames: ["id"],
            referencedTableName: DatabaseTables.OFFER_CHANNEL,
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the "offer" table
        await queryRunner.dropTable(DatabaseTables.OFFER, true, true, true);
    }

}

