import React from "react";
import { Link } from "react-router";
import "./index.css";

export default function UserChatCard({ receiver, chat }) {
  console.log(receiver);
  return (
    <Link
      to={`/chat/${receiver?.id}`}
      className="user-chat-card user-profile-card"
    >
      <img src={receiver?.image} />
      <p>{receiver?.name}</p>
    </Link>
  );
}
