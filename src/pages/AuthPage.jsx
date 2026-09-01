import { useState, useEffect } from "react";
import { Mail, Lock, User, LogIn, Loader2, AlertCircle } from "lucide-react";
import { login, register, logout, onAuthChange, isFirebaseConfigured } from "../lib/firebase.js";

// ────────────────────────────────────────────────────────────
// AuthPage — email/password login & registration, backed by
// Firebase Authentication. Shows a friendly "not configured"
// state when Firebase env vars are missing.
// ────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const configured = useState(() => isFirebaseConfigured())[0];

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return unsub;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (err) {
      const msg = /not configured/.test(err.message)
        ? "Firebase not configured — set VITE_FIREBASE_API_KEY in .env.local."
        : err.message.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      setError(err.message);
    }
  };

  // Loading state
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
      </div>
    );
  }

  // Logged in
  if (user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-[16px] font-semibold text-gray-800">{user.displayName || "User"}</h2>
          <p className="text-[12.5px] text-gray-400 mt-0.5">{user.email}</p>
          <div className="mt-5 flex flex-col gap-2">
            <a
              href="/chat"
              className="h-9 rounded-lg bg-emerald-500 text-white text-[13px] font-semibold flex items-center justify-center hover:bg-emerald-600 transition-colors"
            >
              Open Chat
            </a>
            <button
              onClick={handleLogout}
              className="h-9 rounded-lg border border-gray-200 text-gray-500 text-[13px] font-medium hover:bg-gray-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not configured
  if (!configured) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-[16px] font-semibold text-gray-800 mb-1">Firebase not configured</h2>
          <p className="text-[12.5px] text-gray-400">
            Set <span className="font-mono text-gray-600">VITE_FIREBASE_API_KEY</span> and other
            Firebase keys in <span className="font-mono text-gray-600">.env.local</span>.
          </p>
          <a
            href="/"
            className="inline-block mt-4 h-9 px-4 rounded-lg bg-gray-800 text-white text-[13px] font-medium hover:bg-gray-900 transition-colors"
          >
            Back to home
          </a>
        </div>
      </div>
    );
  }

  // Login / Register form
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`flex-1 py-3 text-[13px] font-medium transition-colors ${
                mode === m
                  ? "text-emerald-600 border-b-2 border-emerald-500"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {m === "login" ? "Sign in" : "Register"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {mode === "register" && (
            <Field
              icon={<User className="w-4 h-4" />}
              placeholder="Display name"
              value={name}
              onChange={setName}
            />
          )}
          <Field
            icon={<Mail className="w-4 h-4" />}
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            required
          />
          <Field
            icon={<Lock className="w-4 h-4" />}
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            required
            minLength={6}
          />

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-[11.5px] text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full h-10 rounded-xl bg-emerald-500 text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ icon, type = "text", placeholder, value, onChange, required, minLength }) {
  return (
    <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-gray-50 border border-gray-100 focus-within:border-emerald-400/60 transition-colors">
      <span className="text-gray-400">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="flex-1 bg-transparent text-[13px] text-gray-700 placeholder:text-gray-400 outline-none"
      />
    </div>
  );
}
