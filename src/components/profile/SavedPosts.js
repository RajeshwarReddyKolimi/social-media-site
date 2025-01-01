import React, { useEffect, useState } from "react";
import PostCard from "../posts/PostCard";
import { supabase } from "../../config/supabase";

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState();
  const fetchSavedPosts = async () => {
    try {
      const { data, error } = await supabase.from("SavedPosts").select();
      console.log(data);
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
        <PostCard post={post} key={id} />
      ))}
    </div>
  );
}
