import React, { useEffect, useState } from "react";
import PostCard from "../posts/PostCard";
import { supabase } from "../../config/supabase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userState from "../../atoms/userState";
import loadingState from "../../atoms/loadingState";

export default function MyPosts() {
  const [myPosts, setMyPosts] = useState();
  const setLoading = useSetRecoilState(loadingState);
  const user = useRecoilValue(userState);
  const fetchMyPosts = async () => {
    try {
      setLoading((prev) => prev + 1);
      const { data, error } = await supabase
        .from("Posts")
        .select(
          `*,
          User:userId (id, name, image),
          likes:LikedPosts!postId(postId)`
        )
        .eq("userId", user?.id)
        .order("created_at", { ascending: false });
      setMyPosts(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <div className="posts">
      {myPosts?.map((post, id) => (
        <PostCard post={post} key={id} isMe={true} />
      ))}
    </div>
  );
}
