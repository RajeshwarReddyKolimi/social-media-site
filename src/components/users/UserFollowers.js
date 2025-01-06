import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import UserPostCard from "../profile/UserPostCard";
import { useRecoilState, useRecoilValue } from "recoil";
import userState from "../../atoms/userState";

export default function UserFollowers({ user }) {
  const [userFollowers, setUserFollowers] = useState([]);
  const currentUser = useRecoilValue(userState);
  const fetchUserFollowers = async () => {
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
      setUserFollowers(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchUserFollowers();
  }, []);
  return (
    <div>
      {userFollowers?.map((user, id) => (
        <UserPostCard
          user={user?.User}
          key={id}
          isMine={user?.User?.id === currentUser?.id}
        />
      ))}
    </div>
  );
}
