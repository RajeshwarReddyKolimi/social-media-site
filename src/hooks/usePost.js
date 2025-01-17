import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import loadingState from "../atoms/loadingState";
import userState from "../atoms/userState";
import { supabase } from "../config/supabase";
import followersState from "../atoms/followers";
import followingsState from "../atoms/followings";
import { GiConsoleController } from "react-icons/gi";
import { useNavigate } from "react-router";

export default function usePost() {
  const setLoading = useSetRecoilState(loadingState);
  const followings = useRecoilValue(followingsState);
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const handleUploadImage = async (image) => {
    try {
      setLoading((prev) => prev + 1);
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
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  const createPost = async (values) => {
    try {
      setLoading((prev) => prev + 1);
      const image = await handleUploadImage(values?.fileList?.[0]);
      const { data, error } = await supabase
        .from("Posts")
        .insert({
          userId: currentUser?.id,
          image,
          caption: values?.caption,
        })
        .select()
        .maybeSingle();
      setCurrentUser((prev) => {
        return { ...prev, posts: [...prev?.posts, data] };
      });

      if (!error) navigate("/");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  async function fetchAllPosts() {
    try {
      setLoading((prev) => prev + 1);
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

  async function fetchPost({ id, setPost, setError }) {
    try {
      setLoading((prev) => prev + 1);
      if (!currentUser?.id) return;
      const { data, error } = await supabase
        .from("Posts")
        .select(
          `*, user:userId(id, name, image), likes:LikedPosts!postId(postId)`
        )
        .eq("id", id)
        .maybeSingle();
      if (!data) {
        setError("Invalid url");
        return;
      }
      setPost(data);
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }
  return { fetchAllPosts, createPost, deletePost, fetchPost };
}
