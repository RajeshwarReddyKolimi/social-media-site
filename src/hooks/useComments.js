import React from "react";
import { supabase } from "../config/supabase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userState from "../atoms/userState";
import loadingState from "../atoms/loadingState";

export default function useComments({ postId, setComments }) {
  const currentUser = useRecoilValue(userState);
  const setLoading = useSetRecoilState(loadingState);
  const fetchComments = async () => {
    try {
      setLoading((prev) => prev + 1);
      const { data, error } = await supabase
        .from("Comments")
        .select(`*, user:userId (id, name, image)`)
        .eq("postId", postId)
        .order("created_at", { ascending: false });
      setComments(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  const handleAddComment = async ({ comment, form }) => {
    try {
      setLoading((prev) => prev + 1);
      if (!comment?.trim()) return;
      const { data, error } = await supabase
        .from("Comments")
        .insert({
          userId: currentUser?.id,
          postId,
          comment,
        })
        .eq("postId", postId)
        ?.select(`*, user:userId (id, name, image)`)
        ?.maybeSingle();
      form.resetFields();
      setComments((prev) => [data, ...prev]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  return { fetchComments, handleAddComment };
}
