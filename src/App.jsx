import { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SearchModal from "./components/SearchModal.jsx";
import HomePage from "./pages/HomePage.jsx";
import DatesPage from "./modules/dates/DatesPage.jsx";
import WizardPage from "./modules/wizard/WizardPage.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import IntelPage from "./intel/IntelPage.jsx";
import StudioPage from "./studio/StudioPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CensusDataPage from "./pages/CensusDataPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const handleSearchOpen = useCallback(() => setSearchOpen(true), []);
  const handleSearchClose = useCallback(() => setSearchOpen(false), []);

  return (
    <BrowserRouter>
      {/* Dedicated full-chrome pages (own backgrounds/shells, no shared nav/footer) */}
      <Routes>
        <Route path="/intel" element={<IntelPage />} />
        <Route path="/viz" element={<IntelPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/census-data" element={<CensusDataPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar onSearchOpen={handleSearchOpen} />
        <SearchModal open={searchOpen} onClose={handleSearchClose} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dates" element={<DatesPage />} />
            <Route path="/wizard" element={<WizardPage />} />
            <Route path="/privacy" element={<ComingSoon title="Privacy Guide" icon="🔒" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <footer className="footer">
          <div className="container footer-inner">
            <span className="footer-mark">🗳️ Tally</span>
            <p className="footer-text">
              An assistive layer for Census 2027 — <strong>not</strong> affiliated with or endorsed
              by the Registrar General of India.{" "}
              <a
                href="https://censusindia.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-terracotta)", fontWeight: 600 }}
              >
                censusindia.gov.in
              </a>{" "}
              is the official portal.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
