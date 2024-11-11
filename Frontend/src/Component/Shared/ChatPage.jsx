import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import thumbnail from "../../Assets/thumbnail.webp";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import { useParams } from "react-router-dom";
import io from "socket.io-client"; 
import { formatTime, formatDate, formatDay } from "../Utils/Time";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [profile, setProfile] = useState(null);
  const [socket, setSocket] = useState(null); 
  const [socketConnected, setSocketConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { artistId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await makeAuthenticatedGETRequest(`/profile/${artistId}`);
        const modifiedProfile = {
          ...response.data,
          profilePic: response.data.profilePic 
          ? `/ProfilePic/${response.data.profilePic.split("\\").pop()}`
          : null,
        };
        setProfile(modifiedProfile);
        console.log("profile details:", modifiedProfile);
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
    // Update current time every minute
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    const newSocket = io("ws://localhost:8080"); // Connect to the WebSocket server
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("WebSocket connection opened");
      setSocketConnected(true);
    });

    newSocket.on("message", (newMessage) => {
      newMessage.timeStamp = new Date().toISOString();
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
        timeStamp: new Date().toISOString(),
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
    <section className="h-full bg-gray-900">
  <NavBar />
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="w-full max-w-md bg-base-200 shadow-xl rounded-lg p-8 mt-4">
      <div className="flex flex-col h-full">
        {/* Profile Section */}
        <div className="flex items-center p-4 space-x-4">
          {profile && profile.profilePic !== null ? (
            <img
              src={profile.profilePic}
              alt="profile photo"
              className="rounded-full w-16 h-16 border-2 border-[#9A7B4F] shadow-md"
            />
          ) : (
            <img
              src={thumbnail}
              alt="Profile pic"
              className="rounded-full w-16 h-16 border-2 border-[#9A7B4F] shadow-md"
            />
          )}
          <h1 className="text-2xl font-bold text-[#9A7B4F]">{profile?.userName}</h1>
        </div>

        {/* Messages Display */}
        <div className="flex-grow overflow-y-auto px-4 max-h-[300px] custom-scrollbar">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 ${msg.role === 'sender' ? 'text-right' : 'text-left'}`}
                style={{ textAlign: msg.role === 'sender' ? 'right' : 'left' }}
              >
                <div
                  className={`p-4 rounded-lg ${
                    msg.role === 'sender'
                      ? 'bg-[#9A7B4F] text-white shadow-lg'
                      : 'bg-base-100 text-black'
                  }`}
                >
                  {msg.content}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatMessageTime(msg.timeStamp)}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              <p className="text-gray-400 text-center text-lg font-medium">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="flex items-center p-4 space-x-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="input input-bordered input-secondary w-full rounded-md focus:ring-2 focus:ring-[#9A7B4F]"
          />
          <button
            className="btn btn-primary bg-[#9A7B4F] text-white hover:bg-green-500 rounded-md"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

  );

    // Function to format the message timestamp
    function formatMessageTime(timestamp) {
      const messageTime = new Date(timestamp);
      const now = currentTime;
  
      // Check if the message was sent today
      if (
        now.getDate() === messageTime.getDate() &&
        now.getMonth() === messageTime.getMonth() &&
        now.getFullYear() === messageTime.getFullYear()
      ) {
        return formatTime(messageTime);
      } else if (
        now - messageTime <= 6 * 24 * 60 * 60 * 1000 &&
        now.getDate() > messageTime.getDate()
      ) {
        // Check if the message was sent within the last 6 days
        return `${formatDay(messageTime.getDay())} ${formatTime(messageTime)}`;
      } else {
        // Display full date and time
        return `${formatDate(messageTime)} ${formatTime(messageTime, true)}`;
      }
    }
  };
  


export default ChatPage;
