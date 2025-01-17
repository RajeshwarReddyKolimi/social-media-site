import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import React, { useState } from "react";
import usePost from "../../hooks/usePost";

export default function CreatePost() {
  const [fileList, setFileList] = useState([]);
  const { createPost } = usePost();
  return (
    <div className="create-post-page">
      <h1>Create new post</h1>
      <Form
        className="create-post-form"
        layout="horizontal"
        onFinish={createPost}
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
