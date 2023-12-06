import React, { useState } from "react";
import NavBar from "../Home/NavBar";
import thumbnail from "../../Assets/thumbnail.webp";

const ChatPage = () => {

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');


    return (
        <section>
            <NavBar />
            <div className="flex ">
                <div>
                    <img
                      src={thumbnail}
                      alt="Profile pic"
                      className=""
                    />
                    <h1>userName</h1>
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