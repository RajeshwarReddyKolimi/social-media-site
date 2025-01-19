import { Button, Form, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useNotify from "../../hooks/useNotify";

export default function ChangePassword() {
  const { handleChangePassword } = useAuth();
  const navigate = useNavigate();
  const { notify, contextHolder } = useNotify();
  const changePassword = async (values) => {
    const { data, error } = await handleChangePassword(values);
    if (!error) navigate("/", { replace: true });
    else
      notify({
        type: "error",
        message: "Password change Error",
        description: error?.status,
      });
  };
  return (
    <div className="signin-page">
      {contextHolder}
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
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Confirm
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
