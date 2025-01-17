import { Button, Empty, Form, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import loadingState from "../../atoms/loadingState";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";
import NotFound from "../navbar/NotFound";
import UserSearchCard from "../users/UserSearchCard";
import Message from "./Message";
import MessagePost from "./MessagePost";
import useMessages from "../../hooks/useMessages";

export default function Messages() {
  const currentUser = useRecoilValue(userState);
  const setLoading = useSetRecoilState(loadingState);
  const { id: chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState();
  const [form] = Form.useForm();
  const messagesEndRef = useRef(null);
  const [chatDetails, setChatDetails] = useState();
  const [receiver, setReceiver] = useState();
  const { fetchMessages } = useMessages();
  const handleSendMessage = async (values) => {
    try {
      setLoading((prev) => prev + 1);
      if (!values?.message?.trim()) return;
      if (!chatId) return;
      const { data, error } = await supabase.from("Messages").insert({
        sender: currentUser?.id,
        receiver: receiver?.id,
        text: values?.message?.trim(),
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
  const fetchChatDetails = async () => {
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
      setChatDetails(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (chatId) {
      fetchMessages({ chatId, setMessages, setError });
      fetchChatDetails();
    }
  }, [chatId, currentUser]);

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
      <div className="messages-container">
        <UserSearchCard user={receiver} />
        <div className="messages">
          {messages?.map((message, id) =>
            message?.postId ? (
              <MessagePost
                key={id}
                message={message}
                isSent={currentUser?.id === message?.sender}
              />
            ) : (
              <Message
                key={id}
                message={message}
                isSent={currentUser?.id === message?.sender}
              />
            )
          )}
          {messages?.length == 0 && <Empty description="No messages" />}
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
    </div>
  );
}
