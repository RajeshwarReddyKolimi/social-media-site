import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import UserCardMin from "../posts/UserCardMin";
import { useRecoilState, useRecoilValue } from "recoil";
import userState from "../../atoms/userState";

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
        .eq("follower", user?.id)
        .neq("following", currentUser?.id);
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
        <UserCardMin user={user?.User} key={id} />
      ))}
    </div>
  );
}
