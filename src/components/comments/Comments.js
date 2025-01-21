import { Button, Empty, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import useComments from "../../hooks/useComments";
import "./index.css";
import UserCommentCard from "./UserCommentCard";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loader from "../../utils/loader/Loader";

export default function Comments({ setShowComments, post }) {
  const [form] = Form.useForm();
  const { fetchComments, handleAddComment } = useComments();
  const queryClient = useQueryClient();

  const {
    data: comments,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["comments", post?.id],
    queryFn: () => fetchComments(post?.id),
    staleTime: 1000 * 60,
  });

  const commentMutation = useMutation({
    mutationFn: (comment) => handleAddComment({ postId: post?.id, comment }),
    onSuccess: (comment) => {
      queryClient.invalidateQueries(["comments", post?.id]);
      queryClient.setQueryData(["comments", post?.id], (prev) => [
        comment,
        ...prev,
      ]);
      form.resetFields();
    },
    onError: (error) => {
      console.log("Error liking post:", error.message);
    },
  });
  return (
    <section
      className="overlay"
      onClick={(e) => {
        if (e.target.className != "overlay") return;
        setShowComments(false);
      }}
    >
      {isLoading && <Loader />}
      <div className="comments-container">
        <h1>Comments</h1>
        <div className="comments">
          {comments?.map((comment, id) => (
            <UserCommentCard key={id} comment={comment} />
          ))}

          {comments?.length == 0 && <Empty description="No comments" />}
        </div>
        <Form
          className="comment-form"
          name="commentForm"
          onFinish={(values) => commentMutation.mutate(values?.commentInput)}
          onFinishFailed={(e) => console.log(e)}
          autoComplete="off"
          form={form}
        >
          <Form.Item name="commentInput">
            <Input placeholder="Enter comment" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
