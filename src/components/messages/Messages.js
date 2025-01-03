import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import { useParams } from "react-router";
import { supabase } from "../../config/supabase";
import Message from "./Message";
import Chats from "./Chats";
import { Button, Form, Input } from "antd";

export default function Messages() {
  const user = useRecoilValue(userState);
  const { id: chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [form] = Form.useForm();
  const messagesEndRef = useRef(null);

  const fetchChatDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("Chats")
        .select("*")
        .eq("id", chatId)
        .single();
      if (data) {
        setReceiverId(
          user?.id === data?.user1Id ? data?.user2Id : data?.user1Id
        );
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
          `
            *,
            Sender:sender (id, name, image),
            Receiver:receiver (id, name, image)
          `
        )
        .or(`sender.eq.${user?.id}, receiver.eq.${user?.id}`);
      setMessages(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSendMessage = async (values) => {
    try {
      if (!values?.message?.trim()) return;
      const { data, error } = await supabase.from("Messages").insert({
        sender: user?.id,
        receiver: receiverId,
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

  useEffect(() => {
    messagesEndRef.current.scrollIntoView();
  }, [messages]);
  useEffect(() => {
    if (chatId) {
      fetchChatDetails();
    }
  }, [chatId]);

  useEffect(() => {
    if (receiverId) {
      fetchMessages();
    }
  }, [receiverId]);

  useEffect(() => {
    const subscription = supabase
      .channel("message-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Messages" },
        (payload) => {
          if (
            payload?.new?.receiver === user?.id ||
            payload?.new?.sender === user?.id
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
  }, [user?.id]);

  return (
    <div className="messages-page">
      <div className="chat-sidebar">
        <Chats />
      </div>
      <div className="messages-container">
        <div className="messages">
          {messages?.map((message, id) => (
            <Message key={id} message={message} userId={user?.id} />
          ))}
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
