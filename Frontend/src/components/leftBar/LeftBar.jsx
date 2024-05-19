import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import smoledit from "../../assets/smoledit.png"
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

import portfolioIcon from "../../assets/portfoliosmol.png"

// import React, { useState, useEffect } from 'react';




const LeftBar = () => {

   const { currentUser } = useContext(AuthContext);
   const userid= currentUser.id



  //  const [showModal, setShowModal] = useState(false);
  // const userId = "current_user_id"; // Replace "current_user_id" with the actual user ID

  // useEffect(() => {
  //   // Function to fetch portfolio data
  //   const fetchPortfolioData = async () => {
  //     try {
  //       const response = await fetch(`/api/portfolio/${userId}`);
  //       const data = await response.json();
  //       // If portfolio data doesn't exist, show modal
  //       if (response.status === 404) {
  //         setShowModal(true);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching portfolio data:', error);
  //     }
  //   };

  //   // Call the function when component mounts
  //   fetchPortfolioData();
  // }, [userId]);



   
  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img
               src={"/upload/" +currentUser.profilePic}
              //  src={currentUser.profilePic}
              //src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            {/* <span>Ammar</span> */}
            
            
            {/* <Link to={`/profile/`+userid}><span>{currentUser.name}</span></Link> */}

            <Link to={`/profile/${userid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <span>{currentUser.name}</span>
            </Link>

          </div>
          {/* <div className="item">
            <img src={Friends} alt="" />
            <span>Friends</span>
          </div> */}

{/* skjfk;ajefkjw */}
          <div className="item">
            <img src={portfolioIcon} alt="" />
            <Link to="/PortfolioPage" style={{ textDecoration: 'none', color: 'inherit' }} >Portfolio</Link>
            
          </div>

          {/* lsamf;skmf */}

          {/* <div className="item">
      <img src={portfolioIcon} alt="" />
      <Link to="/PortfolioPage" style={{ textDecoration: 'none', color: 'inherit' }}>
        Portfolio
      </Link>
      
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <p>You don't have a portfolio yet. Create one now!</p>
          </div>
        </div>
      )}
    </div> */}




          

          <div className="item">
            <img src={smoledit} alt="" />
            <Link to="/EditablePortfolio" style={{ textDecoration: 'none', color: 'inherit' }} >Edit Portfolio</Link>
            
          </div>


          <div className="item">
            <img src={Groups} alt="" />
            <Link to="/messenger"  style={{ textDecoration: 'none', color: 'inherit' }} >Messenger</Link>
            {/* <span>Groups</span> */}
          </div>
          <div className="item">
            <img src={Market} alt="" />
            <Link to="/studentJob"  style={{ textDecoration: 'none', color: 'inherit' }} >Job Page</Link>
          </div>
          <div className="item">
          <img src={Events} alt="" />
          <Link to="/studentAppliedJob"  style={{ textDecoration: 'none', color: 'inherit' }} >Applied Jobs</Link>
          </div>
          <div className="item">
            <img src={Memories} alt="" />
            <Link to="/studentInterview"  style={{ textDecoration: 'none', color: 'inherit' }} >Interviews</Link>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <Link to="/saved"  style={{ textDecoration: 'none', color: 'inherit' }} >Saved Posts</Link>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <div className="item">
            <img src={Events} alt="" />
            <span>Events</span>
          </div>
          <div className="item">
            <img src={Gaming} alt="" />
            <span>Gaming</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <span>Gallery</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>Videos</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <span>Messages</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Others</span>
          <div className="item">
            <img src={Fund} alt="" />
            <span>Fundraiser</span>
          </div>
          <div className="item">
            <img src={Tutorials} alt="" />
            <span>Tutorials</span>
          </div>
          <div className="item">
            <img src={Courses} alt="" />
            <span>Courses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;