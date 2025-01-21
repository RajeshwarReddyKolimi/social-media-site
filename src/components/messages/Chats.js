import { Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";
import useMessages from "../../hooks/useMessages";
import UserChatCard from "../users/UserChatCard";
import "./index.css";
import { useQuery, useQueryClient } from "react-query";
import Loader from "../../utils/loader/Loader";

export default function Chats() {
  const { fetchChats } = useMessages({});
  const currentUser = useRecoilValue(userState);
  const queryClient = useQueryClient();

  const {
    data: chats,
    error,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["chats", currentUser?.id],
    queryFn: fetchChats,
    staleTime: 1000 * 60 * 1,
  });

  useEffect(() => {
    const subscription = supabase
      .channel("message-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Messages" },
        (payload) => {
          if (
            payload?.new?.receiver === currentUser?.id ||
            payload?.new?.sender === currentUser?.id
          ) {
            refetch();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser?.id]);

  return (
    <div className="chat-list">
      {isLoading && <Loader />}
      {chats?.map((chat, id) => (
        <UserChatCard
          key={id}
          chat={chat}
          user={currentUser?.id == chat?.user1Id ? chat?.user2 : chat?.user1}
        />
      ))}
      {!chats?.length && <Empty description="No chats" />}
    </div>
  );
}
