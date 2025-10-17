import React from "react";
import banner1 from "./../assets/banner/1.jpg";
import banner2 from "./../assets/banner/2.jpg";
import banner3 from "./../assets/banner/3.jpg";
import banner4 from "./../assets/banner/4.jpg";
import banner5 from "./../assets/banner/5.jpg";
import banner6 from "./../assets/banner/6.jpg";
import { Carousel } from "antd";

const Body_Banner = () => {
  return (
    <>
      <Carousel autoplay arrows infinite={true} className="Carousel">
        <div>
          <img src={banner1} alt="1" />
        </div>
        <div>
          <img src={banner2} alt="2" />
        </div>
        <div>
          <img src={banner3} alt="3" />
        </div>
        <div>
          <img src={banner4} alt="4" />
        </div>
        <div>
          <img src={banner5} alt="5" />
        </div>
        <div>
          <img src={banner6} alt="6" />
        </div>
      </Carousel>
    </>
  );
};
export default Body_Banner;

// const products = [
// {
//   id: 1,
//   name: "iPhone 16 Pro Max 5G (Titanium Black, 1TB Storage)",
//   price: 177900,
//   image: IPhone,
// },
// {
//   id: 2,
//   name: "Samsung Galaxy S25 Ultra 5G (Titanium Black, 1TB Storage)",
//   price: 165999,
//   image: Samsung,
// },
// {
//   id: 3,
//   name: "OnePlus 13 (24GB RAM, 1TB Storage Black Eclipse)",
//   price: 89998,
//   image: OnePlus,
// },
// {
//   id: 4,
//   name: "iPhone 16 Pro Max 5G (Titanium Black, 1TB Storage)",
//   price: 177900,
//   image: m4,
// },
// ];
