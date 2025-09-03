import { Breadcrumb } from "antd";
import HeaderComponent from "./HeaderComponent";
import Footer from "./Footer";
import React, { useEffect, useState } from "react";
import axios from "axios";

const MobileLogin = () => {
  const [phone, setPhone] = useState("");
  const [oldPhone, setOldPhone] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);

        if (userData.phone) {
          setPhone(userData.phone);
          setOldPhone(userData.phone);
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
    if (!newPhone.trim()) {
      alert("Please enter a new PhoneNumber.");
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(newPhone)) {
      alert("Please enter a valid Phone number.");
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
          oldPhone,
          phone: newPhone,
        }
      );

      if (response.data.message === "User updated successfully") {
        alert(
          `PhoneNumber changed successfully from ${oldPhone} to: ${newPhone}`
        );

        // Update localStorage and React state
        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user")),
          phone: newPhone,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("Updated localStorage:", localStorage.getItem("user"));
        setPhone(newPhone);
        setOldPhone(newPhone);
        setNewPhone(""); // Clear the input after successful update
      }
    } catch (error) {
      console.error("Error updating PhoneNumber:", error);
      alert(error?.response?.data?.message || "Failed to update PhoneNumber.");
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
                title: " Change Mobile Number",
              },
            ]}
          />

          <h1>Change Mobile Number</h1>
          <div style={{ textAlign: "left" }}>
            <h5>Old mobile number:</h5>
            <h5>{phone}</h5>
          </div>
          <br />
          <div style={{ textAlign: "center" }}>
            <div>
              <h4>Mobile number</h4>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
            </div>
            <br />
            <p style={{ textAlign: "left" }}>
              To verify your number, we will send you a text message with a
              temporary code. Message and data rates may apply.
            </p>
            <div>
              <button
                className="cart-button"
                style={{ width: "70% ", textAlign: "center" }}
                onClick={handleSaveChanges}
                disabled={!newPhone.trim() || loading}
              >
                {loading ? "Updating..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </center>
      <Footer />
    </>
  );
};
export default MobileLogin;
