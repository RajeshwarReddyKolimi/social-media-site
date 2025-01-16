import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import followingsState from "../../atoms/followings";
import userState from "../../atoms/userState";
import UserProfileCard from "./UserProfileCard";
import useFollows from "../../hooks/useFollows";
import loadingState from "../../atoms/loadingState";
import { Empty } from "antd";

export default function UserFollowings({ user }) {
  const [userFollowings, setUserFollowings] = useState([]);
  const setLoading = useSetRecoilState(loadingState);
  const currentUser = useRecoilValue(userState);
  const { fetchFollowings } = useFollows();
  const followings = useRecoilValue(followingsState);
  const fetchUserFollowings = async () => {
    try {
      setLoading((prev) => prev + 1);
      const data = await fetchFollowings(user?.id);
      setUserFollowings(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  useEffect(() => {
    if (user?.id == currentUser?.id) setUserFollowings(followings);
    else fetchUserFollowings();
  }, [user]);
  return (
    <div>
      {userFollowings?.map((user, id) => (
        <UserProfileCard
          user={user?.user}
          key={id}
          isMe={user?.user?.id === currentUser?.id}
        />
      ))}
      {userFollowings?.length == 0 && <Empty description="No followings" />}
    </div>
  );
}
