import React from "react";
import "./index.css";

export default function Message({ message, userId }) {
  return (
    <div
      className={`message ${
        userId === message?.sender ? "sent-message" : "received-message"
      }`}
    >
      <span>{message?.text}</span>
    </div>
  );
}
