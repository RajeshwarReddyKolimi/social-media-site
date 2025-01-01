import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import loadingState from "../atoms/loadingState";
import { supabase } from "../config/supabase";
import userState from "../atoms/userState";

export default function usePost() {
  const [loading, setLoading] = useRecoilState(loadingState);
  const user = useRecoilValue(userState);
  async function uploadImage(image) {}
  async function fetchAllPosts() {
    try {
      if (!user?.id) return;
      // setLoading((prev) => prev + 1);
      const { data, error } = await supabase
        .from("Posts")
        .select(
          `*,
        User:userId (
          id,
          name,
          image
        )`
        )
        .neq(`userId`, user?.id);
      error && console.log(error);
      return data;
    } catch (e) {
      console.error(e);
    } finally {
      // setLoading((prev) => prev - 1);
    }
  }

  async function createAPost({ userId, image, caption }) {
    try {
      setLoading((prev) => prev + 1);
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
  return { fetchAllPosts, createAPost };
}
