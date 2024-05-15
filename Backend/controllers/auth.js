import { db } from "../connect.js";
 import bcrypt from "bcryptjs"; 
 import jwt from "jsonwebtoken";

// export const register = (req, res) => {
//   //CHECK USER IF EXISTS

//   const q = "SELECT * FROM users WHERE username = ?";

//   db.query(q, [req.body.username], (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length) return res.status(409).json("User already exists!");
//     //CREATE A NEW USER
//     //Hash the password
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(req.body.password, salt);

//     const q =
//       "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";

//     const values = [
//       req.body.username,
//       req.body.email,
//       hashedPassword,
//       req.body.name,
//     ];

//     db.query(q, [values], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json("User has been created.");
//     });
//   });
// };

// export const login = (req, res) => {
//   const q = "SELECT * FROM users WHERE username = ?";

//   db.query(q, [req.body.username], (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length === 0) return res.status(404).json("User not found!");

//     const checkPassword = bcrypt.compareSync(
//       req.body.password,
//       data[0].password
//     );

//     if (!checkPassword)
//       return res.status(400).json("Wrong password or username!");

//     const token = jwt.sign({ id: data[0].id }, "secretkey");

//     const { password, ...others } = data[0];

//     res
//       .cookie("accessToken", token, {
//         httpOnly: true,
//       })
//       .status(200)
//       .json(others);
//   });

// };





export const login = (req, res) => {
  const userQuery = "SELECT * FROM users WHERE email = ?";
  const adminQuery = "SELECT * FROM admins WHERE email = ?";

  // First, try to authenticate using the users table
  db.query(userQuery, [req.body.email], (userErr, userData) => {
    if (userErr) {
      return res.status(500).json(userErr); // Handle query errors
    }
    
    if (userData.length > 0) {
      const user = userData[0];
      const checkUserPassword = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      
      if (checkUserPassword) {
        const token = jwt.sign({ id: user.id }, "secretkey");
        const { password, ...others } = user;
        console.log("User type:", user.userType);
        return res
          .cookie("accessToken", token, {
            httpOnly: true,
          })
          .status(200)
          .json({ ...others, userType: user.userType });
      }
    }

    // If authentication using the users table fails, try the admins table
    db.query(adminQuery, [req.body.email], (adminErr, adminData) => {
      if (adminErr) {
        return res.status(500).json(adminErr); // Handle query errors
      }
      
      if (adminData.length > 0) {
        const admin = adminData[0];
        const checkAdminPassword = bcrypt.compareSync(
          req.body.password,
          admin.password
        );
        
        if (checkAdminPassword) {
          const token = jwt.sign({ id: admin.id }, "secretkey");
          const { password, ...others } = admin;
          console.log("User type: admin");
          return res
            .cookie("accessToken", token, {
              httpOnly: true,
            })
            .status(200)
            .json({ ...others, userType: "admin" });
        }
      }

      // If authentication using both users and admins tables fails
      return res.status(400).json("Wrong password or email!");
    });
  });
};






export const register = (req, res) => {
  const { username, email, password, name, role } = req.body;




  // Check if a user with the same email already exists
  const queryCheckEmail = "SELECT * FROM users WHERE email = ?";
  db.query(queryCheckEmail, [email], (err, emailData) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (emailData.length > 0) {
      console.log("User with this email already exists!");
      return res.status(409).json({ message: 'User with this email already exists!' });
      
    }



  // // Check if a user with the same username already exists
  // const queryCheckUsername = "SELECT * FROM users WHERE username = ?";
  // db.query(queryCheckUsername, [username], (err, data) => {
  //   if (err) {
  //     return res.status(500).json({ message: 'Database error', error: err });
  //   }
  //   if (data.length > 0) {
  //     return res.status(409).json({ message: 'Username already exists!' });
  //   }


    // Hash the password for secure storage
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    if (role === "student") {
      // Check in `unidomains` for a match by email
      const queryCheckUniDomain = "SELECT * FROM unidomains WHERE uniEmail = ?";
      
      db.query(queryCheckUniDomain, [email], (err, uniData) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        if (uniData.length === 0) {
          return res.status(404).json({ message: 'Email not found in unidomains!' });
        }

        // Compare the stored hashed password with the user's entered password
        const storedHashedPassword = uniData[0].uniPass;
        const isPasswordMatch = bcrypt.compareSync(password, storedHashedPassword);

        if (!isPasswordMatch) {
          return res.status(404).json({ message: 'Email and password do not match with unidomains!' });
        }

        // Insert new user with `userType` as "student"
        const queryInsertStudent = "INSERT INTO users (`username`, `email`, `password`, `name`, `userType`) VALUES (?, ?, ?, ?, ?)";
        const values = [username, email, hashedPassword, name, "student"];

        db.query(queryInsertStudent, values, (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
          }

          const userId = result.insertId; // Get the ID of the inserted user

          // Insert the user ID into the students table
          const queryInsertStudentId = "INSERT INTO students (`FK_userIDStudent`) VALUES (?)";
          db.query(queryInsertStudentId, [userId], (err, result) => {
            if (err) {
              console.error("Database error:", err);
              return res.status(500).json({ message: "Database error", error: err });
            }
            return res.status(200).json({ message: "User registered as student!" });
          });
        });
      });

    } else if (role === "recruiter") {
      // Insert new user with `userType` as "recruiter"
      const queryInsertRecruiter = "INSERT INTO users (`username`, `email`, `password`, `name`, `userType`) VALUES (?, ?, ?, ?, ?)";
      const values = [username, email, hashedPassword, name, "recruiter"];

      db.query(queryInsertRecruiter, values, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        const userId = result.insertId; // Get the ID of the inserted user

        // Insert the user ID into the recruiters table
        const queryInsertRecruiterId = "INSERT INTO recruiters (`FK_userIDRecruiter`) VALUES (?)";
        db.query(queryInsertRecruiterId, [userId], (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
          }
          return res.status(200).json({ message: "User registered as recruiter!" });
        });
      });

    } 
    
    // else if (role === "admin") {
    //   // Insert new user with `userType` as "admin"
    //   const queryInsertAdmin = "INSERT INTO users (`username`, `email`, `password`, `name`, `userType`) VALUES (?, ?, ?, ?, ?)";
    //   const values = [username, email, hashedPassword, name, "admin"];

    //   db.query(queryInsertAdmin, values, (err, result) => {
    //     if (err) {
    //       return res.status(500).json({ message: 'Database error', error: err });
    //     }

    //     const userId = result.insertId; // Get the ID of the inserted user

    //     // Insert the user ID into the admin table
    //     const queryInsertAdminId = "INSERT INTO admins (`FK_userIDAdmin`) VALUES (?)";
    //     db.query(queryInsertAdminId, [userId], (err, result) => {
    //       if (err) {
    //         console.error("Database error:", err);
    //         return res.status(500).json({ message: "Database error", error: err });
    //       }
    //       return res.status(200).json({ message: "User registered as admin!" });
    //     });
    //   });

    // } 
    
    
    else {
      return res.status(400).json({ message: 'Invalid role provided!' });
    }
  });
};





// SHIFT FOLLOWING TO ADMINWORKS.JS
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




export const logout = (req, res) => {
  res.clearCookie("accessToken",{
    secure:true,
    sameSite:"none"
  }).status(200).json("User has been logged out.")
};
