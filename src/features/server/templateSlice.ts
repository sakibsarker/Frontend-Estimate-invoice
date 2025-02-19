import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the interface for the tempalte data

interface Template {
  id: string;
  name: string;
  selected_color: string;
  selected_layout: string;
  logo: string | null;
  is_default: boolean;

  customer_name: boolean;
  billing_address: boolean;
  shipping_address: boolean;
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
  endpoints: (builder) => ({
    // POST - Create new Template

    createTemplate: builder.mutation<Template, Omit<Template, "id">>({
      query: (templatePayload) => ({
        url: "estimate/invoice-template/create/",
        method: "POST",
        body: templatePayload,
      }),
    }),
    // Get all Template
    getTemplate: builder.query<Template[], void>({
      query: () => "estimate//invoice-template/",
    }),

    // GET - Fetch a single Template by ID
    getTemplateByID: builder.query<Template, number>({
      query: (id) => `estimate/invoice-template/${id}/`,
    }),

    // PATCH - Update a Template
    updateTemplate: builder.mutation<Template, Template>({
      query: (data) => ({
        url: `estimate/invoice-template/${data.id}/update/`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useGetTemplateByIDQuery,
  useLazyGetTemplateByIDQuery,
} = templateApi;
