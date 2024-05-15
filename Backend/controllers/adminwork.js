import { db } from "../connect.js";
 import bcrypt from "bcryptjs"; 
 import jwt from "jsonwebtoken";

 const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10); // Hash the password with salt rounds of 10
};


// UNIDOMAINS TABLE CRUD APIS

// export const addToUniDomains = (req, res) => {
//     const { uniEmail, uniPass, uniName } = req.body;
  
//     // Hash the uniPass before storing it in the database
//     const salt = bcrypt.genSaltSync(10);
//     const hashedUniPass = bcrypt.hashSync(uniPass, salt);
  
//     // SQL query to insert into unidomains
//     const query = 'INSERT INTO unidomains (uniEmail, uniPass, uniName) VALUES (?, ?, ?)';
  
//     // Execute the query and handle errors
//     db.query(query, [uniEmail, hashedUniPass, uniName], (err, result) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).json({ message: 'Error adding data to unidomains', error: err });
//       }
  
//       // If successful, return a 200 response
//       return res.status(200).json({ message: 'Data added successfully', result: result });
//     });
//   };



// Get all unidomains
export const getAllUniDomains = (req, res) => {
  const sql = 'SELECT * FROM unidomains';
  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          res.status(200).json(result);
      }
  });
};

// Add a new unidomain
export const addUniDomain = (req, res) => {
  const { uniEmail, uniPass, uniName } = req.body;
  const hashedPassword = hashPassword(uniPass);

  const query = "INSERT INTO unidomains (uniEmail, uniPass, uniName) VALUES (?, ?, ?)";
  db.query(query, [uniEmail, hashedPassword, uniName], (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      return res.status(200).json("UniDomain added successfully!");
  });
};

// Update an existing unidomain
export const updateUniDomain = (req, res) => {
  const { idunidomains, uniEmail, uniPass, uniName } = req.body;
  const hashedPassword = hashPassword(uniPass);

  const query = "UPDATE unidomains SET uniEmail = ?, uniPass = ?, uniName = ? WHERE idunidomains = ?";
  db.query(query, [uniEmail, hashedPassword, uniName, idunidomains], (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      return res.status(200).json("UniDomain updated successfully!");
  });
};

// Delete an unidomain
export const deleteUniDomain = (req, res) => {
  const { idunidomains } = req.body;

  const query = "DELETE FROM unidomains WHERE idunidomains = ?";
  db.query(query, [idunidomains], (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      return res.status(200).json("UniDomain deleted successfully!");
  });
};




// UNIDOMAINS TABLE CRUD APIS




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

