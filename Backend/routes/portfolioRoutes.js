// routes/about.js

import express from "express";
import {

    saveAboutData,
    getAboutData,
    checkUserAboutid,

    saveEducationData,
    getEducationData,
    getLastEducationSectionID,
    deleteEducationSection,

    saveExperienceData,
    getExperienceData,
    getLastExperienceSectionID,
    deleteExperienceSection,

    saveInterestsData,
    getInterestsData,
    getLastInterestsSectionID,
    deleteInterestsSection,

    saveAwardsData,
    getAwardsData,
    getLastAwardsSectionID,
    deleteAwardsSection,

    saveCertificationsData,
    getCertificationsData,
    getLastCertificationsSectionID,
    deleteCertificationsSection,

    getUserSections




} from "../controllers/portfolio.js";

const router = express.Router();


// ABOUT ROUTES
// route for the api code that is checking about id value for the current user
router.get("/checkUserAboutid/:userId", checkUserAboutid);

router.get("/getAboutData/:userId", getAboutData);

router.post("/saveAboutData/:userId", saveAboutData);
// ABOUT ROUTES




// EDUCATION ROUTES
router.post("/saveEducationData/:userId", saveEducationData);

router.get('/getEducationData/:userId', getEducationData);

router.get('/getLastEducationSectionID', getLastEducationSectionID);

router.delete('/deleteEducationSection', deleteEducationSection);
// EDUCATION ROUTES




// EXPERIENCE ROUTES
router.post("/saveExperienceData/:userId", saveExperienceData);

router.get('/getExperienceData/:userId', getExperienceData);

router.get('/getLastExperienceSectionID', getLastExperienceSectionID);

router.delete('/deleteExperienceSection', deleteExperienceSection);
// EXPERIENCE ROUTES



// INTERESTS ROUTES
router.post("/saveInterestsData/:userId", saveInterestsData);

router.get('/getInterestsData/:userId', getInterestsData);

router.get('/getLastInterestsSectionID', getLastInterestsSectionID);

router.delete('/deleteInterestsSection', deleteInterestsSection);
// INTERESTS ROUTES



//AWARDS ROUTES
router.post("/saveAwardsData/:userId", saveAwardsData);

router.get('/getAwardsData/:userId', getAwardsData);

router.get('/getLastAwardsSectionID', getLastAwardsSectionID);

router.delete('/deleteAwardsSection', deleteAwardsSection);
//AWARDS ROUTES


//CERTIFICATIONS ROUTES
router.post("/saveCertificationsData/:userId", saveCertificationsData);

router.get('/getCertificationsData/:userId', getCertificationsData);

router.get('/getLastCertificationsSectionID', getLastCertificationsSectionID);

router.delete('/deleteCertificationsSection', deleteCertificationsSection);
//CERTIFICATIONS ROUTES


router.get('/getUserSections', getUserSections);


export default router;
