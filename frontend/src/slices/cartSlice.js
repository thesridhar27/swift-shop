import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: localStorage.getItem('paymentMethod')
    ? JSON.parse(localStorage.getItem('paymentMethod'))
    : 'PayPal',
};

// Internal utility to sync updates to the database
const syncCartToDatabase = async (cartItems) => {
  try {
    const userInfo = localStorage.getItem('userInfo') 
      ? JSON.parse(localStorage.getItem('userInfo')) 
      : null;

    if (userInfo && userInfo.token) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put('http://localhost:5000/api/cart', { cartItems }, config);
    }
  } catch (error) {
    console.error('Failed to sync cart updates with MongoDB:', error.message);
  }
};

// 🔥 Async thunk to automatically fetch product details from the backend
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ _id, qty }, { getState }) => {
    // Fetch product details directly from your backend server endpoint
    const { data } = await axios.get(`http://localhost:5000/api/products/${_id}`);
    
    const itemPayload = {
      _id: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    };

    // Save to localStorage
    const currentCartItems = getState().cart.cartItems;
    const existItem = currentCartItems.find((x) => x._id === itemPayload._id);
    
    let updatedCartItems;
    if (existItem) {
      updatedCartItems = currentCartItems.map((x) =>
        x._id === existItem._id ? itemPayload : x
      );
    } else {
      updatedCartItems = [...currentCartItems, itemPayload];
    }
    
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    await syncCartToDatabase(updatedCartItems);

    return itemPayload;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Standard synchronous remove action
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      syncCartToDatabase(state.cartItems);
    },
    setCartFromDatabase: (state, action) => {
      state.cartItems = action.payload || [];
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
    },
    // 🧹 NEW ACTIONS: Complete state flush on user sign-out/profile transition
    clearCartState: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = 'PayPal';
      
      // Clear out all residual storage values completely
      localStorage.removeItem('cartItems');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.fulfilled, (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
    });
  },
});

export const { 
  removeFromCart, 
  setCartFromDatabase, 
  clearCartItems, 
  saveShippingAddress,
  savePaymentMethod,
  clearCartState // 👈 Exporting the clear action tracker tool
} = cartSlice.actions;

export const fetchUserCart = () => async (dispatch) => {
  try {
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
    if (userInfo && userInfo.token) {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/cart', config);
      dispatch(setCartFromDatabase(data));
    }
  } catch (error) {
    console.error('Failed to pull saved cart data:', error.message);
  }
};

export default cartSlice.reducer;