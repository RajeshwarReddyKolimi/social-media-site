import { useNavigate } from "react-router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import followingsState from "../atoms/followings";
import loadingState from "../atoms/loadingState";
import userState from "../atoms/userState";
import { supabase } from "../config/supabase";
import useMessages from "./useMessages";

export default function usePost() {
  const setLoading = useSetRecoilState(loadingState);
  const followings = useRecoilValue(followingsState);
  const { fetchChatId } = useMessages({});
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const navigate = useNavigate();

  const handleUploadImage = async (image) => {
    try {
      const imageName = Date.now() + image?.name.replace(/\s+/g, "_");
      const r1 = await supabase.storage
        .from("postImages")
        .upload(imageName, image?.originFileObj);
      if (r1.error) return;
      const { data, error } = await supabase.storage
        .from("postImages")
        .getPublicUrl(imageName);
      if (!error) return data?.publicUrl;
    } catch (e) {
      console.log(e);
    }
  };

  const createPost = async (values) => {
    try {
      const image = await handleUploadImage(values?.fileList?.[0]);
      const { data, error } = await supabase
        .from("Posts")
        .insert({
          userId: currentUser?.id,
          image,
          caption: values?.caption,
        })
        .select(
          `*,
          user:userId (
            id,
            name,
            image
          ),
          likes:Likes!postId(postId)`
        )
        .maybeSingle();
      setCurrentUser((prev) => {
        return { ...prev, posts: [...prev?.posts, data] };
      });
      if (!error) navigate("/");
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  async function fetchAllPosts() {
    try {
      const followerIds = [
        ...(followings?.map((follow) => follow.following) || []),
        currentUser?.id,
      ];
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
          likes:Likes!postId(postId)`
        )
        .in("userId", followerIds)
        .order("created_at", { ascending: false });
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchPost(postId) {
    try {
      if (!currentUser?.id) return;
      const { data, error } = await supabase
        .from("Posts")
        .select(`*, user:userId(id, name, image), likes:Likes!postId(postId)`)
        .eq("id", postId)
        .maybeSingle();
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  async function deletePost(postId) {
    try {
      if (!currentUser?.id) return;
      const { data, error } = await supabase
        .from("Posts")
        .delete()
        .eq("id", postId)
        .eq("userId", currentUser?.id)
        .select()
        .maybeSingle();
      setCurrentUser((prev) => {
        return {
          ...prev,
          posts: prev?.posts?.filter((p) => p.id !== postId),
        };
      });
      const imagePath = data?.image?.split(
        "/storage/v1/object/public/postImages/"
      )?.[1];
      const res = await supabase.storage.from("postImages").remove([imagePath]);
      return postId;
    } catch (e) {
      console.error(e);
    }
  }

  const handleSharePost = async ({
    receiverId,
    postId,
    setShowShareOptions,
  }) => {
    try {
      const chatId = await fetchChatId(receiverId);
      const { data, error } = await supabase.from("Messages").insert({
        sender: currentUser?.id,
        receiver: receiverId,
        postId,
        chatId,
      });
      setShowShareOptions(false);
    } catch (e) {
      console.log(e);
    }
  };

  return { fetchAllPosts, createPost, deletePost, fetchPost, handleSharePost };
}
