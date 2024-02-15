// Reviews1705051636119.ts
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { DatabaseTables, Reviews_Type } from '../../constant';

export class Reviews1705051636119 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: DatabaseTables.REVIEWS,
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'user_id',
                    type: 'int'
                },
                {
                    name: 'order_id',
                    type: 'int'
                },
                {
                    name: 'rating',
                    type: 'int',
                },
                {
                    name: 'comment',
                    type: 'text',
                    isNullable: true
                },
                
                {
                    name: 'type',
                    type: "enum",
                    enum: Object.values(Reviews_Type),
                    // default: `'${Reviews_Type.DISH}'`,
                },
                { name: 'created_on', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_on', type: 'datetime', default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
            ],
            foreignKeys: [
                new TableForeignKey({
                    columnNames: ['user_id'],
                    referencedTableName: DatabaseTables.USERS,
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                }),
                new TableForeignKey({
                    columnNames: ['order_id'],
                    referencedTableName: DatabaseTables.ORDER_TABLE,
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                }),
            ],
            checks: [
                { columnNames: ['rating'], expression: '(rating >= 1 AND rating <= 5)' },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DatabaseTables.REVIEWS, true, true, true);
    }
}
