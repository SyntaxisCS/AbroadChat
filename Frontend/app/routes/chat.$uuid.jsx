import { useState } from "react";
import "../styles/chat.scss";

export default function Chat() {

  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", text: "Welcome to the group!" },
    { id: 2, sender: "Bob", text: "Hello everyone!" },
    { id: 3, sender: "Charlie", text: "Looking forward to our next meetup." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "You",
        text: newMessage,
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Group Chat</h1>
      </header>
      <main className="chat-content">
        <ul className="messages-list">
          {messages.map((message) => (
            <li key={message.id} className="message-item">
              <strong>{message.sender}:</strong> {message.text}
            </li>
          ))}
        </ul>
      </main>
      <footer className="chat-footer">
        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            required
          />
          <button type="submit">Send</button>
        </form>
      </footer>
    </div>
  );
}