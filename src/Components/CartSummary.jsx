import React from "react";

const CartSummary = ({ cartItems = [] }) => {
  if (!Array.isArray(cartItems)) {
    console.error("Invalid cartItems data:", cartItems);
    return <p>Invalid cart data</p>;
  }

  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const totalPrice = cartItems
    .reduce((sum, item) => {
      const price = Number(item.discountedPrice) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + price * qty;
    }, 0)
    .toFixed(2);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md summry">
      <h2 className="text-lg font-semibold">Cart Summary</h2>
      <p>Total Items: {totalItems}</p>
      <p>Total Price: ₹{totalPrice}</p>
    </div>
  );
};

export default CartSummary;
