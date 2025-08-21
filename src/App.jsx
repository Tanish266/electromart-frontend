import Header from "./Components/HeaderComponent";
import Body_Banner from "./Components/Body_Banner";
import Header_2 from "./Components/Header-2";
import Content from "./Components/Content";
import Footer from "./Components/Footer";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
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
