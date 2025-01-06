import { Button, Form, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";
import useMessages from "../../hooks/useMessages";
import UserSearchCard from "../users/UserSearchCard";
import Chats from "./Chats";
import Message from "./Message";
import NotFound from "../navbar/NotFound";
import useAuth from "../../hooks/useAuth";

export default function Messages() {
  const currentUser = useRecoilValue(userState);
  const { id: receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [error, setError] = useState();
  const [form] = Form.useForm();
  const messagesEndRef = useRef(null);
  const { fetchChatDetails, fetchMessages } = useMessages();
  const { fetchUserDetails } = useAuth();

  const handleSendMessage = async (values) => {
    try {
      if (!values?.message?.trim()) return;
      const { data, error } = await supabase.from("Messages").insert({
        sender: currentUser?.id,
        receiver: receiver?.id,
        text: values?.message?.trim(),
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
      fetchMessages({ receiverId, setMessages });
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
