import { Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";
import useMessages from "../../hooks/useMessages";
import UserChatCard from "../users/UserChatCard";
import "./index.css";

export default function Chats() {
  const [chats, setChats] = useState([]);
  const { fetchChats } = useMessages({});
  const currentUser = useRecoilValue(userState);

  useEffect(() => {
    if (currentUser) fetchChats({ setChats });
    else setChats([]);
  }, [currentUser]);

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
            fetchChats();
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
