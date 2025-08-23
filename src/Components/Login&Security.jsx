import { Breadcrumb } from "antd";
import HeaderComponent from "./HeaderComponent";
import Footer from "./Footer";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login_Security = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");

    if (!storedUserString) {
      console.error("No user found in localStorage");
      return;
    }

    let storedUser;
    try {
      storedUser = JSON.parse(storedUserString);
      if (!storedUser || !storedUser.id) {
        throw new Error("Invalid user data format");
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      localStorage.removeItem("user"); // Remove corrupted data
      return;
    }

    setUserData(storedUser);

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/users/${storedUser.id}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return (
    <>
      <HeaderComponent />
      <center>
        <div className="Login-Sec">
          <Breadcrumb
            separator=">"
            items={[
              { title: "Home", href: "/" },
              { title: "Your Account", href: "/Your-Account" },
              { title: "Login & security" },
            ]}
          />
          <h1>Login and Security</h1>
          <>
            <UserDetail
              title="Name"
              value={userData?.name || "N/A"}
              link="/Your-Account/Login_Security/Name-Login"
            />
            <UserDetail
              title="Email"
              value={userData?.email || "N/A"}
              link="/Your-Account/Login_Security/Email-Login"
            />
            <UserDetail
              title="Mobile number"
              value={userData?.phone || "N/A"}
              link="/Your-Account/Login_Security/Mobile-Login"
            />
            <UserDetail
              title="Password"
              value="*********"
              link="/Your-Account/Login_Security/Pass-Login"
            />
          </>
        </div>
      </center>
      <Footer />
    </>
  );
};

// Reusable component for user details
const UserDetail = ({ title, value, link }) => (
  <div className="LAS">
    <div style={{ textAlign: "left" }}>
      <h4>{title}</h4>
      <h6>{value}</h6>
    </div>
    <a href={link}>
      <button style={{ width: "100px", borderRadius: "20px" }}>Edit</button>
    </a>
  </div>
);

export default Login_Security;
