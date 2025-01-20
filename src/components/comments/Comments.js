import { Button, Empty, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import useComments from "../../hooks/useComments";
import "./index.css";
import UserCommentCard from "./UserCommentCard";

export default function Comments({ setShowComments, post }) {
  const [comments, setComments] = useState([]);
  const [form] = Form.useForm();
  const { fetchComments, handleAddComment } = useComments({
    postId: post?.id,
    setComments,
  });
  useEffect(() => {
    fetchComments();
  }, []);
  return (
    <section
      className="overlay"
      onClick={(e) => {
        if (e.target.className != "overlay") return;
        setShowComments(false);
      }}
    >
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
          onFinish={(values) =>
            handleAddComment({
              comment: values?.commentInput,
              form,
            })
          }
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
