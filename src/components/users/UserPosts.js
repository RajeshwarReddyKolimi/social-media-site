import React from "react";
import { useQuery } from "react-query";
import { supabase } from "../../config/supabase";
import Loader from "../../utils/loader/Loader";
import PostCard from "../posts/PostCard";

export default function UserPosts({ user, isMe }) {
  const fetchUserPosts = async () => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("Posts")
        .select(
          `*,
          user:userId (id, name, image),
          likes:Likes!postId(postId)`
        )
        .eq(`userId`, user?.id);
      return data;
    } catch (e) {
      console.error(e);
    }
  };

  const {
    data: userPosts,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["userPosts", user?.id],
    queryFn: fetchUserPosts,
    staleTime: 1000 * 60,
  });

  return (
    <section className="posts">
      {isLoading && <Loader />}
      {userPosts?.map((post, id) => (
        <PostCard key={id} post={post} isMe={isMe} setUserPosts={() => {}} />
      ))}
    </section>
  );
}
