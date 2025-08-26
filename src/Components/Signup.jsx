import React, { useState } from "react";
import moment from "moment";
import {
  Button,
  Checkbox,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./../assets/logo.png";

const { Option } = Select;

const Signup = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const userData = {
      email: values.email,
      password: values.password,
      name: values.name,
      phone: `+${values.prefix}${values.phone}`, // fixed spacing
      address: values.address,
      gender: values.gender,
      birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : "",
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, userData);
      message.success("🎉 Registration successful!");
      navigate("/SignIn");
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      message.error(
        error.response?.data?.message ||
          "❌ Error registering user. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="91">
      <Select style={{ width: 70 }}>
        <Option value="91">+91</Option>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

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
          maxWidth: "600px",
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
        </center>
        <hr />
        <br />

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
        >
          {/* Email */}
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              { type: "email", message: "Invalid E-mail!" },
              { required: true, message: "Please input your E-mail!" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must be 8+ chars with at least one letter & number.",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* Name */}
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
          </Form.Item>

          {/* Address */}
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter your address!" }]}
          >
            <Input />
          </Form.Item>

          {/* Gender */}
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select gender!" }]}
          >
            <Select placeholder="Select your gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          {/* DOB */}
          <Form.Item
            name="birthDate"
            label="Birth-Date"
            rules={[{ required: true, message: "Please select birth date!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current > moment().endOf("day")
              }
            />
          </Form.Item>

          {/* Privacy Policy */}
          <Form.Item
            name="privacyPolicy"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("You must accept agreement")),
              },
            ]}
          >
            <Checkbox>
              I have read the{" "}
              <Link to="/Termsofuse" target="_blank">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link to="/PrivacyPolicy" target="_blank">
                Privacy Policy
              </Link>
            </Checkbox>
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
            <center style={{ marginTop: "10px" }}>
              Already Registered? <Link to="/SignIn">Login</Link>
            </center>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
