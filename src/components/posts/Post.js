import { Button, Image, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark, FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useRecoilValue } from "recoil";
import likedPostsState from "../../atoms/likedPosts";
import savedPostsState from "../../atoms/savedPosts";
import useLikedPosts from "../../hooks/useLikedPosts";
import usePost from "../../hooks/usePost";
import useSavedPosts from "../../hooks/useSavedPosts";
import Comments from "../comments/Comments";
import ShareOptions from "./ShareOptions";

export default function Post({ post, isMe, setUserPosts }) {
  const { addToSavedPosts, removeFromSavedPosts } = useSavedPosts();
  const { addToLikedPosts, removeFromLikedPosts } = useLikedPosts();
  const savedPosts = useRecoilValue(savedPostsState);
  const likedPosts = useRecoilValue(likedPostsState);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
  const { deletePost } = usePost();
  const [showComments, setShowComments] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    setIsSaved(!!savedPosts?.find((spost) => spost?.postId === post?.id));
  }, [savedPosts]);

  useEffect(() => {
    setIsLiked(!!likedPosts?.find((lpost) => lpost?.postId === post?.id));
  }, [likedPosts]);
  return (
    <div className="post">
      <Image height="350px" className="post-image" src={post?.image} />
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
        <button onClick={() => setShowComments((prev) => !prev)}>
          <FaRegComment className="icon-2" />
        </button>
        {showComments && (
          <Comments post={post} setShowComments={setShowComments} />
        )}
        <button onClick={() => setShowShareOptions((prev) => !prev)}>
          <IoIosSend className="icon-2" />
        </button>
        {showShareOptions && (
          <ShareOptions
            setShowShareOptions={setShowShareOptions}
            postId={post?.id}
          />
        )}
        {isSaved ? (
          <button onClick={() => removeFromSavedPosts({ postId: post?.id })}>
            <FaBookmark className="icon-2" />
          </button>
        ) : (
          <button onClick={() => addToSavedPosts({ postId: post?.id })}>
            <FaRegBookmark className="icon-2" />
          </button>
        )}
        {isMe && (
          <Popconfirm
            color="var(--theme-color)"
            description="Are you sure to delete this task?"
            onConfirm={() => {
              deletePost({ postId: post?.id });
              setUserPosts((prev) => prev.filter((p) => p.id != post?.id));
            }}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Button type="text" style={{ padding: "0" }}>
              <MdDelete className="icon-2" />
            </Button>
          </Popconfirm>
        )}
      </div>
      <p>
        <strong>{post?.user?.name}: </strong>
        {post?.caption}
      </p>
    </div>
  );
}
