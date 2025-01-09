import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import loadingState from "../../atoms/loadingState";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";
import UserChatCard from "../users/UserChatCard";
import "./index.css";

export default function Chats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useRecoilState(loadingState);
  const currentUser = useRecoilValue(userState);

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from("Chats")
        .select(
          `
          *,
          user1:user1Id (id, name, image), 
          user2:user2Id (id, name, image)
        `
        )
        .or(`user1Id.eq.${currentUser?.id}, user2Id.eq.${currentUser?.id}`)
        .order("lastUpdatedAt", { ascending: false });
      setChats(data);
    } catch (e) {
      console.log(e);
    } finally {
      // setLoading((prev) => prev - 1);
    }
  };

  const updateChat = async (message) => {
    try {
      const { data, error } = await supabase
        .from("Chats")
        .update({
          lastUpdatedAt: message?.created_at,
        })
        .eq("id", message?.chatId);
      fetchChats();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (currentUser) fetchChats();
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
            updateChat(payload?.new);
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
      {!chats?.length && <p className="empty-message">No chats</p>}
    </div>
  );
}
