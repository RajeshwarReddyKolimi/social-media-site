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

  const getChats = async () => {
    try {
      // setLoading((prev) => prev + 1);
      const { data, error } = await supabase
        .from("Chats")
        .select(
          `
          *,
          User1:user1Id (id, name, image), 
          User2:user2Id (id, name, image)
        `
        )
        .or(`user1Id.eq.${currentUser?.id}, user2Id.eq.${currentUser?.id}`);
      setChats(data);
    } catch (e) {
      console.log(e);
    } finally {
      // setLoading((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (currentUser) getChats();
    else setChats([]);
  }, [currentUser]);
  return (
    <div className="chat-list">
      {chats?.map((chat, id) => (
        <UserChatCard
          key={id}
          chat={chat}
          receiver={
            currentUser?.id == chat?.user1Id ? chat?.User2 : chat?.User1
          }
        />
      ))}
      {!chats?.length && <p className="empty-message">No chats</p>}
    </div>
  );
}
