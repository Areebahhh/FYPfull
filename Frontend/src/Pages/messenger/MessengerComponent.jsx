import React from "react";
import "./messenger.css";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";


export default function MessengerComponent() {
  return (
    <div>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">

            <input placeholder="Search for friends" className="chatMenuInput" />

            <Conversation/>            
            <Conversation/>            
            <Conversation/>            
            
            {/* {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))} */}

          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
       
            {/* {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
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
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )} */}



        
                <div className="chatBoxTop">
                  <Message/>                 
                  <Message own={true}/>                 
                  <Message own={true}/>                 
                  <Message own={true}/>                 
                  <Message/>                 
                  <Message/>                 
                  <Message/>                 
                  <Message/>                 
                </div>

                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    // onChange={(e) => setNewMessage(e.target.value)}
                    // value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" 
                  // onClick={handleSubmit}
                  >
                    Send
                  </button>
                </div>
            
           
              {/* <span className="noConversationText">
                Open a conversation to start a chat.
              </span> */}
          
            
          </div>
        </div>

        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline/>
            <ChatOnline/>
            <ChatOnline/>
            {/* <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            /> */}

          </div>
        </div>
      </div>
    </div>
  );
}
