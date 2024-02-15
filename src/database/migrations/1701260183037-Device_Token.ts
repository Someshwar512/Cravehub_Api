// import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
// import { DatabaseTables, Status,DeviceType } from "../../constant";

// export class DeviceToken1701260183037 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createTable(
//       new Table({
//         name: DatabaseTables.DEVICE_TOKEN,
//         columns: [
//           {
//             name: "id",
//             type: "int",
//             isPrimary: true,
//             isGenerated: true,
//             generationStrategy: "increment",
//           },
//           {
//             name: "token",
//             type: "varchar",
//             isUnique: true,
//             isNullable: false,
//             length:"255"
            
//           },
//           {
//             name: "status",
//             type: "enum",
//             enum: Object.values(Status),
//             default: `'${Status.ACTIVE}'`,
//           },
//           {
//             name: "device_type",
//             type: "enum",
//              enum: Object.values(DeviceType),
//             // default: `'${DeviceType.ANDRIOD}'`,
//             isNullable:true,
           
//           },
//           {
//             name: "user_id",
//             type: "int",
//             isNullable: true,
//           },
//           {
//             name: "created_at",
//             type: "timestamp",
//             default: "CURRENT_TIMESTAMP",
//           },
//           {
//             name: "updated_on",
//             type: "datetime",
//             default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
//           },
//         ],
//       }),
//       true
//     );

//     await queryRunner.createForeignKey(
//       DatabaseTables.DEVICE_TOKEN,
//       new TableForeignKey({
//         columnNames: ["user_id"],
//         referencedColumnNames: ["id"],
//         referencedTableName: "user", // Please replace with your actual table name for users
//         onDelete: "CASCADE",
//         onUpdate: "CASCADE",
//         name: "FK_device_token_user", // Provide a name for the foreign key constraint
//       })
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropForeignKey(DatabaseTables.DEVICE_TOKEN, "FK_device_token_user");
//     await queryRunner.dropTable(DatabaseTables.DEVICE_TOKEN);
//   }
// }
