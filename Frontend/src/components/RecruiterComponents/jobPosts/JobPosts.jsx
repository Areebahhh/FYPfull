 import Post from "../../post/Post";
// import Post from "../../post/Post";
import "./Jobposts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";

// const Posts = ({userId}) => {
const Posts = ({Puserid}) => {
 
  const { isLoading, error, data } = useQuery({queryKey: ["posts"], 
  queryFn: () =>
    makeRequest.get("/posts/jobs?Puserid="+Puserid).then((res) => {
    //makeRequest.get("/posts").then((res) => {
      return res.data;
    })}
  );



  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((post) => <Post post={post} key={post.Pid} />)}

        {/* {posts.map((post) => <Post post={post} key={post.id} />)} */}
    </div>
  );
};

export default Posts;
