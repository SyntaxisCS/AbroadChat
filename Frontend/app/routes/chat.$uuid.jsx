import { useState } from "react";
import "../styles/chat.scss";
import { NavLink } from "@remix-run/react";

export default function Chat() {

    const [messages, setMessages] = useState([
        { id: 1, sender: "Alice", text: "Welcome to the group!" },
        { id: 2, sender: "Bob", text: "Hey John!" },
        { id: 3, sender: "John", text: "Hi guys!" },
        { id: 5, sender: "Charlie", text: "We were planning on meeting up for coffee sometime next week, you in?" },
        { id: 5, sender: "John", text: "Yeah sure. Thanks!" },
    ]);
    const [newMessage, setNewMessage] = useState("");

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
                <NavLink to="/home">
                    <i className="bx bx-left-arrow-alt" />
                </NavLink>
            </header>
            <main className="chatContent">
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