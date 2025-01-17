import { Button, Empty, Form, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";
import useMessages from "../../hooks/useMessages";
import NotFound from "../navbar/NotFound";
import UserSearchCard from "../users/UserSearchCard";
import Message from "./Message";
import MessagePost from "./MessagePost";

export default function Messages() {
  const currentUser = useRecoilValue(userState);
  const { id: chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState();
  const [form] = Form.useForm();
  const messagesEndRef = useRef(null);
  const [receiver, setReceiver] = useState();
  const { fetchMessages, fetchReceiver, handleSendMessage } = useMessages({
    chatId,
    setError,
  });

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (chatId) {
      fetchReceiver({ setReceiver });
      fetchMessages({ setMessages });
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
          onFinish={(values) =>
            handleSendMessage({
              message: values?.message,
              receiverId: receiver?.id,
              form,
            })
          }
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
