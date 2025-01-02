import React, { useEffect, useState } from "react";
import PostCard from "../posts/PostCard";
import { supabase } from "../../config/supabase";
import useSavedPosts from "../../hooks/useSavedPosts";
import { useRecoilValue } from "recoil";
import savedPostsState from "../../atoms/savedPosts";

export default function SavedPosts() {
  const savedPosts = useRecoilValue(savedPostsState);
  return (
    <div className="posts">
      {savedPosts?.map((post, id) => (
        <PostCard post={post?.Post} key={id} />
      ))}
    </div>
  );
}
