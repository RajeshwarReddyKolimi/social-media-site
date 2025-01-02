import React, { useEffect, useState } from "react";
import PostCard from "../posts/PostCard";
import { supabase } from "../../config/supabase";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";

export default function MyPosts() {
  const [myPosts, setMyPosts] = useState();
  const user = useRecoilValue(userState);
  const fetchMyPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("Posts")
        .select(
          `*,
          User:userId (id, name, image)`
        )
        .eq("userId", user?.id);
      setMyPosts(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <div className="posts">
      {myPosts?.map((post, id) => (
        <PostCard post={post} key={id} canDelete={true} />
      ))}
    </div>
  );
}
