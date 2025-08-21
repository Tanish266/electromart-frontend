import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Slice/cartSlice"; // Import the reducer

const store = configureStore({
  reducer: {
    cart: cartReducer, // Add the file slice to the store
  },
});

export default store;
