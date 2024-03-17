import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
// import { Author } from "./entities/Author";
// import { Book } from "./entities/Book";
import { User } from "./entities/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
 
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "root123",
  database: process.env.DB_DATABASE || "wannaeat_new",

   logging: ["query"],
  synchronize: false,
  subscribers: [],
  entities: ["src/database/entities/*.ts"],
  migrations: ["src/database/migrations/*.ts"], 
  
});
