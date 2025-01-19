import { Button, Form, Input } from "antd";
import React from "react";
import { Link } from "react-router";
import Logo from "../../assets/Logo";
import useAuth from "../../hooks/useAuth";
import useNotify from "../../hooks/useNotify";
import validateEmail from "../../utils/anon/validateEmail";
import validatePassword from "../../utils/anon/validatePassword";
import "./index.css";

export default function Signin({ setShowItem }) {
  const { signin } = useAuth();
  const { notify, contextHolder } = useNotify();
  const handleSignin = async (values) => {
    try {
      const { email, password } = values;
      if (!validateEmail(email)) {
        notify({
          type: "error",
          message: "Signin Error",
          description: "Invalid email address",
        });
        return;
      }
      if (!validatePassword(password)) {
        notify({
          type: "error",
          message: "Signin Error",
          description: "Invalid password",
        });
        return;
      }
      const { data, error } = await signin(values);
      if (error) {
        notify({
          type: "error",
          message: "Signin Error",
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
          onFinish={handleSignin}
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
          {/* {error && <p>{error}</p>} */}
          <Link
            style={{
              display: "block",
              textAlign: "right",
            }}
            to="/forgot-password"
          >
            Forgot Password?
          </Link>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="signin-toggle">
        <p>
          Don't have an account?{" "}
          <Button type="text" onClick={() => setShowItem("signup")}>
            Sign up
          </Button>
        </p>
      </div>
    </main>
  );
}
