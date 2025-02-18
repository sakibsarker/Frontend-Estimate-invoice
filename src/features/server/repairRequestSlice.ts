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
  estimate_attachments: string;
  repair_date: string;
  sms_sent_3_days: boolean;
  sms_sent_7_days: boolean;
  created_at: string;
  updated_at: string;
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
  endpoints: (builder) => ({
    // POST - Create new repair request
    createRepairRequest: builder.mutation<RepairRequest, FormData>({
      query: (formData) => ({
        url: "estimate/repair-requests/create/",
        method: "POST",
        body: formData,
      }),
    }),
    // GET - Fetch a single repair request by ID
    getRepairRequestByID: builder.query<RepairRequest, number>({
      query: (id) => `estimate/repair-requests/${id}/`,
    }),

    // PATCH - Update a repair request
    updateRepairRequest: builder.mutation<RepairRequest, RepairRequest>({
      query: (data) => ({
        url: `estimate/repair-requests/${data.id}/update/`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateRepairRequestMutation,
  useGetRepairRequestByIDQuery,
  useUpdateRepairRequestMutation,
} = repairRequestApi;
