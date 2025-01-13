import React, { useEffect, useState } from "react";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark, FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa6";
import { IoIosSend, IoMdHeartEmpty } from "react-icons/io";
import { useRecoilValue, useSetRecoilState } from "recoil";
import likedPostsState from "../../atoms/likedPosts";
import savedPostsState from "../../atoms/savedPosts";
import userState from "../../atoms/userState";
import useLikedPosts from "../../hooks/useLikedPosts";
import useSavedPosts from "../../hooks/useSavedPosts";
import { MdDelete, MdSend } from "react-icons/md";
import usePost from "../../hooks/usePost";
import Comments from "../comments/Comments";
import { supabase } from "../../config/supabase";
import loadingState from "../../atoms/loadingState";

export default function Post({ post, isMe }) {
  const currentUser = useRecoilValue(userState);
  const setLoading = useSetRecoilState(loadingState);
  const { addToSavedPosts, removeFromSavedPosts } = useSavedPosts();
  const { addToLikedPosts, removeFromLikedPosts } = useLikedPosts();
  const savedPosts = useRecoilValue(savedPostsState);
  const likedPosts = useRecoilValue(likedPostsState);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
  const { deletePost } = usePost();
  const [showComments, setShowComments] = useState(false);
  const receiverId = "519599c8-6936-4e36-8bdc-2e89ad221f0a";
  const fetchChatId = async () => {
    try {
      setLoading((prev) => prev + 1);
      if (currentUser?.id == receiverId) return;
      const { data, error } = await supabase
        .from("Chats")
        .select(
          `*,
        user1:user1Id (id, name, image),
        user2:user2Id (id, name, image)`
        )
        .or(`user1Id.eq.${currentUser?.id}, user2Id.eq.${currentUser?.id}`)
        .or(`user1Id.eq.${receiverId}, user2Id.eq.${receiverId}`)
        .maybeSingle();
      if (data) return data?.id;
      else {
        const { data, error } = await supabase
          .from("Chats")
          .upsert({
            user1Id: currentUser?.id,
            user2Id: receiverId,
          })
          .select()
          .single();
        if (data) return data?.id;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  const handleSharePost = async () => {
    try {
      const chatId = await fetchChatId();
      const { data, error } = await supabase.from("Messages").insert({
        sender: currentUser?.id,
        receiver: "519599c8-6936-4e36-8bdc-2e89ad221f0a",
        postId: post?.id,
        chatId: chatId,
      });
    } catch (e) {
      console.log(e);
    }
  };
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
        <button onClick={() => setShowComments((prev) => !prev)}>
          <FaRegComment className="icon-2" />
        </button>
        <button onClick={() => handleSharePost()}>
          <MdSend className="icon-2" />
        </button>
        {showComments && (
          <Comments post={post} setShowComments={setShowComments} />
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
