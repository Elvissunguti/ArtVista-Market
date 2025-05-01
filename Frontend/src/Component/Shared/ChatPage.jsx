// ChatPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Home/NavBar";
import thumbnail from "../../Assets/thumbnail.webp";
import { useAuth } from "../Context/AuthContext";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import { formatDate } from "../Utils/Time";
import { db } from "../Utils/Firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [profile, setProfile] = useState(null);
  const { artistId } = useParams();
  const { currentUserId } = useAuth();

  const bottomRef = useRef(null);

  // Fetch artist profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await makeAuthenticatedGETRequest(`/profile/${artistId}`);
        const modifiedProfile = {
          ...response.data,
          profilePic: response.data.profilePic || null,
        };
        setProfile(modifiedProfile);
      } catch (error) {
        console.log("Error fetching artist profile", error);
      }
    };
    fetchData();
  }, [artistId]);

  const getOrCreateChatId = async (userId1, userId2) => {
    const chatsRef = collection(db, "chats");
    const participants = [userId1, userId2].sort();
    const chatIdKey = participants.join("_");
  
    const q = query(chatsRef, where("chatIdKey", "==", chatIdKey));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }
  
    const chatDoc = await addDoc(chatsRef, {
      chatParticipants: participants,
      chatIdKey,
      createdAt: serverTimestamp(),
    });
  
    return chatDoc.id;
  };
  

  // Real-time listener
  useEffect(() => {
    let unsubscribe;

    const initChat = async () => {
      const chatId = await getOrCreateChatId(currentUserId, artistId);

      const messagesQuery = query(
        collection(db, "messages"),
        where("chatId", "==", chatId),
        orderBy("timeStamp", "asc")
      );

      unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesList);
      });
      
    };

    initChat();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUserId, artistId]);

  // Send a new message
  const sendMessage = async () => {
    try {
      const chatId = await getOrCreateChatId(currentUserId, artistId);

      const participants = [currentUserId, artistId].sort(); 

      const newMessage = {
        chatId,
        content: messageInput,
        senderId: currentUserId,
        chatParticipants: participants, 
        timeStamp: Date.now(),
      };

      await addDoc(collection(db, "messages"), newMessage);

      await makeAuthenticatedPOSTRequest(`/message/create/${artistId}`, {
        content: messageInput,
      });

      setMessageInput("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };


  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatMessageTime = (timeStamp) => {
    if (!timeStamp) return "";
  
    let time;
  
    if (typeof timeStamp === "number") {
      time = new Date(timeStamp);
    } else if (timeStamp.toDate) {
      time = timeStamp.toDate();
    } else {
      return "";
    }
  
    const now = new Date();
    const diff = now - time;
    const min = Math.floor(diff / 60000);
    const hr = Math.floor(diff / 3600000);
    const day = Math.floor(diff / 86400000);
  
    if (min < 1) return "Just now";
    if (min < 60) return `${min} min ago`;
    if (hr < 24) return `${hr} hours ago`;
    if (day < 7) return `${day} days ago`;
  
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(time);
  };
  

  

  return (
    <section className="h-full bg-gray-900">
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-base-200 shadow-xl rounded-lg p-8 mt-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center p-4 space-x-4">
              <img
                src={profile?.profilePic || thumbnail}
                alt="profile photo"
                className="rounded-full w-16 h-16 border-2 border-[#9A7B4F] shadow-md"
              />
              <h1 className="text-2xl font-bold text-[#9A7B4F]">{profile?.userName}</h1>
            </div>

            <div className="flex-grow overflow-y-auto px-4 max-h-[300px] custom-scrollbar">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-3 ${msg.senderId === currentUserId ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`p-4 rounded-lg shadow-lg ${
                        msg.senderId === currentUserId
                          ? "bg-[#9A7B4F] text-white"
                          : "bg-base-100 text-white"
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && messageInput.trim()) {
                    sendMessage();
                  }
                }}
              />
              <button onClick={sendMessage} className="btn btn-accent" disabled={!messageInput.trim()}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatPage;
