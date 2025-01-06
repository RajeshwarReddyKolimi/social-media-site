import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import followingsState from "../../atoms/followings";
import userState from "../../atoms/userState";
import UserProfileCard from "./UserProfileCard";
import useFollows from "../../hooks/useFollows";

export default function UserFollowings({ user }) {
  const [userFollowings, setUserFollowings] = useState([]);
  const currentUser = useRecoilValue(userState);
  const { fetchFollowings } = useFollows();
  const followings = useRecoilValue(followingsState);
  const fetchUserFollowings = async () => {
    const data = await fetchFollowings(user);
    setUserFollowings(data);
  };
  useEffect(() => {
    if (user?.id == currentUser?.id) setUserFollowings(followings);
    else fetchUserFollowings();
  }, [user]);
  return (
    <div>
      {userFollowings?.map((user, id) => (
        <UserProfileCard
          user={user?.User}
          key={id}
          isMine={user?.User?.id === currentUser?.id}
        />
      ))}
    </div>
  );
}
