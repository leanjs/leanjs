import React from "react";

export function Chat() {
  return (
    <div className="chat">
      <h2>Chat app</h2>
      <div className="content"></div>
      <div className="input">
        <input placeholder="Type your message" />
        <button>Send</button>
      </div>
    </div>
  );
}
