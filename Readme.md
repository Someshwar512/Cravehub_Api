
Setup
Install the dependencies: yarn install
Copy the .env file 
Install the dependencies: yarn install
Run the migrations: yarn migrate
Boot the server: yarn start

To create a new migration, run the following command:
yarn migration:create <migration-name> for example: yarn migration:create create_users_table

To revert the last executed migration, run the following command: yarn migration:revert

Available scripts
typeorm: Runs the TypeORM CLI with the data-source.ts file.
migration:show: Shows all the executed migrations.
migration:create: Creates a new migration. You need to provide a name for the migration. Example: yarn migration:create create_users_table.
migration:run: Runs all pending migrations.
migration:revert: Reverts the last executed migration.