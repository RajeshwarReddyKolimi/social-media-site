import React from "react";
import { IoHeartOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import UserProfileCard from "../users/UserProfileCard";
import "./post.css";
import Post from "./Post";

export default function PostCard({ post, isMe }) {
  return (
    <div className="post-card">
      <UserProfileCard user={post?.User} isMe={isMe} />
      <Post post={post} isMe={isMe} />
    </div>
  );
}
