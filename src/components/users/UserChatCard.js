import React from "react";
import { Link } from "react-router";
import "./index.css";

export default function UserChatCard({ user, chat }) {
  return (
    <Link to={`/chat/${chat?.id}`} className="user-chat-card user-profile-card">
      <img src={user?.image} />
      <p>{user?.name}</p>
    </Link>
  );
}
