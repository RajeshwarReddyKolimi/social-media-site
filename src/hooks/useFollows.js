import { useRecoilValue, useSetRecoilState } from "recoil";
import followersState from "../atoms/followers";
import followingsState from "../atoms/followings";
import loadingState from "../atoms/loadingState";
import userState from "../atoms/userState";
import { supabase } from "../config/supabase";

export default function useFollows() {
  const setFollowers = useSetRecoilState(followersState);
  const setFollowings = useSetRecoilState(followingsState);
  const setLoading = useSetRecoilState(loadingState);
  const currentUser = useRecoilValue(userState);
  const fetchFollowers = async (userId) => {
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
        .eq("following", userId)
        .order("created_at", { ascending: false });
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const fetchFollowings = async (userId) => {
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
        .eq("follower", userId)
        .order("created_at", { ascending: false });
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const handleFollow = async (userId) => {
    try {
      if (!currentUser?.id) return;
      const { data, error } = await supabase
        .from("Follows")
        .insert({ follower: currentUser?.id, following: userId })
        .select(
          `*,
          user:following(id, name, image)
          `
        )
        .maybeSingle();
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      if (!currentUser?.id) return;
      const { data, error } = await supabase
        .from("Follows")
        .delete()
        .eq("follower", currentUser?.id)
        .eq("following", userId)
        .select(
          `*,
          user:following(id, name, image)
          `
        )
        .maybeSingle();
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  return { fetchFollowers, fetchFollowings, handleFollow, handleUnfollow };
}
