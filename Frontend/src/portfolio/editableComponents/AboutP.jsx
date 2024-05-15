import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
// import '../vendor/bootstrap/css/bootstrap.min.css'
// import '../vendor/font-awesome/css/font-awesome.min.css'
// import '../vendor/devicons/css/devicons.min.css'
// import '../vendor/simple-line-icons/css/simple-line-icons.css'
// import '../css/resume.min.css'
import { AuthContext } from '../../context/authContext';

function AboutP() {

  const { currentUser } = useContext(AuthContext);

  const userid = currentUser.id;
  // console.log(userid)

  
const [newLink, setNewLink] = useState('');
  const [error, setError] = useState('');
  const [socialLinks, setSocialLinks] = useState([]);

  // const handleGenerateIcon = async () => {
  //   // Reset error message
  //   setError('');

  //   // Validate if a link is provided
  //   if (!newLink) {
  //     setError('Please enter a social media link');
  //     return;
  //   }

  //   // Check if the link already exists
  //   if (socialLinks.some((link) => link.url === newLink)) {
  //     setError('Link already added');
  //     return;
  //   }

  //   // Determine which social media platform the user provided the link for
  //   let icon = null;
  //   if (newLink.includes('facebook.com')) {
  //     icon = (
  //       <span className="fa-stack fa-lg">
  //         <i className="fa fa-circle fa-stack-2x" />
  //         <i className="fa fa-facebook fa-stack-1x fa-inverse" />
  //       </span>
  //     );
  //   } else if (newLink.includes('twitter.com')) {
  //     icon = (
  //       <span className="fa-stack fa-lg">
  //         <i className="fa fa-circle fa-stack-2x" />
  //         <i className="fa fa-twitter fa-stack-1x fa-inverse" />
  //       </span>
  //     );
  //   } else if (newLink.includes('github.com')) {
  //     icon = (
  //       <span className="fa-stack fa-lg">
  //         <i className="fa fa-circle fa-stack-2x" />
  //         <i className="fa fa-github fa-stack-1x fa-inverse" />
  //       </span>
  //     );
  //   } else if (newLink.includes('linkedin.com')) {
  //     icon = (
  //       <span className="fa-stack fa-lg">
  //         <i className="fa fa-circle fa-stack-2x" />
  //         <i className="fa fa-linkedin fa-stack-1x fa-inverse" />
  //       </span>
  //     );
  //   } else if (newLink.includes('youtube.com')) {
  //     icon = (
  //       <span className="fa-stack fa-lg">
  //         <i className="fa fa-circle fa-stack-2x" />
  //         <i className="fa fa-youtube fa-stack-1x fa-inverse" />
  //       </span>
  //     );
  //   }

  //   // Update social links state
  //   setSocialLinks([...socialLinks, { url: newLink, icon }]);
  //   setNewLink('');

  //   // Save the link to the backend
  //   try {
  //     await axios.post('http://localhost:8800/api/portfolio/saveSocialLink', { link: newLink });
  //     console.log('Social link saved successfully');
  //   } catch (error) {
  //     console.error('Error saving social link:', error);
  //   }
  // };



  const handleGenerateIcon = async () => {
    // Reset error message
    setError('');
  
    // Validate if a link is provided
    if (!newLink) {
      setError('Please enter a social media link');
      return;
    }
  
    // Check if the link already exists
    if (socialLinks.some((link) => link.url === newLink)) {
      setError('Link already added');
      return;
    }
  
    // Determine which social media platform the user provided the link for
    let icon = null;
    let platform = null;
  
    if (newLink.includes('facebook.com')) {
      icon = (
        <span className="fa-stack fa-lg">
          <i className="fa fa-circle fa-stack-2x" />
          <i className="fa fa-facebook fa-stack-1x fa-inverse" />
        </span>
      );
      platform = 'facebookLink';
    } 
    
    else if (newLink.includes('twitter.com')) {
      icon = (
        <span className="fa-stack fa-lg">
          <i className="fa fa-circle fa-stack-2x" />
          <i className="fa fa-twitter fa-stack-1x fa-inverse" />
        </span>
      );
      platform = 'twitterLink';
    } 
    
    else if (newLink.includes('github.com')) {
      icon = (
        <span className="fa-stack fa-lg">
          <i className="fa fa-circle fa-stack-2x" />
          <i className="fa fa-github fa-stack-1x fa-inverse" />
        </span>
      );
      platform = 'githubLink';
    } 

    else if (newLink.includes('linkedin.com')) {
      icon = (
        <span className="fa-stack fa-lg">
          <i className="fa fa-circle fa-stack-2x" />
          <i className="fa fa-linkedin fa-stack-1x fa-inverse" />
        </span>
      );
      platform = 'linkedinLink';
    } 

    else if (newLink.includes('youtube.com')) {
      icon = (
        <span className="fa-stack fa-lg">
          <i className="fa fa-circle fa-stack-2x" />
          <i className="fa fa-youtube fa-stack-1x fa-inverse" />
        </span>
      );
      platform = 'youtubeLink';
    } 


  
    // Update social links state
    setSocialLinks([...socialLinks, { url: newLink, icon }]);
  
    // Update the corresponding link state variable
    if (platform) {
      setAboutData({
        ...aboutData,
        [platform]: newLink
      });
    }
  
    setNewLink('');
  
    // Save the link to the backend
    try {
      await axios.post('http://localhost:8800/api/portfolio/saveSocialLink', { link: newLink });
      console.log('Social link saved successfully');
    } catch (error) {
      console.error('Error saving social link:', error);
    }
  };




  const handleRemoveIcon = (linkToRemove) => {
    const updatedLinks = socialLinks.filter((link) => link.url !== linkToRemove);
    setSocialLinks(updatedLinks);
  };









// data sending into db part


const [aboutData, setAboutData] = useState({
  fullname: '',
  address: '',
  contact_number: '',
  email: '',
  about_paragraph: '',
  facebookLink: '',
  twitterLink: '',
  githubLink: '',
  linkedinLink: '',
  youtubeLink: '' 
});

// console.log("userid", userid)
// Function to handle form submission
const handleSubmit = async (e) => {
  
  e.preventDefault();
  try {
      // Send a POST request to the backend to save About data
      //  /currentuser
      await axios.post(`http://localhost:8800/api/portfolio/saveAboutData/${userid}` , {
          fullname: aboutData.fullname,
          address: aboutData.address,
          contact_number: aboutData.contact_number,
          email: aboutData.email,
          about_paragraph: aboutData.about_paragraph,
          facebookLink: aboutData.facebookLink, // Add these fields in your frontend state
          twitterLink: aboutData.twitterLink,
          githubLink: aboutData.githubLink,
          linkedinLink: aboutData.linkedinLink,
          youtubeLink: aboutData.youtubeLink
          
      });
      alert('About section data saved successfully');
      console.log("after axios userid", userid)
  } catch (error) {
      console.error('Error saving About data:', error);
      alert('Failed to save About section data');
  }
};

// Function to handle input changes
const handleChange = (e) => {
  setAboutData({
    ...aboutData,
    [e.target.name]: e.target.value
  });
};


// data sending into db part



// fetching data from db

const fetchAboutData = async () => {
  try {
      const response = await axios.get(`http://localhost:8800/api/portfolio/getAboutData/${userid}`);
      setAboutData(response.data);
  } catch (error) {
      console.error('Error fetching About data:', error);
  }
};

useEffect(() => {
  fetchAboutData();
}, []);



// fetching data from db






// let fblink = "";
// let twitterlink = "";
// let linkedinlink = "";
// let githublink = "";








  return (



<section className="resume-section p-3 p-lg-5 d-flex d-column" id="about">
      <div className="my-auto">
        <form onSubmit={handleSubmit}>
          {/* Input fields for user data */}
          <h1 className="mb-0">
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={aboutData.fullname}
              onChange={handleChange}
              style={{ border: 'none' }}
            />
          </h1>

          <div className="subheading mb-5">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={aboutData.address}
              onChange={handleChange}
              style={{ border: 'none' }}
            />
            ·
            <input
              type="text"
              name="contact_number"
              placeholder="Contact Number"
              value={aboutData.contact_number}
              onChange={handleChange}
              style={{ border: 'none' }}
            />
            ·
            <a href={`mailto:${aboutData.email}`}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={aboutData.email}
                onChange={handleChange}
                style={{ border: 'none' }}
              />
            </a>
          </div>

          <p className="mb-5">
            <input
              type="text"
              name="about_paragraph"
              placeholder="About Myself"
              value={aboutData.about_paragraph}
              onChange={handleChange}
              style={{ border: 'none' }}
            />
          </p>

          <button type="submit">Save</button>
        </form>




        {/* SOCIAL ICONS */}


{/* wkjefiwshnf'oaiairhaufhurwgesrhay97 */}




{/* {aboutData.twitterLink !== null && (

console.log("in about twitter link frontend"),
twitterlink = aboutData.twitterLink,
console.log("twitterlink: ", twitterlink)

)}

{aboutData.linkedinLink !== null && (

console.log("in about linkedin link frontend"),
linkedinlink = aboutData.linkedinLink,
console.log("linkedinlink: ", linkedinlink)

)}

{aboutData.githubLink !== null && (

console.log("in about github link frontend"),
githublink = aboutData.githubLink,
console.log("githublink: ", githublink)

)} */}





<div>
      <input
        type="text"
        value={newLink}
        onChange={(e) => setNewLink(e.target.value)}
        placeholder="Social Media Link"
      />
      <button onClick={handleGenerateIcon}>Generate Icon</button>




      {error && <p>{error}</p>}
      <ul className="list-inline list-social-icons mb-0">





        {/* Display all generated icons */}
        {socialLinks.map((link) => (
          <li className="list-inline-item" key={link.url}>
            {link.icon}
            <button onClick={() => handleRemoveIcon(link.url)} style={{ backgroundColor: 'red', fontSize: '10px' }}>
              X
            </button>
          </li>
))}





      </ul>


{/* 
      {aboutData.facebookLink !== "" && (
          <li className="list-inline-item">
            <a href={aboutData.facebookLink}>
              <span className="fa-stack fa-lg">
                <i className="fa fa-circle fa-stack-2x" />
                <i className="fa fa-facebook fa-stack-1x fa-inverse" />
              </span>
            </a>
          </li>
        )}

        {aboutData.twitterLink !== "" && (
          <li className="list-inline-item">
            <a href={aboutData.twitterLink}>
              <span className="fa-stack fa-lg">
                <i className="fa fa-circle fa-stack-2x" />
                <i className="fa fa-twitter fa-stack-1x fa-inverse" />
              </span>
            </a>
          </li>
        )}

        {aboutData.linkedinLink !== "" && (
          <li className="list-inline-item">
            <a href={aboutData.linkedinLink}>
              <span className="fa-stack fa-lg">
                <i className="fa fa-circle fa-stack-2x" />
                <i className="fa fa-linkedin fa-stack-1x fa-inverse" />
              </span>
            </a>
          </li>
        )}

        {aboutData.githubLink !== "" && (
          <li className="list-inline-item">
            <a href={aboutData.githubLink}>
              <span className="fa-stack fa-lg">
                <i className="fa fa-circle fa-stack-2x" />
                <i className="fa fa-github fa-stack-1x fa-inverse" />
              </span>
            </a>
          </li>
        )}

        {aboutData.youtubeLink !== "" && (
          <li className="list-inline-item">
            <a href={aboutData.githubLink}>
              <span className="fa-stack fa-lg">
                <i className="fa fa-circle fa-stack-2x" />
                <i className="fa fa-youtube fa-stack-1x fa-inverse" />
              </span>
            </a>
          </li>
        )} */}




    </div>
{/* SOCIAL ICONS */}


      </div>
    </section>








  )
}

export default AboutP