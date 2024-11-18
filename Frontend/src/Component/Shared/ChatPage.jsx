// ChatPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Home/NavBar";
import thumbnail from "../../Assets/thumbnail.webp";
import { useAuth } from "../Context/AuthContext";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import { formatTime, formatDate, formatDay } from "../Utils/Time";
import { db } from "../Utils/Firebase"; 
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, setLogLevel } from "firebase/firestore";

setLogLevel("debug");

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [profile, setProfile] = useState(null);
  const { artistId } = useParams();
  const { currentUserId } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await makeAuthenticatedGETRequest(`/profile/${artistId}`);
        const modifiedProfile = {
          ...response.data,
          profilePic: response.data.profilePic ? response.data.profilePic : null,
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
      try {
        const response = await makeAuthenticatedGETRequest(`/message/sent/${artistId}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };
    fetchMessages();
  }, [artistId]);

  // Listen to new messages in Firestore in real-time
  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const messagesQuery = query(
      messagesRef,
      where("userId", "in", [currentUserId, artistId]),
      where("artistId", "in", [currentUserId, artistId]),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
        timeStamp: doc.data().timeStamp.toDate(),
        senderId: doc.data().userId,
      }));
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, [artistId, currentUserId]);

  const sendMessage = async () => {
    try {
      const newMessage = {
        content: messageInput,
        sentByUser: true,
        userId: currentUserId,
        artistId,
        timeStamp: serverTimestamp(),
      };

      // Send message to Firestore
      await addDoc(collection(db, "messages"), newMessage);

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput("");

      // Also save in MongoDB via API if necessary
      await makeAuthenticatedPOSTRequest(`/message/create/${artistId}`, {
        content: messageInput,
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
            <div className="flex items-center p-4 space-x-4">
              {profile && profile.profilePic ? (
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
            <div className="flex-grow overflow-y-auto px-4 max-h-[300px] custom-scrollbar">
              {messages && messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-3 ${msg.sender.id === currentUserId ?  'text-right' : 'text-left'}`}
                  >
                    <div
                      className={`p-4 rounded-lg ${
                        msg.sender.id === currentUserId 
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
            <div className="flex items-center p-4 space-x-2">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Write a message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button
                onClick={sendMessage}
                className="btn btn-accent"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const formatMessageTime = (timeStamp) => {
  const now = new Date();
  const messageTime = new Date(timeStamp);
  const diff = now - messageTime;
  const diffInMinutes = Math.floor(diff / 60000);
  const diffInHours = Math.floor(diff / 3600000);
  const diffInDays = Math.floor(diff / 86400000);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return formatDate(messageTime);
  }
};

export default ChatPage;
