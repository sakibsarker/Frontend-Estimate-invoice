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

interface PaginatedInvoiceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Invoice[];
}

// Add this interface
interface InvoiceStatistics {
  total_invoices: number;
  total_paid: number;
  total_unpaid: number;
  total_pending: number;
  total_draft: number;
  total_amount: number;
  total_subtotal: number;
  total_amount_due: number;
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
    // Get all invoice
    // Update the getInvoice endpoint
    getInvoice: builder.query<
      PaginatedInvoiceResponse,
      {
        page?: number;
        invoice_status?: string;
        search?: string;
      }
    >({
      query: (params) => ({
        url: "estimate/newinvoices/new/",
        params: {
          page: params.page,
          status: params.invoice_status,
          search: params.search,
        },
      }),
    }),
    // Create new invoice
    createInvoice: builder.mutation<Invoice, FormData>({
      query: (formData) => ({
        url: "estimate/newinvoices/create/",
        method: "POST",
        body: formData,
      }),
    }),
    // Get all statistics
    getInvoiceStatistics: builder.query<InvoiceStatistics, void>({
      query: () => "estimate/invoice-statistics/",
    }),

    // Get single invoice by ID
    getInvoiceById: builder.query<Invoice, number>({
      query: (id) => `estimate/newinvoices/${id}/`,
    }),

    // Update invoice
    updateInvoice: builder.mutation<Invoice, Partial<Invoice> & { id: number }>(
      {
        query: ({ id, ...patch }) => ({
          url: `/estimate/newinvoices/${id}/update/`,
          method: "PUT",
          body: patch,
        }),
      }
    ),

    // Delete customer
    deleteInvoice: builder.mutation<void, number>({
      query: (id) => ({
        url: `estimate/newinvoices/${id}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetInvoiceQuery,
  useGetInvoiceByIdQuery,
  useGetInvoiceStatisticsQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoiceApi;
