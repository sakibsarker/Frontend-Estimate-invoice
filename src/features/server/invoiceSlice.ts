import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface InvoiceItem {
  id: number;
  item: number;
  item_name: string;
  quantity: number;
  price: string;
  total: string;
  has_tax: boolean;
  has_discount: boolean;
  paid: boolean;
}

interface Invoice {
  id: number;
  customerId: number;
  repair_request: number | null;
  discount: number;
  tax: number;
  invoice_number: string;
  invoice_status:
    | "DRAFT"
    | "SENT"
    | "PAID"
    | "UNPAID"
    | "OVERDUE"
    | "CANCELLED";
  payment_method: "CASH" | "CREDIT_CARD" | "ONLINE";
  sales_rep: string;
  po_number: string;
  message_on_invoice: string;
  attachments: string | null;
  subtotal: string;
  total: string;
  amount_due: string;
  created_at: string;
  updated_at: string;
  invoice_items: InvoiceItem[];
}

// Update the API response type if needed
export interface InvoiceResponse {
  data: Invoice;
  // ... other response fields
}

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
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
    getCustomers: builder.query<Invoice[], void>({
      query: () => "estimate/customers/",
    }),

    // Get single customer by ID
    getCustomerById: builder.query<Invoice, number>({
      query: (id) => `estimate/customers/${id}/`,
    }),

    // Create new customer
    createCustomer: builder.mutation<Invoice, Omit<Invoice, "id">>({
      query: (newInvoice) => ({
        url: "estimate/newinvoices/create/",
        method: "POST",
        body: newInvoice,
      }),
    }),

    // Update customer
    updateCustomer: builder.mutation<
      Invoice,
      Partial<Invoice> & { id: number }
    >({
      query: ({ id, ...patch }) => ({
        url: `/estimate/customers/${id}/update/`,
        method: "PUT",
        body: patch,
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
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = invoiceApi;
