import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    data: loadCartFromStorage(),
  },

  reducers: {
    AddfromCart: (state, action) => {
      const item = state.data.find(
        (x) =>
          x.productId === action.payload.productId &&
          x.variantColor === action.payload.variantColor &&
          x.variantSize === action.payload.variantSize
      );
      if (!item) {
        state.data.push(action.payload);
        saveCartToStorage(state.data);
      }
    },

    RemovefromCart: (state, action) => {
      state.data = state.data.filter(
        (item) => item.productId !== action.payload.id
      );
      saveCartToStorage(state.data);
    },

    plusQty: (state, action) => {
      const item = state.data.find(
        (item) => item.productId === action.payload.id
      );
      if (item) {
        item.quantity += 1;
        saveCartToStorage(state.data);
      }
    },

    minusQty: (state, action) => {
      const item = state.data.find(
        (item) => item.productId === action.payload.id
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.data = state.data.filter(
            (item) => item.productId !== action.payload.id
          );
        }
        saveCartToStorage(state.data);
      }
    },
    clearCart: (state) => {
      state.data = [];
      saveCartToStorage(state.data);
    },
  },
});

export const { AddfromCart, RemovefromCart, minusQty, plusQty, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
