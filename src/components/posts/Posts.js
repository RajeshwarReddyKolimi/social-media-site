import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import "./post.css";
import usePost from "../../hooks/usePost";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
export default function Posts() {
  const [posts, setPosts] = useState([]);
  const user = useRecoilValue(userState);
  const { fetchAllPosts, createAPost } = usePost();
  async function fetchPosts() {
    const response = await fetchAllPosts();
    setPosts(response);
  }
  useEffect(() => {
    fetchPosts();
  }, [user]);
  return (
    <div className="posts">
      {posts?.map((post, id) => (
        <PostCard post={post} key={id} />
      ))}
    </div>
  );
}
