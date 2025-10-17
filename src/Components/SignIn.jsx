import React, { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import logo from "./../assets/logo.png";
import { Button, Checkbox, Form, Input, Flex, message, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id) {
          navigate("/"); // already logged in → redirect
        }
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        { email, password }
      );

      if (response.data.success) {
        const { user, token } = response.data;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        message.success("✅ Login successful!");
        navigate("/");
      } else {
        message.error(response.data.message || "❌ Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error(
        error.response?.data?.message || "❌ Network error. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f1f3f6",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <center>
          <Link to="/">
            <img
              className="Logo"
              style={{ marginBottom: "10px", height: "60px" }}
              src={logo}
              alt="Logo"
            />
          </Link>
          <hr />
        </center>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Flex
            justify="space-between"
            align="center"
            style={{ marginBottom: "10px" }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link to="/forgot-password">Forgot password?</Link>
          </Flex>

          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={loading}>
              Log in
            </Button>
            <div style={{ marginTop: "10px" }}>
              or <Link to="/Signup">Register now!</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
