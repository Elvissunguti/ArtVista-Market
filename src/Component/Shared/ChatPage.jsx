import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import thumbnail from "../../Assets/thumbnail.webp";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import { useParams } from "react-router-dom";
import io from "socket.io-client"; 

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [profile, setProfile] = useState(null);
  const [socket, setSocket] = useState(null); 
  const [socketConnected, setSocketConnected] = useState(false);

  const { artistId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await makeAuthenticatedGETRequest(`/profile/${artistId}`);
        const modifiedProfile = {
          ...response.data,
          profilePic: `/ProfilePic/${response.data.profilePic.split("\\").pop()}`,
        };
        setProfile(modifiedProfile);
      } catch (error) {
        console.log("Error fetching artist profile", error);
      }
    };
    fetchData();
  }, [artistId]);


  useEffect(() => {
    const fetchMessages = async () => {
      try{
        const response = await makeAuthenticatedGETRequest(
          `/message/sent/${artistId}`
        );

        setMessages(response.data);

      } catch (error){
        console.error("Error fetching messages", error);
      }
    };
    fetchMessages();
  }, [artistId]);


  useEffect(() => {
    const newSocket = io("ws://localhost:8080"); // Connect to the WebSocket server
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("WebSocket connection opened");
      setSocketConnected(true);
    });

    newSocket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    newSocket.on("disconnect", () => {
      console.log("WebSocket connection closed");
      setSocketConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    try {
      // Create a new message locally
      const newMessage = {
        content: messageInput,
        sentByUser: true,
        role: 'sender', // Assuming 'sender' as the role for user-sent messages
      };
  
      // Update the state immediately
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput("");
  
      // Emit the new message event to the server
      if (socketConnected) {
        socket.emit("newMessage", newMessage);
      } else {
        console.error("WebSocket connection not open");
      }
  
      // Make the actual API call to store the message on the server
      makeAuthenticatedPOSTRequest(`/message/create/${artistId}`, {
        content: messageInput,
      }).then((response) => {
        console.log("Response:", response);
  
        // If needed, you can update the state with the server response here
      });
    } catch (error) {
      console.error("Error sending message", error);
    }
  };


  
  

  return (
    <section>
      <NavBar />
      <div className="flex flex-col">
        <div className="flex">
          {profile && profile.profilePic !== null  ? (
            <img src={profile.profilePic} alt="profile photo" className="rounded-full w-16 w-12" />
          ) : (
            <img src={thumbnail} alt="Profile pic" className="rounded-full w-12 h-12" />
          )}
          <h1 className="text-2xl font-semibold pl-4">{profile?.userName}</h1>
        </div>
        <div>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 text-${msg.role === 'sender' ? "right" : "left"}`}
              style={{ textAlign: msg.role === 'sender' ? "right" : "left" }}
            >
              {msg.role === 'sender' ? "You: " : ""}
              {msg.content}
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            style={{ wordWrap: 'break-word' }}
            className="my-5 pr-10 pl-4 py-2 w-96 border border-gray-300 focus:z-10 focus:border-[#9A7B4F] focus:outline-none focus:ring-[#9A7B4F] resize-none whitespace-normal overflow-y-auto max-h-[100px] min-h-[32px]"
          />
          <button className="bg-[#9A7B4F] px-2 py-3 text-white font-semibold rounded-xl hover:bg-green-500 cursor-pointer" 
              onClick={sendMessage}>Send</button>
        </div>
      </div>
    </section>
  );
};

export default ChatPage;
