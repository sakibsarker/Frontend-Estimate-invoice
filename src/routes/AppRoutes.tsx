import { Routes, Route } from "react-router";
import App from "../App";
import Estimate from "../pages/Estimate";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/estimate" element={<Estimate />} />
    </Routes>
  );
};
