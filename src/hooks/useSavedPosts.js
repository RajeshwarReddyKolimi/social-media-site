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
      setLoading((prev) => prev + 1);
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
      setSavedPosts(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  const addToSavedPosts = async ({ postId }) => {
    try {
      setLoading((prev) => prev + 1);

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
      setSavedPosts((prev) => [data, ...prev]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  const removeFromSavedPosts = async ({ postId }) => {
    try {
      setLoading((prev) => prev + 1);
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("Saves")
        .delete()
        .eq("postId", postId)
        .eq("userId", user?.id)
        .select();
      setSavedPosts((prev) => prev?.filter((post) => post?.postId !== postId));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  return { fetchSavedPosts, addToSavedPosts, removeFromSavedPosts };
}
