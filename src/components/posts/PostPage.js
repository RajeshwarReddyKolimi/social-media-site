import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import usePost from "../../hooks/usePost";
import "./index.css";
import PostCard from "./PostCard";
import NotFound from "../navbar/NotFound";
import { useQuery } from "react-query";
import Loader from "../../utils/loader/Loader";

export default function PostPage() {
  const currentUser = useRecoilValue(userState);
  const { id: postId } = useParams();
  const { fetchPost } = usePost();

  const {
    data: post,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
    staleTime: 1000 * 60,
  });

  if (error) return <NotFound />;
  return (
    <main className="posts">
      {isLoading && <Loader />}
      <PostCard post={post} isMe={currentUser?.id == post?.userId} />
    </main>
  );
}
