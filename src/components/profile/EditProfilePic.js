import { Button, Form, Upload } from "antd";
import React from "react";

export default function EditProfilePic() {
  return (
    <div>
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
            // onChange={handleImageUpload}
          >
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
        <Button htmlType="submit">Create</Button>
      </Form>
    </div>
  );
}
