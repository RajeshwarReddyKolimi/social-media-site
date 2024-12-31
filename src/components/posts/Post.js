import React from "react";
import { IoIosSend, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoHeartOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";

export default function Post({ post }) {
  return (
    <div className="post">
      <img src={post?.image} />
      <div className="post-action-items">
        <button>
          <IoMdHeartEmpty className="icon-2" />
        </button>
        <button>
          <FaRegComment className="icon-2" />
        </button>
        <button>
          <IoIosSend className="icon-2" />
        </button>
      </div>
      <p>
        <strong>{post?.Users?.name}: </strong>
        {post?.caption}
      </p>
    </div>
  );
}
