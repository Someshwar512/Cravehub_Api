import { MigrationInterface, QueryRunner,Table } from "typeorm"
import {DatabaseTables} from "../../constant";

export class Membership1702122661241 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
              name: DatabaseTables.MEMBERSHIP,
              columns: [
                {
                  name: "id",
                  type: "int",
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: "increment",
                },
                {
                  name: "name",
                  type: "varchar",
                  isNullable: false,
                  length:"25"
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
            }),
            true
          );
        }
      
        public async down(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.dropTable(DatabaseTables.MEMBERSHIP);
        }
      }
      
