import React, { useEffect, useState } from "react";
import PostCard from "../posts/PostCard";
import { supabase } from "../../config/supabase";
import useLikedPosts from "../../hooks/useLikedPosts";
import { useRecoilValue } from "recoil";
import likedPostsState from "../../atoms/likedPosts";

export default function LikedPosts() {
  const likedPosts = useRecoilValue(likedPostsState);
  return (
    <div className="posts">
      {likedPosts?.map((post, id) => (
        <PostCard post={post?.Post} key={id} />
      ))}
    </div>
  );
}
