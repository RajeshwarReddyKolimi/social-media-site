import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import { useParams } from "react-router";
import { supabase } from "../../config/supabase";
import Message from "./Message";

export default function Messages() {
  const user = useRecoilValue(userState);
  const { id: chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [receiverId, setReceiverId] = useState();
  const room1 = supabase.channel("Messages");
  const fetchChatDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("Chats")
        .select("*")
        .eq("id", chatId)
        .single();
      setReceiverId(user?.id == data?.user1Id ? data?.user2Id : data?.user1Id);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchMessages = async () => {
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
        .or(`sender.eq.${user?.id}`, `receiver.eq.${user?.id}`);
      setMessages(data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      // console.log(messageInput, user?.id, receiverId);
      // const { data, error } = await room1.send({
      //   type: "broadcast",
      //   event: "test",
      //   payload: {
      //     message: messageInput,
      //     id: receiverId,
      //   },
      // });
      // console.log(data, error);
      // setMessages(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchChatDetails();
    fetchMessages();
  }, []);

  useEffect(() => {
    const subscription = room1
      .on("message", (event, session) => {
        console.log("Received message:", event.payload);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="messages-page">
      <div className="message-container">
        {messages?.map((message, id) => (
          <Message key={id} message={message} userId={user?.id} />
        ))}
      </div>
      <form
        onSubmit={(e) => handleSendMessage(e)}
        className="message-input-form"
      >
        <input
          type="text"
          name="messageInput"
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
