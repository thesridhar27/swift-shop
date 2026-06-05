import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Using an empty string because the Vite proxy intercepts relative endpoints smoothly
const baseQuery = fetchBaseQuery({ baseUrl: '' });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Order', 'Product'], // Cache tags for invalidation loops
  endpoints: (builder) => ({}),
});