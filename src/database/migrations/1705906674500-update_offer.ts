// import { MigrationInterface, QueryRunner } from "typeorm"

// export class Undefined1705906674500 implements MigrationInterface {

//     public async up(queryRunner: QueryRunner): Promise<void> {
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//     }

// }

import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { DatabaseTables,Deleted_Status } from "../../constant";

export class UpdateOfferTable1705906674500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Assuming 'offer' is the name of your table and 'Delete' is the column name
        await queryRunner.changeColumn(DatabaseTables.OFFER, 'is_deleted', new TableColumn({
            name: 'is_deleted',
            type: 'enum',
            enum: Object.values(Deleted_Status),
                default: `'${Deleted_Status.NOT_DELETED}'`,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the changes if needed, for example:
        // await queryRunner.changeColumn('offer', 'Delete', new TableColumn({
        //     name: 'Delete',
        //     type: 'boolean',
        //     default: false, // Revert to the original default value
        // }));
    }

}
