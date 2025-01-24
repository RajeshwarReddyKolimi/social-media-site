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
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import Loader from "../../utils/loader/Loader";
import usePost from "../../hooks/usePost";

export default function Messages() {
  const currentUser = useRecoilValue(userState);
  const { id: chatId } = useParams();
  const [error, setError] = useState();
  const [form] = Form.useForm();
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();
  const { fetchMessages, fetchReceiver, handleSendMessage } = useMessages({
    chatId,
    setError,
  });
  const { fetchPost } = usePost();

  const {
    data: receiver,
    error: receiverError,
    isLoading: isReceiverLoading,
  } = useQuery({
    queryKey: ["receiver", currentUser?.id, chatId],
    queryFn: fetchReceiver,
    staleTime: 1000 * 60 * 1,
  });

  const {
    data: messages,
    error: messagesError,
    isLoading,
  } = useQuery({
    queryKey: ["messages", currentUser?.id, receiver?.id],
    queryFn: fetchMessages,
    staleTime: 1000 * 60 * 1,
    enabled: !!receiver?.id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (values) =>
      handleSendMessage({ message: values?.message, receiverId: receiver?.id }),
    onSuccess: () => {
      form.resetFields();
    },
    onError: (error) => {
      console.log("Error sending message", error.message);
    },
  });

  const handleReceiveMessage = async (newMessage) => {
    const receiverId =
      newMessage?.sender === currentUser?.id
        ? newMessage?.receiver
        : newMessage?.sender;

    if (newMessage?.postId) {
      const post = await fetchPost(newMessage?.postId);
      newMessage = { ...newMessage, post };
    }
    queryClient.invalidateQueries(["messages", currentUser?.id, receiver]);
    queryClient.setQueryData(
      ["messages", currentUser?.id, receiverId],
      (prev) => {
        return [...(prev || []), newMessage];
      }
    );
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView();
  }, [messages]);

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
            handleReceiveMessage(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser?.id, receiver]);

  if (error) return <NotFound />;

  return (
    <div className="messages-page">
      {(isLoading || isReceiverLoading) && <Loader />}
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
          onFinish={sendMessageMutation.mutate}
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
