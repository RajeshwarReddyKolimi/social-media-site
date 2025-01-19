import { Button, Form, Input } from "antd";
import React from "react";
import useAuth from "../../hooks/useAuth";
import useNotify from "../../hooks/useNotify";

export default function ForgotPassword() {
  const { handleInitiateChangePassword } = useAuth();
  const { notify, contextHolder } = useNotify();
  const initiateChangePassword = async (email) => {
    const { data, error } = await handleInitiateChangePassword(email);
    if (error)
      notify({
        type: "error",
        message: "Password Change Error",
        description: error?.status,
      });
    else
      notify({
        type: "success",
        message: "Password Change",
        description: "Email to change password has been sent",
      });
  };
  return (
    <div className="signin-page">
      {contextHolder}
      <div className="change-password signin-form">
        <h1>Forgot password</h1>
        <Form
          className="form"
          onFinish={(values) => initiateChangePassword(values?.email)}
          style={{
            maxWidth: 500,
          }}
          onFinishFailed={(e) => console.log(e)}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input placeholder="Enter new email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send Verification Link
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
