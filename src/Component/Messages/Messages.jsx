import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import NavBar from "../Home/NavBar";
import thumbnail from "../../Assets/thumbnail.webp";
import { Link } from "react-router-dom";


const Messages = () => {

    const [ chats, setChats ] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/message/get/chat"
                )
                setChats(response.data)

            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        }
        fetchChats()
    }, [])

    


    return (
        <section>
            <NavBar />
            <div>
                <h2>My Messages</h2>
            </div>
            <div>
                {chats.length > 0 ? (
                    <div className=" ">
                        {chats.map((chat) => (
                            <Link to={`/chatpage/${chat?.artistId}`}>
                            
                            <div key={chat.artistId} className="flex  items-center ">
                              {chat.artPhoto ? (
                             <img
                        src={`/ArtImages/${chat.artPhoto.split("\\").pop()}`}
                        alt="Profile pic"
                        className="w-12 h-12 rounded-full"
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
                        <p className="font-semibold text-lg">{chat.userName}</p>
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
    )
}
export default Messages;