import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import DatesPage from "./modules/dates/DatesPage.jsx";
import WizardPage from "./modules/wizard/WizardPage.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";

// Immersive/standalone pages are code-split so they never block first paint.
const IntelPage = lazy(() => import("./intel/IntelPage.jsx"));
const StudioPage = lazy(() => import("./studio/StudioPage.jsx"));
const ChatPage = lazy(() => import("./pages/ChatPage.jsx"));
const CensusDataPage = lazy(() => import("./pages/CensusDataPage.jsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.jsx"));

function PageLoader() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className="navbar-logo-loading" aria-hidden="true">
        ⏳
      </span>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Immersive full-chrome pages (no shared nav/footer) */}
        <Route
          path="/intel"
          element={
            <Suspense fallback={<PageLoader />}>
              <IntelPage />
            </Suspense>
          }
        />
        <Route
          path="/viz"
          element={
            <Suspense fallback={<PageLoader />}>
              <IntelPage />
            </Suspense>
          }
        />
        <Route
          path="/studio"
          element={
            <Suspense fallback={<PageLoader />}>
              <StudioPage />
            </Suspense>
          }
        />

        {/* Pages under shared chrome (navbar + search + footer) */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dates" element={<DatesPage />} />
          <Route path="/wizard" element={<WizardPage />} />
          <Route path="/privacy" element={<ComingSoon title="Privacy Guide" icon="🔒" />} />
          <Route
            path="/chat"
            element={
              <Suspense fallback={<PageLoader />}>
                <ChatPage />
              </Suspense>
            }
          />
          <Route
            path="/census-data"
            element={
              <Suspense fallback={<PageLoader />}>
                <CensusDataPage />
              </Suspense>
            }
          />
          <Route
            path="/auth"
            element={
              <Suspense fallback={<PageLoader />}>
                <AuthPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}