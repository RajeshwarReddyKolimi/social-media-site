import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useRecoilValue } from "recoil";
import Logo from "../../assets/Logo";
import userState from "../../atoms/userState";
import useAuth from "../../hooks/useAuth";
import "./index.css";
import loadingState from "../../atoms/loadingState";
import validateEmail from "../../utils/anon/validateEmail";

export default function Signin() {
  const { signin, handleInitiateChangePassword } = useAuth();
  const loading = useRecoilValue(loadingState);
  const currentUser = useRecoilValue(userState);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState();
  const handleSignin = async (values) => {
    try {
      const { email, password } = values;
      console.log(validateEmail(email));
      if (!validateEmail(email)) {
        setError("Invalid email");
        console.log("Invalid email");
        return;
      }
      console.log(email, password);
      const { data, error } = await signin(values);
      Object.keys(error).forEach((e) => {
        console.log(error[e]);
      });
      console.log(error);
      console.log();
      if (error) setError(error);
    } catch (e) {
      console.log(e);
    }
  };
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
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
