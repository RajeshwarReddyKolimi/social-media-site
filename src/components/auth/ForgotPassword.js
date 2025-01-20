import { Button, Form, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import userState from "../../atoms/userState";
import useAuth from "../../hooks/useAuth";
import useNotify from "../../hooks/useNotify";

export default function ForgotPassword() {
  const currentUser = useRecoilState(userState);
  const { handleInitiateChangePassword } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
  const initiateChangePassword = async (email) => {
    const { data, error } = await handleInitiateChangePassword(email);
    if (error)
      notify({
        type: "error",
        message: "Password Change Error",
        description: error?.code,
      });
    else
      notify({
        type: "success",
        message: "Password Change",
        description: "Link to change password has been sent to email",
      });
  };
  if (currentUser) navigate("/");
  return (
    <main className="signin-page">
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
    </main>
  );
}
