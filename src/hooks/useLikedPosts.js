import { useRecoilValue, useSetRecoilState } from "recoil";
import likedPostsState from "../atoms/likedPosts";
import loadingState from "../atoms/loadingState";
import userState from "../atoms/userState";
import { supabase } from "../config/supabase";

export default function useLikedPosts() {
  const setLikedPosts = useSetRecoilState(likedPostsState);
  const user = useRecoilValue(userState);
  const setLoading = useSetRecoilState(loadingState);
  const fetchLikedPosts = async () => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("Likes")
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

  const addToLikedPosts = async (postId) => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("Likes")
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
      setLikedPosts((prev) => [data, ...prev]);
    } catch (e) {
      console.log(e);
    }
  };

  const removeFromLikedPosts = async (postId) => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("Likes")
        .delete()
        .eq("postId", postId)
        .eq("userId", user?.id)
        .select();
      return postId;
    } catch (e) {
      console.log(e);
    }
  };

  return { fetchLikedPosts, addToLikedPosts, removeFromLikedPosts };
}
