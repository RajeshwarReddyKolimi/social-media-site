import React from "react";
import "./index.css";
import { Button } from "antd";

export default function UserSharePostCard({ user, handleSharePost }) {
  return (
    <div className="user-profile-card">
      <img src={user?.user?.image} />
      <p>{user?.user?.name}</p>
      <div className="flex-buffer"></div>
      <Button type="primary" onClick={() => handleSharePost(user?.user?.id)}>
        Send
      </Button>
    </div>
  );
}
