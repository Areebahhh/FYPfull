import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
// import '../vendor/bootstrap/css/bootstrap.min.css';
// import '../vendor/font-awesome/css/font-awesome.min.css';
// import '../vendor/devicons/css/devicons.min.css';
// import '../vendor/simple-line-icons/css/simple-line-icons.css';
// import '../css/resume.min.css';

function InterestsP() {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;

  const [interests, setInterests] = useState([]);
  const [latestInterestsSectionID, setLatestInterestsSectionID] = useState(null);

  // Fetch the last section ID for interests
  const fetchInterestsSectionID = (userId) => {
    return fetch(`http://localhost:8800/api/portfolio/getLastInterestsSectionID?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch InterestsSectionID');
        }
        return response.json();
      })
      .then((interestsSectionID) => {
        setLatestInterestsSectionID(interestsSectionID);
        return interestsSectionID;
      })
      .catch((error) => {
        console.error('Error fetching InterestsSectionID:', error);
        throw error;
      });
  };

  // Fetch interests data for the current user
  const loadInterestsData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8800/api/portfolio/getInterestsData/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch interests data');
      }
      const interestsData = await response.json();
      setInterests(interestsData); // Update the state with fetched data
    } catch (error) {
      console.error('Error fetching interests data:', error);
    }
  };

  useEffect(() => {
    loadInterestsData(userId); // Load interests data when component mounts

    // If no existing interests items, add a default section with `interestsSectionID` set to 1
    if (interests.length === 0) {
      const defaultInterestsSection = {
        paragraph1: '',
        paragraph2: '',
        interestsSectionID: 1, // Default `interestsSectionID`
      };

      setInterests([defaultInterestsSection]); // Initialize with the default section
    }
  }, [userId]);

  const handleAddMore = () => {
    fetchInterestsSectionID(userId).then((interestsSectionID) => {
      const newItem = {
        paragraph1: '',
        paragraph2: '',
        interestsSectionID: interestsSectionID,
      };
      setInterests([...interests, newItem]); // Update the state with the new item
    });
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    const updatedItems = interests.map((item) => {
      if (item.interestsSectionID === id) {
        return { ...item, [name]: value };
      }
      return item;
    });
    setInterests(updatedItems); // Update state with changes
  };

  const handleRemove = async (interestsSectionID) => {
    try {
      const response = await fetch(
        `http://localhost:8800/api/portfolio/deleteInterestsSection?userId=${userId}&interestsSectionID=${interestsSectionID}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete interest');
      }
      setInterests(interests.filter((item) => item.interestsSectionID !== interestsSectionID)); // Remove from state
    } catch (error) {
      console.error('Error deleting interest:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await fetch(`http://localhost:8800/api/portfolio/saveInterestsData/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests }),
      });
      console.log('Interests data saved successfully');
    } catch (error) {
      console.error('Error saving interests data:', error);
    }
  };

  return (
    <section className="resume-section p-3 p-lg-5 d-flex flex-column" id="Interests">
      <div className="my-auto">
        <h2 className="mb-5">Interests</h2>
        {interests.map((item) => (
          <div key={item.interestsSectionID} className="mb-5">
            <p>
              <input
                type="text"
                name="paragraph1"
                placeholder="Paragraph 1"
                style={{ border: 'none' }}
                value={item.paragraph1}
                onChange={(e) => handleChange(item.interestsSectionID, e)}
              />
            </p>
            <p className="mb-0">
              <input
                type="text"
                name="paragraph2"
                placeholder="Paragraph 2"
                style={{ border: 'none' }}
                value={item.paragraph2}
                onChange={(e) => handleChange(item.interestsSectionID, e)}
              />
            </p>
            <button onClick={() => handleRemove(item.interestsSectionID)} style={{ float: 'right' }}>
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddMore}>Add More</button>
        <button onClick={handleSubmit}>Save</button>
      </div>
    </section>
  );
}

export default InterestsP;
