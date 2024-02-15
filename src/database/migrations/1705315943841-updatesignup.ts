
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { DatabaseTables, Food_Type } from '../../constant';

export class Updatesignup1705315943841 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            DatabaseTables.USERS,
            new TableColumn({
                name: 'food_type',
                type: 'enum',
                enum: Object.values(Food_Type),
               isNullable:true,

            })
        );

      
        await queryRunner.changeColumn(
            DatabaseTables.REVIEWS,
            'rating',
            new TableColumn({
                name: 'rating',
                type: 'double',
            })
        );

  
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      
        await queryRunner.dropColumn(DatabaseTables.USERS, 'menu');
     
    }
}
