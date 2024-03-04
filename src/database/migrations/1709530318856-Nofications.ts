import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import { DatabaseTables } from "../../constant";

export class CreateNotificationsTable1709530318856 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.createTable(new Table({
            name: DatabaseTables.NOTIFICATIONS,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "user_id",
                    type: "int"
                },
                {
                    name: "title",
                    type: "varchar"
                },
                {
                    name: "content",
                    type: "text"
                }
            ]
        }), true);

        // Creating foreign key constraint
        await queryRunner.createForeignKey("notifications", new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: DatabaseTables.USERS,
            onDelete: "CASCADE",
            onUpdate:"CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the "notifications" table
        await queryRunner.dropTable(DatabaseTables.NOTIFICATIONS);
    }

}
