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
  const user = useRecoilValue(userState);
  const fetchFollowers = async () => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("Follows")
        .select(
          `
                *,
                User:follower(id, name, image)
                `
        )
        .eq("following", user?.id);
      setFollowers(data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchFollowings = async () => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("Follows")
        .select(
          `
                *,
                User:following(id, name, image)
                `
        )
        .eq("follower", user?.id);
      setFollowings(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFollow = async ({ userId }) => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("Follows")
        .insert({ follower: user?.id, following: userId });
      fetchFollowings();
    } catch (e) {
      console.log(e);
    }
  };

  const handleUnfollow = async ({ userId }) => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("Follows")
        .delete()
        .eq("follower", user?.id)
        .eq("following", userId);
      console.log(data, error);
      fetchFollowings();
    } catch (e) {
      console.log(e);
    }
  };

  return { fetchFollowers, fetchFollowings, handleFollow, handleUnfollow };
}
