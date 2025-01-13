import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import "./post.css";
import usePost from "../../hooks/usePost";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userState from "../../atoms/userState";
import loadingState from "../../atoms/loadingState";
export default function Posts() {
  const [posts, setPosts] = useState([]);
  const setLoading = useSetRecoilState(loadingState);
  const user = useRecoilValue(userState);
  const { fetchAllPosts, createAPost } = usePost();
  async function fetchPosts() {
    try {
      setLoading((prev) => prev + 1);
      const response = await fetchAllPosts();
      setPosts(response);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }

  console.log(posts);
  useEffect(() => {
    fetchPosts();
  }, [user]);
  return (
    <div className="posts">
      {posts?.map((post, id) => (
        <PostCard post={post} key={id} />
      ))}
      {posts?.length == 0 && (
        <p className="empty-message">No posts yet. Come back later</p>
      )}
    </div>
  );
}
