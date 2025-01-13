import React from "react";
import { Link } from "react-router";
import UserSearchCard from "../users/UserSearchCard";
import "./index.css";
export default function MessagePost({ message, isSent }) {
  return (
    <div
      className={`message message-post ${
        isSent ? "sent-message" : "received-message"
      }`}
    >
      <UserSearchCard user={message?.post?.user} />
      <Link to={`/post/${message?.post?.id}`} className="message-post-link">
        <img src={message?.post?.image} />
        <p>{message?.post?.caption}</p>
      </Link>
    </div>
  );
}
