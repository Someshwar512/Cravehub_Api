import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";
import { DatabaseTables,AutoApplied ,DiscountType,Deleted_Status,Status} from "../../constant";


export class AddColumnsToOfferAndBanner1704719958713 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add column 'name' to the 'offer' table
        await queryRunner.addColumn(
            DatabaseTables.OFFER,
            new TableColumn({
                name: 'name',
                type: 'varchar',
                length: '255',
            }),
        );

        // Add column 'offer_id' and foreign key to the 'banner' table
        await queryRunner.addColumn(
            DatabaseTables.BANNER,
            new TableColumn({
                name: 'offer_id',
                type: 'int',
                isNullable: true,
            }),
        );

        await queryRunner.createForeignKey(
            DatabaseTables.BANNER,
            new TableForeignKey({
                columnNames: ['offer_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'offer',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key and column 'offer_id' from the 'banner' table
        await queryRunner.dropTable(DatabaseTables.BANNER);
    
        // Drop the entire 'offer' table
        await queryRunner.dropTable(DatabaseTables.OFFER);
    }
    

}
