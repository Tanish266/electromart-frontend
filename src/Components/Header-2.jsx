import React, { useEffect, useState } from "react";
import { Menu, Drawer, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";

const Header_2 = () => {
  const [current, setCurrent] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location.pathname]);

  const scrollSections = [
    "/mobiles",
    "/laptops",
    "/tvs",
    "/cameras",
    "/watches",
    "/headphones",
    "/airbuds",
    "/computers",
    "/speakers",
    "/powerbanks",
  ];

  const scrollToSection = (key) => {
    const sectionId = key.slice(1);
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onClick = (e) => {
    const key = e.key;
    setCurrent(key);

    if (scrollSections.includes(key)) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => scrollToSection(key), 100);
      } else {
        scrollToSection(key);
      }
      return;
    }

    navigate(key);
    setOpen(false); // close drawer on mobile
  };

  const items = scrollSections.map((path) => ({
    key: path,
    label: path.slice(1).charAt(0).toUpperCase() + path.slice(2),
  }));

  return (
    <>
      {/* Desktop Menu */}
      <div className="desktop-menu">
        <Menu
          className="Hd2"
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />
      </div>

      {/* Mobile Hamburger */}
      <div className="mobile-menu">
        <Button
          icon={<MenuOutlined />}
          type="text"
          onClick={() => setOpen(true)}
        />
      </div>

      {/* Drawer for Mobile */}
      <Drawer
        title="Categories"
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
      >
        <Menu
          mode="inline"
          onClick={onClick}
          selectedKeys={[current]}
          items={items}
        />
      </Drawer>
    </>
  );
};

export default Header_2;
