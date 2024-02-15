import express from "express";
import { Login } from "../middleware/auth";


const router = express.Router();

const login=new Login();
 router.post('/login',login.login);

 export default router;