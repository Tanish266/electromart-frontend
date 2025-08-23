import { Breadcrumb } from "antd";
import HeaderComponent from "./HeaderComponent";
import Footer from "./Footer";
import React, { useState, useEffect } from "react";
import axios from "axios";

const PassLogin = () => {
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);

        if (userData.password) {
          setPassword(userData.password);
        }
        if (userData.id) {
          setUserId(userData.id);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleSaveChanges = async () => {
    if (!newPassword.trim()) {
      alert("Please enter a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
        {
          oldPassword,
          password: newPassword,
        }
      );

      if (response.data.message === "User updated successfully") {
        alert(
          `Password changed successfully from ${oldPassword} to: ${newPassword}`
        );

        // Update localStorage and React state
        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user")),
          password: newPassword,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        console.log("Updated localStorage:", localStorage.getItem("user"));

        setPassword(newPassword);
        setNewPassword("");
        setOldPassword("");
        setConfirmPassword(""); // Clear the input after successful update
      }
    } catch (error) {
      console.error("Error updating Password:", error);
      alert(error?.response?.data?.message || "Failed to update Password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <>
        <HeaderComponent />
      </>
      <center>
        <div className="Login-Sec">
          <Breadcrumb
            separator=">"
            items={[
              {
                title: "Home",
                href: "/",
              },
              {
                title: "Your Account",
                href: "/Your-Account",
              },
              {
                title: "Login & security",
                href: "/Your-Account/Login_Security",
              },
              {
                title: " Change Password",
              },
            ]}
          />
          <h1>Change Password</h1>
          <div style={{ textAlign: "left" }}>
            <p>
              Use the form below to change the password for your Electromart
              account
            </p>
          </div>
          <div style={{ textAlign: "left" }}>
            <h4>Current password:</h4>
            <input
              type="password"
              style={{ width: "250px" }}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <br />

            <h4>New password:</h4>
            <input
              type="password"
              style={{ width: "250px" }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <br />

            <h4>Reenter new password:</h4>
            <input
              type="password"
              style={{ width: "250px" }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <br />
          <div style={{ textAlign: "left" }}>
            <button
              className="cart-button"
              style={{ textAlign: "center" }}
              onClick={handleSaveChanges}
              disabled={loading}
            >
              {loading ? "Updating..." : "Save changes"}
            </button>
          </div>
        </div>
      </center>
      <Footer />
    </>
  );
};
export default PassLogin;
