
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { DatabaseTables } from '../../constant';
export class ChefTags1702958782548 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ChefTag table
    await queryRunner.createTable(new Table({
      name: DatabaseTables.CHEF_TAGS,
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'tag_id',
          type: 'int',
        },
        {
          name: 'chef_id',
          type: 'int',
        },
      ],
    }), true);

    // Define foreign key for tag_id
    await queryRunner.createForeignKey('chef_tag', new TableForeignKey({
      columnNames: ['tag_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'tags', // Name of the Tag table
      onDelete: 'CASCADE', // Define the behavior on deletion if needed
      onUpdate:'CASCADE',
    }));

    // Define foreign key for chef_id
    await queryRunner.createForeignKey('chef_tag', new TableForeignKey({
      columnNames: ['chef_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'user', // Name of the User table
      onDelete: 'CASCADE', // Define the behavior on deletion if needed
      onUpdate:'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(DatabaseTables.CHEF_TAGS);
  }
}
