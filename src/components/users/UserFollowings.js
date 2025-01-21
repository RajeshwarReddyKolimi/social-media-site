import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import followingsState from "../../atoms/followings";
import userState from "../../atoms/userState";
import UserProfileCard from "./UserProfileCard";
import useFollows from "../../hooks/useFollows";
import loadingState from "../../atoms/loadingState";
import { Empty } from "antd";
import { useQuery } from "react-query";
import Loader from "../../utils/loader/Loader";

export default function UserFollowings({ user }) {
  const currentUser = useRecoilValue(userState);
  const { fetchFollowings } = useFollows();
  const followings = useRecoilValue(followingsState);
  const fetchUserFollowings = async () => {
    try {
      const data = await fetchFollowings(user?.id);
      return data;
    } catch (e) {
      console.log(e);
    }
  };
  const {
    data: userFollowings,
    error: userFollowingsError,
    isLoading: isUserFollowingsLoading,
  } = useQuery({
    queryKey: ["userFollowings", user?.id],
    queryFn: () => {
      if (user?.id == currentUser?.id) return followings;
      return fetchUserFollowings(currentUser?.id);
    },
    staleTime: 1000 * 60,
  });

  return (
    <section>
      {isUserFollowingsLoading && <Loader />}
      {userFollowings?.map((user, id) => (
        <UserProfileCard
          user={user?.user}
          key={id}
          isMe={user?.user?.id === currentUser?.id}
        />
      ))}
      {userFollowings?.length == 0 && <Empty description="No followings" />}
    </section>
  );
}
