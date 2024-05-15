import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/authContext';
// import '../vendor/bootstrap/css/bootstrap.min.css';
// import '../vendor/font-awesome/css/font-awesome.min.css';
// import '../vendor/devicons/css/devicons.min.css';
// import '../vendor/simple-line-icons/css/simple-line-icons.css';
// import '../css/resume.min.css';

function CertificationsP() {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;

  const [certifications, setCertifications] = useState([]);
  const [latestCertificationsSectionID, setLatestCertificationsSectionID] = useState(null);

  // Fetch the last section ID for certifications
  const fetchCertificationsSectionID = (userId) => {
    return fetch(`http://localhost:8800/api/portfolio/getLastCertificationsSectionID?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch CertificationsSectionID');
        }
        return response.json();
      })
      .then((certificationsSectionID) => {
        setLatestCertificationsSectionID(certificationsSectionID);
        return certificationsSectionID;
      })
      .catch((error) => {
        console.error('Error fetching CertificationsSectionID:', error);
        throw error;
      });
  };

  // Fetch certification data for the current user
  const loadCertificationsData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8800/api/portfolio/getCertificationsData/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch certifications data');
      }
      const certificationsData = await response.json();
      setCertifications(certificationsData); // Update the state with fetched data
    } catch (error) {
      console.error('Error fetching certifications data:', error);
    }
  };

//   useEffect(() => {
//     loadCertificationsData(userId); // Fetch certification data when the component mounts
//   }, [userId]);


useEffect(() => {
    loadCertificationsData(userId); // Load education data when component mounts

    // gpt code

    // If no existing Experience items, add a default section with `experienceSectionID` set to 1
    if (certifications.length === 0) {
        const defaultCertificationsSection = {
            certificationName: '',
            certificationDescription: '',
            certificationsSectionID: 1, // Default `experienceSectionID`
        };

        setCertifications([defaultCertificationsSection]); // Initialize with the default section
    }


}, [userId]);






  const addCertification = () => {
    fetchCertificationsSectionID(userId).then((certificationsSectionID) => {
      const newItem = {
        certificationName: '',
        certificationDescription: '',
        certificationsSectionID: certificationsSectionID,
      };
      setCertifications([...certifications, newItem]);
    });
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    const updatedItems = certifications.map((item) => {
      if (item.certificationsSectionID === id) {
        return { ...item, [name]: value };
      }
      return item;
    });
    setCertifications(updatedItems);
  };

  const removeCertification = async (certificationsSectionID) => {
    try {
      const response = await fetch(
        `http://localhost:8800/api/portfolio/deleteCertificationsSection?userId=${userId}&certificationsSectionID=${certificationsSectionID}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete certification');
      }
      setCertifications(certifications.filter((item) => item.certificationsSectionID !== certificationsSectionID));
    } catch (error) {
      console.error('Error deleting certification:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await fetch(`http://localhost:8800/api/portfolio/saveCertificationsData/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certifications }),
      });
      console.log('Certifications data saved successfully');
    } catch (error) {
      console.error('Error saving certifications data:', error);
    }
  };

  return (
    <section className="resume-section p-3 p-lg-5 d-flex flex-column" id="Certifications">
      <div className="my-auto">
        <h2 className="mb-5">Certifications</h2>
        {certifications.map((item) => (
          <div key={item.certificationsSectionID}>
            <ul className="fa-ul mb-0">
              <li>
                <FontAwesomeIcon icon={faCertificate} style={{ color: '#dadd36' }} />
                <input
                  type="text"
                  name="certificationName"
                  placeholder="Certification Name"
                  style={{ border: 'none' }}
                  value={item.certificationName}
                  onChange={(e) => handleChange(item.certificationsSectionID, e)}
                />
              </li>
            </ul>
            <input
              type="text"
              name="certificationDescription"
              placeholder="Certification Description"
              value={item.certificationDescription}
              onChange={(e) => handleChange(item.certificationsSectionID, e)}
              style={{ border: 'none' }}
            />
            <button onClick={() => removeCertification(item.certificationsSectionID)} style={{ float: 'right' }}>
              Remove
            </button>
          </div>
        ))}
        <button onClick={addCertification}>Add More</button>
        <button onClick={handleSubmit}>Save</button>
      </div>
    </section>
  );
}

export default CertificationsP;
