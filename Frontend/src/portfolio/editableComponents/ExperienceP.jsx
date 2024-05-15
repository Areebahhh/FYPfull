


import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
// import '../vendor/bootstrap/css/bootstrap.min.css';
// import '../vendor/font-awesome/css/font-awesome.min.css';
// import '../vendor/devicons/css/devicons.min.css';
// import '../vendor/simple-line-icons/css/simple-line-icons.css';
// import '../css/resume.min.css';

function ExperienceP() {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;

  const [experienceItems, setExperienceItems] = useState([]);
  const [latestExperienceSectionID, setLatestExperienceSectionID] = useState(null);



  // Function to fetch the latest Experience Section ID
  const fetchExperienceSectionID = (userId) => {
    return fetch(`http://localhost:8800/api/portfolio/getLastExperienceSectionID?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch ExperienceSectionID');
        }
        return response.json();
      })
      .then((experienceSectionID) => {
        setLatestExperienceSectionID(experienceSectionID);
        return experienceSectionID;
      })
      .catch((error) => {
        console.error('Error fetching ExperienceSectionID:', error);
        throw error;
      });
  };






  // Function to fetch experience data for the current user
  const loadExperienceData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8800/api/portfolio/getExperienceData/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch experience data');
      }
      const experienceData = await response.json();
      setExperienceItems(experienceData);
    } catch (error) {
      console.error('Error fetching experience data:', error);
    }
  };

//   useEffect(() => {
//     fetchExperienceSectionID(userId); // Fetch the latest Experience Section ID when the component mounts
//     loadExperienceData(userId); // Fetch experience data when the component mounts
//   }, [userId]);



useEffect(() => {
    loadExperienceData(userId); // Load education data when component mounts

    // gpt code

    // If no existing Experience items, add a default section with `experienceSectionID` set to 1
    if (experienceItems.length === 0) {
        const defaultExperienceSection = {
            jobTitle: '',
            jobCompany: '',
            jobDescription: '',
            jobDate: '',
            experienceSectionID: 1, // Default `experienceSectionID`
        };

        setExperienceItems([defaultExperienceSection]); // Initialize with the default section
    }


}, [userId]);






  const handleAddMore = () => {
    fetchExperienceSectionID(userId)
    .then((experienceSectionID) => {
      const newItem = {
        jobTitle: '',
        jobCompany: '',
        jobDescription: '',
        jobDate: '',
        experienceSectionID: experienceSectionID, // Use the fetched ID
      };

      setExperienceItems([...experienceItems, newItem]);
    });
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    const updatedItems = experienceItems.map((item) => {
      if (item.experienceSectionID === id) {
        return { ...item, [name]: value };
      }
      return item;
    });

    setExperienceItems(updatedItems);
  };

  const handleRemove = async (experienceSectionID) => {
    try {
      const response = await fetch(
        `http://localhost:8800/api/portfolio/deleteExperienceSection?userId=${userId}&experienceSectionID=${experienceSectionID}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete experience section');
      }
      setExperienceItems(experienceItems.filter((item) => item.experienceSectionID !== experienceSectionID));
    } catch (error) {
      console.error('Error deleting experience section:', error);
    }
  };




  const handleSubmit = async () => {
    try {
      await fetch(`http://localhost:8800/api/portfolio/saveExperienceData/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ experienceItems }),
      });
      console.log('Experience data saved successfully');
    } catch (error) {
      console.error('Error saving experience data:', error);
    }
  };

  return (
    <section className="resume-section p-3 p-lg-5 d-flex flex-column" id="Experience">
      <div className="my-auto">
        <h2 className="mb-5">Experience</h2>
        {experienceItems.map((item) => (
          <div key={item.experienceSectionID} className="resume-item d-flex flex-column flex-md-row mb-5">
            <div className="resume-content mr-auto">
              <h3 className="mb-0">
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Job Title"
                  style={{ border: 'none' }}
                  value={item.jobTitle}
                  onChange={(e) => handleChange(item.experienceSectionID, e)}
                />
              </h3>
              <div className="subheading mb-3">
                <input
                  type="text"
                  name="jobCompany"
                  placeholder="Company Name"
                  style={{ border: 'none' }}
                  value={item.jobCompany}
                  onChange={(e) => handleChange(item.experienceSectionID, e)}
                />
              </div>
              <p>
                <input
                  type="text"
                  name="jobDescription"
                  placeholder="Job Description"
                  style={{ border: 'none' }}
                  value={item.jobDescription}
                  onChange={(e) => handleChange(item.experienceSectionID, e)}
                />
              </p>
            </div>
            <div className="resume-date text-md-right">
              <span className="text-primary">
                <input
                  type="text"
                  name="jobDate"
                  placeholder="Job Date"
                  style={{ border: 'none' }}
                  value={item.jobDate}
                  onChange={(e) => handleChange(item.experienceSectionID, e)}
                />
              </span>
            </div>
            <button onClick={() => handleRemove(item.experienceSectionID)}>Remove</button> {/* Ensure correct ID */}
          </div>
        ))}
        <button onClick={handleAddMore}>Add More</button>
        <button onClick={handleSubmit}>Save</button>
      </div>
    </section>
  );
}

export default ExperienceP;
