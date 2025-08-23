import React, { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import logo from "./../assets/logo.png";
import { Button, Checkbox, Form, Input, Flex, message, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored user data:", storedUser);
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { email, password } = values;

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/login`,
        {
          email,
          password,
        }
      );

      console.log("Raw login response:", response.data);

      if (response.data.success) {
        const { user, token } = response.data; // Corrected `User` to `user`

        localStorage.setItem("user", JSON.stringify(user)); // Corrected `User` to `user`
        localStorage.setItem("token", token);

        message.success("Login successful!");
        setUser(user); // Corrected `User` to `user`
        navigate("/");
      } else {
        message.error(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        message.error(error.response.data?.message || "Invalid credentials");
      } else {
        message.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f1f3f6", margin: "0px 400px" }}>
      <center>
        <Link to="/">
          <img
            className="Logo"
            style={{ margin: "5px" }}
            src={logo}
            alt="Logo"
          />
        </Link>
        <hr />
        <br />

        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Typography.Link to="/forgot-password">
                Forgot password?
              </Typography.Link>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={loading}>
              Log in
            </Button>
            or <Link to="/Signup">Register now!</Link>
          </Form.Item>
        </Form>
      </center>
    </div>
  );
};

export default SignIn;
