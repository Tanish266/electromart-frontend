import React, { useState } from "react";
import { Avatar, Popover, Button, Drawer, message, Modal } from "antd";
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
    <header className="header">
      {/* Logo */}
      <div className="LogoWrapper">
        <Link to="/">
          <img alt="Logo" className="Logo" src={logo} />
        </Link>
      </div>

      {/* Search */}
      <div className="Search">
        <input
          className="SearchInput"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
        />
      </div>

      {/* Account + Cart */}
      <div className="RightActions">
        <Popover
          placement="bottomRight"
          content={user ? contentLoggedIn : contentNotLoggedIn}
        >
          <Avatar className="Account" icon={<UserOutlined />} />
        </Popover>

        <button className="CartButton" onClick={showLargeDrawer}>
          <ShoppingCartOutlined className="Cart" />
        </button>
      </div>

      {/* Cart Drawer */}
      <Drawer
        title="Cart"
        placement="right"
        size={size}
        onClose={onClose}
        open={open}
      >
        <AddToCart />
      </Drawer>
    </header>
  );
};

export default Header;
