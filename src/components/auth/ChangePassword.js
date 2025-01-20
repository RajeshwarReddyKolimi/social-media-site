import { Button, Form, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useNotify from "../../hooks/useNotify";
import "./index.css";

export default function ChangePassword() {
  const { handleChangePassword } = useAuth();
  const navigate = useNavigate();
  const notify = useNotify();
  const changePassword = async (values) => {
    const { data, error } = await handleChangePassword(values);
    if (!error) {
      notify({
        type: "success",
        message: "Password Change Success",
        description: "Password successfully changed",
      });
      navigate("/", { replace: true });
    } else
      notify({
        type: "error",
        message: "Password Change Error",
        description: error?.code,
      });
  };
  return (
    <main className="signin-page">
      <div className="change-password signin-form">
        <h1>Change password</h1>
        <Form
          className="form"
          onFinish={changePassword}
          style={{
            maxWidth: 500,
          }}
          onFinishFailed={(e) => console.log(e)}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter new password"
              visibilityToggle={false}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Confirm
            </Button>
          </Form.Item>
        </Form>
      </div>
    </main>
  );
}
