import React from "react";
import { useRecoilValue } from "recoil";
import likedPostsState from "../../atoms/likedPosts";
import PostCard from "../posts/PostCard";
import { Empty } from "antd";

export default function LikedPosts() {
  const likedPosts = useRecoilValue(likedPostsState);
  return (
    <main className="posts">
      {likedPosts?.map((post, id) => (
        <PostCard post={post?.Post} key={id} />
      ))}
      {likedPosts?.length == 0 && <Empty description="No liked posts" />}
    </main>
  );
}
