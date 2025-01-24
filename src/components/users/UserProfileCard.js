import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import followingsState from "../../atoms/followings";
import useFollows from "../../hooks/useFollows";
import "./index.css";
import userState from "../../atoms/userState";
import { useMutation, useQueryClient } from "react-query";

export default function UserProfileCard({ user, isMe }) {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const { handleFollow, handleUnfollow } = useFollows();
  const [followings, setFollowings] = useRecoilState(followingsState);
  const [isFollowing, setIsFollowing] = useState(false);
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () => handleFollow(user?.id),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["followings", currentUser?.id]);
      queryClient.setQueryData(["followings", currentUser?.id], (prev) => [
        data,
        ...prev,
      ]);
      setFollowings((prev) => [data, ...prev]);
      setCurrentUser((prev) => {
        return {
          ...prev,
          followings: [...prev?.followings, { following: data?.following }],
        };
      });
    },
    onError: (error) => {
      console.log("Error following user:", error.message);
    },
  });

  useEffect(() => {
    setIsFollowing(
      !!followings?.find((fuser) => fuser?.following === user?.id)
    );
  }, [followings, user]);

  return (
    <Link to={`/user/${user?.id}`} className="user-profile-card">
      <img src={user?.image} />
      <p>{user?.name}</p>
      <div className="flex-buffer" />
      {!isFollowing && currentUser?.id !== user?.id && (
        <Button
          className="follow-button"
          onClick={(e) => {
            e.preventDefault();
            followMutation.mutate();
          }}
        >
          Follow
        </Button>
      )}
    </Link>
  );
}
