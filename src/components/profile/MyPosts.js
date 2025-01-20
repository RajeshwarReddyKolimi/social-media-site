import { Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import loadingState from "../../atoms/loadingState";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";
import PostCard from "../posts/PostCard";

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
          user:userId (id, name, image),
          likes:Likes!postId(postId)`
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
  console.log(myPosts);
  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <section className="posts">
      {myPosts?.map((post, id) => (
        <PostCard post={post} key={id} isMe={true} />
      ))}
      {myPosts?.length == 0 && <Empty description="No posts" />}
    </section>
  );
}
