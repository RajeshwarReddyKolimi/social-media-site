import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { replace, useNavigate, useParams, useSearchParams } from "react-router";
import { supabase } from "../../config/supabase";

export default function ChangePassword() {
  const { handleChangePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const changePassword = async (values) => {
    const isSuccess = await handleChangePassword(values);
    if (isSuccess) navigate("/", { replace: true });
    else alert("error changing password");
  };
  useEffect(() => {
    console.log(searchParams.get("token"));
  }, []);
  return (
    <div className="signin-page">
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
