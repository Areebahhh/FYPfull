import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext, useEffect ,useRef,useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import SearchBar from "../searchbar/SearchBar";
import NotificationMenu from "../notificationMenu/NotificationMenu";
import { makeRequest } from "../../axios";


import { useNavigate } from 'react-router-dom';


import fyplogonavbar from '../../assets/fyplogonavbar.png'




const Navbar = () => {
   const { toggle, darkMode } = useContext(DarkModeContext);
   const { currentUser } = useContext(AuthContext);

   const [openUpdate, setOpenUpdate] = useState(false);

 
    
    const recieverId = currentUser.id;

  // For fetching all notifications of our current user
  const { isLoading, error, data: notificationData } = useQuery({
    queryKey: ["Notification", recieverId],
    queryFn: () => makeRequest.get(`/notifications?userId=${recieverId}`).then((res) => res.data),
    enabled: !!recieverId, // Ensures the query is only executed when recieverId is truthy
    refetchOnWindowFocus: false, // Optional: Disable refetch on window focus
    retry: 1, // Optional: Number of retries before failing the query
  });
  

  const getHomeRoute = () => {
    // Check the user's type and return the corresponding route
    if (currentUser.userType === 'student') {
      return '/studentHome';
    } else if (currentUser.userType === 'recruiter') {
      return '/recruiterHome';
    }
    return '/'; // Default route if type is not recognized
  };



  const { logout } = useContext(AuthContext); // Get logout function from context
  const navigate = useNavigate(); // Hook for navigation

  const [showModal, setShowModal] = useState(false);
  const handleLogout = async () => {
    try {
      await logout(); // Call logout function from context
      navigate('/'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };



  





   
  return (

    <>

    <div>

        <style>
          {`
          .logo {
            height: 100px; /* Adjust size as needed */
            margin-right: 5px; /* Adjust spacing as needed */
            
          }
          
          `}
        </style>

    </div>

    




    <div className="navbar">
      <div className="left">

      {/* <Link to={getHomeRoute()} style={{ textDecoration: "none" }}>
          <img src={fyplogonavbar} alt="Logo" className="logo" />
        </Link> */}


        <Link to={getHomeRoute()} style={{ textDecoration: "none", padding: "2px" }}>
          <span>AcademyLink</span>
        </Link>


        <Link to={getHomeRoute()}>
          <HomeOutlinedIcon style={{ color: 'inherit', textDecoration: 'none' }} />
        </Link>

       
  
      {/* conditionally render the WbSunnyOutlinedIcon or DarkModeOutlinedIcon based on the darkMode value */}

        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
      
        <GridViewOutlinedIcon />

        <div>

           {/* searchbar component */}
          <SearchBar/>

        </div>

      </div>
      <div className="right">
      


        {/* Notifications modal */}

        
      <div className="icons">
        
        
        
        
        <div className="icon"   
                onClick={() => {
                  setOpenUpdate(true)
                }}>
          <div className="iconImg" >
            <NotificationsOutlinedIcon />
          </div>
           
            {notificationData && notificationData.length > 0 && (
                <div className="counter">{notificationData.length}</div> 
            )}
        </div>

        {/* <div className="icon">
          <div className="iconImg">
          <LogoutIcon/>
          </div>
        </div> */}


        

<div className="icon" onClick={handleLogout} style={{ cursor: 'pointer' }}>
      <div className="iconImg">
        <LogoutIcon />
      </div>
    </div>




        

      </div>    


      {/* Notifications modal */}

{/* 
      <div className="container">
      <div className="interior">
        <a className="btn" href="#open-modal">👋 Basic CSS-Only Modal</a>
      </div>
      <div id="open-modal" className="modal-window">
        <div>
          <a href="#" title="Close" className="modal-close">Close</a>
          <h1>Voilà!</h1>
          <div>A CSS-only modal based on the :target pseudo-class. Hope you find it helpful.</div>
          <br />
          Your new favorite eyedropper tool!
        </div>
      </div>
    </div> */}






        <div className="user">
        {/* <Link  to={"/profile/" + currentUser.id} style={{ textDecoration: "none", color: "inherit" }} > */}
          <img
            // src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600"
             src={"/upload/" + currentUser.profilePic}
          
            alt=""
          />
        
          <span>{currentUser.name}</span>
        {/* </Link>   */}
        </div>
      </div>
      {openUpdate && <NotificationMenu setOpenUpdate={setOpenUpdate}   />}
    
    </div>



    </>
  );
};

export default Navbar;
