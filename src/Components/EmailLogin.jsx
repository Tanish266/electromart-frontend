import { Breadcrumb } from "antd";
import HeaderComponent from "./HeaderComponent";
import Footer from "./Footer";
import React, { useEffect, useState } from "react";
import axios from "axios";

const EmailLogin = () => {
  const [email, setEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.email) {
          setEmail(userData.email);
          setOldEmail(userData.email);
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
    if (!newEmail.trim()) {
      alert("Please enter a new email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      alert("Please enter a valid email address.");
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
          oldEmail,
          email: newEmail,
        }
      );

      if (response.data.message === "User updated successfully") {
        alert(`Email changed successfully from ${oldEmail} to: ${newEmail}`);

        // ✅ Update localStorage and React state immediately
        const updatedUser = JSON.parse(localStorage.getItem("user")) || {};
        updatedUser.email = newEmail;
        localStorage.setItem("user", JSON.stringify(updatedUser));

        console.log("Updated localStorage:", localStorage.getItem("user"));

        setEmail(newEmail);
        setOldEmail(newEmail);
        setNewEmail("");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      alert(error.response?.data?.message || "Failed to update email.");
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
              { title: "Change your email address" },
            ]}
          />
          <h1>Change your email address</h1>
          <div style={{ textAlign: "left" }}>
            <h5>Current email address:</h5>
            <h6>{email || "Loading..."}</h6>
            <p>
              Enter the new email address you want to associate with your
              account below. A One Time Password (OTP) will be sent to verify
              the change.
            </p>
          </div>
          <div style={{ textAlign: "left" }}>
            <h4>New email address</h4>
            <input
              type="email"
              style={{ width: "100%" }}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <br />
          <div>
            <button
              className="cart-button"
              onClick={handleSaveChanges}
              style={{ width: "100%", textAlign: "center" }}
              disabled={!newEmail.trim() || loading} // Disable button if input is empty
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

export default EmailLogin;
