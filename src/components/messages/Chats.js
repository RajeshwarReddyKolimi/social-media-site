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
      // const { data, error } = await supabase
      //   .from("Messages")
      //   .select(
      //     `
      //     *,
      //     sender (id, name, image),
      //     receiver (id, name, image)
      //   `
      //   )
      //   .or(`sender.eq.${currentUser?.id}, receiver.eq.${currentUser?.id}`);
      const { data, error } = await supabase
        .from("Chats")
        .select(
          `
          *,
          user1:user1Id (id, name, image), 
          user2:user2Id (id, name, image)
        `
        )
        .or(`user1Id.eq.${currentUser?.id}, user2Id.eq.${currentUser?.id}`);
      console.log(data);
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
          user={currentUser?.id == chat?.user1Id ? chat?.user2 : chat?.user1}
        />
      ))}
      {!chats?.length && <p className="empty-message">No chats</p>}
    </div>
  );
}
