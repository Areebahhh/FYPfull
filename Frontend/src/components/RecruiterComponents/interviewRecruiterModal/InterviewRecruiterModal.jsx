import { useState } from "react";
import { makeRequest } from "../../../axios";
import "./interviewRecruiterModal.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import moment from 'moment';

const InterviewRecruiterModal = ({ setOpenUpdate, postId,user  }) => {
  const [scheduledAt, setScheduledAt] = useState("");


  // console.log("student id is:",user.id)
  // console.log("student name is:",user.name)
  // console.log("post id is:",postId)

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => makeRequest.post("/interviews", data).then(() => {
      // Send notification after successful creation of interview

        makeRequest.post("/notifications", {
          postId: postId,
          receiverId: user.id,
          type: 4, // 4 represents an interview notification
        });
      
    }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["interviews"]);
    },
  });
  

  const handleClick = async (e) => {
    e.preventDefault();

    // Convert the scheduledAt value to the correct format
    // const formattedScheduledAt = new Date(scheduledAt).toISOString().slice(0, 19).replace("T", " ");
    const localScheduledAt = moment(scheduledAt).format('YYYY-MM-DD HH:mm:ss');

    mutation.mutate({
      postid: postId, 
      studentid: user.id, // Replace with the student's id
      scheduledAt: localScheduledAt,
    });

    
    // console.log("student id is:",user.id)
    // console.log(typeof user.id)
    // console.log("post id is:",postId)
    // console.log(typeof postId)
    // console.log(" old Scheduled at:", scheduledAt);
    // console.log("new Scheduled at:", localScheduledAt);
   
    setOpenUpdate(false);
  
  };

  return (
    <div className="interviewRecruiterModal">
      <div className="wrapper">
        <h1>Schedule Interview for {user.name}</h1>
        <form>
          <label>Scheduled At</label>
          <div className="datetimePicker">
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
            <CalendarTodayIcon className="icon" />
          </div>
          <button onClick={handleClick}>Schedule</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default InterviewRecruiterModal;
