import React from "react";
import { supabase } from "../config/supabase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userState from "../atoms/userState";
import NotFound from "../components/navbar/NotFound";
import loadingState from "../atoms/loadingState";

export default function useMessages({ chatId, setError }) {
  const currentUser = useRecoilValue(userState);
  const setLoading = useSetRecoilState(loadingState);

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
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const fetchReceiver = async () => {
    try {
      const { data, error } = await supabase
        .from("Chats")
        .select(
          `*, 
          user1:user1Id (id, name, image), 
          user2:user2Id (id, name, image)`
        )
        .eq("id", chatId)
        .maybeSingle();
      if (currentUser?.id != data?.user1Id && currentUser?.id != data?.user2Id)
        setError("Invalid Url");
      return currentUser?.id == data?.user1Id ? data?.user2 : data?.user1;
    } catch (e) {
      console.log(e);
    }
  };

  const createNewChat = async (userId) => {
    try {
      const [user1Id, user2Id] =
        currentUser?.id?.localeCompare(userId) < 0
          ? [currentUser?.id, userId]
          : [userId, currentUser?.id];
      const { data, error } = await supabase
        .from("Chats")
        .upsert({
          user1Id,
          user2Id,
        })
        .select()
        .single();
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const fetchChatId = async (userId) => {
    try {
      if (currentUser?.id == userId) return;
      const { data, error } = await supabase
        .from("Chats")
        .select(
          `*,
        user1:user1Id (id, name, image),
        user2:user2Id (id, name, image)`
        )
        .or(`user1Id.eq.${currentUser?.id}, user2Id.eq.${currentUser?.id}`)
        .or(`user1Id.eq.${userId}, user2Id.eq.${userId}`)
        .maybeSingle();
      if (data) return data?.id;
      else {
        const data = await createNewChat(userId);
        if (data) return data?.id;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchMessages = async () => {
    try {
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
        .or(`sender.eq.${currentUser?.id}, receiver.eq.${currentUser?.id}`);
      if (error) setError("Invalid Url");
      return data;
    } catch (e) {
      setError("Invalid Url");
      console.log(e);
    }
  };

  const handleSendMessage = async ({ message, receiverId }) => {
    try {
      if (!message?.trim()) return;
      if (!chatId) return;
      const { data, error } = await supabase.from("Messages").insert({
        sender: currentUser?.id,
        receiver: receiverId,
        text: message?.trim(),
        chatId: chatId,
      });
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  return {
    fetchChats,
    fetchReceiver,
    fetchChatId,
    fetchMessages,
    handleSendMessage,
  };
}
