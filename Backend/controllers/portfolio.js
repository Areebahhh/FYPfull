// controllers/portfolio.js

import { db } from "../connect.js";
import jwt from "jsonwebtoken";




export const saveAboutData = (req, res) => {
    const userId = req.params.userId;
    console.log(userId);

    const {
        fullname,
        address,
        contact_number,
        email,
        about_paragraph,
        facebookLink,
        twitterLink,
        githubLink,
        youtubeLink,
        linkedinLink
    } = req.body;

    // Check if userId already exists in portfolio table
    const portfolioCheckQuery = `
        SELECT aboutID FROM portfolio WHERE userId = ?
    `;
    db.query(portfolioCheckQuery, [userId], (err, rows) => {
        if (err) {
            console.error('Error checking userId in portfolio table:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (rows.length > 0) {
            // UserId exists in portfolio table, update corresponding row in about table
            const aboutId = rows[0].aboutID;
            const updateAboutQuery = `
                UPDATE about SET
                fullname = ?,
                address = ?,
                contact_number = ?,
                email = ?,
                about_paragraph = ?,
                facebookLink = ?,
                twitterLink = ?,
                githubLink = ?,
                youtubeLink = ?,
                linkedinLink = ?
                WHERE aboutID = ?
            `;
            db.query(
                updateAboutQuery, 
                [
                    fullname,
                    address,
                    contact_number,
                    email,
                    about_paragraph,
                    facebookLink,
                    twitterLink,
                    githubLink,
                    youtubeLink,
                    linkedinLink,
                    aboutId
                ],
                (err, result) => {
                    if (err) {
                        console.error('Error updating about data in about table:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    console.log('About section data updated successfully');
                    res.status(200).json({ message: 'About section data updated successfully' });
                }
            );
        } else {
            // UserId does not exist in portfolio table, proceed with inserting new data
            // Start a transaction
            db.beginTransaction(function(err) {
                if (err) {
                    console.error('Error starting transaction:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                // about insert
                const aboutQuery = `
                    INSERT INTO about (fullname, address, contact_number, email, about_paragraph, facebookLink, twitterLink, githubLink, youtubeLink, linkedinLink )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(aboutQuery, [fullname, address, contact_number, email, about_paragraph, facebookLink, twitterLink, githubLink, youtubeLink, linkedinLink], (err, result) => {
                    if (err) {
                        console.error('Error saving About section data:', err);
                        return db.rollback(function() {
                            res.status(500).json({ message: 'Internal server error' });
                        });
                    }

                    // Retrieve the auto-generated aboutID
                    const aboutId = result.insertId;

                    // Insert aboutID into the portfolio table along with userId
                    const portfolioQuery = `
                        INSERT INTO portfolio (userId, aboutID) VALUES (?, ?)
                    `;
                    db.query(portfolioQuery, [userId, aboutId], (err, result) => {
                        if (err) {
                            console.error('Error saving About ID in Portfolio table:', err);
                            return db.rollback(function() {
                                res.status(500).json({ message: 'Internal server error' });
                            });
                        }

                        // Retrieve the auto-generated portfolioID
                        const portfolioId = result.insertId;

                        // Update the about table with portfolioID
                        const updateAboutQuery = `
                            UPDATE about SET portfolioID = ? WHERE aboutID = ?;
                        `;
                        db.query(updateAboutQuery, [portfolioId, aboutId], (err, result) => {
                            if (err) {
                                console.error('Error updating About table with Portfolio ID:', err);
                                return db.rollback(function() {
                                    res.status(500).json({ message: 'Internal server error' });
                                });
                            }

                            // Commit the transaction
                            db.commit(function(err) {
                                if (err) {
                                    console.error('Error committing transaction:', err);
                                    return db.rollback(function() {
                                        res.status(500).json({ message: 'Internal server error' });
                                    });
                                }

                                console.log('Transaction committed successfully');
                                res.status(200).json({ message: 'About section data and About ID saved successfully in Portfolio table' });
                            });
                        });
                    });
                });
            });
        }
    });
};



export const getAboutData = (req, res) => {
    const userId = req.params.userId;
    console.log("user id in get: ", userId)

    // SQL query to fetch About section data based on userId
    const q = `
        SELECT a.fullname, a.address, a.contact_number, a.email, a.about_paragraph, a.facebookLink, a.twitterLink, a.githubLink,a.youtubeLink, a.linkedinLink
        FROM about a
        JOIN portfolio p ON a.aboutID = p.aboutID
        WHERE p.userId = ?
        LIMIT 1
    `;

    // Execute the query to fetch the About section data
    db.query(q, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching About section data:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'About section data not found for the given user' });
        }

        const aboutData = result[0];
        res.status(200).json(aboutData);
    });
};




export const checkUserAboutid = (req, res) => {
    const userId = req.params.userId;

    // SQL query to check if userId exists in the portfolio table and get the corresponding aboutID
    const q = `
        SELECT aboutID
        FROM portfolio
        WHERE userId = ?
        LIMIT 1
    `;

    // Execute the query to check user's portfolio
    db.query(q, [userId], (err, result) => {
        if (err) {
            console.error('Error checking user portfolio:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.length === 0) {
            // If no matching userId is found in the portfolio table
            return res.status(404).json({ message: 'User portfolio not found' });
        }

        // If userId matches, get the corresponding aboutID
        const userAboutId = result[0].aboutID;
        res.status(200).json({ userAboutId });
        console.log("about id user: ", userAboutId)
    });
};









export const saveEducationData = (req, res) => {
    const userId = req.params.userId;
    const educationItems = req.body.educationItems;

    // Check if the user exists in the portfolio table
    const portfolioCheckQuery = `
        SELECT * FROM portfolio WHERE userID = ?
    `;
    db.query(portfolioCheckQuery, [userId], (err, rows) => {
        if (err) {
            console.error('Error checking user portfolio:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User portfolio not found' });
        }

        const portfolioId = rows[0].portfolioID;

        // Start a transaction
        db.beginTransaction(function (err) {
            if (err) {
                console.error('Error starting transaction:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // Loop through each education item and insert/update the data
            educationItems.forEach(item => {
                const { educationSectionID, universityName, degreeType, courseName, cgpa, degreeDate } = item;

                // Check if the education section already exists for this user
                const educationCheckQuery = `
                    SELECT * FROM education WHERE portfolioID = ? AND educationSectionID = ?
                `;
                db.query(educationCheckQuery, [portfolioId, educationSectionID], (err, rows) => {
                    if (err) {
                        console.error('Error checking education section:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    if (rows.length > 0) {
                        // If the education section exists, update the data
                        const updateEducationQuery = `
                            UPDATE education
                            SET universityName = ?, degreeType = ?, courseName = ?, cgpa = ?, degreeDate = ?
                            WHERE portfolioID = ? AND educationSectionID = ?
                        `;
                        db.query(
                            updateEducationQuery,
                            [universityName, degreeType, courseName, cgpa, degreeDate, portfolioId, educationSectionID],
                            (err, result) => {
                                if (err) {
                                    console.error('Error updating education data:', err);
                                    return res.status(500).json({ message: 'Internal server error' });
                                }
                                console.log('Education data updated successfully');
                            }
                        );
                    } else {
                        // If the education section does not exist, insert a new entry
                        const insertEducationQuery = `
                            INSERT INTO education (educationSectionID, universityName, degreeType, courseName, cgpa, degreeDate, portfolioID)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                        `;
                        db.query(
                            insertEducationQuery,
                            [educationSectionID, universityName, degreeType, courseName, cgpa, degreeDate, portfolioId],
                            (err, result) => {
                                if (err) {
                                    console.error('Error inserting education data:', err);
                                    return res.status(500).json({ message: 'Internal server error' });
                                }
                                console.log('Education data inserted successfully');
                                
                                // Get the auto-generated educationID
                                const educationId = result.insertId;

                                // Update the portfolio table with the educationID
                                const updatePortfolioQuery = `
                                    UPDATE portfolio
                                    SET educationID = ?
                                    WHERE portfolioID = ?
                                `;
                                db.query(
                                    updatePortfolioQuery,
                                    [educationId, portfolioId],
                                    (err, result) => {
                                        if (err) {
                                            console.error('Error updating portfolio with educationID:', err);
                                            return res.status(500).json({ message: 'Internal server error' });
                                        }
                                        console.log('Portfolio updated with educationID');
                                    }
                                );
                            }
                        );
                    }
                });
            });

            // Commit the transaction
            db.commit(function (err) {
                if (err) {
                    console.error('Error committing transaction:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                console.log('Transaction committed successfully');
                res.status(200).json({ message: 'Education data saved successfully' });
            });
        });
    });
};





















export const getEducationData = (req, res) => {
    const userId = req.params.userId; // Get the user ID from request parameters
    console.log("User ID in getEducationData:", userId);

    // SQL query to fetch education data based on userId
    const q = `
    SELECT 
        e.educationID,
        e.portfolioID,
        e.educationSectionID,
        e.universityName,
        e.degreeType,
        e.courseName,
        e.cgpa,
        e.degreeDate
    FROM 
        education e
    JOIN 
        portfolio p 
    ON 
        e.portfolioID = p.portfolioID
    WHERE 
        p.userID = ?
    `; // Corrected the comment error and ensured proper syntax
    

    // Execute the query with the provided userId
    db.query(q, [userId], (err, result) => {
        if (err) { // Error handling for SQL errors
            console.error('Error fetching education data:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.length === 0) { // No data found for the given userId
            return res.status(404).json({ message: 'Education data not found for this user' });
        }

        res.status(200).json(result); // Send the fetched data to the client
    });
    
   
};







export const getLastEducationSectionID = (req, res) => {
    const q1 = "SELECT portfolioID, educationID FROM portfolio WHERE userID = ?";
  
    db.query(q1, [req.query.userId], (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (data.length === 0) {
        return res.status(404).json({ error: "No data found for this userId" });
      }
  
      // Store the returned data in two variables
      const returnedportfolioID = data[0].portfolioID;
      const returnededucationID = data[0].educationID;
  
      // Now fetch the educationSectionID using the previous variables
      const q2 = "SELECT educationSectionID FROM education WHERE portfolioID = ? AND educationID = ?";
      
      db.query(q2, [returnedportfolioID, returnededucationID], (err, data) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
  
        if (data.length === 0) {
          return res.status(404).json({ error: "No education section found for the provided portfolioID and educationID" });
        }
  
        // Increment the educationSectionID by 1
        const incrementedEducationSectionID = data[0].educationSectionID + 1;
  
        // Return only the numeric value
        return res.status(200).json(incrementedEducationSectionID);
      });
    });
  };
  





  export const deleteEducationSection = (req, res) => {
    const { userId, educationSectionID } = req.query;

    console.log('Received userId:', userId); // Debugging
    console.log('Received educationSectionID:', educationSectionID); // Debugging

    if (!userId || !educationSectionID) {
        return res.status(400).json({ error: "Missing userId or educationSectionID" });
    }

    // Step 1: Retrieve portfolioID and educationID from the portfolio table
    const q1 = "SELECT portfolioID, educationID FROM portfolio WHERE userId = ?";

    db.query(q1, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching portfolio:", err);
            return res.status(500).json({ error: err.message });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: "No portfolio found for this userId" });
        }

        // Extract portfolioID and educationID from the data
        const portfolioID = data[0].portfolioID;
        const educationID = data[0].educationID;

        // Step 2: Delete the specific education section based on educationSectionID and portfolioID
        
        const q2 = "DELETE FROM education WHERE educationSectionID = ? AND portfolioID = ?";

        db.query(q2, [educationSectionID, portfolioID], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error("Error deleting education section:", deleteErr);
                return res.status(500).json({ error: deleteErr.message });
            }

            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ error: "Education section not found with given educationSectionID, portfolioID, and educationID" });
            }

            // Return success response if deletion was successful
            res.status(200).json({ message: "Education section deleted successfully" });
        });
    });
};











// code that is fetching and storing correct eduid and portfolio id
// export const getLastEducationSectionID = (req, res) => {
//     const q = "SELECT portfolioID, educationID FROM portfolio WHERE userID = ?";
//     db.query(q, [req.query.userId], (err, data) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
  
//       if (data.length === 0) {
//         return res.status(404).json({ error: "No data found for this userId" });
//       }
  
//       // Store the returned data in two variables
//       const returnedportfolioID = data[0].portfolioID;
//       const returnededucationID = data[0].educationID;

//       console.log("returnedportfolioID: ", returnedportfolioID);
//       console.log("returnededucationID: ", returnededucationID);
  
//       // Returning the data to the client
//       return res.status(200).json({
//         portfolioID: returnedportfolioID,
//         educationID: returnededucationID,
//       });
//     });
//   };
  
  




// EXPERIENCE SECTION'S APIS


// Save Experience Data
export const saveExperienceData = (req, res) => {
    const userId = req.params.userId;
    const experienceItems = req.body.experienceItems;

    // Check if the user exists in the portfolio table
    const portfolioCheckQuery = `
        SELECT * FROM portfolio WHERE userID = ?
    `;
    db.query(portfolioCheckQuery, [userId], (err, rows) => {
        if (err) {
            console.error('Error checking user portfolio:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User portfolio not found' });
        }

        const portfolioId = rows[0].portfolioID;

        // Start a transaction
        db.beginTransaction((err) => {
            if (err) {
                console.error('Error starting transaction:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // Loop through each job item and insert/update the data
            experienceItems.forEach((item) => {
                const { experienceSectionID, jobTitle, jobCompany, jobDescription, jobDate } = item;

                // Check if the Experience section already exists for this portfolio
                const experienceCheckQuery = `
                    SELECT * FROM experience WHERE portfolioID = ? AND experienceSectionID = ?
                `;
                db.query(experienceCheckQuery, [portfolioId, experienceSectionID], (err, rows) => {
                    if (err) {
                        console.error('Error checking Experience section:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    if (rows.length > 0) {
                        // If the Experience section exists, update the data
                        const updateExperienceQuery = `
                            UPDATE experience
                            SET jobTitle = ?, jobCompany = ?, jobDescription = ?, jobDate = ?
                            WHERE portfolioID = ? AND experienceSectionID = ?
                        `;
                        db.query(
                            updateExperienceQuery,
                            [jobTitle, jobCompany, jobDescription, jobDate, portfolioId, experienceSectionID],
                            (err, result) => {
                                if (err) {
                                    console.error('Error updating Experience data:', err);
                                    return res.status(500).json({ message: 'Internal server error' });
                                }
                                console.log('Experience data updated successfully');
                            }
                        );
                    } else {
                        // If the Experience section does not exist, insert a new entry
                        const insertExperienceQuery = `
                            INSERT INTO experience (experienceSectionID, jobTitle, jobCompany, jobDescription, jobDate, portfolioID)
                            VALUES (?, ?, ?, ?, ?, ?)
                        `;
                        db.query(
                            insertExperienceQuery,
                            [experienceSectionID, jobTitle, jobCompany, jobDescription, jobDate, portfolioId],
                            (err, result) => {
                                if (err) {
                                    console.error('Error inserting Experience data:', err);
                                    return res.status(500).json({ message: 'Internal server error' });
                                }
                                console.log('Experience data inserted successfully');
                                
                                // Get the auto-generated experienceID
                                const experienceId = result.insertId;

                                // Update the portfolio table with the experienceID
                                const updatePortfolioQuery = `
                                    UPDATE portfolio
                                    SET experienceID = ?
                                    WHERE portfolioID = ?
                                `;
                                db.query(
                                    updatePortfolioQuery,
                                    [experienceId, portfolioId],
                                    (err, result) => {
                                        if (err) {
                                            console.error('Error updating portfolio with experienceID:', err);
                                            return res.status(500).json({ message: 'Internal server error' });
                                        }
                                        console.log('Portfolio updated with experienceID');
                                    }
                                );
                            }
                        );
                    }
                });
            });

            // Commit the transaction
            db.commit((err) => {
                if (err) {
                    console.error('Error committing transaction:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                console.log('Transaction committed successfully');
                res.status(200).json({ message: 'Experience data saved successfully' });
            });
        });
    });
};

// Get Experience Data
export const getExperienceData = (req, res) => {
    const userId = req.params.userId;

    // SQL query to fetch Experience data based on userId
    const query = `
    SELECT 
        e.experienceID,
        e.portfolioID,
        e.experienceSectionID,
        e.jobTitle,
        e.jobCompany,
        e.jobDescription,
        e.jobDate
    FROM 
        experience e
    JOIN 
        portfolio p 
    ON 
        e.portfolioID = p.portfolioID
    WHERE 
        p.userID = ?
    `;

    // Execute the query with the provided userId
    db.query(query, [userId], (err, result) => {
        if (err) { // Error handling for SQL errors
            console.error('Error fetching Experience data:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.length === 0) { // No data found for the given userId
            return res.status(404).json({ message: 'Experience data not found for this user' });
        }

        res.status(200).json(result); // Send the fetched data to the client
    });
};

// Get Last Experience Section ID
export const getLastExperienceSectionID = (req, res) => {
    const q1 = "SELECT portfolioID, experienceID FROM portfolio WHERE userID = ?";

    db.query(q1, [req.query.userId], (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ error: "No data found for this userId" });
      }

      // Store the returned data in two variables
      const returnedPortfolioID = data[0].portfolioID;
      const returnedExperienceID = data[0].experienceID;

      // Now fetch the experienceSectionID using the previous variables
      const q2 = "SELECT experienceSectionID FROM experience WHERE portfolioID = ? AND experienceID = ?";
      
      db.query(q2, [returnedPortfolioID, returnedExperienceID], (err, data) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (data.length === 0) {
          return res.status(404).json({ error: "No Experience section found for the provided portfolioID and experienceID" });
        }

        // Increment the experienceSectionID by 1
        const incrementedExperienceSectionID = data[0].experienceSectionID + 1;

        // Return only the numeric value
        return res.status(200).json(incrementedExperienceSectionID);
      });
    });
};

// Delete an Experience Section
export const deleteExperienceSection = (req, res) => {
    const { userId, experienceSectionID } = req.query;

    console.log('Received userId:', userId); // Debugging
    console.log('Received experienceSectionID:', experienceSectionID); // Debugging

    if (!userId || !experienceSectionID) {
        return res.status(400).json({ error: "Missing userId or experienceSectionID" });
    }

    // Step 1: Retrieve portfolioID and experienceID from the portfolio table
    const q1 = "SELECT portfolioID, experienceID FROM portfolio WHERE userId = ?";

    db.query(q1, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching portfolio:", err);
            return res.status(500).json({ error: err.message });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: "No portfolio found for this userId" });
        }

        // Extract portfolioID and experienceID from the data
        const portfolioID = data[0].portfolioID;
        const experienceID = data[0].experienceID;

        // Step 2: Delete the specific experience section based on experienceSectionID and portfolioID
        
        const q2 = "DELETE FROM experience WHERE experienceSectionID = ? AND portfolioID = ?";

        db.query(q2, [experienceSectionID, portfolioID], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error("Error deleting Experience section:", deleteErr);
                return res.status(500).json({ error: deleteErr.message });
            }

            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ error: "Experience section not found with given experienceSectionID, portfolioID, and experienceID" });
            }

            // Return success response if deletion was successful
            res.status(200).json({ message: "Experience section deleted successfully" });
        });
    });
};

// EXPERIENCE SECTION'S APIS







// INTERESTS SECTION'S APIS
export const saveInterestsData = (req, res) => {
  const userId = req.params.userId;
  const interests = req.body.interests;

  const portfolioCheckQuery = `
    SELECT * FROM portfolio WHERE userID = ?
  `;
  db.query(portfolioCheckQuery, [userId], (err, rows) => {
    if (err) {
      console.error('Error checking user portfolio:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User portfolio not found' });
    }

    const portfolioID = rows[0].portfolioID;

    db.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      interests.forEach((item) => {
        const { interestsSectionID, paragraph1, paragraph2 } = item;

        const checkQuery = `
          SELECT * FROM interests WHERE portfolioID = ? AND interestsSectionID = ?
        `;
        db.query(checkQuery, [portfolioID, interestsSectionID], (err, rows) => {
          if (err) {
            console.error('Error checking interests section:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }

          if (rows.length > 0) {
            // Update existing interests section
            const updateQuery = `
              UPDATE interests
              SET paragraph1 = ?, paragraph2 = ?
              WHERE portfolioID = ? AND interestsSectionID = ?
            `;
            db.query(
              updateQuery,
              [paragraph1, paragraph2, portfolioID, interestsSectionID],
              (err, result) => {
                if (err) {
                  console.error('Error updating interests section:', err);
                  return res.status(500).json({ message: 'Internal server error' });
                }
                console.log('Interests updated successfully');
              }
            );
          } else {
            // Insert a new interests section
            const insertQuery = `
              INSERT INTO interests (interestsSectionID, paragraph1, paragraph2, portfolioID)
              VALUES (?, ?, ?, ?)
            `;
            db.query(
              insertQuery,
              [interestsSectionID, paragraph1, paragraph2, portfolioID],
              (err, result) => {
                if (err) {
                  console.error('Error inserting interests:', err);
                  return res.status(500).json({ message: 'Internal server error' });
                }
                console.log('Interests inserted successfully');

                // Get the auto-generated `interestsID`
                const interestsID = result.insertId;



                // Corrected section to update the portfolio with interestsID
const updatePortfolioQuery = `
  UPDATE portfolio
  SET interestsID = ?
  WHERE portfolioID = ?
`;

// Ensure both interestsID and portfolioID are defined
if (interestsID && portfolioID) {
  db.query(updatePortfolioQuery, [interestsID, portfolioID], (err, updateResult) => {
    if (err) {
      console.error('Error updating portfolio with interestsID:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    console.log('Portfolio updated with interestsID');
  });
} else {
  console.error('Failed to update portfolio: missing interestsID or portfolioID');
  return res.status(400).json({ message: 'Missing interestsID or portfolioID' });
}





              }
            );
          }
        });
      });

      db.commit((err) => {
        if (err) {
          console.error('Error committing transaction:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
        console.log('Transaction committed successfully');
        res.status(200).json({ message: 'Interests data saved successfully' });
      });
    });
  });
};







// export const saveInterestsData = (req, res) => {
//   const userId = req.params.userId;
//   const interests = req.body.interests;

//   const portfolioCheckQuery = `
//     SELECT * FROM portfolio WHERE userID = ?
//   `;
//   db.query(portfolioCheckQuery, [userId], (err, rows) => {
//     if (err) {
//       console.error('Error checking user portfolio:', err);
//       return res.status(500).json({ message: 'Internal server error' });
//     }

//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'User portfolio not found' });
//     }

//     const portfolioID = rows[0].portfolioID;

//     db.beginTransaction((err) => {
//       if (err) {
//         console.error('Error starting transaction:', err);
//         return res.status(500).json({ message: 'Internal server error' });
//       }

//       interests.forEach((item) => {
//         const { interestsSectionID, paragraph1, paragraph2 } = item;

//         const checkQuery = `
//           SELECT * FROM interests WHERE portfolioID = ? AND interestsSectionID = ?
//         `;
//         db.query(checkQuery, [portfolioID, interestsSectionID], (err, rows) => {
//           if (err) {
//             console.error('Error checking interests section:', err);
//             return res.status(500).json({ message: 'Internal server error' });
//           }

//           if (rows.length > 0) {
//             // If the section exists, update it
//             const updateQuery = `
//               UPDATE interests
//               SET paragraph1 = ?, paragraph2 = ?
//               WHERE portfolioID = ? AND interestsSectionID = ?
//             `;
//             db.query(
//               updateQuery,
//               [paragraph1, paragraph2, portfolioID, interestsSectionID],
//               (err, result) => {
//                 if (err) {
//                   console.error('Error updating interests section:', err);
//                   return res.status(500).json({ message: 'Internal server error' });
//                 }
//                 console.log('Interests updated successfully');
//               }
//             );
//           } else {
//             // If it doesn't exist, insert a new section
//             const insertQuery = `
//               INSERT INTO interests (interestsSectionID, paragraph1, paragraph2, portfolioID)
//               VALUES (?, ?, ?, ?)
//             `;
//             db.query(
//               insertQuery,
//               [interestsSectionID, paragraph1, paragraph2, portfolioID],
//               (err, result) => {
//                 if (err) {
//                   console.error('Error inserting interests:', err);
//                   return res.status(500).json({ message: 'Internal server error' });
//                 }
//                 console.log('Interests inserted successfully');

//                 // Update `portfolio` with the auto-generated `interestsID`
//                 const interestsID = result.insertId;
//                 const updatePortfolioQuery = `
//                   UPDATE portfolio
//                   SET interestsID = ?
//                   WHERE portfolioID = ?
//                 `;
//                 db.query(
//                   [interestsID, portfolioID],
//                   (err, updateResult) => {
//                     if (err) {
//                       console.error('Error updating portfolio with interestsID:', err);
//                       return res.status(500).json({ message: 'Internal server error' });
//                     }
//                     console.log('Portfolio updated with interestsID');
//                   }
//                 );
//               }
//             );
//           }
//         });
//       });

//       db.commit((err) => {
//         if (err) {
//           console.error('Error committing transaction:', err);
//           return res.status(500).json({ message: 'Internal server error' });
//         }
//         console.log('Transaction committed successfully');
//         res.status(200).json({ message: 'Interests data saved successfully' });
//       });
//     });
//   });
// };



export const getInterestsData = (req, res) => {
  const userId = req.params.userId; // Get the user ID from request parameters

  const query = `
  SELECT 
    i.interestsID,
    i.portfolioID,
    i.interestsSectionID,
    i.paragraph1,
    i.paragraph2
  FROM 
    interests i
  JOIN 
    portfolio p 
  ON 
    i.portfolioID = p.portfolioID
  WHERE 
    p.userID = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching interests data:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Interests data not found for this user' });
    }

    res.status(200).json(result); // Return the fetched data
  });
};


export const getLastInterestsSectionID = (req, res) => {
  const q1 = "SELECT portfolioID, interestsID FROM portfolio WHERE userID = ?";

  db.query(q1, [req.query.userId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "No data found for this userId" });
    }

    // Store returned data
    const portfolioID = data[0].portfolioID;
    const interestsID = data[0].interestsID;

    // Now fetch the interestsSectionID using the previous variables
    const q2 = "SELECT interestsSectionID FROM interests WHERE portfolioID = ? AND interestsID = ?";

    db.query(q2, [portfolioID, interestsID], (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ error: "No interests section found for the provided portfolioID and interestsID" });
      }

      const incrementedInterestsSectionID = data[0].interestsSectionID + 1; // Increment to ensure unique section IDs

      return res.status(200).json(incrementedInterestsSectionID);
    });
  });
};


export const deleteInterestsSection = (req, res) => {
  const { userId, interestsSectionID } = req.query;

  if (!userId || !interestsSectionID) {
    return res.status(400).json({ error: "Missing userId or interestsSectionID" });
  }

  // Step 1: Retrieve portfolioID from the portfolio table
  const q1 = "SELECT portfolioID, interestsID FROM portfolio WHERE userID = ?";

  db.query(q1, [userId], (err, data) => {
    if (err) {
      console.error("Error fetching portfolio:", err);
      return res.status(500).json({ error: err.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "No portfolio found for this userId" });
    }

    const portfolioID = data[0].portfolioID;

    // Step 2: Delete the specific interests section based on interestsSectionID and portfolioID
    const q2 = "DELETE FROM interests WHERE interestsSectionID = ? AND portfolioID = ?";

    db.query(q2, [interestsSectionID, portfolioID], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Error deleting interests section:", deleteErr);
        return res.status(500).json({ error: deleteErr.message });
      }

      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ error: "Interests section not found with given interestsSectionID and portfolioID" });
      }

      res.status(200).json({ message: "Interests section deleted successfully" });
    });
  });
};

// INTERESTS SECTION'S APIS



// AWARDS SECTION'S APIS
export const saveAwardsData = (req, res) => {
    const userId = req.params.userId;
    const awards = req.body.awards;
  
    // Check if the user exists in the portfolio table
    const portfolioCheckQuery = `
      SELECT * FROM portfolio WHERE userID = ?
    `;
    db.query(portfolioCheckQuery, [userId], (err, rows) => {
      if (err) {
        console.error('Error checking user portfolio:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'User portfolio not found' });
      }
  
      const portfolioID = rows[0].portfolioID;
  
      db.beginTransaction(function (err) {
        if (err) {
          console.error('Error starting transaction:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        awards.forEach((item) => {
          const { awardsSectionID, awardTitle, awardDescription } = item;
  
          const checkQuery = `
            SELECT * FROM awards WHERE portfolioID = ? AND awardsSectionID = ?
          `;
          db.query(checkQuery, [portfolioID, awardsSectionID], (err, rows) => {
            if (err) {
              console.error('Error checking awards section:', err);
              return res.status(500).json({ message: 'Internal server error' });
            }
  
            if (rows.length > 0) {
              // If the section exists, update
              const updateQuery = `
                UPDATE awards
                SET awardTitle = ?, awardDescription = ?
                WHERE portfolioID = ? AND awardsSectionID = ?
              `;
              db.query(
                updateQuery,
                [awardTitle, awardDescription, portfolioID, awardsSectionID],
                (err, result) => {
                  if (err) {
                    console.error('Error updating awards:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                  }
                  console.log('Awards updated successfully');
                }
              );
            } else {
              // Insert new if it doesn't exist
              const insertQuery = `
                INSERT INTO awards (awardsSectionID, awardTitle, awardDescription, portfolioID)
                VALUES (?, ?, ?, ?)
              `;
              db.query(
                insertQuery,
                [awardsSectionID, awardTitle, awardDescription, portfolioID],
                (err, result) => {
                  if (err) {
                    console.error('Error inserting awards:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                  }
                  console.log('Awards inserted successfully');
  
                  const updatePortfolioQuery = `
                    UPDATE portfolio
                    SET awardsID = ?
                    WHERE portfolioID = ?
                  `;
                  db.query(
                    updatePortfolioQuery,
                    [result.insertId, portfolioID],
                    (err, result) => {
                      if (err) {
                        console.error('Error updating portfolio with awardsID:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                      }
                      console.log('Portfolio updated with awardsID');
                    }
                  );
                }
              );
            }
          });
        });
  
        db.commit((err) => {
          if (err) {
            console.error('Error committing transaction:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }
          console.log('Transaction committed successfully');
          res.status(200).json({ message: 'Awards data saved successfully' });
        });
      });
    });
  };

  
  export const getAwardsData = (req, res) => {
    const userId = req.params.userId;
  
    const query = `
      SELECT 
        a.awardsID,
        a.portfolioID,
        a.awardsSectionID,
        a.awardTitle,
        a.awardDescription
      FROM 
        awards a
      JOIN 
        portfolio p 
      ON 
        a.portfolioID = p.portfolioID
      WHERE 
        p.userID = ?
    `;
  
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error fetching awards data:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'Awards data not found for this user' });
      }
  
      res.status(200).json(result); // Send fetched data
    });
  };
  



  export const getLastAwardsSectionID = (req, res) => {
    const portfolioQuery = "SELECT portfolioID FROM portfolio WHERE userID = ?";
  
    db.query(portfolioQuery, [req.query.userId], (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (data.length === 0) {
        return res.status(404).json({ error: "No data found for this user" });
      }
  
      const portfolioID = data[0].portfolioID;
  
      const lastSectionQuery = `
        SELECT MAX(awardsSectionID) AS lastAwardsSectionID
        FROM awards 
        WHERE portfolioID = ?
      `;
  
      db.query(lastSectionQuery, [portfolioID], (err, data) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
  
        if (data.length === 0) {
          return res.status(404).json({ error: "No awards section found for this portfolioID" });
        }
  
        const incrementedAwardsSectionID = data[0].lastAwardsSectionID + 1; // Incremented ID
  
        return res.status(200).json(incrementedAwardsSectionID); // Return only the ID
      });
    });
  };

  

  export const deleteAwardsSection = (req, res) => {
    const { userId, awardsSectionID } = req.query;
  
    if (!userId || !awardsSectionID) {
      return res.status(400).json({ error: "Missing userId or awardsSectionID" });
    }
  
    const portfolioQuery = `
      SELECT portfolioID
      FROM portfolio 
      WHERE userID = ?
    `;
  
    db.query(portfolioQuery, [userId], (err, data) => {
      if (err) {
        console.error("Error fetching portfolio:", err);
        return res.status(500).json({ error: err.message });
      }
  
      if (data.length === 0) {
        return res.status(404).json({ error: "No portfolio found for this userId" });
      }
  
      const portfolioID = data[0].portfolioID;
  
      const deleteQuery = `
        DELETE FROM awards 
        WHERE awardsSectionID = ? AND portfolioID = ?
      `;
  
      db.query(deleteQuery, [awardsSectionID, portfolioID], (err, result) => {
        if (err) {
          console.error("Error deleting awards section:", err);
          return res.status(500).json({ error: err.message });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Awards section not found with given awardsSectionID and portfolioID" });
        }
  
        res.status(200).json({ message: "Awards section deleted successfully" });
      });
    });
  };
  

// AWARDS SECTION'S APIS





//CERTIFICATIONS SECTION'S APIS
// export const saveCertificationsData = (req, res) => {
//     const userId = req.params.userId;
//     const certifications = req.body.certifications;
  
//     const portfolioCheckQuery = `
//       SELECT * FROM portfolio WHERE userID = ?
//     `;
//     db.query(portfolioCheckQuery, [userId], (err, rows) => {
//       if (err) {
//         console.error('Error checking user portfolio:', err);
//         return res.status(500).json({ message: 'Internal server error' });
//       }
  
//       if (rows.length === 0) {
//         return res.status(404).json({ message: 'User portfolio not found' });
//       }
  
//       const portfolioID = rows[0].portfolioID;
  
//       db.beginTransaction(function (err) {
//         if (err) {
//           console.error('Error starting transaction:', err);
//           return res.status(500).json({ message: 'Internal server error' });
//         }
  
//         certifications.forEach((item) => {
//           const { certificationsSectionID, certificationName, certificationDescription } = item;
  
//           const checkQuery = `
//             SELECT * FROM certifications WHERE portfolioID = ? AND certificationsSectionID = ?
//           `;
//           db.query(checkQuery, [portfolioID, certificationsSectionID], (err, rows) => {
//             if (err) {
//               console.error('Error checking certifications section:', err);
//               return res.status(500).json({ message: 'Internal server error' });
//             }
  
//             if (rows.length > 0) {
//               // Update existing certification
//               const updateQuery = `
//                 UPDATE certifications
//                 SET certificationName = ?, certificationDescription = ?
//                 WHERE portfolioID = ? AND certificationsSectionID = ?
//               `;
//               db.query(
//                 updateQuery,
//                 [certificationName, certificationDescription, portfolioID, certificationsSectionID],
//                 (err, result) => {
//                   if (err) {
//                     console.error('Error updating certifications:', err);
//                     return res.status(500).json({ message: 'Internal server error' });
//                   }
//                   console.log('Certifications updated successfully');
//                 }
//               );
//             } else {
//               // Insert new certification
//               const insertQuery = `
//                 INSERT INTO certifications (certificationsSectionID, certificationName, certificationDescription, portfolioID)
//                 VALUES (?, ?, ?, ?)
//               `;
//               db.query(
//                 insertQuery,
//                 [certificationsSectionID, certificationName, certificationDescription, portfolioID],
//                 (err, result) => {
//                   if (err) {
//                     console.error('Error inserting certifications:', err);
//                     return res.status(500).json({ message: 'Internal server error' });
//                   }
//                   console.log('Certifications inserted successfully');
//                 }
//               );
//             }
//           });
//         });
  
//         db.commit((err) => {
//           if (err) {
//             console.error('Error committing transaction:', err);
//             return res.status(500).json({ message: 'Internal server error' });
//           }
//           console.log('Transaction committed successfully');
//           res.status(200).json({ message: 'Certifications data saved successfully' });
//         });
//       });
//     });
//   };

export const saveCertificationsData = (req, res) => {
    const userId = req.params.userId;
    const certifications = req.body.certifications;
  
    // Check if the user exists in the portfolio table
    const portfolioCheckQuery = `
      SELECT portfolioID FROM portfolio WHERE userID = ?
    `;
    db.query(portfolioCheckQuery, [userId], (err, rows) => {
      if (err) {
        console.error('Error checking user portfolio:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'User portfolio not found' });
      }
  
      const portfolioID = rows[0].portfolioID;
  
      // Start a transaction
      db.beginTransaction((err) => {
        if (err) {
          console.error('Error starting transaction:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        certifications.forEach((item) => {
          const { certificationsSectionID, certificationName, certificationDescription } = item;
  
          const checkQuery = `
            SELECT * FROM certifications WHERE portfolioID = ? AND certificationsSectionID = ?
          `;
          db.query(checkQuery, [portfolioID, certificationsSectionID], (err, rows) => {
            if (err) {
              console.error('Error checking certifications section:', err);
              return res.status(500).json({ message: 'Internal server error' });
            }
  
            if (rows.length > 0) {
              // Update existing certification
              const updateQuery = `
                UPDATE certifications
                SET certificationName = ?, certificationDescription = ?
                WHERE portfolioID = ? AND certificationsSectionID = ?
              `;
              db.query(
                updateQuery,
                [certificationName, certificationDescription, portfolioID, certificationsSectionID],
                (err, result) => {
                  if (err) {
                    console.error('Error updating certifications:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                  }
                  console.log('Certifications updated successfully');
                }
              );
            } else {
              // Insert new certification
              const insertQuery = `
                INSERT INTO certifications (certificationsSectionID, certificationName, certificationDescription, portfolioID)
                VALUES (?, ?, ?, ?)
              `;
              db.query(
                insertQuery,
                [certificationsSectionID, certificationName, certificationDescription, portfolioID],
                (err, result) => {
                  if (err) {
                    console.error('Error inserting certifications:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                  }
              
                  console.log('Certifications inserted successfully');
              
                  // Log the inserted certification ID
                  const certificationsID = result.insertId;
                  console.log('Inserted certification ID:', certificationsID);
                  
              console.log("certificationsID",certificationsID)

                  // Now update the portfolio with this certification ID
                  const updatePortfolioQuery = `
                    UPDATE portfolio
                    SET certificationsID = ?
                    WHERE portfolioID = ?
                  `;
                  db.query(
                    updatePortfolioQuery,
                    [certificationsID, portfolioID],
                    (err, result) => {
                      if (err) {
                        console.error('Error updating portfolio with certificationsID:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                      }
                      console.log('Portfolio updated with certificationsID');
                    }
                  );
                }
              );

            }
          });
        });
  
        // Commit the transaction
        db.commit((err) => {
          if (err) {
            console.error('Error committing transaction:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }
          console.log('Transaction committed successfully');
          res.status(200).json({ message: 'Certifications data saved successfully' });
        });
      });
    });
  };
  
  
  
  export const getCertificationsData = (req, res) => {
    const userId = req.params.userId;
  
    const query = `
      SELECT 
        c.certificationsID,
        c.portfolioID,
        c.certificationsSectionID,
        c.certificationName,
        c.certificationDescription
      FROM 
        certifications c
      JOIN 
        portfolio p 
      ON 
        c.portfolioID = p.portfolioID
      WHERE 
        p.userID = ?
    `;
  
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error fetching certifications data:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'Certifications data not found for this user' });
      }
  
      res.status(200).json(result);
    });
  };

  

  export const getLastCertificationsSectionID = (req, res) => {
    const portfolioQuery = "SELECT portfolioID FROM portfolio WHERE userID = ?";
  
    db.query(portfolioQuery, [req.query.userId], (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (data.length === 0) {
        return res.status(404).json({ error: "No data found for this user" });
      }
  
      const portfolioID = data[0].portfolioID;
  
      const lastSectionQuery = `
        SELECT MAX(certificationsSectionID) AS lastCertificationsSectionID
        FROM certifications 
        WHERE portfolioID = ?
      `;
  
      db.query(lastSectionQuery, [portfolioID], (err, data) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
  
        if (data.length === 0) {
          return res.status(404).json({ error: "No certifications section found for this portfolioID" });
        }
  
        const incrementedCertificationsSectionID = data[0].lastCertificationsSectionID + 1; // Incremented ID
  
        return res.status(200).json(incrementedCertificationsSectionID); // Return the incremented ID
      });
    });
  };

  
  export const deleteCertificationsSection = (req, res) => {
    const { userId, certificationsSectionID } = req.query;
  
    if (!userId || !certificationsSectionID) {
      return res.status(400).json({ error: "Missing userId or certificationsSectionID" });
    }
  
    const portfolioQuery = `
      SELECT portfolioID
      FROM portfolio 
      WHERE userID = ?
    `;
  
    db.query(portfolioQuery, [userId], (err, data) => {
      if (err) {
        console.error("Error fetching portfolio:", err);
        return res.status(500).json({ error: err.message });
      }
  
      if (data.length === 0) {
        return res.status(404).json({ error: "No portfolio found for this userId" });
      }
  
      const portfolioID = data[0].portfolioID;
  
      const deleteQuery = `
        DELETE FROM certifications 
        WHERE certificationsSectionID = ? AND portfolioID = ?
      `;
  
      db.query(deleteQuery, [certificationsSectionID, portfolioID], (err, result) => {
        if (err) {
          console.error("Error deleting certifications section:", err);
          return res.status(500).json({ error: err.message });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Certifications section not found with given certificationsSectionID and portfolioID" });
        }
  
        res.status(200).json({ message: "Certifications section deleted successfully" });
      });
    });
  };
  
//CERTIFICATIONS SECTION'S APIS







// GETTING THE SECTIONS IDS

// Get Available Sections for a User
export const getUserSections = (req, res) => {
  const userId = req.query.userId;

  // Query to get the portfolio information for the given user
  const query = `
    SELECT 
      aboutID,
      educationID, 
      experienceID, 
      skillsID, 
      awardsID, 
      certificationsID, 
      interestsID
    FROM portfolio
    WHERE userID = ?
  `;

  db.query(query, [userId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "No portfolio found for this userId" });
    }

    const portfolio = data[0]; // Fetch the portfolio row for the given user
    const availableSections = [];

    // Check which sections have a valid ID (non-null)
    if (portfolio.aboutID) availableSections.push("about");
    if (portfolio.educationID) availableSections.push("education");
    if (portfolio.experienceID) availableSections.push("experience");
    if (portfolio.skillsID) availableSections.push("skills");
    if (portfolio.awardsID) availableSections.push("awards");
    if (portfolio.certificationsID) availableSections.push("certifications");
    if (portfolio.interestsID) availableSections.push("interests");
    
    
    

    // Return the list of available sections
    return res.status(200).json(availableSections);
  });
};
