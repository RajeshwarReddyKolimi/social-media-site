import { useRecoilValue, useSetRecoilState } from "recoil";
import loadingState from "../atoms/loadingState";
import savedPostsState from "../atoms/savedPosts";
import userState from "../atoms/userState";
import { supabase } from "../config/supabase";

export default function useSavedPosts() {
  const setSavedPosts = useSetRecoilState(savedPostsState);
  const setLoading = useSetRecoilState(loadingState);
  const user = useRecoilValue(userState);
  const fetchSavedPosts = async () => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("Saves")
        .select(
          `*,
            Post:postId (
              user:userId (id, name, image),
              id,
              caption,
              image,
              likes:Likes!postId(postId)
            )
          `
        )
        .order("created_at", { ascending: false });
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const addToSavedPosts = async (postId) => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("Saves")
        .insert({ postId, userId: user?.id })
        .select(
          `*,
            Post:postId (
              user:userId (id, name, image),
              id,
              caption,
              image,
              likes:Likes!postId(postId)
            )
          `
        )
        .maybeSingle();
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const removeFromSavedPosts = async (postId) => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("Saves")
        .delete()
        .eq("postId", postId)
        .eq("userId", user?.id)
        .select();
      return postId;
    } catch (e) {
      console.log(e);
    }
  };

  return { fetchSavedPosts, addToSavedPosts, removeFromSavedPosts };
}
