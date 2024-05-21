import { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom";
import "./messenger.css";
// import "./messengerComponent.scss"
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import SearchBarConvo from "../../components/searchConvo/SearchBarConvo";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { io } from "socket.io-client";

import EmojiPicker from 'emoji-picker-react';
import PersonPinIcon from '@mui/icons-material/PersonPin';


export default function MessengerComponent() {

  const { currentUser } = useContext(AuthContext);

// console.log("id",currentUser.id)


  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState({ username: '', profilePic: '' });

  //Id of current conversation coming from profile of that receiver
  const { ConversationId } = useParams();


  useEffect(() => {
    // Check if ConversationId is present
    if (ConversationId) {

      // Fetch the current conversation details using the ConversationId
      const fetchCurrentConversations = async (ConversationId) => {
        try {
          const res = await axios.get(`http://localhost:8800/api/conversations?id=${ConversationId}`);
          if (res.data.length > 0) {
            return res.data[0]; // Return the object at index 0
          } else {
            throw new Error("No conversation found");
          }
        } catch (err) {
          throw new Error("Failed to fetch conversations");
        }
      };
      


      fetchCurrentConversations(ConversationId)
      .then((data) => {
        if(data)
          {
          setCurrentChat(data);
          }
         
      })
      .catch((error) => {
        console.error(error);
      });

    }
  }, [ConversationId]); // Run this effect whenever ConversationId changes
  




  const socket = useRef();
  const scrollRef = useRef();






//To send something from client side to server side of socket we use socket.emit
//and to fetch something we use socket.on
  



  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
      });
    });

    //fetching friends data of current user
    const getFriends = async () => {
      const res = await axios.get("http://localhost:8800/api/relationships/friendsdata?userId=" + currentUser.id);
      // console.log("response: ",res.data)
      setFriends(res.data);
      // console.log("friends:",friends)
    };

    getFriends();
    
    
  }, []);


  useEffect(() => {  
    socket.current.on("getUsers", (users) => {

       const onlineVariable = friends.filter((f) => users.some((u) => u.userId === f.id))
  
       //update online users
      setOnlineUsers(
        onlineVariable
        )
    });
  
  }, [friends , currentUser]);

  

  useEffect(() => {
    // Check if currentChat and its members property are defined and not null
    if (currentChat?.members) {
      // Parse the members property of currentChat from JSON string to array
      const currentChatMembersArray = JSON.parse(currentChat.members);
      
      // Check if arrivalMessage is defined and currentChatMembersArray includes arrivalMessage.sender
      arrivalMessage &&
        currentChatMembersArray.includes(arrivalMessage.sender) &&
        // If the conditions are met, add arrivalMessage to the messages state
        setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);
  
  

  useEffect(() => {
    socket.current.emit("addUser", currentUser.id);
  }, [currentUser]);



//get convo logic

// function to fetch conversations
const fetchConversations = async (userId) => {
  try {
    const res = await axios.get(`http://localhost:8800/api/conversations/${userId}`);
    return res.data;
  } catch (err) {
    throw new Error("Failed to fetch conversations");
  }
};

// useQuery hook to fetch conversations
const { isLoading, error, data: fetchedConversations  } = useQuery({
  queryKey: ["conversations", currentUser.id], // Unique query key
  queryFn: () => fetchConversations(currentUser.id), // Function to fetch conversations
  enabled: !!currentUser.id, // Ensures the query is only executed when currentUser.id is truthy
  refetchOnWindowFocus: false, // Optional: Disable refetch on window focus
  retry: 1, // Optional: Number of retries before failing the query
});


  // Update conversations state with fetched data
  useEffect(() => {
    if (fetchedConversations) {
      setConversations(fetchedConversations);
   
    }
  }, [fetchedConversations]);


   //this useEffect will be used to fetch all messages of active conversation
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/messages/" + currentChat?.id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);



  //this function will handle posting of new messages from user 
  const handleSubmit = async (e) => 
  {
    e.preventDefault();

    //creating body of our new message
    const message = {
      sender: currentUser.id,
      text: newMessage,
      conversationId: currentChat.id,
    };

    
    const currentChatMembersArray = JSON.parse(currentChat?.members);

    const receiverId = currentChatMembersArray.find(
      (member) => member !== currentUser.id
    );

    socket.current.emit("sendMessage", {
      senderId: currentUser.id,
      receiverId,
      text: newMessage,
    });

    //sending data to backend api
    try {
      const res = await axios.post("http://localhost:8800/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");



    //   const NotifactionBody = { 
    //     receiverId: receiverId,
    //     type: 3,
    //   };

    // // // Sending data to the notification API without postId
    // await axios.post("http://localhost:8800/api/notifications", NotifactionBody);


    } catch (err) {
      console.log(err);
    }


   


  };

  //for scrolling down to the newest message from users
  //behavior smooth is for smoothing scrolling
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  // .chat {
  //   flex: 1;
  //   display: flex;
  //   flex-direction: column;
  //   width: calc(70% - 130px);
  //   position: absolute;
  //   right: 0;
  //   top: 0;
  //   bottom: 0;
  //   background-color: #fff; /* Ensure chat has a background */
  //   box-shadow: -3px 0px 5px rgba(0, 0, 0, 0.1);
    
  // }



  // const getUserFromConversation = async (conversation) => {
  //   try {
  //     const membersArray = JSON.parse(conversation.members);
  //     const friendId = membersArray.find((m) => m !== currentUser.id);
  //     const res = await axios("http://localhost:8800/api/users/find/" + friendId);
  //     console.log("response data username: ", res.data.username);
  //     setCurrentChatusername(res.data.username);
  //     // return res.data.username;
  //   } catch (err) {
  //     console.log(err);
  //     return null;
  //   }
  // };


  const getUserFromConversation = async (conversation) => {
    try {
      const membersArray = JSON.parse(conversation.members);
      const friendId = membersArray.find((m) => m !== currentUser.id);
      const res = await axios("http://localhost:8800/api/users/find/" + friendId);
      console.log("response data:", res.data);
      setCurrentChatUser({
        username: res.data.username,
        profilePic: res.data.profilePic
      });
    } catch (err) {
      console.log(err);
    }
  };





  const [activeTab, setActiveTab] = useState('tab1'); // State to manage the active tab

  const handleTabClick = (e, tab) => {
    e.preventDefault(); // Prevent page reload
    setActiveTab(tab); // Set the active tab
  };







  return (

    <>

    <div><style>
      {`
      body {
        padding: 5%;
        background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px,transparent 2px, transparent 4px),linear-gradient(90deg, rgb(29, 67, 158),rgb(219, 239, 242));
        
      }
      
      .container {
        display: flex;
        background-color: #FFF; 
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
        height: 700px;
        
        
      }
      
      /* ===== MENU ===== */
      .menu {
        float: left;
        height: 700px;;
        width: 70px;
        background: #4768b5;
        background: -webkit-linear-gradient(#4768b5, #35488e);
        background: -o-linear-gradient(#4768b5, #35488e);
        background: -moz-linear-gradient(#4768b5, #35488e);
        background: linear-gradient(#4768b5, #35488e);
        box-shadow: 0 10px 20px rgba(0,0,0,0.19);
      }
      
      .menu .items {
        list-style:none;
        margin: auto;
        padding: 0;
      }
      
      .menu .items .item {
        height: 70px;
        border-bottom: 1px solid #6780cc;
        display:flex;
        justify-content: center;
        align-items: center;
        color: #9fb5ef;
        font-size: 17pt;
      }
      
      .menu .items .item-active {
        background-color:#5172c3;
        color: #FFF;
      }
      
      .menu .items .item:hover {
        cursor: pointer;
        background-color: #4f6ebd;
        color: #cfe5ff;
      }
      
      /* === CONVERSATIONS === */
      
      .discussions {
        width: 35%;
        height: 700px;
        box-shadow: 0px 8px 10px rgba(0,0,0,0.20);
        overflow: hidden;
        background-color: #87a3ec;
        display: inline-block;
        
      }
      
      .discussions .discussion {
        width: 100%;
        height: 90px;
        background-color: #FAFAFA;
        border-bottom: solid 1px #E0E0E0;
        display:flex;
        align-items: center;
        cursor: pointer;
      }
      
      .discussions .search {
        display:flex;
        align-items: center;
        justify-content: center;
        color: blue;
      }
      
      .discussions .search .searchbar {
        height: 40px;
        background-color: #FFF;
        width: 70%;
        padding: 0 20px;
        border-radius: 50px;
        border: 1px solid #EEEEEE;
        display:flex;
        align-items: center;
        cursor: pointer;
        
      }
      
      .discussions .search .searchbar input {
        margin-left: 15px;
        height:38px;
        width:100%;
        border:none;
        font-family: 'Montserrat', sans-serif;;
        
      }
      
      .discussions .search .searchbar *::-webkit-input-placeholder {
        
          color: #E0E0E0;
      }
      .discussions .search .searchbar input *:-moz-placeholder {
        
          color: #E0E0E0;
      }
      .discussions .search .searchbar input *::-moz-placeholder {
          color: #E0E0E0;
      }
      .discussions .search .searchbar input *:-ms-input-placeholder {
          color: #E0E0E0;
      }
      
      .discussions .message-active {
        width: 100%;
        height: 90px;
        background-color: #FFF;
        border-bottom: solid 1px #E0E0E0;
      }
      
      .discussions .discussion .photo {
          margin-left:20px;
          display: block;
          width: 45px;
          height: 45px;
          background: #E6E7ED;
          -moz-border-radius: 50px;
          -webkit-border-radius: 50px;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
      }
      
      .online {
        position: relative;
        top: 30px;
        left: 35px;
        width: 13px;
        height: 13px;
        background-color: #8BC34A;
        border-radius: 13px;
        border: 3px solid #FAFAFA;
      }
      
      .desc-contact {
        height: 43px;
        width:50%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        
      }
      
      .discussions .discussion .name {
        margin: 0 0 0 20px;
        font-family:'Montserrat', sans-serif;
        font-size: 11pt;
        color:#515151;
      }
      
      .discussions .discussion .message {
        margin: 6px 0 0 20px;
        font-family:'Montserrat', sans-serif;
        font-size: 9pt;
        color:#515151;
      }
      
      .timer {
        margin-left: 15%;
        font-family:'Open Sans', sans-serif;
        font-size: 11px;
        padding: 3px 8px;
        color: #BBB;
        background-color: #FFF;
        border: 1px solid #E5E5E5;
        border-radius: 15px;
      }
      







      .chat {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        
        
        background-color: #fff; /* Ensure chat has a background */
        box-shadow: -3px 0px 5px rgba(0, 0, 0, 0.1);
        
      }
      
      .header-chat {
        background-color: #4768b5;
        height: 90px;
        box-shadow: 0px 3px 2px rgba(0,0,0,0.100);
        display:flex;
        align-items: center;
        position: relative;
        
      }
      
      .chat .header-chat .icon {
        margin-left: 30px;
        color:#515151;
        font-size: 14pt;
        
      }
      
      .chat .header-chat .name {
        margin: 0 0 0 20px;
        text-transform: uppercase;
        font-family:'Montserrat', sans-serif;
        font-size: 13pt;
        color:#515151;
      }
      
      .chat .header-chat .right {
        position: absolute;
        right: 40px;
        
      }
      
      .chat .messages-chat {
        padding: 25px 35px;
        overflow-y: auto; /* Ensure scrolling if messages overflow */
        height: calc(100% - 90px); /* Full height minus the header */
        flex: 1;
        
      
      }
      
      .chat .messages-chat .message {
        display: flex;
        margin-bottom: 8px;
        margin-left: auto
        
      }
      
      .chat .messages-chat .message .photo {
          display: block;
          width: 45px;
          height: 45px;
          background: #E6E7ED;
          -moz-border-radius: 50px;
          -webkit-border-radius: 50px;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          
      }
      
      .chat .messages-chat .text {
        margin-left: 20px;
        background-color: #f6f6f6;
        padding: 15px;
        border-radius: 12px;
        
      }

      
      
      .text-only {
        margin-left: 45px;
      }
      
      .time {
        font-size: 10px;
        color:lightgrey;
        margin-bottom:10px;
        margin-left: 85px;
      }
      
      .response-time {
        float: right;
        margin-right: 40px !important;
      }
      
      .response {
        float: right;
        margin-right: 0px !important;
        margin-left:auto; /* flexbox alignment rule */
        
      }
      
      .response .text {
        background-color: #e3effd !important;
      }
      
      .footer-chat {
        display: flex;
        align-items: center;
        padding: 0 20px;
        height: 80px;
        border-top: 2px solid #EEE;
        
      }
      
      .chat .footer-chat .icon {
        margin-left: 30px;
        color:#C0C0C0;
        font-size: 14pt;
      }
      
      .chat .footer-chat .send {
        color: #fff;
  background-color: #4f6ebd;
  border-radius: 50%;
  padding: 12px;
  font-size: 14pt;
  margin-left: auto;
 
      }
      
      .chat .footer-chat .name {
        margin: 0 0 0 20px;
        text-transform: uppercase;
        font-family:'Montserrat', sans-serif;
        font-size: 13pt;
        color:#515151;
      }
      
      .chat .footer-chat .right {
        position: absolute;
        right: 40px;
      }
      
      .write-message {
        border: none;
  flex: 1;
  height: 50px;
  padding: 10px;
  margin-left: 20px;
      }
      
      .footer-chat *::-webkit-input-placeholder {
        color: #C0C0C0;
        font-size: 13pt;
      }
      .footer-chat input *:-moz-placeholder {
        color: #C0C0C0;
        font-size: 13pt;
      }
      .footer-chat input *::-moz-placeholder {
        color: #C0C0C0;
        font-size: 13pt;
        margin-left:5px;
      }
      .footer-chat input *:-ms-input-placeholder {
        color: #C0C0C0;
        font-size: 13pt;
      }
      
      .clickable {
        cursor: pointer;
      }


      .userInfo {
        display: flex;
        align-items: center;
        gap: 20px;
        position: relative;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

      `}
      </style></div>
    


      <div className="container">


{/* side icon blue menu */}

  <div className="menu">
    <ul className="items">
      {/* <li className="item"><i className="fa fa-home" aria-hidden="true"></i></li>
      <li className="item"><i className="fa fa-user" aria-hidden="true"></i></li>
      <li className="item"><i className="fa fa-pencil" aria-hidden="true"></i></li> */}



      {/* <li className="item item-active"><i className="fa fa-commenting" aria-hidden="true"></i></li> */}



      {/* <li
            className={activeTab === 'tab1' ? 'active' : '' }
            onClick={(e) => handleTabClick(e, 'tab1')}
          >
            <a href="">
              <i className="fa fa-commenting" aria-hidden="true"></i>
            </a>
          </li> */}

<li
  className={`item ${activeTab === 'tab1' ? 'item-active' : ''}`}
  onClick={(e) => handleTabClick(e, 'tab1')}
>
  <a href="">
    <i className="fa fa-commenting" aria-hidden="true"></i>
  </a>
</li>



          <li
            className={`item ${activeTab === 'tab2' ? 'item-active' : ''}`}
            onClick={(e) => handleTabClick(e, 'tab2')}
          >
            <a href="">
              <i aria-hidden="true"></i>
              
              <PersonPinIcon/>
              
            </a>
          </li>




      {/* <li className="item"><i className="fa fa-file" aria-hidden="true"></i></li>
      <li className="item"><i className="fa fa-cog" aria-hidden="true"></i></li> */}
    </ul>
  </div>


{/* 
  <li
            className={activeTab === 'tab1' ? 'active' : ''}
            onClick={(e) => handleTabClick(e, 'tab1')}
          >
            <a href="">
              <i className=""></i>A
            </a>
          </li> */}





{/* existing chat on the left */}


  <div className="discussions">


    {/* search bar */}
    <div className="discussion search" >
      <div className="searchbar" >
      <SearchBarConvo/>

            
        {/* <i className="fa fa-search" aria-hidden="true"></i>
        <input type="text" placeholder="Search..." /> */}
      </div>
    </div>


      {/* <div className="discussion message-active">
        
        <div className="photo" style={{"background-image":"url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80)"}}>
          <div className="online" />
        </div>
        <div className="desc-contact">
          <p className="name">Megan Leib</p>
          <p className="message">9 pm at the bar if possible 😳</p>
        </div>
        <div className="timer">12 sec</div>
      
      </div> */}


<div
          id="tab1"
          style={{ display: activeTab === 'tab1' ? 'block' : 'none' }}
        >
          

          {conversations.map((c) => (
      <div onClick={() => { setCurrentChat(c) 
        getUserFromConversation(c)
      }}>

        <div className="discussion message-active">
          {/* <div className="photo" style={{ backgroundImage: `url(${c.photoUrl})` }}>
            {c.online && <div className="online" />}
          </div> */}
          {/* <div className="desc-contact">
            <p className="name">{c.name}</p>
            <p className="message">{c.lastMessage}</p>
          </div> */}
          {/* <div className="timer">{c.timeAgo}</div> */}
          <Conversation conversation={c} currentUser={currentUser} />
        </div>
      </div>
    ))}


          {/* <AdminsTableCrud /> */}
        </div> 




        <div
          id="tab2"
          style={{ display: activeTab === 'tab2' ? 'block' : 'none' }}
        >
          
          
          <div className="discussion message-active">
          
<ChatOnline 
              onlineUsers={onlineUsers}
              currentId={currentUser.id}
              setCurrentChat={setCurrentChat}
            />
          
          </div>
          
        </div>










</div>








    {/* chatting place where msgs being sent rec etc */}
    <div className="chat">





    {/* <div className="header-chat">
      <i className="icon fa fa-user-o" aria-hidden="true"></i>
      <p className="name">Megan Leib</p>
      <i className="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i>
    </div> */}






      {/* actual chatting msgs part */}

    <div className="messages-chat">

{/* 
    <div className="userInfo">
                      <img
                        {currentChatUser.profilePic && <img src={`/upload/${currentChatUser.profilePic}`} 
                        alt={currentChatUser.username} />}
                      />

                      
                        <span>{currentChatUser.username}</span>
                      
                    </div> */}




{currentChat ? (
              <>


<div className="header-chat">
      {/* <i className="icon fa fa-user-o" aria-hidden="true"></i> */}
      {/* <p className="name">{currentChatUser.username}</p> */}

      
    <div className="userInfo">
                      
                        {currentChatUser.profilePic && <img src={`/upload/${currentChatUser.profilePic}`} 
                        alt={currentChatUser.username} />}
 
                        <span>{currentChatUser.username}</span>
                      
                    </div>
      
      {/* <i className="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i> */}
    </div>



                <div className="chatBoxTop">
                  {messages.map((m) => (
                     <div ref={scrollRef}>
                      <Message message={m} own={m.sender === currentUser.id} />
                     </div>
                  ))}
                </div>

                
                </>
              ) : (
                <span className="noConversationText">
                  Open a conversation to start a chat.
                </span>
            )}  
            




      </div>

      {/* actual chatting msgs part */}







      <div className="footer-chat">



      <i className="icon fa fa-smile-o clickable" style={{ "font-size": "25pt" }} aria-hidden="true">
      {/* <EmojiPicker /> */}
      </i>
      {/* <input type="text" className="write-message" placeholder="Type your message here" />
      <i className="icon send fa fa-paper-plane-o clickable" aria-hidden="true"></i> */}
   
            {/* <div className="chatBoxBottom"> */}
            {/* <div className="write-message"> */}
                  {/* <textarea */}
                  <input type="text"
                  className="write-message"
                    // className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  
                  />
                  {/* </div> */}
                  {/* ></textarea> */}
                  
                  <i 
                  className="icon send fa fa-paper-plane-o clickable"  
                  aria-hidden="true"
                    onClick={handleSubmit}
                  >
                    {/* Send */}
                  </i>
                {/* </div> */}
   
    </div>





  </div>








</div>


    </>
  );
}
