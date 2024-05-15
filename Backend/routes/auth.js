import express from "express";
import { login,register,logout, addToUniDomains } from "../controllers/auth.js";

const router = express.Router()

 router.post("/login", login)
 router.post("/register", register)
 router.post("/logout", logout)


 router.post("/addToUniDomains", addToUniDomains)


export default router