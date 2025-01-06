import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import { useRecoilState, useRecoilValue } from "recoil";
import loadingState from "../../atoms/loadingState";
import userState from "../../atoms/userState";
import ChatCard from "./ChatCard";
import "./index.css";
import Messages from "./Messages";
import { useParams } from "react-router";
import UserChatCard from "../users/UserChatCard";

export default function Chats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useRecoilState(loadingState);
  const user = useRecoilValue(userState);
  const { id: chatId } = useParams();

  const getChats = async () => {
    try {
      // setLoading((prev) => prev + 1);
      const { data, error } = await supabase.from("Chats").select(
        `
          *,
          User1:user1Id (id, name, image), 
          User2:user2Id (id, name, image)
        `
      );
      setChats(data);
    } catch (e) {
      console.log(e);
    } finally {
      // setLoading((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (user) getChats();
    else setChats([]);
  }, [user]);
  return (
    <>
      <div className="chat-list">
        {chats?.map((chat, id) => (
          <UserChatCard
            key={id}
            chat={chat}
            user={user?.id == chat?.user1Id ? chat?.User2 : chat?.User1}
          />
        ))}
      </div>
    </>
  );
}
