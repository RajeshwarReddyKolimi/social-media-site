import React, { useEffect } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import Logo from "../../utils/Logo";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useRecoilState } from "recoil";
import userState from "../../atoms/userState";
const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
export default function Signup() {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const { signup } = useAuth();
  console.log(user);
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user]);
  return (
    <div className="signin-page">
      <div className="signin-form">
        <Logo />
        <Form
          className="form"
          name="basic"
          wrapperCol={
            {
              // span: 16,
            }
          }
          style={{
            maxWidth: 500,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={(values) => signup(values)}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
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
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password visibilityToggle={false} placeholder="Password" />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Sign up
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="signin-toggle">
        <p>
          Have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
