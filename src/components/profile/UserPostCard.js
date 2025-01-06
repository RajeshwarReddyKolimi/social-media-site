import React, { useEffect, useState } from "react";
import useFollows from "../../hooks/useFollows";
import followingsState from "../../atoms/followings";
import { useRecoilValue } from "recoil";
import "./index.css";
import { Button } from "antd";

export default function UserPostCard({ user, isMine }) {
  const { handleFollow, handleUnfollow } = useFollows();
  const followings = useRecoilValue(followingsState);
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    setIsFollowing(
      !!followings?.find((fuser) => fuser?.following === user?.id)
    );
  }, [followings]);

  return (
    <div className="user-post-card">
      <img src={user?.image} />
      <p>{user?.name}</p>
      <div className="flex-buffer" />
      {!isFollowing && !isMine && (
        <Button
          className="follow-button"
          onClick={(e) => {
            e.preventDefault();
            handleUnfollow({ userId: user?.id });
          }}
        >
          Unfollow
        </Button>
      )}
    </div>
  );
}
