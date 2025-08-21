import HeaderComponent from "./HeaderComponent";
import Footer from "./Footer";
import React, { useEffect } from "react";
import {
  LockFilled,
  EnvironmentFilled,
  CodeSandboxCircleFilled,
} from "@ant-design/icons";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const YourProfile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      message.error("Please log in to access your profile.");
      navigate("/signin");
    }
  }, [navigate]);

  return (
    <>
      <HeaderComponent />
      <center>
        <h1>Your Account</h1>

        <div className="Ypro">
          <div className="YPpro">
            <div>
              <LockFilled style={{ fontSize: "50px" }} />
            </div>
            <div>
              <a
                href="/Your-Account/Login_Security"
                style={{ textDecoration: "none", color: "black" }}
              >
                <h3>Login & security</h3>
                <h6>Edit Login , Name , and Mobile number</h6>
              </a>
            </div>
          </div>
          <div className="YPpro">
            <div>
              <EnvironmentFilled style={{ fontSize: "50px" }} />
            </div>
            <div>
              <a
                href="/Your-Account/AddressLogin"
                style={{ textDecoration: "none", color: "black" }}
              >
                <h3>Your Addresses</h3>
                <h6>Edit addresses for orders and gifts</h6>
              </a>
            </div>
          </div>
          <div className="orders">
            <div>
              <CodeSandboxCircleFilled style={{ fontSize: "50px" }} />
            </div>
            <div>
              <a
                href="/Your-Account/UserOrders"
                style={{ textDecoration: "none", color: "black" }}
              >
                <h3>UserOrders</h3>
              </a>
            </div>
          </div>
        </div>
      </center>
      <Footer />
    </>
  );
};

export default YourProfile;
