import React from "react";
import { supabase } from "../config/supabase";
import { useRecoilState, useRecoilValue } from "recoil";
import likedPostsState from "../atoms/likedPosts";
import userState from "../atoms/userState";

export default function useLikedPosts() {
  const [likedPosts, setLikedPosts] = useRecoilState(likedPostsState);
  const user = useRecoilValue(userState);
  const fetchLikedPosts = async () => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase.from("LikedPosts").select(
        `*,
            Post:postId (
              User:userId (id, name, image),
              id,
              caption,
              image
            )`
      );
      setLikedPosts(data);
    } catch (e) {
      console.log(e);
    }
  };

  const addToLikedPosts = async ({ postId }) => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("LikedPosts")
        .insert({ postId, userId: user?.id });
      fetchLikedPosts();
    } catch (e) {
      console.log(e);
    }
  };

  const removeFromLikedPosts = async ({ postId }) => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("LikedPosts")
        .delete()
        .eq("postId", postId)
        .eq("userId", user?.id);
      fetchLikedPosts();
    } catch (e) {
      console.log(e);
    }
  };

  return { fetchLikedPosts, addToLikedPosts, removeFromLikedPosts };
}
