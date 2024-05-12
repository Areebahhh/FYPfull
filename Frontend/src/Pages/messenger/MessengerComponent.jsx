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


  return (
    <div>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">

            {/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
            <SearchBarConvo/>

            {conversations.map((c) => (
              <div onClick={() => {
                setCurrentChat(c)
               
              }}>
                <Conversation conversation={c} currentUser={currentUser} />
              </div>
            ))}

          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
       
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                     <div ref={scrollRef}>
                      <Message message={m} own={m.sender === currentUser.id} />
                     </div>
                  ))}
                </div>

                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" 
                    onClick={handleSubmit}
                  >
                    Send
                  </button>
                </div>
                </>
              ) : (
                <span className="noConversationText">
                  Open a conversation to start a chat.
                </span>
            )}  
            
           
  
          
            
          </div>
        </div>

        <div className="chatOnline">
          <div className="chatOnlineWrapper">

            <ChatOnline 
              onlineUsers={onlineUsers}
              currentId={currentUser.id}
              setCurrentChat={setCurrentChat}
            />

          </div>
        </div>
      </div>
    </div>
  );
}
