import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const Header_2 = () => {
  const [current, setCurrent] = useState("");
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
        // Navigate to home first
        navigate("/");
        // Delay to allow content to mount
        setTimeout(() => scrollToSection(key), 100);
      } else {
        scrollToSection(key);
      }
      return;
    }

    navigate(key);
  };

  const items = scrollSections.map((path) => ({
    key: path,
    label: path.slice(1).charAt(0).toUpperCase() + path.slice(2),
  }));

  return (
    <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
      <Menu
        className="Hd2"
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
    </div>
  );
};

export default Header_2;
