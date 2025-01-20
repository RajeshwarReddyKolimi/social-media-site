import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import loadingState from "../../atoms/loadingState";
import { supabase } from "../../config/supabase";
import PostCard from "../posts/PostCard";

export default function UserPosts({ user, isMe }) {
  const [userPosts, setUserPosts] = useState([]);
  const setLoading = useSetRecoilState(loadingState);
  async function fetchUserPosts() {
    try {
      setLoading((prev) => prev + 1);
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("Posts")
        .select(
          `*,
          user:userId (id, name, image),
          likes:Likes!postId(postId)`
        )
        .eq(`userId`, user?.id);
      setUserPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }
  useEffect(() => {
    fetchUserPosts();
  }, [user?.id]);

  return (
    <section className="posts">
      {userPosts?.map((post, id) => (
        <PostCard
          key={id}
          post={post}
          isMe={isMe}
          setUserPosts={setUserPosts}
        />
      ))}
    </section>
  );
}
