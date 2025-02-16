import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Customer {
  id: number;
  customer_display_name: string;
  company_name: string;
  contact_first_name: string;
  contact_last_name: string;
  email_address: string;
  phone_number: string;
  billing_country: string;
  billing_address_line1: string;
  billing_address_line2?: string;
  billing_city: string;
  billing_state: string;
  billing_zip_code: string;
  shipping_country: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip_code: string;
  notes?: string;
  account_number: string;
  company_type: string;
  payment_terms: string;
}

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get all customers
    getCustomers: builder.query<Customer[], void>({
      query: () => "estimate/customers/",
    }),

    // Get single customer by ID
    getCustomer: builder.query<Customer, number>({
      query: (id) => `estimate/customers/${id}/`,
    }),

    // Create new customer
    createCustomer: builder.mutation<Customer, Omit<Customer, "id">>({
      query: (newCustomer) => ({
        url: "estimate/customers/",
        method: "POST",
        body: newCustomer,
      }),
    }),

    // Update customer
    updateCustomer: builder.mutation<Customer, Customer>({
      query: (data) => ({
        url: `estimate/customers/${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    // Delete customer
    deleteCustomer: builder.mutation<void, number>({
      query: (id) => ({
        url: `estimate/customers/${id}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
