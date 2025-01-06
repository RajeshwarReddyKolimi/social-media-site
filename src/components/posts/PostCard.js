import React from "react";
import { IoHeartOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import UserPostCard from "../profile/UserPostCard";
import "./post.css";
import Post from "./Post";

export default function PostCard({ post, isMine }) {
  return (
    <div className="post-card">
      <UserPostCard user={post?.User} isMine={isMine} />
      <Post post={post} isMine={isMine} />
    </div>
  );
}
