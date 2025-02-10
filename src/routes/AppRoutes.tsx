import { Routes, Route } from "react-router";
import App from "../App";
import EstimateDashboard from "../pages/EstimateDashboard";
import EstimateRequestPage from "@/components/estimate/EstimateRequestPage";
import EditInvoice from "@/pages/EditInvoice";
import Layout from "@/components/auth/layout";
import Login from "@/components/auth/login";
import Signup from "@/components/auth/signup";
import LayoutPage from "@/pages/layout";
import Profile from "@/pages/profile";
import CreateEstimate from "@/components/estimate/CreateEstimate";
import EstimateView from "@/components/estimate/EstimateView";
import AdminCreateEstimate from "@/components/estimate/AdminCreateEstimate";
export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<LayoutPage />}>
        <Route path="/" element={<EstimateDashboard />} />
        <Route path="/estimate" element={<CreateEstimate />} />
        <Route path="/estimate/:estimateId" element={<EstimateView />} />
        <Route path="/admin/estimate" element={<AdminCreateEstimate />} />
        <Route path="/invoice" element={<App />} />
        <Route path="/request" element={<EstimateRequestPage />} />
        <Route path="/editinvoice" element={<EditInvoice />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};
