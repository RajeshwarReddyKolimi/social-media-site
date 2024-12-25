import React from "react";
import PostCard from "./PostCard";
import "./post.css";
export default function Posts() {
  const posts = [
    {
      id: "1",
      imageUrl: "https://picsum.photos/id/230/200/200",
      userId: "1",
      username: "rajuK",
      userDp: "https://picsum.photos/id/2/200/200",
      caption: "Random image 1",
    },
    {
      id: "2",
      imageUrl: "https://picsum.photos/id/23/200/200",
      userId: "2",
      username: "ramu",
      userDp: "https://picsum.photos/id/5/200/200",
      caption: "Random image 2",
    },
    {
      id: "3",
      imageUrl: "https://picsum.photos/id/27/200/200",
      userId: "3",
      username: "rakesh",
      userDp: "https://picsum.photos/id/20/200/200",
      caption: "Random image 3",
    },
  ];
  return (
    <div className="posts">
      {posts?.map((post, id) => (
        <PostCard post={post} key={id} />
      ))}
    </div>
  );
}
