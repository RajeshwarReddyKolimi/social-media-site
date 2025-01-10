import React from "react";
import { useRecoilValue } from "recoil";
import savedPostsState from "../../atoms/savedPosts";
import PostCard from "../posts/PostCard";
import "./../posts/post.css";

export default function SavedPosts() {
  const savedPosts = useRecoilValue(savedPostsState);
  return (
    <div className="posts">
      {savedPosts?.map((post, id) => (
        <PostCard post={post?.Post} key={id} />
      ))}
      {savedPosts?.length == 0 && (
        <p className="empty-message">No posts saved.</p>
      )}
    </div>
  );
}
