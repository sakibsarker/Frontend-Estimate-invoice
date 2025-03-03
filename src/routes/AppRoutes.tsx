import { Routes, Route } from "react-router";
import EstimateDashboard from "../pages/EstimateDashboard";
import ViewEstimateRequest from "@/components/estimate/ViewEstimateRequest";
import Template from "@/pages/Template";
import Layout from "@/components/auth/layout";
import Login from "@/components/auth/login";
import Signup from "@/components/auth/signup";
import LayoutPage from "@/pages/layout";
import App from "@/App";
import CreateEstimate from "@/components/estimate/CreateEstimate";
import AdminCreateEstimate from "@/components/estimate/AdminCreateEstimate";
import NewInvoiceForm from "@/components/forms/NewInvoiceForm";
import ManualInvoiceDashboard from "@/pages/ManualInvoiceDashboard";
import EditManualInvoiceForm from "@/components/forms/EditManualInvoiceForm";
import ManualInvoiceForm from "@/components/forms/ManualInvoiceForm";
import TemplateOne from "@/components/InvoiceTemplate/TemplateOne";
import SendInvoice from "@/components/sendInvoice/sendinvoice";
import SendEstimate from "@/components/sendEstimate/sendEstimate";
import EditEstimateInvoiceForm from "@/components/forms/EditEstimateInvoiceForm";
export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/estimate/new" element={<CreateEstimate />} />
      </Route>

      <Route element={<LayoutPage />}>
        <Route path="/" element={<App />} />

        <Route path="/estimate" element={<EstimateDashboard />} />

        <Route path="/admin/estimate" element={<AdminCreateEstimate />} />
        <Route
          path="/estimate/:estimateId/view"
          element={<ViewEstimateRequest />}
        />
        <Route
          path="/estimate/:estimateId/invoice/new"
          element={<NewInvoiceForm />}
        />
        {/* invoice create */}
        <Route path="/invoice" element={<ManualInvoiceDashboard />} />
        {/* invoice edit */}
        <Route
          path="/invoice/:invoiceId/edit"
          element={<EditManualInvoiceForm />}
        />
        {/* estimate edit */}
        <Route
          path="/estimate/:invoiceId/edit"
          element={<EditEstimateInvoiceForm />}
        />
        <Route path="/invoice/new" element={<ManualInvoiceForm />} />
        {/* tempalte */}
        <Route path="/template" element={<Template />} />
        <Route path="/template/one" element={<TemplateOne />} />
        {/* invoice */}
        <Route path="/invoice/:invoiceId/send" element={<SendInvoice />} />
        {/* estimate */}
        <Route path="/estimate/:invoiceId/send" element={<SendEstimate />} />
      </Route>
    </Routes>
  );
};
