import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { useContext,useEffect, useState } from "react";
import moment from "moment";
import { AuthContext } from "../../../context/authContext";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "./interviewComponent.scss";
import UpdateInterviewModal from "../updateInterviewModal/UpdateInterviewModal ";
import axios from "axios";


const InterviewComponent = () => {
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

  //for deleting a job post
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
              

              {/* calling the InterviewApplicantsForPost component by passing the current post id */}
              <InterviewApplicantsForPost postId={post.Pid} />

            </div>
          </div>


        ))}
    </div>
  );
};



//ApplicantsForPost component
const InterviewApplicantsForPost = ({ postId }) => {

  const queryClient = useQueryClient();

  //variable for opening the update modal
   const [openUpdate, setOpenUpdate] = useState(false);

  //variable for storing the applicant object to pass in the update modal
   const [applicantObj, setApplicantObj] = useState(null);
  

  //for fetching all schuduled interviews of a post

  const { isLoading, error, data: applicantsData } = useQuery({
    queryKey: ["applicants", postId],
    queryFn: () => makeRequest.get(`/interviews/post?postId=${postId}`).then((res) => res.data),
    enabled: !!postId, // Ensures the query is only executed when postId is truthy
    refetchOnWindowFocus: false, // Optional: Disable refetch on window focus
    retry: 1, // Optional: Number of retries before failing the query
  });
  
    //for marking a interview as done by useQueryClient
    const MarkDoneMutation = useMutation({
      mutationFn: ({ interviewId }) => makeRequest.delete(`/interviews?interviewId=${interviewId}`),
      onSuccess: () => {
        queryClient.invalidateQueries(["applicants"]);
      },
    });
    
    //for rejecting an application by removing the entry from the appliedjobs table
    const handleDone = (interviewId) => {
      MarkDoneMutation.mutate({ interviewId });
    };



  if (isLoading) return <div>Loading interviews...</div>;
  if (error) return <div>Error fetching interviews applicants: {error.message}</div>;

  //if there are no users who have applied to the current post, display a message
  if (!Array.isArray(applicantsData) || applicantsData.length === 0) {
    return <div>Currently no interviews</div>;
  }





  return (
    <div>
      {applicantsData.map((applicant) => (
        <div key={applicant.id} className="applicantContainer">
          <div className="applicantItem">
            <div className="applicantUserInfo">
              <img src={`/upload/${applicant.profilePic}`} alt="" />

              <span>{applicant.name}</span>
        
              <span className="date">
                Interview Scheduled  {moment(applicant.scheduledAt).fromNow()}
              </span>

              <div className="applicantButtons">
                
                <button 
                onClick={() => {
                  setOpenUpdate(true)
                  setApplicantObj(applicant)
                }}
                > Edit</button>

              <button
                onClick={() => handleDone(applicant.id)}
              >Mark as Done</button>

              </div>
            </div>
          </div>
          
          {/* UpdateInterviewModal interview modal for editing interview of any specific user */}

          {/* pass current post id and applicant object to the update interview modal */}
          {openUpdate && <UpdateInterviewModal  setOpenUpdate={setOpenUpdate}  postId={postId} applicant={applicantObj} />}
        </div>
      ))}
    </div>
  );
};




export default  InterviewComponent;