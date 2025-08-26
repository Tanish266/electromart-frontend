import { Breadcrumb } from "antd";
import HeaderComponent from "./HeaderComponent";
import Footer from "./Footer";
import React, { useState, useEffect } from "react";
import axios from "axios";

const PassLogin = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.id) setUserId(userData.id);
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
        alert("Password changed successfully!");

        // Update localStorage
        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user")),
          password: newPassword,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Reset fields
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error?.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

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
              {
                title: "Login & security",
                href: "/Your-Account/Login_Security",
              },
              { title: "Change Password" },
            ]}
          />
          <h1>Change Password</h1>
          <p>
            Use the form below to change the password for your Electromart
            account
          </p>

          <div className="form-group">
            <h4>Current password:</h4>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <h4>New password:</h4>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <h4>Re-enter new password:</h4>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            className="cart-button"
            onClick={handleSaveChanges}
            disabled={loading}
          >
            {loading ? "Updating..." : "Save changes"}
          </button>
        </div>
      </center>
      <Footer />
    </>
  );
};

export default PassLogin;
