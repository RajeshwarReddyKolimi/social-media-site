import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Upload } from "antd";
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

  // const handleSubmit = (values) => {
  //   console.log("Form values:", values);
  //   console.log("Uploaded file list:", fileList);
  // };

  return (
    <div className="create-post-page">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
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
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item name="caption">
          <Input />
        </Form.Item>
        <button type="submit">Create</button>
      </Form>
    </div>
  );
}
