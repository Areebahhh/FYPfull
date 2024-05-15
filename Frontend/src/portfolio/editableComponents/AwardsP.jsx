import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
// import '../vendor/bootstrap/css/bootstrap.min.css';
// import '../vendor/font-awesome/css/font-awesome.min.css';
// import '../vendor/devicons/css/devicons.min.css';
// import '../vendor/simple-line-icons/css/simple-line-icons.css';
// import '../css/resume.min.css';

function AwardsP() {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;

  const [awards, setAwards] = useState([]);
  const [latestAwardsSectionID, setLatestAwardsSectionID] = useState(null);

  // Function to fetch the latest Awards Section ID
  const fetchAwardsSectionID = (userId) => {
    return fetch(`http://localhost:8800/api/portfolio/getLastAwardsSectionID?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch AwardsSectionID');
        }
        return response.json();
      })
      .then((awardsSectionID) => {
        setLatestAwardsSectionID(awardsSectionID);
        return awardsSectionID;
      })
      .catch((error) => {
        console.error('Error fetching AwardsSectionID:', error);
        throw error;
      });
  };

  // Function to fetch awards data
  const loadAwardsData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8800/api/portfolio/getAwardsData/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch awards data');
      }
      const awardsData = await response.json();
      setAwards(awardsData); // Update the state with fetched data
    } catch (error) {
      console.error('Error fetching awards data:', error);
    }
  };

//   useEffect(() => {
//     loadAwardsData(userId); // Fetch awards data when the component mounts
//   }, [userId]);



useEffect(() => {
    loadAwardsData(userId); // Load education data when component mounts

    // gpt code

    // If no existing Experience items, add a default section with `experienceSectionID` set to 1
    if (awards.length === 0) {
        const defaultAwardsSection = {
            awardTitle: '',
            awardDescription: '',
            awardsSectionID: 1, // Default `experienceSectionID`
        };

        setAwards([defaultAwardsSection]); // Initialize with the default section
    }


}, [userId]);






  const handleAddMore = () => {
    fetchAwardsSectionID(userId).then((awardsSectionID) => {
      const newItem = {
        awardTitle: '',
        awardDescription: '',
        awardsSectionID: awardsSectionID,
      };
      setAwards([...awards, newItem]);
    });
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    const updatedItems = awards.map((item) => {
      if (item.awardsSectionID === id) {
        return { ...item, [name]: value };
      }
      return item;
    });
    setAwards(updatedItems);
  };

  const handleRemove = async (awardsSectionID) => {
    try {
      const response = await fetch(
        `http://localhost:8800/api/portfolio/deleteAwardsSection?userId=${userId}&awardsSectionID=${awardsSectionID}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete awards section');
      }
      setAwards(awards.filter((item) => item.awardsSectionID !== awardsSectionID));
    } catch (error) {
      console.error('Error deleting awards section:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await fetch(`http://localhost:8800/api/portfolio/saveAwardsData/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ awards }),
      });
      console.log('Awards data saved successfully');
    } catch (error) {
      console.error('Error saving awards data:', error);
    }
  };

  return (
    <section className="resume-section p-3 p-lg-5 d-flex flex-column" id="Awards">
      <div className="my-auto">
        <h2 className="mb-5">Awards</h2>
        {awards.map((item) => (
          <div key={item.awardsSectionID} className="mb-5">
            <ul className="fa-ul mb-0">
              <li>
                <i className="fa-li fa fa-trophy text-warning" />
                <input
                  type="text"
                  name="awardTitle"
                  placeholder="Award Title"
                  value={item.awardTitle}
                  onChange={(e) => handleChange(item.awardsSectionID, e)}
                  style={{ border: 'none' }}
                />
              </li>
            </ul>
            <input
              type="text"
              name="awardDescription"
              placeholder="Award Description"
              value={item.awardDescription}
              onChange={(e) => handleChange(item.awardsSectionID, e)}
              style={{ border: 'none' }}
            />
            <button onClick={() => handleRemove(item.awardsSectionID)} style={{ float: 'right' }}>
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

export default AwardsP;
