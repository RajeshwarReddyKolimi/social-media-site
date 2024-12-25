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
export default function Signin() {
  const [user, setUser] = useRecoilState(userState);
  console.log(user);
  const navigate = useNavigate();
  const { signin, currentUser } = useAuth();
  console.log(currentUser);
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user]);
  if (user) {
    navigate("/profile");
  }
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
          onFinish={(values) => signin(values)}
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
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="signin-toggle">
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}