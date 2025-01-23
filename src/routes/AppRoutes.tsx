import { Routes, Route } from "react-router";
import App from "../App";
import EstimateDashboard from "../pages/EstimateDashboard";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/estimate" element={<EstimateDashboard />} />
    </Routes>
  );
};
