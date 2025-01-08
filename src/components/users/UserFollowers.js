import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import followersState from "../../atoms/followers";
import userState from "../../atoms/userState";
import useFollows from "../../hooks/useFollows";
import UserProfileCard from "./UserProfileCard";

export default function UserFollowers({ user }) {
  const [userFollowers, setUserFollowers] = useState([]);
  const currentUser = useRecoilValue(userState);
  const { fetchFollowers } = useFollows();
  const followers = useRecoilValue(followersState);
  const fetchUserFollowers = async () => {
    const data = await fetchFollowers(user);
    setUserFollowers(data);
  };
  useEffect(() => {
    if (user?.id == currentUser?.id) setUserFollowers(followers);
    else fetchUserFollowers();
  }, [user]);
  return (
    <div>
      {userFollowers?.map((user, id) => (
        <UserProfileCard
          user={user?.User}
          key={id}
          isMe={user?.User?.id === currentUser?.id}
        />
      ))}
    </div>
  );
}
