import React, { useState } from "react";
import { useRuntime } from "@art-boards/runtime-react";
import { Graphics } from "@art-boards/ui-canvas";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ChatApp() {
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

          if (newMessage.includes("star")) {
            const graphics = new Graphics();
            graphics.lineStyle(4, 0xffffff);
            graphics.beginFill(0xffcc5a, 1);
            graphics.drawStar?.(
              getRandomInt(100, 800),
              getRandomInt(100, 600),
              5,
              getRandomInt(30, 50),
              20,
              getRandomInt(0, 360)
            );
            graphics.endFill();
            runtime.api.canvas.stage.addChild(graphics);
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
