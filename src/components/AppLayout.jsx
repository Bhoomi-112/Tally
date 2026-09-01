import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar.jsx";
import SearchModal from "./SearchModal.jsx";

// ────────────────────────────────────────────────────────────
// AppLayout — shared chrome (Navbar + SearchModal + footer)
// wrapping all routed pages via <Outlet/>.
// ────────────────────────────────────────────────────────────

export default function AppLayout() {
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const handleSearchOpen = useCallback(() => setSearchOpen(true), []);
  const handleSearchClose = useCallback(() => setSearchOpen(false), []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar onSearchOpen={handleSearchOpen} />
      <SearchModal open={searchOpen} onClose={handleSearchClose} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </div>

      <footer className="footer">
        <div className="container footer-inner">
          <span className="footer-mark">{t("footer.mark")}</span>
          <p className="footer-text">
            {t("footer.text1")}
            <strong> {t("footer.text2")} </strong>
            {t("footer.text3")}{" "}
            <a
              href="https://censusindia.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-terracotta)", fontWeight: 600 }}
            >
              censusindia.gov.in
            </a>
            {t("footer.officialNote")}
          </p>
        </div>
      </footer>
    </div>
  );
}