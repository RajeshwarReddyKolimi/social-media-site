import React from "react";
import useFollows from "../../hooks/useFollows";
import "./userMin.css";
export default function UserCardMin({ user }) {
  const { handleFollow } = useFollows();
  return (
    <div className="user-card-min">
      <img src={user?.image} /> <p>{user?.name}</p>
      <button onClick={() => handleFollow({ userId: user?.id })}>Follow</button>
    </div>
  );
}
