import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import { useRecoilState, useRecoilValue } from "recoil";
import loadingState from "../../atoms/loadingState";
import userState from "../../atoms/userState";
import ChatCard from "./ChatCard";

export default function Chats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useRecoilState(loadingState);
  const user = useRecoilValue(userState);
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
    <div className="chat-list">
      {chats?.map((chat, id) => (
        <ChatCard chat={chat} key={id} />
      ))}
    </div>
  );
}
