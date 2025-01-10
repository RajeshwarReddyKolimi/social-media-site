import React from "react";
import { useRecoilValue } from "recoil";
import likedPostsState from "../../atoms/likedPosts";
import PostCard from "../posts/PostCard";

export default function LikedPosts() {
  const likedPosts = useRecoilValue(likedPostsState);
  return (
    <div className="posts">
      {likedPosts?.map((post, id) => (
        <PostCard post={post?.Post} key={id} />
      ))}
      {likedPosts?.length == 0 && (
        <p className="empty-message">No posts liked.</p>
      )}
    </div>
  );
}
