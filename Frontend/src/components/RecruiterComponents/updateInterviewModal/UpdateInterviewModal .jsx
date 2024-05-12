import { useState } from "react";
import { makeRequest } from "../../../axios";
import "./updateInterviewModal.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import moment from 'moment';

const UpdateInterviewModal = ({ setOpenUpdate, postId,applicant  }) => {
  //formatting date
  const [scheduledAt, setScheduledAt] = useState("");


  const queryClient = useQueryClient();

  //for updating the interview schedule
  const mutation = useMutation({
    mutationFn: (data) => makeRequest.put(`/interviews?postId=${postId}&studentId=${applicant.studentid}`, data).then(() => {
      // Send notification after successful update of interview
     
        makeRequest.post("/notifications", {
          postId: postId,
          receiverId: applicant.studentid,
          type: 5, // 5 represents an interview update notification
        });

    }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["interviews"]);
      setOpenUpdate(false);
    },
  });
  

  const handleClick = async (e) => {
    e.preventDefault();

    // Convert the scheduledAt value to the correct format

    const localScheduledAt = moment(scheduledAt).format('YYYY-MM-DD HH:mm:ss');

    mutation.mutate({
      scheduledAt: localScheduledAt,
    });
    
  };

  return (
    <div className="interviewRecruiterModal">
      <div className="wrapper">
        <h1>Updating Interview schedule for {applicant.name}</h1>
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

export default UpdateInterviewModal;
