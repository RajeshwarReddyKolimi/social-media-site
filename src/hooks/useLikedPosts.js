import React from "react";
import { supabase } from "../config/supabase";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import likedPostsState from "../atoms/likedPosts";
import userState from "../atoms/userState";
import loadingState from "../atoms/loadingState";

export default function useLikedPosts() {
  const [likedPosts, setLikedPosts] = useRecoilState(likedPostsState);
  const user = useRecoilValue(userState);
  const setLoading = useSetRecoilState(loadingState);
  const fetchLikedPosts = async () => {
    try {
      setLoading((prev) => prev + 1);
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("LikedPosts")
        .select(
          `*,
            Post:postId (
              User:userId (id, name, image),
              id,
              caption,
              image,
              likes:LikedPosts!postId(postId)
            )
          `
        )
        .order("created_at", { ascending: false });
      setLikedPosts(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  const addToLikedPosts = async ({ postId }) => {
    try {
      setLoading((prev) => prev + 1);
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("LikedPosts")
        .insert({ postId, userId: user?.id });
      fetchLikedPosts();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  const removeFromLikedPosts = async ({ postId }) => {
    try {
      setLoading((prev) => prev + 1);

      if (!user?.id) return;
      const { data, error } = await supabase
        .from("LikedPosts")
        .delete()
        .eq("postId", postId)
        .eq("userId", user?.id);
      fetchLikedPosts();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  return { fetchLikedPosts, addToLikedPosts, removeFromLikedPosts };
}
