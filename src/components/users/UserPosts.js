import React, { useEffect, useState } from "react";
import PostCard from "../posts/PostCard";
import { supabase } from "../../config/supabase";

export default function UserPosts({ user }) {
  const [userPosts, setUserPosts] = useState([]);
  async function fetchUserPosts() {
    try {
      if (!user?.id) return;
      // setLoading((prev) => prev + 1);
      const { data, error } = await supabase
        .from("Posts")
        .select(
          `*,
        User:userId (
          id,
          name,
          image
        )`
        )
        .eq(`userId`, user?.id);
      setUserPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      // setLoading((prev) => prev - 1);
    }
  }
  useEffect(() => {
    fetchUserPosts();
  }, []);
  return (
    <div>
      {userPosts?.map((post, id) => (
        <PostCard key={id} post={post} />
      ))}
    </div>
  );
}
