import { db } from "../connect.js";
 import bcrypt from "bcryptjs"; 
 import jwt from "jsonwebtoken";


// UNIDOMAIN TABLE CRUD APIS FOR COORDINATOR

// export const getAllDomains = (req, res) => {
//     const sql = 'SELECT * FROM unidomains';
//     db.query(sql, (err, result) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             res.status(500).json({ error: 'Internal server error' });
//         } else {
//             res.status(200).json(result);
//         }
//     });
// };


export const getAllDomains = (req, res) => {
    
    console.log("Request query:", req.body);

    const { uniName } = req.body; // Access uniName directly from req.body
    console.log("uni name:", uniName);


    const sql = 'SELECT * FROM unidomains WHERE uniName = ?';
    db.query(sql, [uniName], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(result);
        }
    });
};





export const addDomain = (req, res) => {
    const { uniEmail, uniPass, uniName, studentName, studentRollNo, studentCGPA, studentDegree } = req.body;
    const hashedPassword = bcrypt.hashSync(uniPass, 10);
    const sql = 'INSERT INTO unidomains (uniEmail, uniPass, uniName, studentName, studentRollNo, studentCGPA, studentDegree) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [uniEmail, hashedPassword, uniName, studentName, studentRollNo, studentCGPA, studentDegree], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ message: 'Domain added successfully!' });
        }
    });
};

export const updateDomain = (req, res) => {
    const { idunidomains, uniEmail, uniPass, uniName, studentName, studentRollNo, studentCGPA, studentDegree } = req.body;
    const hashedPassword = bcrypt.hashSync(uniPass, 10);
    const sql = 'UPDATE unidomains SET uniEmail = ?, uniPass = ?, uniName = ?, studentName = ?, studentRollNo = ?, studentCGPA = ?, studentDegree = ? WHERE idunidomains = ?';
    db.query(sql, [uniEmail, hashedPassword, uniName, studentName, studentRollNo, studentCGPA, studentDegree, idunidomains], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ message: 'Domain updated successfully!' });
        }
    });
};

export const deleteDomain = (req, res) => {
    const { idunidomains } = req.body;
    const sql = 'DELETE FROM unidomains WHERE idunidomains = ?';
    db.query(sql, [idunidomains], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ message: 'Domain deleted successfully!' });
        }
    });
};


// UNIDOMAIN TABLE CRUD APIS FOR COORDINATOR