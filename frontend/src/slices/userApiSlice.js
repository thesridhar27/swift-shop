import { apiSlice } from './apiSlice.js';

const USERS_URL = '/api/users';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🚪 Standard Email & Password Login Mutation Endpoint
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    
    // 📝 Standard Account Registration Mutation Endpoint
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),

    // 📱 Firebase OTP / Phone Authentication Mutation Endpoint
    phoneLogin: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/phone-login`,
        method: 'POST',
        body: data,
      }),
    }),

    // 👤 Profile Meta Updates Mutation Endpoint
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

// Export auto-generated React Hooks hooks for component consumption
export const {
  useLoginMutation,
  useRegisterMutation,
  usePhoneLoginMutation,
  useUpdateUserMutation,
} = userApiSlice;