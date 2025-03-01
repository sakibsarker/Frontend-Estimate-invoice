import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the interface for the repair request data
interface Item {
  id: number;
  type: "LABOR" | "PARTS" | "OTHER";
  item_name: string;
  description: string;
  price: number;
}

export const itemApi = createApi({
  reducerPath: "itemApi",
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
  tagTypes: ["Iteams"],
  endpoints: (builder) => ({
    // POST - Create new Items
    createItem: builder.mutation<Item, FormData>({
      query: (formData) => ({
        url: "estimate/new-item/create/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Iteams"], // Add this to refresh cache
    }),
    // Get all Items
    getItems: builder.query<Item[], void>({
      query: () => "estimate/new-item/",
      providesTags: ["Iteams"],
    }),
    // GET - Fetch a single Items by ID
    getItemById: builder.query<Item, number>({
      query: (id) => `estimate/new-item/create/${id}/`,
      providesTags: ["Iteams"],
    }),

    // PATCH - Update a Items
    updateItem: builder.mutation<Item, Item>({
      query: (data) => ({
        url: `estimate/new-item/create/${data.id}/update/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Iteams"], // Add this to refresh cache
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateItemMutation,
  useUpdateItemMutation,
  useGetItemsQuery,
  useGetItemByIdQuery,
} = itemApi;
