import React from "react";
import { Link } from "react-router";
import "./index.css";

export default function UserCommentCard({ comment }) {
  return (
    <div className="user-comment-card">
      <Link to={`/user/${comment?.user?.id}`}>
        <img src={comment?.user?.image} />
      </Link>
      <Link to={`/user/${comment?.user?.id}`}>
        <p>{comment?.user?.name}:</p>
      </Link>
      <p className="comment">{comment?.comment}</p>
    </div>
  );
}
