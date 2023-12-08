import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import thumbnail from "../../Assets/thumbnail.webp";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import { useParams } from "react-router-dom";

const ChatPage = () => {

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [ profile, setProfile ] = useState([]);

    const { artistId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    `/profile/${artistId}` 
                );
                console.log(response.data);
                const modifiedProfile = {
                    ...response.data,
                    profilePic: `/ProfilePic/${response.data.profilePic.split("\\").pop()}`,
                  };
                setProfile(modifiedProfile);
            } catch (error){
                console.log("Error fetching artist profile", error);
            }
        }
        fetchData();
    }, [artistId]);


    return (
        <section>
            <NavBar />
            <div className="flex flex-col">
                <div className="flex ">
                {profile && profile.profilePic ? (
                    <img
                     src={profile.profilePic}
                     alt='profile photo'
                     className="rounded-full"
                    />
                ) : (
                     <img
                      src={thumbnail}
                      alt="Profile pic"
                      className=""
                    />
                )}
                          
                    <h1>{profile.userName}</h1>
                </div>
                <div>
                {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 text-${msg.sentByUser ? 'right' : 'left'}`}
              style={{ textAlign: msg.sentByUser ? 'right' : 'left' }}
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
                    <button>
                        Send
                    </button>
                </div>

            </div>
        </section>
    )
}
export default ChatPage;