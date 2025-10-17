import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

const Content = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`
        );
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderProductList = (category, title) => {
    const filteredProducts = products.filter((product) => {
      if (category.toLowerCase() === "power banks") {
        return product.ProductName.toLowerCase().includes("power bank");
      }
      return product.Category?.toLowerCase() === category.toLowerCase();
    });

    if (filteredProducts.length === 0) return null;

    return (
      <div id={category.toLowerCase().replace(" ", "")}>
        <center>
          <h1
            style={{
              borderBottom: "1px dotted black",
              borderTop: "1px dotted black",
              margin: "10px 0",
              padding: "10px",
            }}
          >
            {title}
          </h1>
        </center>
        <div className="products-grid">
          {filteredProducts.map((product) => {
            let price = product.Price;

            if (
              Array.isArray(product.variants) &&
              product.variants.length > 0
            ) {
              price = product.variants[0]?.Price;
            } else if (Array.isArray(product.Price)) {
              price = product.Price[0];
            }

            return (
              <div
                key={product.id}
                className="product-card"
                onClick={() =>
                  navigate(`/Single-Product-View/${title}/${product.id}`)
                }
              >
                <img
                  className="product-image"
                  src={
                    product.MainImage
                      ? `${import.meta.env.VITE_API_URL}/p_image/${
                          product.MainImage
                        }`
                      : "/placeholder.png"
                  }
                  alt={product.ProductName}
                />
                <h2>₹{price}</h2>
                <h4>{product.ProductName}</h4>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {renderProductList("Mobiles", "MOBILES")}
          {renderProductList("Laptops", "LAPTOPS")}
          {renderProductList("TVs", "TVS")}
          {renderProductList("Cameras", "CAMERAS")}
          {renderProductList("Watches", "WATCHES")}
          {renderProductList("Headphones", "HEADPHONES")}
          {renderProductList("Airbuds", "AIRBUDS")}
          {renderProductList("Computers", "COMPUTERS")}
          {renderProductList("Speakers", "SPEAKERS")}
          {renderProductList("Power Banks", "POWER BANKS")}
        </>
      )}
    </>
  );
};

export default Content;
