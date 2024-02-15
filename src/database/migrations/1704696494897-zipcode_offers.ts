import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { DatabaseTables,AutoApplied ,DiscountType,Deleted_Status,Status} from "../../constant";


export class ZipcodeOffers1704696494897 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the "zipcode_offers" table
        await queryRunner.createTable(new Table({
            name: DatabaseTables.ZIPCODE_OFFERS,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "zipcode_id", type: "int" },
                { name: "offer_id", type: "int" },
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

        // Add foreign key constraints
        await queryRunner.createForeignKey("zipcode_offers", new TableForeignKey({
            columnNames: ["zipcode_id"],
            referencedColumnNames: ["id"],
            referencedTableName: DatabaseTables.ZIPCODE,
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("zipcode_offers", new TableForeignKey({
            columnNames: ["offer_id"],
            referencedColumnNames: ["id"],
            referencedTableName: DatabaseTables.OFFER, 
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the "zipcode_offers" table
        await queryRunner.dropTable(DatabaseTables.ZIPCODE_OFFERS, true, true, true);
    }

}
