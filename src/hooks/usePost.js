import { useRecoilValue, useSetRecoilState } from "recoil";
import loadingState from "../atoms/loadingState";
import userState from "../atoms/userState";
import { supabase } from "../config/supabase";

export default function usePost() {
  const setLoading = useSetRecoilState(loadingState);
  const user = useRecoilValue(userState);
  async function uploadImage(image) {}
  async function fetchAllPosts() {
    try {
      setLoading((prev) => prev + 1);
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("Posts")
        .select(
          `*,
          User:userId (
            id,
            name,
            image
          ),
          likes:LikedPosts!postId(postId)`
        )
        .neq("userId", user?.id)
        .order("created_at", { ascending: false });

      return data;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }

  async function createAPost({ userId, image, caption }) {
    try {
      setLoading((prev) => prev + 1);
      if (!user?.id) return;
      const imageUrl = await uploadImage(image);
      const data = await supabase
        .from("Posts")
        .insert({ userId, image: imageUrl, caption });
      return data;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }

  async function deletePost({ postId }) {
    try {
      setLoading((prev) => prev + 1);
      if (!user?.id) return;
      const data = await supabase
        .from("Posts")
        .delete()
        .eq("id", postId)
        .eq("userId", user?.id);
      return data;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }
  return { fetchAllPosts, createAPost, deletePost };
}
