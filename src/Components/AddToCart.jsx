import React, { useState } from "react";
import Logo from "./../assets/logo.png";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RemovefromCart, plusQty, minusQty } from "../Redux/Slice/cartSlice";
import CartSummary from "./CartSummary";
import { Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import axios from "axios";

const AddToCart = () => {
  const cartData = useSelector((state) => state.cart.data || []);
  const dispatch = useDispatch();
  const [warnedItems, setWarnedItems] = useState({});

  const handleAddCart = async (item) => {
    if (item.quantity >= item.Unit) {
      if (!warnedItems[item.productId]) {
        alert("You've reached the max stock available.");
        setWarnedItems((prev) => ({ ...prev, [item.productId]: true }));
      }
      return;
    }

    // Update cart quantity in backend
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/update-quantity`, {
        userId: item.userId,
        productId: item.productId,
        variantColor: item.variantColor,
        variantSize: item.variantSize,
        quantity: item.quantity + 1,
      });

      dispatch(plusQty({ id: item.productId }));
    } catch (error) {
      console.error("Error updating cart quantity", error);
    }
  };

  const handleRemoveCart = async (item) => {
    if (item.quantity > 1) {
      // Update cart quantity in backend
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/update-quantity`, {
          userId: item.userId,
          productId: item.productId,
          variantColor: item.variantColor,
          variantSize: item.variantSize,
          quantity: item.quantity - 1,
        });

        dispatch(minusQty({ id: item.productId }));
      } catch (error) {
        console.error("Error updating cart quantity", error);
      }
    } else {
      dispatch(RemovefromCart({ id: item.productId }));
    }
  };

  const handleRemoveFromCart = async (item) => {
    // Ask for confirmation before removing the item
    const isConfirmed = window.confirm(
      "Are you sure want to remove this item from your cart?"
    );

    if (isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/remove`, {
          data: {
            userId: item.userId,
            productId: item.productId,
            variantColor: item.variantColor,
            variantSize: item.variantSize,
          },
        });

        dispatch(RemovefromCart({ id: item.productId }));
        alert("Item removed from cart.");
      } catch (error) {
        console.error("Error removing item from cart", error);
        alert("Failed to remove item from cart.");
      }
    } else {
      alert("Item removal canceled.");
    }
  };

  return (
    <div className="Full-cart">
      <center>
        <Link to="/">
          <img className="Logo" src={Logo} alt="Logo" />
        </Link>
        <h1>Your Cart</h1>
      </center>

      <div className="Cart-items">
        {cartData.length === 0 ? (
          <p style={{ textAlign: "center" }}>Your cart is empty.</p>
        ) : (
          cartData.map((item) => (
            <div key={item.productId} className="Cart-item">
              <img
                src={`${import.meta.env.VITE_API_URL}/p_image/${
                  item.mainImage
                }`}
                alt={item.productName}
                className="Items-content"
              />
              <div className="cart-text">
                <h4>{item.productName}</h4>
                <h5>
                  Variant: {item.variantColor || "-"} |{" "}
                  {item.variantSize || "-"}
                </h5>
                <h3>Final Price: ₹{item.discountedPrice}</h3>

                <center>
                  <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <Button
                      className="cart-button"
                      onClick={() => handleRemoveFromCart(item)}
                    >
                      Remove From Cart
                    </Button>
                  </div>

                  <div className="Add">
                    <Button
                      style={{ margin: "10px" }}
                      onClick={() => handleRemoveCart(item)}
                      disabled={item.quantity <= 1}
                    >
                      <MinusOutlined />
                    </Button>
                    <span style={{ margin: "15px" }}>{item.quantity}</span>
                    <Button
                      style={{ margin: "10px" }}
                      onClick={() => handleAddCart(item)}
                      disabled={item.quantity >= item.Unit}
                    >
                      <PlusOutlined />
                    </Button>
                  </div>
                </center>
              </div>
            </div>
          ))
        )}
      </div>

      {cartData.length > 0 && (
        <div>
          <h3>
            <CartSummary cartItems={cartData} />
          </h3>
          <h3 className="summry">
            <Link to="/Buy-Now" className="cart-button">
              Buy Now
            </Link>
          </h3>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
