import { Button, Form, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";
import useAuth from "../../hooks/useAuth";
import useMessages from "../../hooks/useMessages";
import NotFound from "../navbar/NotFound";
import UserSearchCard from "../users/UserSearchCard";
import Message from "./Message";

export default function Messages() {
  const currentUser = useRecoilValue(userState);
  const { id: receiverId } = useParams();
  const [chatId, setChatId] = useState();
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [error, setError] = useState();
  const [form] = Form.useForm();
  const messagesEndRef = useRef(null);
  const { fetchChatDetls, fetchMessages } = useMessages();
  const { fetchUserDetails } = useAuth();
  const handleSendMessage = async (values) => {
    try {
      console.log(chatId);
      if (!values?.message?.trim()) return;
      if (!chatId) return;
      const { data, error } = await supabase.from("Messages").insert({
        sender: currentUser?.id,
        receiver: receiver?.id,
        text: values?.message?.trim(),
        chatId,
      });
      if (error) {
        console.log(error);
      } else {
        form.resetFields();
      }
    } catch (e) {
      console.log(e);
    }
  };
  const createNewChat = async () => {
    try {
      const { data, error } = await supabase.from("Chats").upsert({
        user1Id: currentUser?.id,
        user2Id: receiverId,
      });
      setChatId(data?.id);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchChatDetails = async () => {
    try {
      if (!currentUser?.id || currentUser?.id == receiverId) {
        setError("Invalid url");
        return;
      }
      const { data, error } = await supabase
        .from("Chats")
        .select(
          `*, user1:user1Id(id, name, image), user2:user2Id(id, name, image)`
        )
        .or(`user1Id.eq.${currentUser?.id}, user2Id.eq.${currentUser?.id}`)
        .or(`user1Id.eq.${receiverId}, user2Id.eq.${receiverId}`)
        .single();
      if (data) setChatId(data?.id);
      else {
        await createNewChat();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchReceiver = async () => {
    const { data, error } = await fetchUserDetails(receiverId);
    setError(error);
    setReceiver(data);
  };

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (receiverId) {
      fetchReceiver();
    }
  }, [receiverId]);

  useEffect(() => {
    if (receiverId) {
      fetchChatDetails();
      fetchMessages({ receiverId, setMessages });
    }
  }, [receiverId, currentUser]);

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
            setMessages((prev) => [...prev, payload?.new]);
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser?.id]);

  if (error) return <NotFound />;

  return (
    <div className="messages-page">
      {/* <div className="chat-sidebar">
        <Chats />
      </div> */}
      {receiverId && (
        <div className="messages-container">
          <UserSearchCard user={receiver} />
          <div className="messages">
            {messages?.map((message, id) => (
              <Message key={id} message={message} userId={currentUser?.id} />
            ))}
            {messages?.length == 0 && (
              <p className="empty-message">No messages</p>
            )}
            <div ref={messagesEndRef} />
          </div>
          <Form
            className="message-input-form"
            onFinish={handleSendMessage}
            form={form}
          >
            <Form.Item name="message">
              <Input placeholder="Enter a message" autoFocus />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Send
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}
