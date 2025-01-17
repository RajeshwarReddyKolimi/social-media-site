import React from "react";
import { supabase } from "../config/supabase";
import { useRecoilValue } from "recoil";
import userState from "../atoms/userState";
import NotFound from "../components/navbar/NotFound";

export default function useMessages() {
  const currentUser = useRecoilValue(userState);
  const fetchChatDetails = async ({ chatId, receiverId }) => {
    try {
      if (currentUser?.id == receiverId) return;
      const { data, error } = await supabase
        .from("Chats")
        .select(
          `*, user1:user1Id(id, name, image), user2:user2Id(id, name, image)`
        )
        .or(`user1Id.eq.${currentUser?.id}, user2Id.eq.${currentUser?.id}`)
        .or(`user1Id.eq.${receiverId}, user2Id.eq.${receiverId}`)
        .single();

      if (data) return data?.id;
      else {
        const res = await supabase.from("Chats").insert({
          user1Id: currentUser?.id,
          user2Id: receiverId,
        });
        console.log(data);
        const { data, error } = await supabase
          .from("Chats")
          .select(
            `*, user1:user1Id(id, name, image), user2:user2Id(id, name, image)`
          )
          .or(`user1Id.eq.${currentUser?.id}, user2Id.eq.${currentUser?.id}`)
          .or(`user1Id.eq.${receiverId}, user2Id.eq.${receiverId}`)
          .single();
        console.log(data);
        return data?.id;
      }
      console.log(currentUser?.id, receiverId);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchMessages = async ({ receiverId, setMessages }) => {
    try {
      const { data, error } = await supabase
        .from("Messages")
        .select(
          `
            *,
            Sender:sender (id, name, image),
            Receiver:receiver (id, name, image)
          `
        )
        .or(`sender.eq.${currentUser?.id}, receiver.eq.${currentUser?.id}`)
        .or(`sender.eq.${receiverId}, receiver.eq.${receiverId}`);
      setMessages(data);
    } catch (e) {
      console.log(e);
    }
  };

  return { fetchChatDetails, fetchMessages };
}
