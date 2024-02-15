import * as dotenv from "dotenv";
import "reflect-metadata";

import app from "./app";
import { AppDataSource } from "./database/data-source";

dotenv.config();
const PORT = process.env.APP_PORT;
process.env.expirationTime;


function setupAndStartExpressApp() {

  AppDataSource.initialize()
  .then(async () => {
    console.log("Database connection success");
    
  })  
  .catch((err) => console.error(err));
  
  app.listen(PORT, () => {
    console.log(`App listening at http://192.168.0.105:${PORT}`);
  });
}

setupAndStartExpressApp();
