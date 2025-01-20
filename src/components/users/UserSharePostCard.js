import React from "react";
import "./index.css";
import { Button } from "antd";
import usePost from "../../hooks/usePost";

export default function UserSharePostCard({
  user,
  postId,
  setShowShareOptions,
}) {
  const { handleSharePost } = usePost();
  return (
    <div className="user-profile-card">
      <img src={user?.user?.image} />
      <p>{user?.user?.name}</p>
      <div className="flex-buffer"></div>
      <Button
        type="primary"
        onClick={() =>
          handleSharePost({
            postId,
            receiverId: user?.user?.id,
            setShowShareOptions,
          })
        }
      >
        Send
      </Button>
    </div>
  );
}
