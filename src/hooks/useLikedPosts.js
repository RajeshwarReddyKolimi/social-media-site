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
      setLoading((prev) => prev + 1);
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("LikedPosts")
        .select(
          `*,
            Post:postId (
              user:userId (id, name, image),
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
        .insert({ postId, userId: user?.id })
        .select(
          `*,
            Post:postId (
              user:userId (id, name, image),
              id,
              caption,
              image,
              likes:LikedPosts!postId(postId)
            )
          `
        )
        .maybeSingle();
      setLikedPosts((prev) => [data, ...prev]);
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
        .eq("userId", user?.id)
        .select();
      setLikedPosts((prev) => prev?.filter((post) => post?.postId !== postId));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  return { fetchLikedPosts, addToLikedPosts, removeFromLikedPosts };
}
