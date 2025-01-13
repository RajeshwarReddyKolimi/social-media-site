import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useRecoilValue } from "recoil";
import followingsState from "../../atoms/followings";
import useFollows from "../../hooks/useFollows";
import "./index.css";

export default function UserProfileCard({ user, isMe }) {
  const { handleFollow, handleUnfollow } = useFollows();
  const followings = useRecoilValue(followingsState);
  const [isFollowing, setIsFollowing] = useState(false);
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
      {!isFollowing && !isMe && (
        <Button
          className="follow-button"
          onClick={(e) => {
            e.preventDefault();
            handleFollow({ userId: user?.id });
          }}
        >
          Follow
        </Button>
      )}
    </Link>
  );
}
