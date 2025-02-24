import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the interface for the repair request data
interface RepairRequest {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  repair_details: string;
  repair_status: "NEW" | "VIEWED" | "EXPIRED";
  previous_visits: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  vehicle_name: string;
  attachments: string;
  repair_date: string;
  sms_sent_3_days: boolean;
  sms_sent_7_days: boolean;
  invoice_total: string;
  created_at: string;
  updated_at: string;
  invoice_id: string;
}

interface RepairRequestbyId {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  repair_details: string;
  repair_status: "NEW" | "VIEWED" | "EXPIRED";
  previous_visits: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  vehicle_name: string;
  attachment_urls: string[];
  repair_date: string;
  sms_sent_3_days: boolean;
  sms_sent_7_days: boolean;
  invoice_total: string;
  created_at: string;
  updated_at: string;
  invoice_id: string;
}

interface QueryRepairRequest {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  repair_details: string;
  repair_status: "NEW" | "VIEWED" | "EXPIRED";
  previous_visits: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  vehicle_name: string;
  attachment_urls: string[];
  repair_date: string;
  sms_sent_3_days: boolean;
  sms_sent_7_days: boolean;
  created_at: string;
  updated_at: string;
  invoice_id: string | number;
  invoice_total: string | number;
}
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface RepairRequestStatistics {
  total_requests: number;
  total_new_requests: number;
  total_expired_requests: number;
  accepted_percentage: number;
}

export const repairRequestApi = createApi({
  reducerPath: "repairRequestApi",
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
  tagTypes: ["Repairrequests"],
  endpoints: (builder) => ({
    // POST - Create new repair request
    createRepairRequest: builder.mutation<RepairRequest, FormData>({
      query: (formData) => ({
        url: "estimate/repair-requests/create/new/",
        method: "POST",
        body: formData,
      }),
    }),
    // Get all estimate
    getRepiarRequst: builder.query<
      PaginatedResponse<QueryRepairRequest>,
      {
        page?: number;
        repair_status?: string;
        search?: string;
        start_date?: string;
        end_date?: string;
      }
    >({
      query: (params) => ({
        url: "estimate/repair-requests/",
        params: {
          page: params.page,
          repair_status: params.repair_status,
          search: params.search,
          start_date: params.start_date,
          end_date: params.end_date,
        },
      }),
      providesTags: ["Repairrequests"],
    }),

    // Get all estimate statistics
    getRepiarStatistics: builder.query<RepairRequestStatistics, void>({
      query: () => "estimate/repair-requests/statistics/",
    }),

    // GET - Fetch a single repair request by ID
    getRepairRequestByID: builder.query<RepairRequestbyId, number>({
      query: (id) => `estimate/repair-requests/${id}/`,
    }),

    // PATCH - Update a repair request
    updateRepairRequest: builder.mutation<RepairRequestbyId, RepairRequest>({
      query: (data) => ({
        url: `estimate/repair-requests/${data.id}/update/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // Delete repair request
    deleteRepairRequest: builder.mutation<void, number>({
      query: (id) => ({
        url: `estimate/repair-requests/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Repairrequests"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetRepiarRequstQuery,
  useGetRepiarStatisticsQuery,
  useCreateRepairRequestMutation,
  useGetRepairRequestByIDQuery,
  useUpdateRepairRequestMutation,
  useDeleteRepairRequestMutation,
} = repairRequestApi;
