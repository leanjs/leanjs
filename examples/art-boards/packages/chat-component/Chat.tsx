import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function Chat() {
  const state = useSelector((state) => state);

  const [messages, setMessages] = useState([
    { text: "Hello 👋", sentAt: new Date() },
  ]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="chat">
      <h2>Chat</h2>
      <div className="content">
        {/* <pre>{JSON.stringify(state, undefined, 2)}</pre> */}
        {messages.map((message) => (
          <p key={message.sentAt.getTime()}>{message.text}</p>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setMessages([...messages, { text: newMessage, sentAt: new Date() }]);

          setNewMessage("");
        }}
      >
        <div className="input">
          <input
            autoComplete="off"
            type="text"
            name="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}
