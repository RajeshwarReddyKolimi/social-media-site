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
import { MdDelete } from "react-icons/md";
import usePost from "../../hooks/usePost";

export default function Post({ post, isMine }) {
  const user = useRecoilValue(userState);
  const { addToSavedPosts, removeFromSavedPosts } = useSavedPosts();
  const { addToLikedPosts, removeFromLikedPosts } = useLikedPosts();
  const savedPosts = useRecoilValue(savedPostsState);
  const likedPosts = useRecoilValue(likedPostsState);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
  const { deletePost } = usePost();

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
          <button
            onClick={() => {
              removeFromLikedPosts({ postId: post?.id });
              setLikesCount((prev) => prev - 1);
            }}
          >
            <FaHeart className="icon-2" style={{ fill: "#e31b23" }} />
            {likesCount}
          </button>
        ) : (
          <button
            onClick={() => {
              addToLikedPosts({ postId: post?.id });
              setLikesCount((prev) => prev + 1);
            }}
          >
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
          <button onClick={() => addToSavedPosts({ postId: post?.id })}>
            <FaRegBookmark className="icon-2" />
          </button>
        )}
        {isMine && (
          <button onClick={() => deletePost({ postId: post?.id })}>
            <MdDelete className="icon-2" />
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
