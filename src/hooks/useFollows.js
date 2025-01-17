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
      setLoading((prev) => prev + 1);
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
      if (currentUser?.id == userId) setFollowers(data);
      else return data;
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  const fetchFollowings = async (userId) => {
    try {
      setLoading((prev) => prev + 1);
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
      if (currentUser?.id == userId) setFollowings(data);
      else return data;
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  const handleFollow = async ({ userId, setUser }) => {
    try {
      setLoading((prev) => prev + 1);
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
      setFollowings((prev) => [data, ...prev]);
      setUser((prev) => {
        return {
          ...prev,
          followers: [...prev?.followers, { following: data?.following }],
        };
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  const handleUnfollow = async ({ userId, setUser }) => {
    try {
      setLoading((prev) => prev + 1);
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
      setFollowings((prev) => prev.filter((user) => user?.following != userId));
      setUser((prev) => {
        return {
          ...prev,
          followers: prev?.followers?.filter(
            (follower) => follower?.following !== data?.following
          ),
        };
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  return { fetchFollowers, fetchFollowings, handleFollow, handleUnfollow };
}
