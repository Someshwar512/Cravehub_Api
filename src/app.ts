import express, { Express, Request, Response } from "express";
// import { ErrorHandler } from "./http/middlewares/ErrorHandler";

import bodyParser from "body-parser";
import cors from "cors";
import adminRoute from "./routes/admin";
import chefRoute from "./routes/chef";
import userRoute from "./routes/user";
import authRoute from "./routes/auth";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());

// Call auth routes
app.use("/api", authRoute);

// Call admin routes
app.use("/api/admin", adminRoute);

// Call chef routes
app.use("/api/chef", chefRoute);

// Call user routes
app.use("/api/user", userRoute);


export default app;