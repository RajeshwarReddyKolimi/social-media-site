import React from "react";
import { IoHeartOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import UserCardMin from "./UserCardMin";
import "./post.css";
import Post from "./Post";

export default function PostCard({ post, canDelete }) {
  return (
    <div className="post-card">
      <UserCardMin user={post?.User} />
      <Post post={post} canDelete={canDelete} />
    </div>
  );
}
