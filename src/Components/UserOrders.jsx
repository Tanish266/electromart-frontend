import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Spin,
  Card,
  Typography,
  Modal,
  Button,
  Tag,
  Steps,
} from "antd";
import { PlusCircleFilled } from "@ant-design/icons";

import axios from "axios";
import Header from "./HeaderComponent";
import Footer from "./Footer";

const { Title } = Typography;

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getUserAndToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token) {
      message.error("User not authenticated. Please log in.");
      return null;
    }
    return { user, token };
  };

  const fetchOrders = async () => {
    const userAndToken = getUserAndToken();
    if (!userAndToken) return;
    const { user, token } = userAndToken;

    const url = `${import.meta.env.VITE_API_URL}/api/orders/user/${user.id}`;
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const sortedOrders = res.data.orders.sort((a, b) => a.id - b.id);
        setOrders(sortedOrders);
      } else {
        message.error("Failed to fetch orders.");
      }
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error.response ? error.response.data : error
      );
      message.error("An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const cancelOrder = async () => {
    const userAndToken = getUserAndToken();
    if (!userAndToken) return;
    const { token } = userAndToken;

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/cancel/${selectedOrder.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        message.success("Order has been cancelled.");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id
              ? { ...order, order_status: "Cancelled" }
              : order
          )
        );
        setIsModalVisible(false);
      } else {
        message.error("Failed to cancel the order.");
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      message.error("An error occurred while cancelling the order.");
    }
  };

  const STATUS_COLORS = {
    Pending: "gold",
    Failed: "red",
    Cancelled: "gray",
    Paid: "green",
    Delivered: "green",
    "Out for Delivery": "blue",
    Dispatched: "orange",
    Returned: "red",
  };

  const getStatusColor = (status) => STATUS_COLORS[status] || "default";

  const ORDER_STATUS_STEP = {
    Pending: 0,
    "Order Processed": 1,
    Packed: 2,
    Dispatched: 3,
    "Out for Delivery": 4,
    Delivered: 5,
    Cancelled: 6,
  };

  const ORDER_STATUS_PAYMENT = {
    Pending: 0,
    Paid: 1,
    Returned: 2,
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (value) => `₹${Number(value || 0).toFixed(2)}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (value) => `₹${Number(value || 0).toFixed(2)}`,
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Order Status",
      dataIndex: "order_status",
      key: "order_status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Placed On",
      dataIndex: "created_at",
      key: "created_at",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <a onClick={() => showModal(record)}>
          View Details <PlusCircleFilled />
        </a>
      ),
    },
  ];

  const modalContent = selectedOrder ? (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "20px",
        }}
      >
        <Steps
          current={ORDER_STATUS_STEP[selectedOrder.order_status] ?? 0}
          size="small"
          progressDot
          direction="vertical"
        >
          {Object.keys(ORDER_STATUS_STEP).map((status) => (
            <Steps.Step
              key={status}
              title={status}
              icon={
                <div
                  style={{
                    backgroundColor: getStatusColor(status),
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                  }}
                />
              }
            />
          ))}
        </Steps>

        <Steps
          current={ORDER_STATUS_PAYMENT[selectedOrder.payment_status] ?? 0}
          size="small"
          direction="vertical"
          progressDot
        >
          {Object.keys(ORDER_STATUS_PAYMENT).map((status) => (
            <Steps.Step
              key={status}
              title={status}
              icon={
                <div
                  style={{
                    backgroundColor: getStatusColor(status),
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                  }}
                />
              }
            />
          ))}
        </Steps>
      </div>
      <p>
        <strong>Order ID:</strong> {selectedOrder.id}
      </p>
      <p>
        <strong>Payment Status:</strong> {selectedOrder.payment_status}
      </p>
      <p>
        <strong>Order Status:</strong> {selectedOrder.order_status}
      </p>
      <p>
        <strong>Placed On:</strong>{" "}
        {new Date(selectedOrder.created_at).toLocaleString()}
      </p>

      <h3>Order Items:</h3>
      {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
        <ul>
          {selectedOrder.orderItems.map((item, index) => (
            <li key={index}>
              <p>
                <strong>Product:</strong> {item.productName}
              </p>
              <p>
                <strong>Price:</strong> ₹{Number(item.price || 0).toFixed(2)}
              </p>

              <p>
                <strong>Quantity:</strong> {item.qty}
              </p>
              <p>
                <strong>Total:</strong> ₹{Number(item.total || 0).toFixed(2)}
              </p>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No items found in this order.</p>
      )}

      {!["Cancelled", "Delivered", "Returned"].includes(
        selectedOrder.order_status
      ) && (
        <Button
          onClick={cancelOrder}
          style={{
            marginTop: 16,
            backgroundColor: "red",
            border: "none",
            color: "white",
          }}
        >
          Cancel Order
        </Button>
      )}
    </div>
  ) : null;

  return (
    <>
      <Header />
      <hr />
      <div className="p-6">
        <Title level={3} style={{ textAlign: "center" }}>
          My Orders
        </Title>
        <hr />
        <Card>
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              dataSource={orders}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              locale={{ emptyText: "No orders found" }}
            />
          )}
        </Card>
      </div>

      <Modal
        title="Order Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {modalContent}
      </Modal>

      <Footer className="footer" />
    </>
  );
};

export default UserOrders;
