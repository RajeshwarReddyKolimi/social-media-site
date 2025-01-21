import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import followersState from "../../atoms/followers";
import userState from "../../atoms/userState";
import useFollows from "../../hooks/useFollows";
import UserProfileCard from "./UserProfileCard";
import loadingState from "../../atoms/loadingState";
import { Empty } from "antd";
import { useQuery } from "react-query";
import Loader from "../../utils/loader/Loader";

export default function UserFollowers({ user }) {
  const setLoading = useSetRecoilState(loadingState);
  const currentUser = useRecoilValue(userState);
  const { fetchFollowers } = useFollows();
  const followers = useRecoilValue(followersState);
  const fetchUserFollowers = async () => {
    try {
      const data = await fetchFollowers(user?.id);
      return data;
    } catch (e) {
      console.log(e);
    }
  };
  const {
    data: userFollowers,
    error: userFollowersError,
    isLoading: isUserFollowersLoading,
  } = useQuery({
    queryKey: ["userFollowers", user?.id],
    queryFn: () => {
      if (user?.id == currentUser?.id) return followers;
      return fetchUserFollowers(currentUser?.id);
    },
    staleTime: 1000 * 60,
  });

  return (
    <section>
      {isUserFollowersLoading && <Loader />}

      {userFollowers?.map((user, id) => (
        <UserProfileCard
          user={user?.user}
          key={id}
          isMe={user?.user?.id === currentUser?.id}
        />
      ))}
      {userFollowers?.length == 0 && <Empty description="No followers" />}
    </section>
  );
}
