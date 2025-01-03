import React, { useEffect, useState } from "react";
import useFollows from "../../hooks/useFollows";
import followingsState from "../../atoms/followings";
import { useRecoilValue } from "recoil";
import "./index.css";
import { Button } from "antd";

export default function UserPostCard({ user }) {
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
      {isFollowing ? (
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleUnfollow({ userId: user?.id });
          }}
        >
          Unfollow
        </Button>
      ) : (
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleFollow({ userId: user?.id });
          }}
        >
          Follow
        </Button>
      )}
    </div>
  );
}
