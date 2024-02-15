import { MigrationInterface, QueryRunner ,TableForeignKey} from "typeorm"
import { DatabaseTables } from "../../constant";

export class Updateuser1702458229054 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            DatabaseTables.USERS,
            new TableForeignKey({
              columnNames: ["membership_id"],
              referencedColumnNames: ["id"],
              referencedTableName: "membership", // Replace with the actual table name for membership
              onDelete: "CASCADE",
              onUpdate: "CASCADE",
              name: "FK_membership_user", // Provide a name for the foreign key constraint
            })
          );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(DatabaseTables.USERS, "FK_membership_user");
       
    }

}
