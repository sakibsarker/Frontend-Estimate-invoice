import { Routes, Route } from "react-router";
import EstimateDashboard from "../pages/EstimateDashboard";
import ViewEstimateRequest from "@/components/estimate/ViewEstimateRequest";
import EditInvoice from "@/pages/EditInvoice";
import Layout from "@/components/auth/layout";
import Login from "@/components/auth/login";
import Signup from "@/components/auth/signup";
import LayoutPage from "@/pages/layout";
import Profile from "@/pages/profile";
import CreateEstimate from "@/components/estimate/CreateEstimate";
import AdminCreateEstimate from "@/components/estimate/AdminCreateEstimate";
import NewInvoiceForm from "@/components/forms/NewInvoiceForm";
import ManualInvoiceDashboard from "@/pages/ManualInvoiceDashboard";
import NewManualInvoiceForm from "@/components/forms/NewManualInvoiceFormcopy";
import EditManualInvoiceForm from "@/components/forms/EditManualInvoiceForm";
export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<LayoutPage />}>
        <Route path="/estimate" element={<EstimateDashboard />} />
        <Route path="/estimate/new" element={<CreateEstimate />} />
        <Route path="/admin/estimate" element={<AdminCreateEstimate />} />
        <Route
          path="/estimate/:estimateId/view"
          element={<ViewEstimateRequest />}
        />
        <Route
          path="/estimate/:estimateId/invoice/new"
          element={<NewInvoiceForm />}
        />

        <Route path="/invoice" element={<ManualInvoiceDashboard />} />
        <Route path="/invoice/:invoiceId" element={<EditManualInvoiceForm />} />
        <Route path="/invoice/new" element={<NewManualInvoiceForm />} />

        <Route path="/editinvoice" element={<EditInvoice />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};
