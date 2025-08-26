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
  MenuOutlined,
} from "@ant-design/icons";
import logo from "./../assets/logo.png";
import AddToCart from "./AddToCart";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery}`);
    }
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
        localStorage.removeItem("cart");
        message.success("Logged out successfully!");
        navigate("/signin");
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
      <Row
        className="header"
        align="middle"
        justify="space-between"
        style={{ padding: "0 10px" }}
      >
        {/* Logo */}
        <Col xs={12} sm={6} md={4}>
          <Link to="/">
            <img alt="Logo" className="Logo" src={logo} />
          </Link>
        </Col>

        {/* Search Bar - hidden on small screens */}
        <Col xs={0} sm={12} md={12} lg={14}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Search" className="Search">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                style={{ width: "100%", maxWidth: "400px" }}
              />
              <Button
                type="primary"
                shape="circle"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              />
            </Tooltip>
          </div>
        </Col>

        {/* Desktop Right Icons */}
        <Col xs={0} sm={6} md={6} lg={6} style={{ textAlign: "right" }}>
          {user ? (
            <Popover placement="bottom" content={contentLoggedIn}>
              <Avatar className="Account" icon={<UserOutlined />} />
            </Popover>
          ) : (
            <Popover placement="bottom" content={contentNotLoggedIn}>
              <Avatar className="Account" icon={<UserOutlined />} />
            </Popover>
          )}

          <ShoppingCartOutlined
            className="Cart"
            onClick={() => setCartOpen(true)}
          />
        </Col>

        {/* Mobile Hamburger */}
        <Col xs={12} sm={0} style={{ textAlign: "right" }}>
          <MenuOutlined
            style={{ fontSize: "24px" }}
            onClick={() => setOpen(true)}
          />
        </Col>
      </Row>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
        {/* Mobile Search */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            style={{ width: "80%", marginRight: "5px" }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          />
        </div>

        {/* Account */}
        <div style={{ marginBottom: "20px" }}>
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

        {/* Cart */}
        <Button
          type="default"
          icon={<ShoppingCartOutlined />}
          onClick={() => setCartOpen(true)}
        >
          Cart
        </Button>
      </Drawer>

      {/* Cart Drawer */}
      <Drawer
        title={"Cart"}
        placement="right"
        size="large"
        onClose={() => setCartOpen(false)}
        open={cartOpen}
      >
        <AddToCart />
      </Drawer>
    </>
  );
};

export default Header;
