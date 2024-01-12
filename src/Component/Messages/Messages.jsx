import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import NavBar from "../Home/NavBar";
import thumbnail from "../../Assets/thumbnail.webp";


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
                            <div key={chat.userId} className="flex">
                              {chat.artPhoto ? (
                             <img
                        src={`/ArtImages/${chat.artPhoto.split("\\").pop()}`}
                        alt="Profile pic"
                        className=""
                    />
                ) : (
                  <div>
                   <img
                     src={thumbnail}
                     alt="thumbnail"
                     className=""
                    />
                  </div>
                )}
                        <p>{chat.userName}</p>
                            </div>
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