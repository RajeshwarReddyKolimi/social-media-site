import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import loadingState from "../../atoms/loadingState";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";

export default function CreatePost() {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useRecoilState(loadingState);
  const user = useRecoilValue(userState);
  const handleImageUpload = () => {};
  const createPost = async (image, caption) => {
    try {
      setLoading((prev) => prev + 1);
      const { data, error } = await supabase.from("Posts").insert({
        userId: user?.id,
        image,
        caption,
      });
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
      const imageName = Date.now() + image?.name;
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
        style={{ maxWidth: 600 }}
        onFinish={handleSubmit}
        onFinishFailed={(e) => console.log("Form submission failed:", e)}
      >
        <Form.Item
          name="fileList"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleImageUpload}
          >
            <Button
              className="upload-button"
              style={{ border: 0, background: "none" }}
              htmlType="button"
            >
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload Image</div>
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item name="caption">
          <Input placeholder="Enter caption" />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form>
    </div>
  );
}
