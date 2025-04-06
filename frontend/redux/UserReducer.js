import { createSlice } from "@reduxjs/toolkit";

export const CartSlice = createSlice({
  name: "user",
  initialState: {
    cartCount: 0,
  },
  reducers: {
    updateCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
    addUser: (state, action) => {
      state.user = action.payload;
    },
    cleanUser: (state) => {
      state.user = null;
    },
    cleanCart: (state) => {
      state.cartCount = 0;
    },
  },
});

export const { addUser, cleanUser, cleanCart, updateCartCount } =
  CartSlice.actions;

export default CartSlice.reducer;
