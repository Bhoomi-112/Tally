import { useState, useEffect } from "react";
import { RefreshCw, CheckCircle2, AlertCircle, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchNationalCensus, fetchStatesCensus, fetchCensusStatus } from "../lib/api.js";

// ────────────────────────────────────────────────────────────
// CensusDataPage — pulls live or fallback Census data from the
// backend and displays national + state summaries.
// ────────────────────────────────────────────────────────────
export default function CensusDataPage() {
  const { t } = useTranslation();
  const [national, setNational] = useState(null);
  const [states, setStates] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = (force = false) => {
    setLoading(true);
    setError(null);
    Promise.all([fetchNationalCensus(force), fetchStatesCensus(force), fetchCensusStatus()])
      .then(([nRes, sRes, stRes]) => {
        if (nRes.ok) setNational(nRes.data);
        if (sRes.ok) setStates(sRes.data);
        if (stRes.ok) setStatus(stRes);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchNationalCensus(false), fetchStatesCensus(false), fetchCensusStatus()])
      .then(([nRes, sRes, stRes]) => {
        if (cancelled) return;
        if (nRes.ok) setNational(nRes.data);
        if (sRes.ok) setStates(sRes.data);
        if (stRes.ok) setStatus(stRes);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-800">{t("census.title")}</h1>
            <p className="text-[12.5px] text-gray-400 mt-0.5">{t("census.subtitle")}</p>
          </div>
          <button
            onClick={() => load(true)}
            disabled={loading}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-500 text-white text-[12px] font-semibold hover:bg-emerald-600 disabled:opacity-40 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {t("census.refresh")}
          </button>
        </div>

        {/* Status strip */}
        {status && (
          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-[11px] text-gray-500">
              {t("census.api")} <span className="font-mono text-gray-700">{status.endpoint}</span>
            </span>
            <span
              className={`flex items-center gap-1 text-[11px] ${status.liveEnabled ? "text-emerald-600" : "text-gray-400"}`}
            >
              {status.liveEnabled ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <AlertCircle className="w-3 h-3" />
              )}
              {status.liveEnabled ? t("census.livePull") : t("census.fallback")}
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-[12px] text-red-600">
            {error}
          </div>
        )}

        {/* National summary */}
        {national && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-[15px] font-semibold text-gray-800 mb-3">
              {t("census.nationalTitle", { year: national.censusYear })}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard
                label={t("census.totalPopulation")}
                value={national.totalPopulation?.toLocaleString("en-IN")}
              />
              <StatCard label={t("census.males")} value={national.males?.toLocaleString("en-IN")} />
              <StatCard
                label={t("census.females")}
                value={national.females?.toLocaleString("en-IN")}
              />
              <StatCard label={t("census.sexRatio")} value={`${national.sexRatio} / 1000`} />
              <StatCard label={t("census.literacy")} value={`${national.literacyRate}%`} />
            </div>
          </section>
        )}

        {/* States table */}
        {states.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="text-[15px] font-semibold text-gray-800">{t("census.stateTitle")}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-[11px] font-semibold uppercase tracking-wide">
                    <th className="px-4 py-2.5">{t("census.colState")}</th>
                    <th className="px-4 py-2.5 text-right">{t("census.colPopulation")}</th>
                    <th className="px-4 py-2.5 text-right">{t("census.colSexRatio")}</th>
                    <th className="px-4 py-2.5 text-right">{t("census.colLiteracy")}</th>
                    <th className="px-4 py-2.5 text-right">{t("census.colCensus")}</th>
                  </tr>
                </thead>
                <tbody>
                  {states.map((s) => (
                    <tr key={s.name} className="border-t border-gray-100 hover:bg-gray-50/60">
                      <td className="px-4 py-2.5 text-[13px] font-medium text-gray-700">
                        {s.name}
                      </td>
                      <td className="px-4 py-2.5 text-[12.5px] text-gray-600 text-right font-mono">
                        {s.population?.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2.5 text-[12.5px] text-gray-600 text-right">
                        {s.sexRatio}
                      </td>
                      <td className="px-4 py-2.5 text-[12.5px] text-gray-600 text-right">
                        {s.literacy}%
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-gray-400 text-right">
                        {s.censusYear}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-[16px] font-bold text-gray-800 font-mono">{value || "—"}</div>
    </div>
  );
}
