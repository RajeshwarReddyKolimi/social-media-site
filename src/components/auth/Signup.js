import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useRecoilValue } from "recoil";
import Logo from "../../assets/Logo";
import userState from "../../atoms/userState";
import useAuth from "../../hooks/useAuth";
import "./index.css";
import loadingState from "../../atoms/loadingState";

export default function Signup() {
  const { signup } = useAuth();
  const loading = useRecoilValue(loadingState);
  const currentUser = useRecoilValue(userState);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (loading == 0) {
      if (currentUser) navigate(searchParams?.get("redirect") ?? "/");
    }
  }, [currentUser, loading]);

  return (
    <div className="signin-page">
      <div className="signin-form">
        <Logo />
        <Form
          className="form"
          name="basic"
          style={{
            maxWidth: 500,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={signup}
          onFinishFailed={(e) => console.log(e)}
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
