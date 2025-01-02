import React, { useEffect, useState } from "react";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark, FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa6";
import { IoIosSend, IoMdHeartEmpty } from "react-icons/io";
import { useRecoilValue } from "recoil";
import likedPostsState from "../../atoms/likedPosts";
import savedPostsState from "../../atoms/savedPosts";
import userState from "../../atoms/userState";
import useLikedPosts from "../../hooks/useLikedPosts";
import useSavedPosts from "../../hooks/useSavedPosts";

export default function Post({ post }) {
  const user = useRecoilValue(userState);
  const { addToSavedPosts, removeFromSavedPosts } = useSavedPosts();
  const { addToLikedPosts, removeFromLikedPosts } = useLikedPosts();
  const savedPosts = useRecoilValue(savedPostsState);
  const likedPosts = useRecoilValue(likedPostsState);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsSaved(!!savedPosts?.find((spost) => spost?.postId === post?.id));
  }, [savedPosts]);

  useEffect(() => {
    setIsLiked(!!likedPosts?.find((lpost) => lpost?.postId === post?.id));
  }, [likedPosts]);

  return (
    <div className="post">
      <img src={post?.image} />
      <div className="post-action-items">
        {isLiked ? (
          <button onClick={() => removeFromLikedPosts({ postId: post?.id })}>
            <FaHeart className="icon-2" style={{ fill: "#e31b23" }} />
          </button>
        ) : (
          <button onClick={() => addToLikedPosts({ postId: post?.id })}>
            <FaRegHeart className="icon-2" />
          </button>
        )}
        <button>
          <FaRegComment className="icon-2" />
        </button>
        <button>
          <IoIosSend className="icon-2" />
        </button>
        {isSaved ? (
          <button onClick={() => removeFromSavedPosts({ postId: post?.id })}>
            <FaBookmark className="icon-2" />
          </button>
        ) : (
          <button onClick={addToSavedPosts}>
            <FaRegBookmark className="icon-2" />
          </button>
        )}
      </div>
      <p>
        <strong>{post?.User?.name}: </strong>
        {post?.caption}
      </p>
    </div>
  );
}
