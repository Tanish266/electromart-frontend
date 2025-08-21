import React, { useState } from "react";
import {
  Avatar,
  Popover,
  Button,
  Tooltip,
  Row,
  Col,
  Drawer,
  message,
  Modal,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import logo from "./../assets/logo.png";
import AddToCart from "./AddToCart";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      console.log("Searching for:", searchQuery);
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const showLargeDrawer = () => {
    setSize("large");
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const logout = () => {
    Modal.confirm({
      title: "Are you sure you want to log out?",
      content: "You will be logged out of your account.",
      okText: "Yes, Log out",
      cancelText: "Cancel",
      onOk: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("cart"); // Clear cart data
        message.success("Logged out successfully!");
        navigate("/signin");
      },
      onCancel() {
        message.info("Log out canceled");
      },
    });
  };

  const user = localStorage.getItem("user");

  const contentLoggedIn = (
    <div>
      <Link to="/Your-Account" style={{ textDecoration: "none" }}>
        Your Profile
      </Link>
      <p />
      <Link to="/" style={{ textDecoration: "none" }} onClick={logout}>
        Log out
      </Link>
    </div>
  );

  // Content for not logged-in user
  const contentNotLoggedIn = (
    <div>
      <Link to="/Signup" style={{ textDecoration: "none" }}>
        Create Account
      </Link>
      <p />
      <Link to="/SignIn" style={{ textDecoration: "none" }}>
        Log in
      </Link>
    </div>
  );

  return (
    <>
      <Row className="header">
        <Col xs={2} sm={4} md={6} lg={8} xl={10}>
          <div style={{ padding: "0 16px" }}>
            {/* Logo */}
            <Link to="/">
              <img alt="Logo" className="Logo" src={logo} />
            </Link>
          </div>
        </Col>
        {/* Search */}
        <Col flex="1 1 200px">
          <div
            style={{ display: "flex", gap: "small", flexDirection: "column" }}
          >
            <div style={{ display: "flex", gap: "small" }}>
              <Tooltip title="Search" className="Search">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                />
              </Tooltip>
            </div>
          </div>
        </Col>
        <Row wrap={false}>
          <Col flex="none">
            <div style={{ padding: "0 16px" }}>
              {/* Account */}
              {user ? (
                <Popover placement="bottom" content={contentLoggedIn}>
                  <Avatar className="Account" icon={<UserOutlined />} />
                </Popover>
              ) : (
                <Popover placement="bottom" content={contentNotLoggedIn}>
                  <Avatar className="Account" icon={<UserOutlined />} />
                </Popover>
              )}
            </div>
          </Col>
        </Row>
        <Row wrap={false}>
          <Col flex="none">
            {/* Cart */}
            <a onClick={showLargeDrawer}>
              <ShoppingCartOutlined className="Cart" />
            </a>

            <Drawer
              title={"Cart"}
              placement="right"
              size={size}
              onClose={onClose}
              open={open}
            >
              <div>
                <AddToCart />
              </div>
            </Drawer>
          </Col>
        </Row>
      </Row>
    </>
  );
};

export default Header;
