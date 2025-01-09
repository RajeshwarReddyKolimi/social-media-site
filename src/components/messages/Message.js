import React from "react";
import "./index.css";

export default function Message({ message, isSent }) {
  return (
    <div className={`message ${isSent ? "sent-message" : "received-message"}`}>
      <span>{message?.text}</span>
    </div>
  );
}
