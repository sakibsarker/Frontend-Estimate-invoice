import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the interface for the repair request data
interface Tax {
  id: number;
  tax_name: string;
  tax_rate: number;
}

export const taxApi = createApi({
  reducerPath: "taxApi",
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
    // POST - Create new tax
    createTax: builder.mutation<Tax, FormData>({
      query: (formData) => ({
        url: "estimate/taxes/create/",
        method: "POST",
        body: formData,
      }),
    }),
    // Get all tax
    getTaxs: builder.query<Tax[], void>({
      query: () => "estimate/taxes/",
    }),
    // GET - Fetch a single tax by ID
    getTaxById: builder.query<Tax, number>({
      query: (id) => `estimate/taxes/${id}/`,
    }),

    // PATCH - Update a tax
    updateTax: builder.mutation<Tax, Tax>({
      query: (data) => ({
        url: `estimate/taxes/${data.id}/update/`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateTaxMutation,
  useGetTaxsQuery,
  useGetTaxByIdQuery,
  useUpdateTaxMutation,
} = taxApi;
