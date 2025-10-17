import logo from "./../assets/logo.png";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Radio,
  Row,
  Collapse,
  message,
  Modal,
} from "antd";
import CartSummary from "./CartSummary";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearCart } from "./../Redux/Slice/cartSlice";

const Buy_Now = () => {
  const cartData = useSelector((state) => state.cart.data);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onClose = () => {
    setOpen(false);
  };
  const [value, setValue] = useState(1);

  // Address
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
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
          `${import.meta.env.VITE_API_URL}/api/saveaddresses/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSavedAddresses(response.data);

        if (response.data.length > 0) {
          setSelectedAddressId(response.data[0].id); // Auto-select first address
        }
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
        `${import.meta.env.VITE_API_URL}/api/saveaddresses`,
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
        `${import.meta.env.VITE_API_URL}/api/saveaddresses/${id}`
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

  // Payment method
  const [selectedMethod, setSelectedMethod] = useState("card");

  const onChangePayment = (e) => {
    setValue(e.target.value);
    setSelectedMethod(e.target.value);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Handle placing the order

  const placeOrder = async () => {
    if (!selectedAddressId) {
      message.error("Please select a shipping address.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    if (!userId) {
      message.error("User not found. Please log in again.");
      return;
    }

    const totalPrice = cartData.reduce((acc, item) => {
      const price = item.discountPrice || item.price;
      return acc + price * item.quantity;
    }, 0);

    // Find the selected shipping address
    const shippingAddress = savedAddresses.find(
      (addr) => addr.id === selectedAddressId
    );

    if (!shippingAddress) {
      message.error("Shipping address not found.");
      console.log("Shipping address is NULL or invalid.");
      return;
    }

    const orderStatus = "Order Placed"; // Always "Order Placed" in your example
    const orderData = {
      customerName: user?.name,
      customerEmail: user?.email,
      customerPhone: shippingAddress?.mobilenumber || "N/A",
      shippingAddress: JSON.stringify(shippingAddress),
      paymentStatus: selectedMethod === "cod" ? "Pending" : "Paid",
      orderStatus,
      subtotal: totalPrice,
      discount: cartData.reduce(
        (acc, item) =>
          acc +
          (item.discountPrice
            ? (item.price - item.discountPrice) * item.quantity
            : 0),
        0
      ),
      tax: (totalPrice * 0.0018).toFixed(2),
      total: (totalPrice * 1.0018).toFixed(2),
      orderItems: cartData.map((item) => ({
        productName: item.productName,
        price: item.discountPrice || item.price,
        quantity: item.quantity,
        total: (item.quantity * (item.discountPrice || item.price)).toFixed(2),
      })),
      userId,
    };

    console.log("orderData being sent to the server:", orderData);

    const token = localStorage.getItem("token");

    // Cash on Delivery (COD) logic
    if (selectedMethod === "cod") {
      Modal.confirm({
        title: "Confirm Your Order",
        content:
          "Are you sure you want to place this order with Cash on Delivery?",
        okText: "Yes, Place Order",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/orders/place`,
              orderData,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
              message.success("Order placed successfully with COD.");
              dispatch(clearCart());
              navigate("/");
            } else {
              message.error("Failed to place order.");
            }
          } catch (err) {
            message.error("Error placing COD order.");
          }
        },
        onCancel() {
          message.info("Order cancelled");
        },
      });
      return;
    }

    // Create Razorpay order on backend
    let orderResponse;
    try {
      orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments/razorpay/order`,
        { amount: Math.round(totalPrice * 100), currency: "INR" }
      );
    } catch (err) {
      console.error("Error creating Razorpay order:", err);
      message.error("Failed to initiate payment. Try again.");
      return;
    }

    const { order } = orderResponse.data || {};
    if (!order?.id) {
      message.error("Payment initialization failed.");
      return;
    }

    // Online Payment via Razorpay with order_id
    const options = {
      key: "rzp_test_3FYvf0aMRI8oZ0",
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "ELECTROMART",
      description: "Order Payment",
      handler: async function (response) {
        try {
          // Verify payment on backend
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/payments/razorpay/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (!verifyRes.data?.success) {
            message.error("Payment verification failed.");
            return;
          }

          // Place order after successful verification
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/orders/place`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data.success) {
            message.success("✅ Order placed successfully after payment.");
            dispatch(clearCart());
            navigate("/");
          } else {
            message.error("❌ Failed to place order after payment.");
          }
        } catch (err) {
          console.error("Payment processing error:", err);
          message.error("❌ Error verifying payment or placing order.");
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.mobilenumber,
      },
      theme: { color: "#F37254" },
    };

    Modal.confirm({
      title: "Confirm Your Order",
      content: "Are you sure you want to place this order with Razorpay?",
      okText: "Yes, Proceed to Payment",
      cancelText: "Cancel",
      onOk: () => {
        try {
          const razorpayInstance = new window.Razorpay(options);
          razorpayInstance.on("payment.failed", function (response) {
            alert(`❌ Payment Failed\nReason: ${response.error.description}`);
          });
          razorpayInstance.open();
        } catch (err) {
          console.error("Error opening Razorpay:", err);
          alert("❌ Error opening payment window.");
        }
      },
      onCancel() {
        message.info("Order cancelled");
      },
    });
  };

  return (
    <>
      <center style={{ margin: "10px" }}>
        <a href="/">
          <img className="Logo" src={logo} />
        </a>
      </center>
      <div
        style={{
          padding: "14px 18px 18px",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <div>
          {/* 1 Select a delivery address */}
          <div>
            <Collapse
              size="large"
              style={{ width: "760px" }}
              items={[
                {
                  key: "1",
                  label: <h2>1 Select a delivery address</h2>,
                  children: (
                    <>
                      {
                        <div>
                          <h3>Your addresses</h3>

                          {savedAddresses.length > 0 ? (
                            <Radio.Group
                              className="address"
                              value={selectedAddressId}
                              onChange={(e) =>
                                setSelectedAddressId(e.target.value)
                              }
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 200px)",
                                gridAutoRows: "minmax(150px, auto)",
                                gap: "10px",
                              }}
                            >
                              {savedAddresses.map((address) => (
                                <Radio
                                  key={
                                    address.id ||
                                    address.fullname + address.mobilenumber
                                  }
                                  value={address.id}
                                  style={{
                                    border: "1px solid #ddd",
                                    padding: "10px",
                                    margin: "2px",
                                    display: "block",
                                  }}
                                >
                                  <p>
                                    <strong>Name:</strong> {address.fullname}
                                  </p>
                                  <p>
                                    <strong>Mobile:</strong>{" "}
                                    {address.mobilenumber}
                                  </p>
                                  <p>
                                    <strong>Address:</strong>{" "}
                                    {address.addressLine1}, {address.area},{" "}
                                    {address.city}, {address.state},{" "}
                                    {address.pincode}
                                  </p>
                                  <hr />
                                  <Button
                                    danger
                                    onClick={(e) => {
                                      e.stopPropagation(); // prevent selecting the radio when delete is clicked
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
                                </Radio>
                              ))}
                            </Radio.Group>
                          ) : (
                            <p>No saved address found.</p>
                          )}

                          <hr />
                          <span>
                            <Button
                              onClick={() => setOpen(true)}
                              icon={<PlusOutlined />}
                            >
                              Add a new address
                            </Button>
                            <Drawer
                              title="Enter a new delivery address"
                              width={720}
                              onClose={() => setOpen(false)}
                              open={open}
                              styles={{
                                body: {
                                  paddingBottom: 80,
                                },
                              }}
                            >
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
                                      label="Full name (First and Last name)"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter Full name",
                                        },
                                      ]}
                                    >
                                      <Input
                                        style={{
                                          width: "100%",
                                        }}
                                        placeholder="Please enter Your Full Name"
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      name="mobilenumber"
                                      label="Mobile number"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Enter an Mobile number",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Enter Your Mobile number"></Input>
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
                                          message: " Enter your Country/Region",
                                        },
                                      ]}
                                    >
                                      <Input placeholder=" Enter your Country/Region" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      name="pincode"
                                      label="Pincode"
                                      rules={[
                                        {
                                          required: true,
                                          message: " Enter Your Pincode",
                                        },
                                      ]}
                                    >
                                      <Input placeholder=" Enter Your Pincode"></Input>
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Row gutter={16}>
                                  <Col span={24}>
                                    <Form.Item
                                      name="addressLine1"
                                      label="Flat, House no., Building, Company, Apartment"
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            " Enter your the Flat, House no., Building, Company, Apartment",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Enter your Flat, House no., Building, Company, Apartment"></Input>
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
                                          message:
                                            " Enter your the Area, Street, Sector, Village",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Enter your the Area, Street, Sector, Village"></Input>
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      name="landmark"
                                      label="Landmark"
                                      rules={[
                                        {
                                          required: true,
                                          message: " Enter your Landmark",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Enter your Landmark" />
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <Form.Item
                                      name="city"
                                      label="Town/City"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Enter your Town/City",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Enter Town/City" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      name="state"
                                      label="State"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Enter your State",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Enter your State" />
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <Button
                                      style={{ width: "95%", margin: "10px" }}
                                      onClick={onClose}
                                    >
                                      Cancel
                                    </Button>
                                  </Col>
                                  <Col span={12}>
                                    <Button
                                      type="primary"
                                      htmlType="submit"
                                      loading={loading}
                                      style={{ width: "95%", margin: "10px" }}
                                    >
                                      Add Address
                                    </Button>
                                  </Col>
                                </Row>
                              </Form>
                            </Drawer>
                          </span>
                        </div>
                      }
                    </>
                  ),
                },
              ]}
            />
          </div>

          {/* 2 Select a payment method */}
          <div>
            <Collapse
              style={{ width: "760px" }}
              size="large"
              items={[
                {
                  key: "2",
                  label: <h2>2 Select a payment method</h2>,
                  children: (
                    <div className="payment">
                      <h3>Payment Method</h3>
                      <hr />

                      <Radio.Group
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                        onChange={onChangePayment}
                        value={value}
                      >
                        <Radio value="cod" className="cash">
                          Cash on Delivery / Pay on Delivery
                        </Radio>
                        <Radio value="razorpay" className="razorpay">
                          Razorpay (Card)
                          {value === "razorpay" && (
                            <div style={{ marginTop: "1rem" }}>
                              <h3>Proceed to pay securely via Razorpay</h3>
                            </div>
                          )}
                        </Radio>
                      </Radio.Group>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
        {/* Summary */}
        <div className="Sumpay">
          <div className="p-4 bg-gray-100 rounded-lg shadow-md summry">
            <CartSummary cartItems={cartData} />
            <center style={{ padding: "50px " }}>
              <Button
                onClick={placeOrder}
                type="primary"
                loading={loading}
                disabled={!selectedAddressId}
              >
                Place Order
              </Button>
            </center>
          </div>
        </div>
      </div>
    </>
  );
};

export default Buy_Now;
