
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';
import { DatabaseTables, OtpUse } from '../../constant';

export class OtpVerfiy1704456664923 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DatabaseTables.OTP_VERFIY,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'otp',
            type: 'varchar',
          },
          {
            name: 'is_used',
            type: 'enum',
            enum: Object.values(OtpUse),
            default: `'${OtpUse.NOT_USED}'`,
           
          },
          {
            name: 'expired_on',
            type: 'timestamp',
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
        ],
      })
    );

    await queryRunner.createForeignKey(
      DatabaseTables.OTP_VERFIY,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(DatabaseTables.OTP_VERFIY);
  }
}


