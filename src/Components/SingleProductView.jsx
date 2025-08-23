import Header from "./HeaderComponent";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { Rate, Carousel, Popover, Button } from "antd";
import {
  AddfromCart,
  RemovefromCart,
  plusQty,
  minusQty,
} from "../Redux/Slice/cartSlice";
import {
  RetweetOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
  MoneyCollectOutlined,
  TrophyOutlined,
  ToolOutlined,
  LockOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const SingleProductView = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedMRP, setSelectedMRP] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const cartData = useSelector((state) => state.cart.data);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/${id}`
        );
        const parsedProduct = {
          ...data,
          VariantsColor: JSON.parse(data.VariantsColor || "[]"),
          VariantsSize: JSON.parse(data.VariantsSize || "[]"),
          ExtraImage: JSON.parse(data.ExtraImage || "[]"),
          ColorImageMap: data.ColorImageMap
            ? JSON.parse(data.ColorImageMap)
            : {},
          StorageImageMap: data.StorageImageMap
            ? JSON.parse(data.StorageImageMap)
            : {},
        };
        setProduct(parsedProduct);

        const firstColor = parsedProduct.VariantsColor?.[0];
        setSelectedColor({
          name: firstColor,
          image: parsedProduct.ColorImageMap?.[firstColor] || data.MainImage,
        });

        const firstStorage = parsedProduct.VariantsSize?.[0];
        const storageIndex = parsedProduct.VariantsSize.findIndex(
          (item) => item === firstStorage
        );
        setSelectedStorage({
          name: firstStorage,
          image:
            parsedProduct.StorageImageMap?.[firstStorage] || data.MainImage,
        });
        setSelectedPrice(parsedProduct.Price?.[storageIndex]);
        setSelectedMRP(parsedProduct.Price?.[storageIndex]);
        setSelectedDiscount(parsedProduct.discountpercentage?.[storageIndex]);
      } catch (error) {
        console.error(error);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const discountedPrice = useMemo(() => {
    if (!selectedPrice || !selectedDiscount) return 0;
    return Math.round(
      Number(selectedPrice) * (1 - Number(selectedDiscount) / 100)
    );
  }, [selectedPrice, selectedDiscount]);

  const isInCart = cartData.find(
    (item) =>
      item.productId === product?.id &&
      item.variantColor === selectedColor?.name &&
      item.variantSize === selectedStorage?.name
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const handleAddToCart = async () => {
    if (product.Unit <= 0) return;

    const selectedColorName = selectedColor?.name;
    const selectedStorageName = selectedStorage?.name || "Default";
    const selectedProductImage =
      selectedColor?.image || selectedStorage?.image || product.MainImage;

    if (!selectedColor || !selectedStorage || !selectedPrice) {
      alert("Please select the product variants before adding to the cart.");
      return;
    }

    if (!isInCart) {
      const cartItem = {
        userId,
        productId: product.id,
        productName: product.ProductName,
        productBrand: product.ProductBrand,
        mainImage: selectedProductImage,
        price: discountedPrice,
        quantity: 1,
        variantColor: selectedColorName,
        variantSize: selectedStorageName,
      };

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/cart/addcart`,
          cartItem
        );
        dispatch(
          AddfromCart({ ...cartItem, discountedPrice, Unit: product.Unit })
        );
      } catch (err) {
        console.error("Cart add failed:", err.response?.data || err.message);
        alert("Failed to add product to cart");
      }
    } else {
      alert("Item already in cart!");
    }
  };

  const handleAddCart = async (item) => {
    if (!selectedColor || !selectedStorage) {
      alert(
        "Please select the color and storage variant before adding to the cart."
      );
      return;
    }

    const productId = product?.id;
    const quantity = item?.quantity || 1; // Default to 1 if quantity is undefined

    if (isNaN(quantity) || quantity <= 0) {
      console.error("Invalid quantity:", quantity);
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/update-quantity`,
        {
          userId,
          productId,
          variantColor: selectedColor.name,
          variantSize: selectedStorage.name,
          quantity: quantity + 1, // Increase by 1
        }
      );

      if (response.status === 200) {
        dispatch(plusQty({ id: productId }));
      } else {
        alert("Failed to update cart quantity.");
      }
    } catch (error) {
      console.error(
        "Cart update error:",
        error.response?.data || error.message
      );
      alert("Something went wrong. Please try again.");
    }
  };

  const handleRemoveCart = async (item) => {
    const { userId, productId, variantColor, variantSize, quantity } = item;

    if (quantity > 1) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/update-quantity`,
          {
            userId,
            productId,
            variantColor,
            variantSize,
            quantity: quantity - 1, // Decrease by 1
          }
        );

        if (response.status === 200) {
          dispatch(minusQty({ id: productId }));
        } else {
          alert("Failed to update cart quantity.");
        }
      } catch (error) {
        console.error(
          "Cart update error:",
          error.response?.data || error.message
        );
        alert("Something went wrong. Please try again.");
      }
    } else {
      dispatch(RemovefromCart({ id: productId }));
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!product) return <h2>Product not found</h2>;

  return (
    <>
      <Header />
      <div style={{ margin: "20px" }}>
        <div className="Products-list">
          {/* Left: Image + Cart Actions */}
          <div style={{ width: "50%" }}>
            <img
              className="Product"
              src={`${process.env.REACT_APP_API_URL}/p_image/${
                selectedColor?.image ||
                selectedStorage?.image ||
                product.MainImage
              }`}
              alt={product?.ProductName || "Product Image"}
            />

            <div style={{ marginTop: "20px" }}>
              {/* Decrease Quantity */}
              <Button
                onClick={() => handleRemoveCart(isInCart)}
                disabled={!isInCart || isInCart.quantity <= 1}
                style={{ margin: "5px" }}
              >
                <MinusOutlined />
              </Button>

              {/* Add to Cart */}
              <Button
                className="cart-button"
                onClick={handleAddToCart}
                disabled={product.Unit <= 0 || !!isInCart}
                style={{ margin: "5px" }}
              >
                {isInCart ? `${isInCart.quantity} in cart` : "Add to Cart"}
              </Button>

              {/* Increase Quantity */}
              <Button
                onClick={() => handleAddCart(isInCart)}
                disabled={!isInCart || isInCart.quantity >= product.Unit}
                style={{ margin: "5px" }}
              >
                <PlusOutlined />
              </Button>
            </div>
          </div>

          {/* Right: Details */}
          <div style={{ width: "70%" }}>
            <h1>{product.ProductName}</h1>
            <p>
              {product.ProductDescription} | {selectedColor?.name} |{" "}
              {selectedStorage?.name}
            </p>
            <Rate allowHalf defaultValue={3.5} />
            <h2>
              <span style={{ color: "red" }}> -{selectedDiscount}% </span>
              <span> ₹ {discountedPrice} </span>
            </h2>
            <h6>
              M.R.P.:{" "}
              <span style={{ textDecoration: "line-through" }}>
                ₹ {selectedMRP}
              </span>
            </h6>
            <h5>
              <span style={{ color: product.Unit > 0 ? "green" : "red" }}>
                Stock: {product.Unit > 0 ? product.Unit : "Out of Stock"}
              </span>
            </h5>
            <hr />
            {/* Features Carousel */}
            <Carousel infinite={false} dots={false} slidesToShow={4} arrows>
              {[
                { icon: <RetweetOutlined />, text: "7 Days Replacement" },
                { icon: <CarOutlined />, text: "Free Delivery" },
                {
                  icon: <SafetyCertificateOutlined />,
                  text: "Warranty Policy",
                },
                { icon: <MoneyCollectOutlined />, text: "Cash on Delivery" },
                { icon: <TrophyOutlined />, text: "Top Brand" },
                { icon: <ToolOutlined />, text: "Installation Available" },
                { icon: <LockOutlined />, text: "Secure Transaction" },
              ].map((item, index) => (
                <Popover
                  key={index}
                  content={<p>{item.text}</p>}
                  trigger="click"
                >
                  <div className="text-center">
                    <div className="text-icon">{item.icon}</div>
                    <p className="text-item">{item.text}</p>
                  </div>
                </Popover>
              ))}
            </Carousel>
            <hr />
            {/* Color Variant */}
            {product.VariantsColor?.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h4>Select Color: {selectedColor?.name}</h4>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {product.VariantsColor.map((colorName, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        const newImage =
                          product.ColorImageMap?.[colorName] ||
                          product.MainImage;
                        setSelectedColor({
                          name: colorName,
                          image: newImage,
                        });
                      }}
                      style={{
                        padding: "10px",
                        border:
                          selectedColor?.name === colorName
                            ? "2px solid blue"
                            : "1px solid #ccc",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {colorName}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* storage Variant */}
            {product.VariantsSize?.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h4>Select storage: {selectedStorage?.name}</h4>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {product.VariantsSize.map((storageName, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        const newImage =
                          product.StorageImageMap?.[storageName] ||
                          product.MainImage;

                        setSelectedStorage({
                          name: storageName,
                          image: newImage,
                        });

                        // 👇 Update price based on selected storage index
                        const index = product.VariantsSize.findIndex(
                          (item) => item === storageName
                        );

                        setSelectedStorage({
                          name: storageName,
                          image: newImage,
                        });

                        setSelectedPrice(product.Price?.[index]);
                        setSelectedMRP(product.Price?.[index]);
                        setSelectedDiscount(
                          product.discountpercentage?.[index]
                        );
                      }}
                      style={{
                        padding: "10px",
                        border:
                          selectedStorage?.name === storageName
                            ? "2px solid blue"
                            : "1px solid #ccc",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {storageName}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <hr />
            <div>
              <h4>About This</h4>
              <ul>
                <h6
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <li>
                    {" "}
                    Product Color : <span>{selectedColor?.name}</span>
                  </li>
                </h6>
                <hr
                  style={{
                    width: "50%",
                  }}
                />
                <h6
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <li>
                    Product Size : <span>{selectedStorage?.name}</span>
                  </li>
                </h6>
                <hr
                  style={{
                    width: "50%",
                  }}
                />
                <h6
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <li>
                    Product Brand : <span>{product.ProductBrand}</span>
                  </li>
                </h6>{" "}
                <hr
                  style={{
                    width: "50%",
                  }}
                />
              </ul>
            </div>
          </div>
        </div>

        <br />
        <hr />
        {/* product ExtraImage */}
        <div style={{ width: "100%", height: "100%" }}>
          {product.ExtraImage?.length > 0 ? (
            <div>
              {product.ExtraImage.map((img, index) => (
                <div key={index}>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/p_image/${img}`}
                    alt={`Extra ${index}`}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            []
          )}
        </div>
        <hr />
      </div>
      <Footer />
    </>
  );
};

export default SingleProductView;
