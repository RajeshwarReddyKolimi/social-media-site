import React from "react";
import { supabase } from "../config/supabase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userState from "../atoms/userState";
import NotFound from "../components/navbar/NotFound";
import loadingState from "../atoms/loadingState";

export default function useMessages({ chatId, setError }) {
  const currentUser = useRecoilValue(userState);
  const setLoading = useSetRecoilState(loadingState);
  const fetchReceiver = async ({ setReceiver }) => {
    try {
      setLoading((prev) => prev + 1);
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
      setReceiver(currentUser?.id == data?.user1Id ? data?.user2 : data?.user1);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  const fetchMessages = async ({ setMessages }) => {
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
        .or(`sender.eq.${currentUser?.id}, receiver.eq.${currentUser?.id}`);
      if (error) setError("Invalid Url");
      setMessages(data);
    } catch (e) {
      setError("Invalid Url");
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  const handleSendMessage = async ({ message, receiverId, form }) => {
    try {
      setLoading((prev) => prev + 1);
      if (!message?.trim()) return;
      if (!chatId) return;
      const { data, error } = await supabase.from("Messages").insert({
        sender: currentUser?.id,
        receiver: receiverId,
        text: message?.trim(),
        chatId: chatId,
      });
      if (error) {
        console.log(error);
      } else {
        form.resetFields();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  return { fetchReceiver, fetchMessages, handleSendMessage };
}
