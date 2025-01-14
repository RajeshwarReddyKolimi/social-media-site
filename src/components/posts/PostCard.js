import React from "react";
import UserProfileCard from "../users/UserProfileCard";
import Post from "./Post";
import "./post.css";

export default function PostCard({ post, isMe, setUserPosts }) {
  return (
    <div className="post-card">
      <UserProfileCard user={post?.user} isMe={isMe} />
      <Post post={post} isMe={isMe} setUserPosts={setUserPosts} />
    </div>
  );
}
