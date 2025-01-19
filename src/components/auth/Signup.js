import { Button, Form, Input } from "antd";
import React from "react";
import Logo from "../../assets/Logo";
import useAuth from "../../hooks/useAuth";
import useNotify from "../../hooks/useNotify";
import validateEmail from "../../utils/anon/validateEmail";
import validatePassword from "../../utils/anon/validatePassword";
import "./index.css";

export default function Signup({ setShowItem }) {
  const { signup } = useAuth();
  const { notify, contextHolder } = useNotify();

  const handleSignup = async (values) => {
    try {
      const { email, password } = values;
      if (!validateEmail(email)) {
        notify({
          type: "error",
          message: "Signup Error",
          description: "Invalid email address",
        });
        return;
      }
      if (!validatePassword(password)) {
        notify({
          type: "error",
          message: "Signup Error",
          description: "Invalid password",
        });
        return;
      }
      const { data, error } = await signup(values);
      if (error) {
        notify({
          type: "error",
          message: "Signup Error",
          description: error?.code ?? "Invalid credentials",
        });
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <main className="signin-page">
      <div className="signin-form">
        {contextHolder}
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
          onFinish={handleSignup}
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
          Have an account?{" "}
          <Button type="text" onClick={() => setShowItem("signin")}>
            Sign In
          </Button>
        </p>
      </div>
    </main>
  );
}
