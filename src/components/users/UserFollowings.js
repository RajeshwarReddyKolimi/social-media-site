import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";
import UserPostCard from "../profile/UserPostCard";

export default function UserFollowings({ user }) {
  const [userFollowings, setUserFollowings] = useState([]);
  const currentUser = useRecoilValue(userState);
  const fetchUserFollowings = async () => {
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
      setUserFollowings(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchUserFollowings();
  }, []);
  return (
    <div>
      {userFollowings?.map((user, id) => (
        <UserPostCard
          user={user?.User}
          key={id}
          isMine={user?.User?.id === currentUser?.id}
        />
      ))}
    </div>
  );
}
