import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import DatesPage from "./modules/dates/DatesPage.jsx";
import WizardPage from "./modules/wizard/WizardPage.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dates" element={<DatesPage />} />
            <Route path="/wizard" element={<WizardPage />} />
            <Route path="/chat" element={<ComingSoon title="AI Explainer" icon="💬" />} />
            <Route path="/privacy" element={<ComingSoon title="Privacy Guide" icon="🔒" />} />
            <Route path="/viz" element={<ComingSoon title="Data Explorer" icon="📊" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <footer className="footer">
          <div className="container">
            Tally is an assistive layer for Census 2027 — it is{" "}
            <strong>not</strong> affiliated with or endorsed by the Registrar General of India.{" "}
            <a href="https://censusindia.gov.in" target="_blank" rel="noopener noreferrer">
              censusindia.gov.in
            </a>{" "}
            is the official portal.
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
