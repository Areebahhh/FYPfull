import express from "express";
import { 

    getAllDomains,
    addDomain,
    updateDomain,
    deleteDomain


} from "../controllers/coordinatorwork.js";


const router = express.Router()

// ROUTES FOR UNIDOMAINS TABLE CRUD FOR COORDINATOR
router.post('/getAllDomains', getAllDomains);
router.post('/addDomain', addDomain);
router.post('/updateDomain', updateDomain);
router.post('/deleteDomain', deleteDomain);
// ROUTES FOR UNIDOMAINS TABLE CRUD FOR COORDINATOR


export default router