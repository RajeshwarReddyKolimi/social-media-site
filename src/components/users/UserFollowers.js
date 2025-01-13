import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import followersState from "../../atoms/followers";
import userState from "../../atoms/userState";
import useFollows from "../../hooks/useFollows";
import UserProfileCard from "./UserProfileCard";
import loadingState from "../../atoms/loadingState";

export default function UserFollowers({ user }) {
  const [userFollowers, setUserFollowers] = useState([]);
  const setLoading = useSetRecoilState(loadingState);
  const currentUser = useRecoilValue(userState);
  const { fetchFollowers } = useFollows();
  const followers = useRecoilValue(followersState);
  const fetchUserFollowers = async () => {
    try {
      setLoading((prev) => prev + 1);
      const data = await fetchFollowers(user);
      setUserFollowers(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  useEffect(() => {
    if (user?.id == currentUser?.id) setUserFollowers(followers);
    else fetchUserFollowers();
  }, [user]);
  return (
    <div>
      {userFollowers?.map((user, id) => (
        <UserProfileCard
          user={user?.user}
          key={id}
          isMe={user?.user?.id === currentUser?.id}
        />
      ))}
      {userFollowers?.length == 0 && (
        <p className="empty-message">No followers</p>
      )}
    </div>
  );
}
