import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; // agar tum React Router use kar rahe ho
import Header from "./Components/HeaderComponent";
import Body_Banner from "./Components/Body_Banner";
import Header_2 from "./Components/Header-2";
import Content from "./Components/Content";
import Footer from "./Components/Footer";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { initGA, logPageView } from "./analytics";

const App = () => {
  const location = useLocation(); // current route ka path milega

  // Google Analytics initialize ek hi baar hoga
  useEffect(() => {
    initGA();
  }, []);

  // Jab bhi route change hoga tab pageview send hoga
  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  const someData = "Dynamic data";

  return (
    <>
      <Header data={someData} />
      <Header_2 />
      <Body_Banner />
      <Content />
      <Footer />
    </>
  );
};

export default App;
