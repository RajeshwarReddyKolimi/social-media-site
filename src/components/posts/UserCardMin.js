import React, { useEffect, useState } from "react";
import useFollows from "../../hooks/useFollows";
import "./userMin.css";
import followingsState from "../../atoms/followings";
import { useRecoilValue } from "recoil";
export default function UserCardMin({ user }) {
  const { handleFollow, handleUnfollow } = useFollows();
  const followings = useRecoilValue(followingsState);
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    setIsFollowing(
      !!followings?.find((fuser) => fuser?.following === user?.id)
    );
  }, [followings]);

  return (
    <div className="user-card-min">
      <img src={user?.image} /> <p>{user?.name}</p>
      {isFollowing ? (
        <button onClick={() => handleUnfollow({ userId: user?.id })}>
          Unfollow
        </button>
      ) : (
        <button onClick={() => handleFollow({ userId: user?.id })}>
          Follow
        </button>
      )}
    </div>
  );
}
