import React, { useEffect, useState } from "react";
import PostCard from "../posts/PostCard";
import { supabase } from "../../config/supabase";

export default function LikedPosts() {
  const [likedPosts, setLikedPosts] = useState();
  const fetchLikedPosts = async () => {
    try {
      const { data, error } = await supabase.from("LikedPosts").select(
        `*,
        Post:postId (
          User:userId (id, name, image),
          id,
          caption,
          image
        )`
      );
      console.log(data, error);
      setLikedPosts(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchLikedPosts();
  }, []);
  return (
    <div className="saved-posts">
      {likedPosts?.map((post, id) => (
        <PostCard post={post?.Post} key={id} />
      ))}
    </div>
  );
}
