import express from "express";
import { 

    addToUniDomains,

    getAllAdmins,
    addAdmin,
    updateAdmin,
    deleteAdmin



} from "../controllers/adminwork.js";



const router = express.Router()

 router.post("/addToUniDomains", addToUniDomains)

 router.get('/getAllAdmins', getAllAdmins);
 router.post("/addAdmin", addAdmin)
 router.post("/updateAdmin", updateAdmin)
 router.post("/deleteAdmin", deleteAdmin)



export default router