
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { DatabaseTables, Status,DeviceType } from "../../constant";

export class AuthToken1704432281745 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DatabaseTables.AUTH_TOKEN,
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "access_token",
            type: "varchar",
            isUnique: true,
            isNullable: false,
            length:"255"
            
          },
          {
            name: "status",
            type: "enum",
            enum: Object.values(Status),
            default: `'${Status.ACTIVE}'`,
          },
          {
            name: "device_type",
            type: "enum",
             enum: Object.values(DeviceType),
            // default: `'${DeviceType.ANDRIOD}'`,
            isNullable:true,
           
          },
          {
            name: "user_id",
            type: "int",
            isNullable: true,
          },
          {
            name:"auth_client_id",
            type:"int",
            isNullable: true,

          },
          {
            name: 'device_token', 
            type: 'varchar',
             isNullable: true,
        },
        {
            name: 'access_token_expire_on',
            type: 'datetime',
            isNullable: true,
        },
        {
            name: 'refresh_token_expire_on',
            type: 'datetime',
            isNullable: true,
        },
        {
            name: 'uuid',
            type: 'varchar',
            isNullable: true,
        },
        {
            name: 'device_unique_id',
            type: 'varchar',
            isNullable: true,
        },
        {
            name: 'refresh_token', 
            type: 'varchar',
             isNullable: true,
        },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_on",
            type: "datetime",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      DatabaseTables.AUTH_TOKEN,
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "user", 
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        
      })
    );

     //  add foregn key auth_client
     await queryRunner.createForeignKey(
        DatabaseTables.AUTH_TOKEN,
        new TableForeignKey({
            columnNames: ['auth_client_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'auth_client',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
   
    await queryRunner.dropTable(DatabaseTables.AUTH_TOKEN);
  }
}

