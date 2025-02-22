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
export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<LayoutPage />}>
        <Route path="/home" element={<App />} />
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
        {/* invoice create */}
        <Route path="/invoice" element={<ManualInvoiceDashboard />} />
        <Route
          path="/invoice/:invoiceId/edit"
          element={<EditManualInvoiceForm />}
        />
        <Route path="/invoice/new" element={<ManualInvoiceForm />} />
        {/* tempalte */}
        <Route path="/template" element={<Template />} />
        <Route path="/template/one" element={<TemplateOne />} />
        <Route path="/invoice/:invoiceId/send" element={<SendInvoice />} />
      </Route>
    </Routes>
  );
};
