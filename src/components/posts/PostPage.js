import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import usePost from "../../hooks/usePost";
import "./index.css";
import PostCard from "./PostCard";

export default function PostPage() {
  const currentUser = useRecoilValue(userState);
  const { id: postId } = useParams();
  const { fetchAPost } = usePost();
  const [post, setPost] = useState();
  const fetchPostDetails = async (id) => {
    const { data, error } = await fetchAPost(id);
    console.log(data);
    setPost(data);
  };
  useEffect(() => {
    fetchPostDetails(postId);
  }, [postId]);
  return (
    <div className="posts">
      <PostCard post={post} isMe={currentUser?.id == post?.userId} />
    </div>
  );
}
