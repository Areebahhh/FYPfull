import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css";

 export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {

 
 
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // console.log("current user id : ",currentId)
  
  // useEffect(() => {
  //   const getFriends = async () => {
  //     const res = await axios.get("http://localhost:8800/api/relationships/friendsdata?userId=" + currentId);
  //     setFriends(res.data);
  //   };

  //   getFriends();
  // }, [currentId]);

  //  console.log("friends in chat : ",friends)
    //  console.log("Online users(coming) in chat:",onlineUsers)

  // useEffect(() => {
  //   setOnlineFriends(friends.filter((f) => onlineUsers.includes(f.id)));
  // }, [friends, onlineUsers]);

  //  console.log("online friends(existing) in chat: ",onlineFriends)

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/conversations/find/${currentId}/${user.id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };






  return (
    // <div className="chatOnline">
   
    //     <div className="chatOnlineFriend" 
    //     // onClick={() => handleClick(o)}
    //     >
    //       <div className="chatOnlineImgContainer">
    //         <img
    //           className="chatOnlineImg"
    //           src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600"
    //           // src={
    //           //   o?.profilePicture
    //           //     ? PF + o.profilePicture
    //           //     : PF + "person/noAvatar.png"
    //           // }
    //           alt=""
    //         />
    //         <div className="chatOnlineBadge"></div>
    //       </div>
    //       {/* <span className="chatOnlineName">{o?.username}</span> */}
    //       <span className="chatOnlineName">Ammar Zahid</span>
    //     </div>
    // </div>




    <div className="chatOnline">
      {/* {onlineFriends.map((o) => ( */}
      {onlineUsers.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={"/upload/"+ o.profilePic}
              // src={
              //   o?.profilePicture
              //     ? PF + o.profilePicture
              //     : PF + "person/noAvatar.png"
              // }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
