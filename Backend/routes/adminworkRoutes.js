import express from "express";
import { 

    getAllUniDomains,
    addUniDomain,
    updateUniDomain,
    deleteUniDomain,

    getAllAdmins,
    addAdmin,
    updateAdmin,
    deleteAdmin





} from "../controllers/adminwork.js";



const router = express.Router()


 router.get("/getAllUniDomains", getAllUniDomains)
 router.post("/addUniDomain", addUniDomain)
 router.post("/updateUniDomain", updateUniDomain)
 router.post("/deleteUniDomain", deleteUniDomain)


//  admin's api routes
 router.get('/getAllAdmins', getAllAdmins);
 router.post("/addAdmin", addAdmin)
 router.post("/updateAdmin", updateAdmin)
 router.post("/deleteAdmin", deleteAdmin)





export default router