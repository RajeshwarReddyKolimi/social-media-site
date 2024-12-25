import React from "react";
import { IoHeartOutline } from "react-icons/io5";

export default function Post({ post }) {
  return (
    <div className="post">
      <img src={post?.imageUrl} />
      <button className="button-icon like-button">
        <IoHeartOutline className="icon-1" />
      </button>
      <p>{post?.caption}</p>
    </div>
  );
}
