import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Safe check initialization block reads raw session token assets out of localStorage
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Stores authenticated user details and local JSON web token strings
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // Flushes authorization storage clean to terminate active user runtime tracking
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;
export default userSlice.reducer;