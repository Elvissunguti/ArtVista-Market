import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import thumbnail from "../../Assets/thumbnail.webp";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [profile, setProfile] = useState([]);
  const [websocket, setWebsocket] = useState(null);

  const { artistId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await makeAuthenticatedGETRequest(`/profile/${artistId}`);
        console.log(response.data);
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
    const ws = new WebSocket("ws://localhost:8081");

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWebsocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = async () => {
    try {
      const response = await makeAuthenticatedPOSTRequest(
        `/message/create/${artistId}`, {
        content: messageInput,
      });

      const newMessage = response.data.newMessage;

      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({ newMessage }));
      }

      setMessages([...messages, newMessage]);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <section>
      <NavBar />
      <div className="flex flex-col">
        <div className="flex">
          {profile && profile.profilePic ? (
            <img src={profile.profilePic} alt="profile photo" className="rounded-full w-16 w-12" />
          ) : (
            <img src={thumbnail} alt="Profile pic" className="rounded-full w-12 h-12" />
          )}
          <h1 className="text-2xl font-semibold pl-4">{profile.userName}</h1>
        </div>
        <div>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 text-${msg.sentByUser ? "right" : "left"}`}
              style={{ textAlign: msg.sentByUser ? "right" : "left" }}
            >
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
            className=""
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </section>
  );
};

export default ChatPage;
