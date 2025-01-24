import { Button, Image, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark, FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useRecoilState, useRecoilValue } from "recoil";
import likedPostsState from "../../atoms/likedPosts";
import savedPostsState from "../../atoms/savedPosts";
import useLikedPosts from "../../hooks/useLikedPosts";
import usePost from "../../hooks/usePost";
import useSavedPosts from "../../hooks/useSavedPosts";
import Comments from "../comments/Comments";
import ShareOptions from "./ShareOptions";
import { useMutation, useQueryClient } from "react-query";
import Loader from "../../utils/loader/Loader";
import userState from "../../atoms/userState";

export default function Post({ post, isMe }) {
  const { addToSavedPosts, removeFromSavedPosts } = useSavedPosts();
  const { addToLikedPosts, removeFromLikedPosts } = useLikedPosts();
  const currentUser = useRecoilValue(userState);
  const [savedPosts, setSavedPosts] = useRecoilState(savedPostsState);
  const [likedPosts, setLikedPosts] = useRecoilState(likedPostsState);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
  const { deletePost } = usePost();
  const [showComments, setShowComments] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const queryClient = useQueryClient();

  const likePostMutation = useMutation({
    mutationFn: () => addToLikedPosts(post?.id),
    onSuccess: (post) => {
      queryClient.invalidateQueries(["likedPosts", currentUser?.id]);
      setLikedPosts((prev) => [post, ...prev]);
    },
    onError: (error) => {
      console.log("Error liking post:", error.message);
    },
  });

  const unlikePostMutation = useMutation({
    mutationFn: () => removeFromLikedPosts(post?.id),
    onSuccess: (postId) => {
      queryClient.invalidateQueries(["likedPosts", currentUser?.id]);
      setLikedPosts((prev) => prev?.filter((post) => post?.postId !== postId));
    },
    onError: (error) => {
      console.log("Error unliking post:", error.message);
    },
  });

  const savePostMutation = useMutation({
    mutationFn: () => addToSavedPosts(post?.id),
    onSuccess: (post) => {
      queryClient.invalidateQueries(["savedPosts", currentUser?.id]);
      setSavedPosts((prev) => [post, ...prev]);
      queryClient.setQueryData(
        ["savedPosts", currentUser?.id],
        (prev) => (prev) => [post, ...prev]
      );
    },
    onError: (error) => {
      console.log("Error liking post:", error.message);
    },
  });

  const unsavePostMutation = useMutation({
    mutationFn: () => removeFromSavedPosts(post?.id),
    onSuccess: (postId) => {
      queryClient.invalidateQueries(["savedPosts", currentUser?.id]);
      queryClient.setQueryData(["savedPosts", currentUser?.id], (prev) => {
        return prev.filter((oldPost) => oldPost.id !== postId);
      });
      setSavedPosts((prev) => prev?.filter((post) => post?.postId !== postId));
    },
    onError: (error) => {
      console.log("Error unliking post:", error.message);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: () => deletePost(post?.id),
    onSuccess: (postId) => {
      queryClient.invalidateQueries(["userPosts", post?.userId]);
      queryClient.setQueryData(["userPosts", post?.userId], (prev) => {
        return prev.filter((oldPost) => oldPost.id !== postId);
      });
      queryClient.invalidateQueries(["homePosts", currentUser?.id]);
    },
    onError: (error) => {
      console.log("Error deleting post:", error.message);
    },
  });

  useEffect(() => {
    setIsSaved(!!savedPosts?.find((spost) => spost?.postId === post?.id));
  }, [savedPosts]);

  useEffect(() => {
    setIsLiked(!!likedPosts?.find((lpost) => lpost?.postId === post?.id));
  }, [likedPosts]);
  return (
    <div className="post">
      <Image height="350px" className="post-image" src={post?.image} />
      {(deletePostMutation?.isLoading ||
        likePostMutation?.isLoading ||
        unlikePostMutation?.isLoading) && <Loader />}
      <div className="post-action-items">
        {isLiked ? (
          <button
            onClick={() => {
              unlikePostMutation.mutate();
              setLikesCount((prev) => prev - 1);
            }}
          >
            <FaHeart className="icon-2" style={{ fill: "#e31b23" }} />
            {likesCount}
          </button>
        ) : (
          <button
            onClick={() => {
              likePostMutation.mutate();
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
          <button onClick={unsavePostMutation.mutate}>
            <FaBookmark className="icon-2" />
          </button>
        ) : (
          <button onClick={savePostMutation.mutate}>
            <FaRegBookmark className="icon-2" />
          </button>
        )}
        {isMe && (
          <Popconfirm
            color="var(--theme-color)"
            description="Are you sure to delete this task?"
            onConfirm={() => {
              deletePostMutation.mutate();
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
