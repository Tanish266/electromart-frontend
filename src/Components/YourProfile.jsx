import HeaderComponent from "./HeaderComponent";
import Footer from "./Footer";
import React, { useEffect } from "react";
import {
  LockFilled,
  EnvironmentFilled,
  CodeSandboxCircleFilled,
} from "@ant-design/icons";
import { message } from "antd";
import { useNavigate, Link } from "react-router-dom";

const YourProfile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      message.error("Please log in to access your profile.");
      navigate("/signin");
    }
  }, [navigate]);

  const menuItems = [
    {
      icon: <LockFilled style={{ fontSize: "40px", color: "#1890ff" }} />,
      title: "Login & Security",
      desc: "Edit Login, Name, and Mobile number",
      link: "/Your-Account/Login_Security",
    },
    {
      icon: (
        <EnvironmentFilled style={{ fontSize: "40px", color: "#52c41a" }} />
      ),
      title: "Your Addresses",
      desc: "Edit addresses for orders and gifts",
      link: "/Your-Account/AddressLogin",
    },
    {
      icon: (
        <CodeSandboxCircleFilled
          style={{ fontSize: "40px", color: "#faad14" }}
        />
      ),
      title: "Your Orders",
      desc: "View and manage your orders",
      link: "/Your-Account/UserOrders",
    },
  ];

  return (
    <>
      <HeaderComponent />
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "30px" }}>Your Account</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {menuItems.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  height: "100%",
                }}
                className="profile-card"
              >
                <div style={{ marginBottom: "10px" }}>{item.icon}</div>
                <h3 style={{ marginBottom: "8px" }}>{item.title}</h3>
                {item.desc && <p style={{ color: "gray" }}>{item.desc}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default YourProfile;
