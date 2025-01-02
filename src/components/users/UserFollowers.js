import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import UserCardMin from "../posts/UserCardMin";
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
        .eq("following", user?.id)
        .neq("follower", currentUser?.id);
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
        <UserCardMin user={user?.User} key={id} />
      ))}
    </div>
  );
}
