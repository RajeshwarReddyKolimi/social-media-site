import React, { useEffect, useState } from "react";
import PostCard from "../posts/PostCard";
import { supabase } from "../../config/supabase";

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState();
  const fetchSavedPosts = async () => {
    try {
      const { data, error } = await supabase.from("SavedPosts").select(
        `*,
        Post:postId (
          User:userId (id, name, image),
          id,
          caption,
          image
        )`
      );
      console.log(data, error);
      setSavedPosts(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchSavedPosts();
  }, []);
  return (
    <div className="saved-posts">
      {savedPosts?.map((post, id) => (
        <PostCard post={post?.Post} key={id} />
      ))}
    </div>
  );
}
