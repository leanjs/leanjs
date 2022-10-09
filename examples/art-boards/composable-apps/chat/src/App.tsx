import { useRuntime } from "@art-boards/runtime-react";
import { createStar } from "@art-boards/ui-canvas";
import React, { useState } from "react";

export default function Chat() {
  const runtime = useRuntime();

  const [messages, setMessages] = useState([
    { text: "Hello 👋", sentAt: new Date() },
  ]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="chat">
      <h2>Chat</h2>
      <div className="content">
        {messages.map((message) => (
          <p key={message.sentAt.getTime()}>{message.text}</p>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setMessages([...messages, { text: newMessage, sentAt: new Date() }]);

          if (newMessage.startsWith("star")) {
            runtime.api.canvas.stage.addChild(createStar());
          }

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
