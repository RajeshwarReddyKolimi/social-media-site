import React from "react";
import { IoIosSend, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoHeartOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { supabase } from "../../config/supabase";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";

export default function Post({ post }) {
  const user = useRecoilValue(userState);
  console.log(post);
  const addToSavedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("SavedPosts")
        .insert({ postId: post?.id, userId: user?.id });
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const addToLikedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("LikedPosts")
        .insert({ postId: post?.id, userId: user?.id });
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="post">
      <img src={post?.image} />
      <div className="post-action-items">
        <button onClick={addToLikedPosts}>
          <IoMdHeartEmpty className="icon-2" />
        </button>
        <button>
          <FaRegComment className="icon-2" />
        </button>
        <button>
          <IoIosSend className="icon-2" />
        </button>
        <button onClick={addToSavedPosts}>
          <FaRegBookmark className="icon-2" />
        </button>
      </div>
      <p>
        <strong>{post?.Users?.name}: </strong>
        {post?.caption}
      </p>
    </div>
  );
}
