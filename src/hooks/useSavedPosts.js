import React from "react";
import { supabase } from "../config/supabase";
import { useRecoilState, useRecoilValue } from "recoil";
import savedPostsState from "../atoms/savedPosts";
import userState from "../atoms/userState";

export default function useSavedPosts() {
  const [savedPosts, setSavedPosts] = useRecoilState(savedPostsState);
  const user = useRecoilValue(userState);
  const fetchSavedPosts = async () => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase.from("SavedPosts").select(
        `*,
            Post:postId (
              User:userId (id, name, image),
              id,
              caption,
              image
            )`
      );
      setSavedPosts(data);
    } catch (e) {
      console.log(e);
    }
  };

  const addToSavedPosts = async ({ postId }) => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("SavedPosts")
        .insert({ postId, userId: user?.id });
      fetchSavedPosts();
    } catch (e) {
      console.log(e);
    }
  };

  const removeFromSavedPosts = async ({ postId }) => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("SavedPosts")
        .delete()
        .eq("postId", postId)
        .eq("userId", user?.id);
      fetchSavedPosts();
    } catch (e) {
      console.log(e);
    }
  };

  return { fetchSavedPosts, addToSavedPosts, removeFromSavedPosts };
}
