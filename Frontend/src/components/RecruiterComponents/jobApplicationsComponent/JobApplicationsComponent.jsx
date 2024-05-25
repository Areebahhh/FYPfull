import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { useContext,useEffect, useState } from "react";
import moment from "moment";
import { AuthContext } from "../../../context/authContext";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "./jobApplicationsComponent.scss";
import InterviewRecruiterModal from "../interviewRecruiterModal/InterviewRecruiterModal";
import axios from "axios";


const JobApplicationsComponent = () => {
  const { currentUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentUserId = currentUser.id;

  const queryClient = useQueryClient();

  //for fetching all job posts of our current user
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest.get("/posts/jobs?Puserid=" + currentUserId).then((res) => {
        return res.data;
      }),
  });

  //for deleting a job post
  const deleteMutation = useMutation({
    mutationFn: (Pid) => makeRequest.delete(`/posts/${Pid}`), 
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]); 
    },
  });

  const handleDelete = (Pid) => {
    deleteMutation.mutate(Pid);
  };

  //for opening the menu of delete post
  const handleMenuOpen = (id) => {
    setMenuOpen((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      {error && <div>Error fetching data</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && data && data.length === 0 && <div>Currently no posts</div>}
      {data &&
        data.map((post) => (
          <div key={post.Pid} className="post" style={{ marginBottom: "20px" }}>
            <div className="container">
              <div className="user">
                <div className="userInfo">
                  <img src={`/upload/${post.profilePic}`} alt="" />
                  <div className="details">
                    <span className="name">{post.name}</span>
                    
                    <span className="date">
                      {moment(post.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <MoreHorizIcon onClick={() => handleMenuOpen(post.id)} />
                {menuOpen === post.id && post.Puserid === currentUserId && (
                  <button onClick={() => handleDelete(post.Pid)}>delete</button>
                )}
              </div>
              <div className="content">
                <p>{post.Postdesc}</p>
                {post.img && (
                  <div>
                    {post.img.endsWith(".jpg") ||
                    post.img.endsWith(".png") ||
                    post.img.endsWith(".jpeg") ? (
                      <img src={`/upload/${post.img}`} alt="Image" />
                    ) : (
                      <video controls>
                        <source src={`/upload/${post.img}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}
              </div>

              <h4>Applicants:</h4>

              {/* Display the list of users who have applied to the post */}
              

              {/* calling the ApplicantsForPost component by passing the current post id */}
              <ApplicantsForPost postId={post.Pid} />

            </div>
          </div>
        ))}
    </div>
  );
};



//ApplicantsForPost component
const ApplicantsForPost = ({ postId }) => {

  const queryClient = useQueryClient();

  //variable for opening the update modal
  const [openUpdate, setOpenUpdate] = useState(false);

  //for storing scheduled interviews of the current post for logic of scheduled interview button
  const [scheduledInterviews, setScheduledInterviews] = useState([]);

    //variable for storing the applicant object to pass in the update modal
    const [applicantObj, setApplicantObj] = useState(null);

    const rejectApplicationMutation = useMutation({
      mutationFn: ({ userId, postId }) => makeRequest.delete(`/jobs/reject?userId=${userId}&postId=${postId}`)
        .then(() => {
          // Send notification after successful rejection
        
            makeRequest.post("/notifications", {
              postId: postId,
              receiverId: userId,
              type: 6, // 6 represents a rejection notification
            });
         
        }),
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    });
    
  
  //for rejecting an application by removing the entry from the appliedjobs table
  const handleRejectApplication = (userId, postId) => {
    rejectApplicationMutation.mutate({ userId, postId });
  };




  //for fetching all users who have applied to the current post

  const { isLoading, error, data: applicantsData } = useQuery({
    queryKey: ["applicants", postId],
    queryFn: () => makeRequest.get(`/jobs/users?postId=${postId}`).then((res) => res.data),
    enabled: !!postId, // Ensures the query is only executed when postId is truthy
    refetchOnWindowFocus: false, // Optional: Disable refetch on window focus
    retry: 1, // Optional: Number of retries before failing the query
  });


  useEffect(() => {
    // Fetch scheduled interview dates and times for the current post
    const fetchScheduledInterviews = async () => {
      try {
        const response = await makeRequest.get(`/interviews/post?postId=${postId}`);
        setScheduledInterviews(response.data.map(interview => interview.studentid));
      } catch (error) {
        console.error('Error fetching scheduled interviews:', error);
      }
    };

    if (postId ) {
      fetchScheduledInterviews();
      // console.log(scheduledInterviews);
    }

  },  [postId, openUpdate]);





  if (isLoading) return <div>Loading applicants...</div>;
  if (error) return <div>Error fetching applicants: {error.message}</div>;

  //if there are no users who have applied to the current post, display a message
  if (!Array.isArray(applicantsData) || applicantsData.length === 0) {
    return <div>Currently no applications</div>;
  }



  return (
    <div>
      {applicantsData.map((applicant) => (
        <div key={applicant.id} className="applicantContainer">
          <div className="applicantItem">
            <div className="applicantUserInfo">
              <img src={`/upload/${applicant.profilePic}`} alt="" />
              <span>{applicant.name}</span>

              {/* <span className="date">
                Applied {moment(applicant.applied_at).fromNow()}
              </span> */}

              <div className="applicantButtons">
                



                
                
                
                <button>View profile</button>

                





                {!scheduledInterviews.includes(applicant.id) ? (
                  <button onClick={() => {
                    setOpenUpdate(true)
                    setApplicantObj(applicant)
                  }}>Schedule interview</button>
                ) : (
                  <button style={{ backgroundColor: "yellow", color: "black" }} disabled >Interview Scheduled</button>
                )}
                
                <button 
                onClick={() => handleRejectApplication(applicant.id, postId)}
                > Reject</button>

              </div>

           

            </div>
          </div>
          {openUpdate && <InterviewRecruiterModal  setOpenUpdate={setOpenUpdate}  postId={postId} user={applicantObj} />}
        </div>  
      ))}
    </div>
  );
};




export default JobApplicationsComponent;