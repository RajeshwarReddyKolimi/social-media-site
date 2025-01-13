import React, { useEffect } from "react";
import { supabase } from "../config/supabase";
import { useRecoilState, useRecoilValue } from "recoil";
import likedPostsState from "../atoms/likedPosts";
import userState from "../atoms/userState";
import followersState from "../atoms/followers";
import followingsState from "../atoms/followings";

export default function useFollows() {
  const [followers, setFollowers] = useRecoilState(followersState);
  const [followings, setFollowings] = useRecoilState(followingsState);
  const currentUser = useRecoilValue(userState);
  const fetchFollowers = async (user) => {
    try {
      if (!currentUser?.id) return;
      const { data, error } = await supabase
        .from("Follows")
        .select(
          `
            *,
            user:follower(id, name, image)
            `
        )
        .eq("following", user?.id)
        .order("created_at", { ascending: false });
      if (currentUser?.id == user?.id) setFollowers(data);
      else return data;
    } catch (e) {
      console.log(e);
    }
  };

  const fetchFollowings = async (user) => {
    try {
      if (!currentUser?.id) return;

      const { data, error } = await supabase
        .from("Follows")
        .select(
          `
                *,
                user:following(id, name, image)
                `
        )
        .eq("follower", user?.id)
        .order("created_at", { ascending: false });

      if (currentUser?.id == user?.id) setFollowings(data);
      else return data;
    } catch (e) {
      console.log(e);
    }
  };

  const handleFollow = async ({ userId }) => {
    try {
      if (!currentUser?.id) return;
      const { data, error } = await supabase
        .from("Follows")
        .insert({ follower: currentUser?.id, following: userId });
      fetchFollowings();
    } catch (e) {
      console.log(e);
    }
  };

  const handleUnfollow = async ({ userId }) => {
    try {
      if (!currentUser?.id) return;
      const { data, error } = await supabase
        .from("Follows")
        .delete()
        .eq("follower", currentUser?.id)
        .eq("following", userId);
      fetchFollowings();
    } catch (e) {
      console.log(e);
    }
  };

  return { fetchFollowers, fetchFollowings, handleFollow, handleUnfollow };
}
