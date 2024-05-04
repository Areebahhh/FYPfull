import { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NewStory from "../addStories/NewStory";
import { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [openStory, setOpenStory] = useState(false);


  const queryClient = useQueryClient();

    const { isLoading, error, data } = useQuery({queryKey: ["stories"], 
    queryFn: () => makeRequest.get("/stories").then((res) => {
      return res.data;
    })}
  );


  const deleteMutation = useMutation({
    mutationFn: (storyId) => {
      return makeRequest.delete(`/stories/${storyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["stories"]);
    },
  });


  return (
    <div className="stories">
      <div className="story">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        {/* <img src={ currentUser.profilePic} alt="" /> */}
        <span>{currentUser.name}</span>
        <button onClick={()=>setOpenStory(true)}>+</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((story) => (
            <div className="story" key={story.Sid}>
              <img src={"/upload/" + story.img} alt="" />
              <span>{story.name}</span>
              {story.Suserid === currentUser.id && (
            <button className="deleteButton" onClick={() => deleteMutation.mutate(story.Sid)}>Delete</button>
          )}
            </div>
          ))}

    {openStory && <NewStory setOpenStory={setOpenStory}/>}
    
    </div>
  );
};

export default Stories;
