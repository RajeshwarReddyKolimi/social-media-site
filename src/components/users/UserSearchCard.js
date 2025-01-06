import React from "react";
import { Link } from "react-router";
import "./index.css";

export default function UserSearchCard({ user }) {
  return (
    <Link to={`/user/${user?.id}`} className="user-chat-card user-profile-card">
      <img src={user?.image} />
      <p>{user?.name}</p>
    </Link>
  );
}
