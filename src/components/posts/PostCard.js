import React from "react";
import { IoHeartOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import UserProfileCard from "../users/UserProfileCard";
import "./post.css";
import Post from "./Post";

export default function PostCard({ post, isMine }) {
  return (
    <div className="post-card">
      <UserProfileCard user={post?.User} isMine={isMine} />
      <Post post={post} isMine={isMine} />
    </div>
  );
}
