import { useState, useContext  } from "react";
import { makeRequest } from "../../axios";
import "./notificationMenu.scss";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import moment from "moment";
import { AuthContext } from "../../context/authContext";

const NotificationMenu = ({ setOpenUpdate }) => {
  
  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();
  
  const recieverId = currentUser.id



 //for rejecting an application by useQueryClient
 const deleteNotificationMutation = useMutation({
  mutationFn: ({ Nid }) => makeRequest.delete(`/notifications?id=${Nid}`),
  onSuccess: () => {
    queryClient.invalidateQueries(["notifications"]);
  },
});

//for rejecting an application by removing the entry from the appliedjobs table
const handleMarkAsRead = (Nid) => {
  console.log("notification id is:",Nid);
   deleteNotificationMutation.mutate({ Nid });
};









  // For fetching all notifications of our current user
  const { isLoading, error, data: notificationData } = useQuery({
    queryKey: ["Notification", recieverId],
    queryFn: () => makeRequest.get(`/notifications?userId=${recieverId}`).then((res) => res.data),
    enabled: !!recieverId, // Ensures the query is only executed when postId is truthy
    refetchOnWindowFocus: false, // Optional: Disable refetch on window focus
    retry: 1, // Optional: Number of retries before failing the query
  });


 

 



  const handleClick = async (e) => {
    e.preventDefault();

    setOpenUpdate(false);
  }
  

  if (isLoading) return <div>Loading notifications...</div>;
  if (error) return <div>Error fetching notifications: {error.message}</div>;

  //if there are no users who have applied to the current post, display a message
  if (!Array.isArray(notificationData) || notificationData.length === 0) {
    return <div>No notifications</div>;
  }


    return (
      <div className="update">
        <div className="wrapper">
          <h1>Notifications:</h1>
          <div>
      {notificationData.map((notifications) => (
         <div key={notifications.Nid} className="applicantContainer"> 
        {/* <div className="applicantContainer"> */}
          <div className="applicantItem">
            <div className="applicantUserInfo">
              <img src={`/upload/${notifications.profilePic}`} alt="" />
              {/* <img src={``} alt="" /> */}
              {/* <span>{notifications.name} liked your post</span> */}
              {/* <span>Ammar</span> */}


                  {notifications.type === 1 && (
                    <span>{notifications.name} liked your post</span>
                  )}
                  {notifications.type === 2 && (
                    <span>{notifications.name} commented on your post</span>
                  )}
                  {notifications.type === 3 && (
                    <span>{notifications.name} sent you a message</span>
                  )}

              <span className="date">
                 {moment(notifications.time).fromNow()}
              </span>    

              <div className="applicantButtons">
                
                <button 
                 onClick={() => handleMarkAsRead(notifications.Nid)}
                > Mark as read</button>

              </div>

           

            </div>
          </div>
         
        </div>  
       ))} 
    </div>



          <button className="close" onClick={() => setOpenUpdate(false)}>
            close
          </button>
        </div>
      </div>




      




 
    );

};
export default NotificationMenu;
