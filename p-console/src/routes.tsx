import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DemoPage from "./DemoPage";
import {
  AdminPortal,
  AstronautLogin,
  AstronautPortal,
  BackendLogin,
  TesterPortal,
} from "./Portals";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/a-login" replace />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/a-login" element={<AstronautLogin />} />
        <Route path="/b-login" element={<BackendLogin />} />
        <Route path="/Astronaut" element={<AstronautPortal />} />
        <Route path="/astronaut" element={<Navigate to="/Astronaut" replace />} />
        <Route path="/asutrnout" element={<Navigate to="/Astronaut" replace />} />
        <Route path="/dashboard" element={<Navigate to="/Astronaut#overview" replace />} />
        <Route path="/vitals" element={<Navigate to="/Astronaut#vitals" replace />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/tester" element={<TesterPortal />} />
        <Route path="*" element={<Navigate to="/a-login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
