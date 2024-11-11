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
                const modifiedChats = response.data.map(chat => ({
                    ...chat,
                    profilePic: chat.profilePic 
                        ? `/ProfilePic/${chat.profilePic.split("\\").pop()}`
                        : null,
                }));
                  setChats(modifiedChats);
                
                console.log("chat", modifiedChats);
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
                    
                  <div className="min-h-screen flex  justify-center overflow-none">
                    <div className="animate-spin w-20 h-20 border-t-4 border-[#9A7B4F] border-solid rounded-full"></div>
                  </div> 
                ) : chats.length > 0 ? (
                    <div className="">
                        {chats.map((chat) => (
                            <Link key={chat.artistId} to={`/chatpage/${chat?.artistId}`}>
                                <div className="flex items-center my-5" key={chat.artistId}>
                                    {chat.profilePic ? (
                                        <img
                                            src={chat.profilePic}
                                            alt="Profile pic"
                                            className="w-12 h-12 ml-5 rounded-full"
                                        />
                                    ) : (
                                        <div>
                                            <img
                                                src={thumbnail}
                                                alt="thumbnail"
                                                className="w-12 h-12 rounded-full ml-5"
                                            />
                                        </div>
                                    )}
                                    <p className="font-semibold ml-4 text-lg">{chat.userName}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    
                    <div>
                        <p>You have no chats yet</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Messages;
