import { Col, Form, Input, Row, Breadcrumb, Button } from "antd";
import HeaderComponent from "./HeaderComponent";
import Footer from "./Footer";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AddressLogin = () => {
  const [form] = Form.useForm();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Keep only one loading state

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!token || !user?.id) {
          alert("Please log in to continue.");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/saveaddresses/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSavedAddresses(response.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleSave = async (values) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      if (!token || !userId)
        throw new Error("Authentication required. Please log in again.");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/saveaddresses`,
        { user_id: userId, ...values },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("added", response);

      if (response.status === 201) {
        const updatedAddresses = [...savedAddresses, values];
        setSavedAddresses(updatedAddresses);
        localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
        alert("Address saved successfully!");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert(
        error.response?.data?.message ||
          "Error saving address. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error(
        "Error: ID is undefined. Check database query & frontend state."
      );
      return;
    }

    try {
      console.log("Deleting address with ID:", id);
      setLoading(true);

      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/saveaddresses/${id}`
      );

      if (response.status === 200) {
        console.log("Address deleted successfully:", id);
        setSavedAddresses((prev) =>
          prev.filter((address) => address.id !== id)
        );
      } else {
        console.error("Failed to delete address:", response.status);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { title: "Home", href: "/" },
    { title: "Your Account", href: "/Your-Account" },
    { title: "Add a new address" },
  ];

  return (
    <>
      <HeaderComponent />
      <center>
        {savedAddresses.length > 0 && (
          <div className="SavedAddresses">
            {savedAddresses.map((address, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <p>
                  <strong>Name:</strong> {address.fullname}
                </p>
                <p>
                  <strong>Mobile:</strong> {address.mobilenumber}
                </p>
                <p>
                  <strong>Address:</strong> {address.addressLine1},
                  {address.area}, {address.city}, {address.state},
                  {address.pincode}
                </p>
                <hr />
                <Button
                  danger
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(address.id);
                  }}
                  style={{
                    border: "2px solid red",
                    backgroundColor: "red",
                    color: "white",
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="Login-Sec">
          <Breadcrumb separator=">" items={breadcrumbItems} />
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSave}
            hideRequiredMark
          >
            <h1>Add a new address</h1>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="fullname"
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please enter your full name" },
                  ]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="mobilenumber"
                  label="Mobile Number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your mobile number",
                    },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit number",
                    },
                  ]}
                >
                  <Input placeholder="Enter mobile number" maxLength={10} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="country"
                  label="Country/Region"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your country/region",
                    },
                  ]}
                >
                  <Input placeholder="Enter country/region" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="pincode"
                  label="Pincode"
                  rules={[
                    { required: true, message: "Please enter your pincode" },
                    {
                      pattern: /^[0-9]{6}$/,
                      message: "Enter a valid 6-digit pincode",
                    },
                  ]}
                >
                  <Input placeholder="Enter pincode" maxLength={6} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="addressLine1"
                  label="Flat, House No., Building, Apartment"
                  rules={[
                    { required: true, message: "Please enter your address" },
                  ]}
                >
                  <Input placeholder="Enter flat/house/building" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="area"
                  label="Area, Street, Sector, Village"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your area/street",
                    },
                  ]}
                >
                  <Input placeholder="Enter area/street" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="landmark"
                  label="Landmark"
                  rules={[{ message: "Please enter a landmark" }]}
                >
                  <Input placeholder="Enter landmark" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="city"
                  label="Town/City"
                  rules={[
                    { required: true, message: "Please enter your town/city" },
                  ]}
                >
                  <Input placeholder="Enter town/city" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[
                    { required: true, message: "Please enter your state" },
                  ]}
                >
                  <Input placeholder="Enter your state" />
                </Form.Item>
              </Col>
            </Row>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={loading}
            >
              Save Address
            </Button>
          </Form>
        </div>
      </center>
      <Footer />
    </>
  );
};

export default AddressLogin;
