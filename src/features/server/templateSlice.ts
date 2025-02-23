import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the interface for the tempalte data

interface Template {
  id: string | number;
  name: string;
  selected_layout: string;
  logo: string | null;

  customer_name: boolean;
  billing_address: boolean;

  phone: boolean;
  email: boolean;
  account_number: boolean;

  po_number: boolean;
  sales_rep: boolean;
  date: boolean;

  item_name: boolean;
  quantity: boolean;
  price: boolean;
  type: boolean;
  description: boolean;

  subtotal: boolean;
  tax: boolean;
  discount: boolean;
  due_amount: boolean;
}

export const templateApi = createApi({
  reducerPath: "templateApi",
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
  tagTypes: ["Templates"],
  endpoints: (builder) => ({
    // POST - Create new Template

    createTemplate: builder.mutation<Template, FormData>({
      query: (formData) => ({
        url: "estimate/invoice-template/create/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Templates"],
    }),
    // Get all Template
    getTemplate: builder.query<Template[], void>({
      query: () => "estimate/invoice-template/",
      providesTags: ["Templates"],
    }),

    // GET - Fetch a single Template by ID
    getTemplatesByID: builder.query<Template, number>({
      query: (id) => `estimate/invoice-template/${id}/`,
    }),

    // PATCH - Update a Template
    updateTemplate: builder.mutation<Template, FormData>({
      query: (formData) => {
        const id = formData.get("id");
        return {
          url: `estimate/invoice-template/${id}/update/`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Templates"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useGetTemplateQuery,
  useGetTemplatesByIDQuery,
} = templateApi;
