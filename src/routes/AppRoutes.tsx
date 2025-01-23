import { Routes, Route } from "react-router";
import App from "../App";
import EstimateDashboard from "../pages/EstimateDashboard";
import EstimateRequestPage from "@/components/estimate/EstimateRequestPage";
import EditInvoice from "@/pages/EditInvoice";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/estimate" element={<EstimateDashboard />} />
      <Route path="/request" element={<EstimateRequestPage />} />
      <Route path="/editinvoice" element={<EditInvoice />} />
    </Routes>
  );
};
