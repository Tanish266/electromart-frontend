import { Breadcrumb } from "antd";
import HeaderComponent from "./HeaderComponent";
import Footer from "./Footer";
import React, { useEffect, useState } from "react";
import axios from "axios";
const NameLogin = () => {
  const [name, setName] = useState("");
  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);

        if (userData.name) {
          setName(userData.name);
          setOldName(userData.name);
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
    if (!newName.trim()) {
      alert("Please enter a new name.");
      return;
    }

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
        {
          oldName,
          name: newName,
        }
      );

      if (response.data.message === "User updated successfully") {
        alert(`Name changed successfully from ${oldName} to: ${newName}`);

        // Update localStorage and React state
        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user")),
          name: newName,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        console.log("Updated localStorage:", localStorage.getItem("user"));

        setName(newName);
        setOldName(newName);
        setNewName(""); // Clear the input after successful update
      }
    } catch (error) {
      console.error("Error updating name:", error);
      alert(error?.response?.data?.message || "Failed to update name.");
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
                title: " Change Your Name",
              },
            ]}
          />

          <h1>Change Your Name</h1>
          <div style={{ textAlign: "left" }}>
            <p style={{ textAlign: "left" }}>
              If you want to change the name associated with your Electromart
              customer account, you may do so below. Be sure to click the Save
              Changes button when you are done.
            </p>
          </div>
          <br />
          <div style={{ textAlign: "left" }}>
            <div>
              <h4>New name</h4>
              <input
                type="text"
                placeholder={name || "Enter new nickname"}
                onChange={(e) => setNewName(e.target.value)}
                style={{ width: "250px" }}
              />
            </div>
            <br />
            <div>
              <button
                className="cart-button"
                onClick={handleSaveChanges}
                disabled={!newName.trim() || loading}
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
export default NameLogin;
