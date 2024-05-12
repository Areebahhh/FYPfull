import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId , receiverId}) => {
   const [Cdesc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  console.log("receiver user from comment",receiverId)
// console.log("current user from comment",currentUser)

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments"],
    queryFn: () => makeRequest.get("/comments?postId=" + postId).then((res) => res.data),
   
     enabled: !!postId, // This line ensures the query only runs if postId is truthy
  });

 


  const queryClient = useQueryClient();


  // const mutation = useMutation({
  //   mutationFn: (newComment) => makeRequest.post("/comments", newComment),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['comments']);
  //   },
  // });


  const mutation = useMutation({
    mutationFn: (newComment) => {
      // Make the request to add the new comment
      return makeRequest.post("/comments", newComment)
        .then((response) => {
            // console.log("response of comment:",response.data);

          //If the comment was added successfully, create a notification
          if (response.status === 200) {
            // const commentId = response.data.commentId; // Assuming the response includes the ID of the newly created comment
            //  onst CpostId = postId;
            // const receiverId = newComment.receiverId;


  
            // Only create the notification if the comment is not made by the post owner
            if (receiverId !== currentUser.id) {
              return makeRequest.post("/notifications", { postId: postId, receiverId: receiverId, type: 2 });
            }
          }
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    },
  });
  

  const handleClick = async (e) => {
    e.preventDefault();

    // console.log("desc is:",Cdesc)
    // console.log("post id is:",postId)
    mutation.mutate({ Cdesc, Cpostid: postId });
    setDesc("");
  };














  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        {/* <img src={ currentUser.profilePic} alt="" /> */}
        <input
          type="text"
          placeholder="write a comment"
          value={Cdesc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
        {/* <button>Send</button> */}
      </div>

      {error
        ? "Something went wrong"
         : isLoading
        ? "loading"
        : data.map((comment) => (
            <div className="comment">
              <img src={"/upload/" + comment.profilePic} alt="" />
              {/* <img src={comment.profilePic} alt="" /> */}
              <div className="info">
                {/* <span>{comment.name}</span> */}
                <p>{comment.Cdesc}</p>
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
                {/* {console.log(moment(comment.createdAt).fromNow())} */}
              </span>
            </div>
          ))}




    </div>
  );
};

export default Comments;
