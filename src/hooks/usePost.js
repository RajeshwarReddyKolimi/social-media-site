import { useRecoilValue, useSetRecoilState } from "recoil";
import loadingState from "../atoms/loadingState";
import userState from "../atoms/userState";
import { supabase } from "../config/supabase";
import followersState from "../atoms/followers";

export default function usePost() {
  const setLoading = useSetRecoilState(loadingState);
  const followers = useRecoilValue(followersState);
  const currentUser = useRecoilValue(userState);
  async function uploadImage(image) {}
  async function fetchAllPosts() {
    try {
      setLoading((prev) => prev + 1);
      const followerIds = [
        ...(followers?.map((follow) => follow.follower) || []),
        currentUser?.id,
      ];
      console.log(followers, followerIds);
      if (!currentUser?.id) return;
      const { data, error } = await supabase
        .from("Posts")
        .select(
          `*,
    user:userId (
      id,
      name,
      image
    ),
    likes:LikedPosts!postId(postId)`
        )
        .in("userId", followerIds)
        .order("created_at", { ascending: false });
      return data;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }

  async function fetchAPost(id) {
    try {
      setLoading((prev) => prev + 1);
      if (!currentUser?.id) return;
      const data = await supabase
        .from("Posts")
        .select(
          `*, user:userId(id, name, image), likes:LikedPosts!postId(postId)`
        )
        .eq("id", id)
        .maybeSingle();
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
      if (!currentUser?.id) return;
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
      if (!currentUser?.id) return;
      const data = await supabase
        .from("Posts")
        .delete()
        .eq("id", postId)
        .eq("userId", currentUser?.id);
      return data;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }
  return { fetchAllPosts, createAPost, deletePost, fetchAPost };
}
