import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";
import "./index.css";
import UserCommentCard from "./UserCommentCard";
import loadingState from "../../atoms/loadingState";

export default function Comments({ setShowComments, post }) {
  const currentUser = useRecoilValue(userState);
  const setLoading = useSetRecoilState(loadingState);
  const [comments, setComments] = useState([]);
  const [form] = Form.useForm();

  const fetchComments = async () => {
    try {
      setLoading((prev) => prev + 1);
      const { data, error } = await supabase
        .from("Comments")
        .select(`*, user:userId (id, name, image)`)
        .eq("postId", post?.id)
        .order("created_at", { ascending: false });
      setComments(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  const handleAddComment = async (values) => {
    try {
      setLoading((prev) => prev + 1);
      if (!values?.commentInput?.trim()) return;

      const { data, error } = await supabase
        .from("Comments")
        .insert({
          userId: currentUser?.id,
          postId: post?.id,
          comment: values?.commentInput,
        })
        .eq("postId", post?.id);
      form.resetFields();
      fetchComments();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  useEffect(() => {
    fetchComments();
  }, []);
  return (
    <div
      className="comments-overlay"
      onClick={(e) => {
        if (e.target.className != "comments-overlay") return;
        setShowComments(false);
      }}
    >
      <div className="comments-container">
        <h1>Comments</h1>
        <div className="comments">
          {comments?.map((comment, id) => (
            <UserCommentCard key={id} comment={comment} />
          ))}
        </div>
        <Form
          className="comment-form"
          name="commentForm"
          onFinish={handleAddComment}
          onFinishFailed={(e) => console.log(e)}
          autoComplete="off"
          form={form}
        >
          <Form.Item name="commentInput">
            <Input placeholder="Enter comment" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<IoIosSend />} />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
