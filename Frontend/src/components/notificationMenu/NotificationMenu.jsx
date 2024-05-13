import { useState, useContext } from "react";
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

  const recieverId = currentUser.id;

  //for rejecting an application by useQueryClient
  const deleteNotificationMutation = useMutation({
    mutationFn: ({ Nid }) => makeRequest.delete(`/notifications?id=${Nid}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  //for rejecting an application by removing the entry from the appliedjobs table
  const handleMarkAsRead = (Nid) => {
    console.log("notification id is:", Nid);
    deleteNotificationMutation.mutate({ Nid });
  };

  // For fetching all notifications of our current user
  const {
    isLoading,
    error,
    data: notificationData,
  } = useQuery({
    queryKey: ["Notification", recieverId],
    queryFn: () =>
      makeRequest
        .get(`/notifications?userId=${recieverId}`)
        .then((res) => res.data),
    enabled: !!recieverId, // Ensures the query is only executed when recieverId is truthy
    refetchOnWindowFocus: false, // Optional: Disable refetch on window focus
    retry: 1, // Optional: Number of retries before failing the query
  });

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Notifications:</h1>

        {/* Display loading message if notifications are still loading */}
        {isLoading && <div>Loading notifications...</div>}
        
        {/* Display error message if there is an error fetching notifications */}
        {error && <div>Error fetching notifications: {error.message}</div>}

        {/* Display "No notifications" message if there are no notifications */}
        {(!Array.isArray(notificationData) ||
          notificationData.length === 0) && <div>No notifications</div>}

        <div>
          {notificationData.map((notifications) => (
            <div key={notifications.Nid} className="applicantContainer">
              <div className="applicantItem">
                <div className="applicantUserInfo">
                  <img src={`/upload/${notifications.profilePic}`} alt="" />

                  {notifications.type === 1 && (
                    <span>{notifications.name} liked your post</span>
                  )}
                  {notifications.type === 2 && (
                    <span>{notifications.name} commented on your post</span>
                  )}
                  {notifications.type === 3 && (
                    <span>{notifications.name} applied to your job post</span>
                  )}
                  {notifications.type === 4 && (
                    <span>
                      {notifications.name} scheduled an interview for you
                    </span>
                  )}
                  {notifications.type === 5 && (
                    <span>
                      {notifications.name} rescheduled your interview{" "}
                    </span>
                  )}
                  {notifications.type === 6 && (
                    <span>{notifications.name} rejected your application</span>
                  )}

                  <span className="date">
                    {moment(notifications.time).fromNow()}
                  </span>

                  <div className="applicantButtons">
                    <button onClick={() => handleMarkAsRead(notifications.Nid)}>
                      {" "}
                      Mark as read
                    </button>
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
