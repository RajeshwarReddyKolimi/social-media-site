import React from "react";
import { supabase } from "../config/supabase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userState from "../atoms/userState";
import loadingState from "../atoms/loadingState";

export default function useComments() {
  const currentUser = useRecoilValue(userState);
  const fetchComments = async (postId) => {
    try {
      const { data, error } = await supabase
        .from("Comments")
        .select(`*, user:userId (id, name, image)`)
        .eq("postId", postId)
        .order("created_at", { ascending: false });
      return data;
    } catch (e) {
      console.log(e);
    }
  };
  const handleAddComment = async ({ comment, postId }) => {
    try {
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
      return data;
    } catch (e) {
      console.log(e);
    }
  };
  return { fetchComments, handleAddComment };
}
