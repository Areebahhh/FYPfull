







// POSTING, UPDATING AND FETCHING DATA CORRECTLY
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
// import '../vendor/bootstrap/css/bootstrap.min.css';
// import '../vendor/font-awesome/css/font-awesome.min.css';
// import '../vendor/devicons/css/devicons.min.css';
// import '../vendor/simple-line-icons/css/simple-line-icons.css';
// import '../css/resume.min.css';

function EducationP() {
    const { currentUser } = useContext(AuthContext);
    const userId = currentUser.id;

    const [educationItems, setEducationItems] = useState([]);







 const [latestEducationSectionID, setLatestEducationSectionID] = useState(null); // State for storing fetched educationSectionID

  // Function to fetch educationSectionID


  const fetchEducationSectionID = (userId) => {
    return fetch("http://localhost:8800/api/portfolio/getLastEducationSectionID?userId=" + userId)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch educationSectionID');
        }
        return response.json();
      })
      .then(educationSectionID => {
        setLatestEducationSectionID(educationSectionID); // Store the numeric value in state
        return educationSectionID; // Return the value to be used
      })
      .catch(error => {
        console.error('Error fetching educationSectionID:', error);
        throw error;
      });
  };
  

useEffect(() => {

    console.log("inside 2nd use effect latestEducationSectionID", latestEducationSectionID);
    
}, [latestEducationSectionID])












    // Function to fetch education data for the current user


   const loadEducationData = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8800/api/portfolio/getEducationData/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch education data');
        }
        const educationData = await response.json();
        setEducationItems(educationData); // Initialize state with fetched data
    } catch (error) {
        console.error('Error fetching education data:', error);
    }
};

useEffect(() => {
    loadEducationData(userId); // Load education data when component mounts

    // gpt code

    // If no existing education items, add a default section with `educationSectionID` set to 1
    if (educationItems.length === 0) {
        const defaultEducationSection = {
            universityName: '',
            degreeType: '',
            courseName: '',
            cgpa: '',
            degreeDate: '',
            educationSectionID: 1, // Default `educationSectionID`
        };

        setEducationItems([defaultEducationSection]); // Initialize with the default section
    }


}, [userId]);










    const handleAddMore = () => {
        fetchEducationSectionID(userId)
          .then((educationSectionID) => {
            console.log("in ADD MORE latestEducationSectionID", educationSectionID);
      
            const newItem = {
              universityName: '',
              degreeType: '',
              courseName: '',
              cgpa: '',
              degreeDate: '',
              educationSectionID: educationSectionID, // Use the updated educationSectionID
            };
      
            setEducationItems([...educationItems, newItem]); // Update the state with the new item
      
            console.log("Adding new section with educationSectionID:", educationSectionID);
          })
          .catch(error => {
            console.error("Error in handleAddMore:", error);
          });
        //   fetchEducationSectionID(userId);
      };
      







    const handleChange = (id, e) => {
        console.log(`Handling change for educationSectionID: ${id}`); // Confirm the ID is passed
        const { name, value } = e.target;
    
        const updatedItems = educationItems.map((item) => {
            if (item.educationSectionID === id) { // Use the correct identifier
                return { ...item, [name]: value }; // Update the specific field
            }
            return item;
        });
    
        setEducationItems(updatedItems);
    };
    


    
    const handleRemove = async (educationSectionID) => {
        console.log('Attempting to delete education section with ID:', educationSectionID); // Debugging
    
        if (!educationSectionID) {
            console.error('educationSectionID is undefined or invalid');
            return; // Early exit if there's an issue with the ID
        }
    
        try {
            const response = await fetch(
                `http://localhost:8800/api/portfolio/deleteEducationSection?userId=${userId}&educationSectionID=${educationSectionID}`,
                {
                    method: 'DELETE',
                }
            );
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete education section');
            }
    
            setEducationItems((prevState) =>
                prevState.filter((item) => item.educationSectionID !== educationSectionID)
            );
    
            console.log('Education section deleted successfully');
        } catch (error) {
            console.error('Error deleting education section:', error);
        }
    };
    
    


    const handleSubmit = async () => {
        try {
            await fetch(`http://localhost:8800/api/portfolio/saveEducationData/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ educationItems }),
            });
            console.log('Education data saved successfully');
        } catch (error) {
            console.error('Error saving education data:', error);
        }
    };


    

    return (
        <section className="resume-section p-3 p-lg-5 d-flex flex-column" id="Education">
            <div className="my-auto">
                <h2 className="mb-5">Education</h2>
                {educationItems.map((item) => (
                    <div key={item.educationSectionID} className="resume-item d-flex flex-column flex-md-row mb-5">
                        <div className="resume-content mr-auto">
                            <h3 className="mb-0">
                                <input
                                    type="text"
                                    name="universityName"
                                    placeholder="University"
                                    style={{ border: 'none' }}
                                    value={item.universityName}
                                    onChange={(e) => handleChange(item.educationSectionID, e)}
                                />
                            </h3>
                            <div className="subheading mb-3">
                                <input
                                    type="text"
                                    name="degreeType"
                                    placeholder="Degree Type"
                                    style={{ border: 'none' }}
                                    value={item.degreeType}
                                    onChange={(e) => handleChange(item.educationSectionID, e)}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="courseName"
                                    placeholder="Course Name"
                                    style={{ border: 'none' }}
                                    value={item.courseName}
                                    onChange={(e) => handleChange(item.educationSectionID, e)}
                                />
                            </div>
                            <p>
                                CGPA: 
                                <input
                                    type="text"
                                    name="cgpa"
                                    placeholder="CGPA"
                                    style={{ border: 'none' }}
                                    value={item.cgpa}
                                    onChange={(e) => handleChange(item.educationSectionID, e)}
                                />
                            </p>
                        </div>
                        <div className="resume-date text-md-right">
                            <span className="text-primary">
                                <input
                                    type="text"
                                    name="degreeDate"
                                    placeholder="Degree Timeline"
                                    style={{ border: 'none' }}
                                    value={item.degreeDate}
                                    onChange={(e) => handleChange(item.educationSectionID, e)}
                                />
                            </span>
                        </div>
                        {/* <button onClick={() => handleRemove(item.id)}>Remove</button> */}
                        <button onClick={() => handleRemove(item.educationSectionID)}>Remove</button> {/* Ensure this parameter is correct */}
                    </div>
                ))}
                <button onClick={handleAddMore}>Add More</button>
                <button onClick={handleSubmit}>Save</button>
            </div>
        </section>
    );
}

export default EducationP;

// POSTING, UPDATING AND FETCHING DATA CORRECTLY





































// // POSTING, UPDATING AND FETCHING DATA CORRECTLY
// import React, { useEffect, useState, useContext } from 'react';
// import { AuthContext } from '../../context/authContext';
// import '../vendor/bootstrap/css/bootstrap.min.css';
// import '../vendor/font-awesome/css/font-awesome.min.css';
// import '../vendor/devicons/css/devicons.min.css';
// import '../vendor/simple-line-icons/css/simple-line-icons.css';
// import '../css/resume.min.css';

// function EducationP() {
//     const { currentUser } = useContext(AuthContext);
//     const userId = currentUser.id;

//     const [educationItems, setEducationItems] = useState([]);







//  const [latestEducationSectionID, setLatestEducationSectionID] = useState(null); // State for storing fetched educationSectionID

//   // Function to fetch educationSectionID


//   const fetchEducationSectionID = (userId) => {
//     return fetch("http://localhost:8800/api/portfolio/getLastEducationSectionID?userId=" + userId)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch educationSectionID');
//         }
//         return response.json();
//       })
//       .then(educationSectionID => {
//         setLatestEducationSectionID(educationSectionID); // Store the numeric value in state
//         return educationSectionID; // Return the value to be used
//       })
//       .catch(error => {
//         console.error('Error fetching educationSectionID:', error);
//         throw error;
//       });
//   };
  


// //   const fetchEducationSectionID = async (userId) => {
// //     try {
// //         const response = await fetch("http://localhost:8800/api/portfolio/getLastEducationSectionID?userId=" + userId);
// //         if (!response.ok) {
// //             throw new Error('Failed to fetch educationSectionID');
// //         }
// //         const educationSectionID = await response.json(); // Fetched numeric value
// //         setLatestEducationSectionID(educationSectionID); // Store the numeric value in state
// //     } catch (error) {
// //         console.error('Error fetching educationSectionID:', error);
// //     }
// // };

// // useEffect(() => {
// //     // Fetch the educationSectionID when component mounts
// //     fetchEducationSectionID(userId);
// //     console.log(" latestEducationSectionID", latestEducationSectionID);
// // }, []);


// useEffect(() => {

//     console.log("inside 2nd use effect latestEducationSectionID", latestEducationSectionID);
    
// }, [latestEducationSectionID])












//     // Function to fetch education data for the current user


//    const loadEducationData = async (userId) => {
//     try {
//         const response = await fetch(`http://localhost:8800/api/portfolio/getEducationData/${userId}`);
//         if (!response.ok) {
//             throw new Error('Failed to fetch education data');
//         }
//         const educationData = await response.json();
//         setEducationItems(educationData); // Initialize state with fetched data
//     } catch (error) {
//         console.error('Error fetching education data:', error);
//     }
// };

// useEffect(() => {
//     loadEducationData(userId); // Load education data when component mounts
// }, [userId]);



















//     // const handleAddMore = () => {

//     //     fetchEducationSectionID(userId);
//     //     console.log("in ADD MORE latestEducationSectionID", latestEducationSectionID);

//     //     const newId = educationItems.length > 0 ? educationItems[educationItems.length - 1].id + 1 : 1;
    
//     //     // // Ensure unique educationSectionID
//     //     // const newSectionId = educationItems.length + 1;

//     //     // console.log(`Adding new section with ID: ${newId}, educationSectionID: ${newSectionId}`); // Ensure unique ID and log it

//     //     console.log(`Adding new section with ID: ${latestEducationSectionID}`); // Ensure unique ID and log it
    
//     //     const newItem = {
//     //         // id: newId, 
//     //         // Unique ID
//     //         universityName: '',
//     //         degreeType: '',
//     //         courseName: '',
//     //         cgpa: '',
//     //         degreeDate: '',
//     //         educationSectionID: latestEducationSectionID, // Ensure unique educationSectionID
//     //     };
    
//     //     setEducationItems([...educationItems, newItem]); // Update the state with the new item

//     //     console.log("newid: ", newId);
//     //     console.log("latestEducationSectionID: ", latestEducationSectionID);
//     // };



//     const handleAddMore = () => {
//         fetchEducationSectionID(userId)
//           .then((educationSectionID) => {
//             console.log("in ADD MORE latestEducationSectionID", educationSectionID);
      
//             const newItem = {
//               universityName: '',
//               degreeType: '',
//               courseName: '',
//               cgpa: '',
//               degreeDate: '',
//               educationSectionID: educationSectionID, // Use the updated educationSectionID
//             };
      
//             setEducationItems([...educationItems, newItem]); // Update the state with the new item
      
//             console.log("Adding new section with educationSectionID:", educationSectionID);
//           })
//           .catch(error => {
//             console.error("Error in handleAddMore:", error);
//           });
//           fetchEducationSectionID(userId);
//       };
      







//     const handleChange = (id, e) => {
//         console.log(`Handling change for educationSectionID: ${id}`); // Confirm the ID is passed
//         const { name, value } = e.target;
    
//         const updatedItems = educationItems.map((item) => {
//             if (item.educationSectionID === id) { // Use the correct identifier
//                 return { ...item, [name]: value }; // Update the specific field
//             }
//             return item;
//         });
    
//         setEducationItems(updatedItems);
//     };
    



//     // const handleRemove = (id) => {
//     //     setEducationItems((prevState) => prevState.filter((item) => item.id !== id));
//     // };
    
//     const handleRemove = async (educationSectionID) => {
//         console.log('Attempting to delete education section with ID:', educationSectionID); // Debugging
    
//         if (!educationSectionID) {
//             console.error('educationSectionID is undefined or invalid');
//             return; // Early exit if there's an issue with the ID
//         }
    
//         try {
//             const response = await fetch(
//                 `http://localhost:8800/api/portfolio/deleteEducationSection?userId=${userId}&educationSectionID=${educationSectionID}`,
//                 {
//                     method: 'DELETE',
//                 }
//             );
    
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to delete education section');
//             }
    
//             setEducationItems((prevState) =>
//                 prevState.filter((item) => item.educationSectionID !== educationSectionID)
//             );
    
//             console.log('Education section deleted successfully');
//         } catch (error) {
//             console.error('Error deleting education section:', error);
//         }
//     };
    
    


//     const handleSubmit = async () => {
//         try {
//             await fetch(`http://localhost:8800/api/portfolio/saveEducationData/${userId}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ educationItems }),
//             });
//             console.log('Education data saved successfully');
//         } catch (error) {
//             console.error('Error saving education data:', error);
//         }
//     };


    

//     return (
//         <section className="resume-section p-3 p-lg-5 d-flex flex-column" id="Education">
//             <div className="my-auto">
//                 <h2 className="mb-5">Education</h2>
//                 {educationItems.map((item) => (
//                     <div key={item.educationSectionID} className="resume-item d-flex flex-column flex-md-row mb-5">
//                         <div className="resume-content mr-auto">
//                             <h3 className="mb-0">
//                                 <input
//                                     type="text"
//                                     name="universityName"
//                                     placeholder="University"
//                                     style={{ border: 'none' }}
//                                     value={item.universityName}
//                                     onChange={(e) => handleChange(item.educationSectionID, e)}
//                                 />
//                             </h3>
//                             <div className="subheading mb-3">
//                                 <input
//                                     type="text"
//                                     name="degreeType"
//                                     placeholder="Degree Type"
//                                     style={{ border: 'none' }}
//                                     value={item.degreeType}
//                                     onChange={(e) => handleChange(item.educationSectionID, e)}
//                                 />
//                             </div>
//                             <div>
//                                 <input
//                                     type="text"
//                                     name="courseName"
//                                     placeholder="Course Name"
//                                     style={{ border: 'none' }}
//                                     value={item.courseName}
//                                     onChange={(e) => handleChange(item.educationSectionID, e)}
//                                 />
//                             </div>
//                             <p>
//                                 CGPA: 
//                                 <input
//                                     type="text"
//                                     name="cgpa"
//                                     placeholder="CGPA"
//                                     style={{ border: 'none' }}
//                                     value={item.cgpa}
//                                     onChange={(e) => handleChange(item.educationSectionID, e)}
//                                 />
//                             </p>
//                         </div>
//                         <div className="resume-date text-md-right">
//                             <span className="text-primary">
//                                 <input
//                                     type="text"
//                                     name="degreeDate"
//                                     placeholder="Degree Timeline"
//                                     style={{ border: 'none' }}
//                                     value={item.degreeDate}
//                                     onChange={(e) => handleChange(item.educationSectionID, e)}
//                                 />
//                             </span>
//                         </div>
//                         {/* <button onClick={() => handleRemove(item.id)}>Remove</button> */}
//                         <button onClick={() => handleRemove(item.educationSectionID)}>Remove</button> {/* Ensure this parameter is correct */}
//                     </div>
//                 ))}
//                 <button onClick={handleAddMore}>Add More</button>
//                 <button onClick={handleSubmit}>Save</button>
//             </div>
//         </section>
//     );
// }

// export default EducationP;

// // POSTING, UPDATING AND FETCHING DATA CORRECTLY

























