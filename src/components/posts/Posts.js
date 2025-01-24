import { Empty } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import usePost from "../../hooks/usePost";
import PostCard from "./PostCard";
import "./index.css";
import Loader from "../../utils/loader/Loader";
import followingsState from "../../atoms/followings";
export default function Posts() {
  const currentUser = useRecoilValue(userState);
  const { fetchAllPosts } = usePost();
  const followings = useRecoilValue(followingsState);
  async function fetchPosts() {
    try {
      const data = await fetchAllPosts();
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  const {
    data: posts,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["homePosts", currentUser?.id],
    queryFn: fetchPosts,
    staleTime: 1000 * 60,
    enabled: !!followings,
  });

  return (
    <main className="posts">
      {isLoading && <Loader />}
      {posts?.map((post, id) => (
        <PostCard post={post} key={id} />
      ))}
      {posts?.length == 0 && <Empty description="No posts" />}
    </main>
  );
}
