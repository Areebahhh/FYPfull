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

   
  return (
    <div className="navbar">
      <div className="left">
        <Link to={getHomeRoute()} style={{ textDecoration: "none" }}>
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
      
      <div className="icons">
        
        {/* Notifications modal */}
        
        <div className="icon"   
                onClick={() => {
                  setOpenUpdate(true)
                }}>
          <div className="iconImg">
            <NotificationsOutlinedIcon />
          </div>
           
            {notificationData && notificationData.length > 0 && (
                <div className="counter">{notificationData.length}</div> 
            )}
        </div>

        <div className="icon">
          <div className="iconImg">
          <LogoutIcon/>
          </div>
        </div>

      </div>    

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
  );
};

export default Navbar;
