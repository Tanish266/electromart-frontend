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

const config = {
  rules: [
    {
      type: "object",
      required: true,
      message: "Please select time!",
    },
  ],
};

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Signup = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const userData = {
      email: values.email,
      password: values.password,
      name: values.name,
      phone: `+${values.prefix} ${values.phone}`, // Fix phone format
      address: values.address,
      gender: values.gender,
      birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : "",
    };
    console.log("Sending user data:", userData);
    try {
      await axios.post("http://localhost:5000/api/users", userData);
      message.success("Registration successful!");
      navigate("/SignIn");
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      message.error(
        error.response?.data?.message ||
          "Error registering user. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="91">+91</Option>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div style={{ backgroundColor: "#f1f3f6", margin: "0px 250px" }}>
      <center>
        <Link to="/">
          <img className="Logo" style={{ margin: "5px" }} src={logo} />
        </Link>
      </center>
      <hr />
      <br />
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: [],
          prefix: "91",
        }}
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must be at least 8 characters long, contain at least one letter and one number.",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: "Please input your name!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              required: true,
              message: "Please input your phone number!",
            },
          ]}
        >
          <Input
            addonBefore={prefixSelector}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[
            {
              required: true,
              message: "Please enter your habitual residence!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Gender"
          rules={[
            {
              required: true,
              message: "Please select gender!",
            },
          ]}
        >
          <Select placeholder="select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item name="birthDate" label="Birth-Date" {...config}>
          <DatePicker
            disabledDate={(current) =>
              current && current > moment().endOf("day")
            }
          />
        </Form.Item>
        <Form.Item
          name="Privacy Policy"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Should accept agreement")),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the
            <Link
              style={{ textDecoration: "none" }}
              to="Termsofuse"
              target="_blank"
            >
              Terms of Use
            </Link>
            and
            <Link
              style={{ textDecoration: "none" }}
              to="PrivacyPolicy"
              target="_blank"
            >
              Privacy Policy.
            </Link>
          </Checkbox>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            loading={loading}
          >
            Register
          </Button>
          <br />
          <center>
            or Already Registered? <Link to="/SignIn">Login</Link>
          </center>
          <br />
        </Form.Item>
      </Form>
    </div>
  );
};
export default Signup;
