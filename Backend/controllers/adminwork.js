import { db } from "../connect.js";
 import bcrypt from "bcryptjs"; 
 import jwt from "jsonwebtoken";



export const addToUniDomains = (req, res) => {
    const { uniEmail, uniPass, uniName } = req.body;
  
    // Hash the uniPass before storing it in the database
    const salt = bcrypt.genSaltSync(10);
    const hashedUniPass = bcrypt.hashSync(uniPass, salt);
  
    // SQL query to insert into unidomains
    const query = 'INSERT INTO unidomains (uniEmail, uniPass, uniName) VALUES (?, ?, ?)';
  
    // Execute the query and handle errors
    db.query(query, [uniEmail, hashedUniPass, uniName], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error adding data to unidomains', error: err });
      }
  
      // If successful, return a 200 response
      return res.status(200).json({ message: 'Data added successfully', result: result });
    });
  };





// ADMIN TABLE CRUD APIS

// GET all admins


export const getAllAdmins = (req, res) => {
  const sql = 'SELECT * FROM admins';
  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          res.status(200).json(result);
      }
  });
};




// Function to hash the password
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10); // Hash the password with salt rounds of 10
};

// Example query to insert data into the admins table
export const addAdmin = (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password); // Hash the password before inserting
  
  const query = "INSERT INTO admins (email, password) VALUES (?, ?)";
  db.query(query, [email, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).json(err); // Handle query errors
    }
    
    return res.status(200).json("Admin added successfully!"); // Successful insertion
  });
};




// Function to hash the password
// const hashPassword = (password) => {
//   return bcrypt.hashSync(password, 10); // Hash the password with salt rounds of 10
// };


export const updateAdmin = (req, res) => {
  const { idadmins, email, password } = req.body;
  const hashedPassword = hashPassword(password); // Hash the password before updating

  const query = "UPDATE admins SET email = ?, password = ? WHERE idadmins = ?";
  db.query(query, [email, hashedPassword, idadmins], (err, result) => {
      if (err) {
          return res.status(500).json(err); // Handle query errors
      }

      return res.status(200).json("Admin updated successfully!"); // Successful update
  });
};




export const deleteAdmin = (req, res) => {
  const { idadmins } = req.body;

  const query = "DELETE FROM admins WHERE idadmins = ?";
  db.query(query, [idadmins], (err, result) => {
      if (err) {
          return res.status(500).json(err); // Handle query errors
      }

      return res.status(200).json("Admin deleted successfully!"); // Successful deletion
  });
};



// ADMIN TABLE CRUD APIS

