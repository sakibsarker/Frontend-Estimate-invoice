import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Customer {
  id: number;
  company_name: string;
  contact_first_name: string;
  contact_last_name: string;
  email_address: string;
  phone_number: string;
  billing_country: string;
  billing_address_line1: string;
  billing_address_line2: string;
  billing_city: string;
  billing_state: string;
  billing_zip_code: string;
  notes: string;
  account_number: string;
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
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    // Get all customers
    getCustomers: builder.query<Customer[], void>({
      query: () => "estimate/customers/",
      providesTags: ["Customer"],
    }),

    // Get single customer by ID
    getCustomerById: builder.query<Customer, number>({
      query: (id) => `estimate/customers/${id}/`,
      providesTags: ["Customer"],
    }),

    // Create new customer
    createCustomer: builder.mutation<Customer, Omit<Customer, "id">>({
      query: (newCustomer) => ({
        url: "estimate/customers/create/",
        method: "POST",
        body: newCustomer,
      }),
      invalidatesTags: ["Customer"], // Add this to refresh cache
    }),

    // Update customer
    updateCustomer: builder.mutation<
      Customer,
      Partial<Customer> & { id: number }
    >({
      query: ({ id, ...patch }) => ({
        url: `/estimate/customers/${id}/update/`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Customer"], // Add this to refresh cache
    }),

    // Delete customer
    deleteCustomer: builder.mutation<void, number>({
      query: (id) => ({
        url: `estimate/customers/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"], // Add this to refresh cache
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
