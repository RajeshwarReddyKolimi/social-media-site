import React from "react";
import { supabase } from "../config/supabase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userState from "../atoms/userState";
import NotFound from "../components/navbar/NotFound";
import loadingState from "../atoms/loadingState";

export default function useMessages() {
  const currentUser = useRecoilValue(userState);
  const setLoading = useSetRecoilState(loadingState);
  const fetchChatDetails = async ({ chatId, receiverId }) => {
    try {
      setLoading((prev) => prev + 1);
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
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  const fetchMessages = async ({ chatId, setMessages, setError }) => {
    try {
      setLoading((prev) => prev + 1);
      const { data, error } = await supabase
        .from("Messages")
        .select(
          `*, 
          post:postId(id, image, caption, 
            user:userId (id, name, image)
          )
          `
        )
        .eq("chatId", chatId)
        .or(`sender.eq.${currentUser?.id}, receiver.eq.${currentUser.id}`);
      if (error) setError("Invalid Url");
      setMessages(data);
    } catch (e) {
      setError("Invalid Url");
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  return { fetchChatDetails, fetchMessages };
}
