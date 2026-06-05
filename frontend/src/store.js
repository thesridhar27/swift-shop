import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice.js';
import userReducer from './slices/userSlice.js';
// 🛒 1. Import your original cart reducer from your slices folder
import cartReducer from './slices/cartSlice.js'; 

const store = configureStore({
  reducer: {
    // 🔐 Synchronous authentication tracking state
    user: userReducer,
    
    // 🛒 2. Put your cart slice back into the state machine matrix
    cart: cartReducer,
    
    // 🌐 Asynchronous network cache manager logic
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;