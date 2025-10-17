import React from "react";

const CartSummary = ({ cartItems = [] }) => {
  if (!Array.isArray(cartItems)) {
    console.error("Invalid cartItems data:", cartItems);
    return <p>Invalid cart data</p>;
  }

  // 🟢 Calculate totals
  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return sum + price * qty;
  }, 0);

  const discount = cartItems.reduce((sum, item) => {
    if (item.discountedPrice) {
      return (
        sum +
        (Number(item.price) - Number(item.discountedPrice)) *
          (item.quantity || 0)
      );
    }
    return sum;
  }, 0);

  const tax = subtotal * 0.018; // 1.8% GST example
  const total = subtotal - discount + tax;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md summry">
      <h2 className="text-lg font-semibold">Cart Summary</h2>
      <p>🛒 Items: {totalItems}</p>
      <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
      <p>Discount: -₹{discount.toFixed(2)}</p>
      <p>Tax (1.8%): ₹{tax.toFixed(2)}</p>
      <hr />
      <h3 className="text-xl font-bold text-green-600">
        Final Total: ₹{total.toFixed(2)}
      </h3>
    </div>
  );
};

export default CartSummary;
