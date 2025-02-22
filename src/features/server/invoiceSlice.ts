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

interface Customer {
  id: number;
  customer_display_name: string;
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
  account_number: string;
}

interface TaxDetail {
  id: number;
  tax_name: string;
  tax_rate: string;
}

interface DiscountDetail {
  id: number;
  discount_name: string;
  discount_rate: string;
}

interface Item {
  id: number;
  type: string;
  item_name: string;
  description: string;
  price: string;
  created_at: string;
  updated_at: string;
}

interface InvoiceItems {
  id: number;
  item: Item;
  quantity: number;
  price: string;
  total: string;
  has_tax: boolean;
  has_discount: boolean;
  paid: boolean;
}

interface InvoicePreview {
  id: number;
  customerId: Customer;
  repair_request: number | null;
  discount: DiscountDetail;
  tax: TaxDetail;
  invoice_number: string;
  invoice_status: string;
  payment_method: string;
  sales_rep: string;
  po_number: string;
  message_on_invoice: string;
  attachments: string;
  subtotal: string;
  total: string;
  amount_due: string;
  created_at: string;
  updated_at: string;
  invoice_items_list: InvoiceItems[];
}

interface GetCustomer {
  id: number;
  customer_display_name: string;
  contact_first_name: string;
  contact_last_name: string;
  email_address: string;
  phone_number: string;
}

interface GetDiscount {
  id: number;
  discount_name: string;
  discount_rate: string;
}

interface GetTax {
  id: number;
  tax_name: string;
  tax_rate: string;
}

interface GetInvoiceItem {
  id: number;
  item: {
    id: number;
    type: string;
    item_name: string;
    description: string;
  };
  quantity: number;
  price: string;
  total: string;
  has_tax: boolean;
  has_discount: boolean;
  paid: boolean;
}

interface GetInvoice {
  id: number;
  customerId: GetCustomer;
  repair_request: number | null;
  discount: GetDiscount | null;
  tax: GetTax | null;
  invoice_number: string | null;
  invoice_status: string;
  payment_method: string;
  sales_rep: string | null;
  po_number: string | null;
  message_on_invoice: string | null;
  attachments: string | null;
  subtotal: string;
  total: string;
  amount_due: string;
  created_at: string;
  updated_at: string;
  invoice_items_list: GetInvoiceItem[];
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
  tagTypes: ["Invoice"],
  endpoints: (builder) => ({
    // Get all invoice
    // Update the getInvoice endpoint
    getInvoice: builder.query<
      PaginatedInvoiceResponse,
      {
        page?: number;
        invoice_status?: string;
        search?: string;
        start_date?: string;
        end_date?: string;
      }
    >({
      query: (params) => ({
        url: "estimate/newinvoices/new/",
        params: {
          page: params.page,
          status: params.invoice_status,
          search: params.search,
          start_date: params.start_date,
          end_date: params.end_date,
        },
      }),
      providesTags: ["Invoice"],
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
    getInvoiceById: builder.query<GetInvoice, number>({
      query: (id) => `estimate/invoices/${id}/`,
    }),
    // Get invoice Preview by ID
    getInvoicePreviwById: builder.query<InvoicePreview, number>({
      query: (id) => `estimate/invoices/detail/${id}/`,
    }),

    // Update invoice

    updateInvoice: builder.mutation<
      Invoice,
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/estimate/invoices/${id}/update/`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Invoice"], // Add this to refresh cache
    }),

    // Delete invoice
    deleteInvoice: builder.mutation<void, number>({
      query: (id) => ({
        url: `estimate/invoices/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoice"],
    }),
  }),
});

export const {
  useGetInvoiceQuery,
  useGetInvoiceByIdQuery,
  useGetInvoicePreviwByIdQuery,
  useGetInvoiceStatisticsQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoiceApi;
