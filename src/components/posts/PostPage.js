import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import usePost from "../../hooks/usePost";
import "./index.css";
import PostCard from "./PostCard";
import NotFound from "../navbar/NotFound";

export default function PostPage() {
  const currentUser = useRecoilValue(userState);
  const { id: postId } = useParams();
  const { fetchPost } = usePost();
  const [post, setPost] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    fetchPost({ id: postId, setPost, setError });
  }, [postId]);
  if (error) return <NotFound />;
  return (
    <main className="posts">
      <PostCard post={post} isMe={currentUser?.id == post?.userId} />
    </main>
  );
}
