import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import loadingState from "../../atoms/loadingState";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";

export default function CreatePost() {
  const [fileList, setFileList] = useState([]);
  const setLoading = useSetRecoilState(loadingState);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const createPost = async (image, caption) => {
    try {
      setLoading((prev) => prev + 1);
      const { data, error } = await supabase
        .from("Posts")
        .insert({
          userId: currentUser?.id,
          image,
          caption,
        })
        .select()
        .maybeSingle();
      setCurrentUser((prev) => {
        return { ...prev, posts: [...prev?.posts, data] };
      });

      if (!error) navigate("/");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  const handleSubmit = async (values) => {
    try {
      setLoading((prev) => prev + 1);
      const image = values?.fileList?.[0];
      const imageName = Date.now() + image?.name.replace(/\s+/g, "_");
      const r1 = await supabase.storage
        .from("postImages")
        .upload(imageName, image?.originFileObj);
      if (r1.error) return;
      const { data, error } = await supabase.storage
        .from("postImages")
        .getPublicUrl(imageName);
      if (error) return;
      const res = await createPost(data?.publicUrl, values?.caption);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  return (
    <div className="create-post-page">
      <h1>Create new post</h1>
      <Form
        className="create-post-form"
        layout="horizontal"
        onFinish={handleSubmit}
        onFinishFailed={(e) => console.log("Form submission failed:", e)}
      >
        <Form.Item
          name="fileList"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            listType="text"
            fileList={fileList}
            maxCount={1}
            accept="image/*"
          >
            <Button
              style={{
                width: "100%",
                backgroundColor: "transparent",
                borderRadius: "0.25rem",
              }}
              icon={<UploadOutlined />}
            >
              Upload Image
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item name="caption">
          <Input
            placeholder="Add caption"
            style={{
              borderRadius: "0.25rem",
            }}
          />
        </Form.Item>
        <Button type="primary" style={{ color: "white" }} htmlType="submit">
          Create
        </Button>
      </Form>
    </div>
  );
}
