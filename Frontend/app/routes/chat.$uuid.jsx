import { useState, useEffect } from "react";
import "../styles/chat.scss";
import { NavLink } from "@remix-run/react";

export default function Chat() {

    const initialMessages = [
        { id: 1, sender: "Alice", text: "Welcome to the group!" },
        { id: 2, sender: "Bob", text: "Hey John!" },
        { id: 3, sender: "John", text: "Hi Guys!" },
        { id: 4, sender: "Charlie", text: "Hey John! We were just speaking about meeting up this saturday, any ideas?" },
    ];

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        let delay = 0;
        initialMessages.forEach((msg, index) => {
            const timeoutId = setTimeout(() => {
                setMessages(prevMessages => {
                    if (!prevMessages.some(m => m.id === msg.id)) {
                        return [...prevMessages, msg];
                    }
                    return prevMessages;
                });
            }, delay);
            delay += (Math.floor(Math.random() * 1000) + 500);

            return () => clearTimeout(timeoutId);
        });
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                sender: "John",
                text: newMessage,
            };
            setMessages([...messages, newMsg]);
            setNewMessage("");
        }
    };

    return (
        <div className="chatContainer">
            <header className="chatHeader">
                <div className="leftGroup">
                    <NavLink to="/home">
                        <i className="bx bx-left-arrow-alt" />
                    </NavLink>
                    <span className="groupName">Colombia Coffee</span>
                </div>

                <div className="rightGroup">
                    <NavLink to="/meetup" className="chip"><span>meeetup</span></NavLink>
                    <i className="bx bx-info-circle" />
                </div>
            </header>
            <main className="chatContent">
                <div className="potd">
                    <p>POTD... do you prefer arabica or robusta or which blend?</p>
                </div>
                <p className="joinMessage">John has joined the chat</p>
                <ul className="messagesList">
                    {messages.map(message => (
                        <li key={message.id} className="messageItem">
                            <strong>{message.sender}:</strong> {message.text}
                        </li>
                    ))}
                </ul>
            </main>
            <footer className="chatFooter">
                <form onSubmit={handleSendMessage}
                    className="messageForm">
                    <span>+</span>

                    <input type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        required
                    />
                    <button type="submit"><i style={{ rotate: "-45px" }} className="bx bxs-send" /></button>
                </form>
            </footer>
        </div>
    );
}