import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the interface for the repair request data
interface Discount {
  id: number;
  discount_name: string;
  discount_rate: number;
}

export const discountApi = createApi({
  reducerPath: "discountApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // POST - Create new Discounts
    createDiscount: builder.mutation<Discount, FormData>({
      query: (formData) => ({
        url: "estimate/discounts/create/",
        method: "POST",
        body: formData,
      }),
    }),
    // Get all Discounts
    getDiscounts: builder.query<Discount[], void>({
      query: () => "estimate/discounts/",
    }),
    // GET - Fetch a single Discounts by ID
    getDiscountById: builder.query<Discount, number>({
      query: (id) => `estimate/discounts/${id}/`,
    }),

    // PATCH - Update a Discounts
    updateDiscounts: builder.mutation<Discount, Discount>({
      query: (data) => ({
        url: `estimate/discounts/${data.id}/update/`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateDiscountMutation,
  useGetDiscountsQuery,
  useGetDiscountByIdQuery,
  useUpdateDiscountsMutation,
} = discountApi;
