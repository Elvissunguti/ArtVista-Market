import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import NavBar from "../Home/NavBar";
import thumbnail from "../../Assets/thumbnail.webp";
import { Link } from "react-router-dom";

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
        try {
          setLoading(true);
          const response = await makeAuthenticatedGETRequest("/message/get/chat");
      
          console.log("Full response from /message/get/chat:", response);
      
          if (Array.isArray(response?.data)) {
            const formattedChats = response.data.map(chat => ({
              artistId: chat.artistId,
              userName: chat.userName,
              profilePic: chat.profilePic
                ? `/ProfilePic/${chat.profilePic.split("\\").pop()}`
                : null,
            }));
            setChats(formattedChats);
          } else {
            console.warn("Unexpected response format", response);
            setChats([]);
          }
        } catch (error) {
          console.error("Error fetching chats:", error);
        } finally {
          setLoading(false);
        }
      };
      

    fetchChats();
  }, []);

  return (
    <section>
      <NavBar />
      <div>
        <h2 className="text-lg font-semibold">My Messages</h2>
      </div>

      <div>
        {loading ? (
          <div className="min-h-screen flex justify-center">
            <div className="animate-spin w-20 h-20 border-t-4 border-[#9A7B4F] border-solid rounded-full"></div>
          </div>
        ) : chats.length > 0 ? (
          <div>
            {chats.map(chat => (
              <Link key={chat.artistId} to={`/chatpage/${chat.artistId}`}>
                <div className="flex items-center my-5">
                  <img
                    src={chat.profilePic || thumbnail}
                    alt="Profile"
                    className="w-12 h-12 ml-5 font-white rounded-full"
                  />
                  <p className="font-semibold ml-4 text-white text-lg">{chat.userName}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center mt-10 text-gray-500">
            <p>You have no chats yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Messages;
