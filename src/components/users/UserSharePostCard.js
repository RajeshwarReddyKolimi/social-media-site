import React from "react";
import "./index.css";
import { Button } from "antd";
import usePost from "../../hooks/usePost";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import Loader from "../../utils/loader/Loader";

export default function UserSharePostCard({
  user,
  postId,
  setShowShareOptions,
}) {
  const { handleSharePost } = usePost();
  const currentUser = useRecoilValue(userState);
  const queryClient = useQueryClient();

  const sharePostMutation = useMutation({
    mutationFn: () => handleSharePost({ postId, receiverId: user?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", currentUser?.id, user?.id]);
      setShowShareOptions(false);
    },
    onError: (error) => {
      console.log("Error sharing post:", error.message);
    },
  });

  return (
    <div className="user-profile-card">
      {sharePostMutation?.isLoading && <Loader />}
      <img src={user?.image} />
      <p>{user?.name}</p>
      <div className="flex-buffer"></div>
      <Button type="primary" onClick={sharePostMutation.mutate}>
        Send
      </Button>
    </div>
  );
}
