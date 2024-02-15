import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { DatabaseTables, Roles, Deleted_Status, Status,UserVerfiy } from "../../constant";

export class User1701259781979 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DatabaseTables.USERS,
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "first_name",
            type: "varchar",
            isNullable: false,
            length:"25"
          },
          {
            name: "last_name",
            type: "varchar",
            isNullable: false,
            length:"25"
          },
          {
            name: "email",
            type: "varchar",
            isUnique: true,
            isNullable: false,
            length:"25"
          },
          {
            name: "phone",
            type: "varchar",
            isUnique: true,
            isNullable: false,
            length:"25"
          },
          {
            name: "password",
            type: "varchar",
            isNullable: true,
            length:"255"
          },
          {
            name: "role",
            type: "enum",
            enum: Object.values(Roles),
            default: `'${Roles.USER}'`,
          },
          {
            name: "image_url",
            type: "varchar",
            isNullable: true,
            length:"255"
          },
          {
            name: "status",
            type: "enum",
            enum: Object.values(Status),
            default: `'${Status.ACTIVE}'`,
          },
          {
            name: "is_verified",
            type: "enum",
            enum: Object.values(UserVerfiy),
            default: `'${UserVerfiy.NOT_VERFIED}'`,
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
          {
            name: "membership_id",
            type: "int",
            isNullable: true,
          },
        
        ],
      }),
      true
    );

  
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
 
    await queryRunner.dropTable(DatabaseTables.USERS);
  }
}
