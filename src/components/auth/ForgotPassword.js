import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { replace, useNavigate, useParams, useSearchParams } from "react-router";
import { supabase } from "../../config/supabase";

export default function ForgotPassword() {
  const { handleInitiateChangePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="signin-page">
      <div className="change-password signin-form">
        <h1>Forgot password</h1>
        <Form
          className="form"
          onFinish={(values) => handleInitiateChangePassword(values?.email)}
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
