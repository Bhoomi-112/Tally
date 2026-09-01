import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Loader2, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { chatWithTally } from "../lib/api.js";

// ────────────────────────────────────────────────────────────
// ChatPage — RAG-powered chatbot, grounded in Census data.
// Messages are PII-guarded on the server via lib/pii-guard.
// ────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: t("chat.welcome"),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);

    const history = messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    try {
      const res = await chatWithTally(q, history);
      const answer = res.ok
        ? res.answer
        : t("chat.errorPrefix") + (res.error || "unknown error");
      setMessages((m) => [...m, { role: "assistant", text: answer }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: t("chat.connectionError", { msg: err.message }) },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, t]);

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 flex flex-col h-[85vh]">
        {/* Header */}
        <header className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 shrink-0">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-[14px] font-semibold text-gray-800">{t("chat.title")}</h1>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t("chat.subtitle")}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1 text-[10px] text-gray-300 bg-gray-50 rounded-lg px-2 py-1">
            <Info className="w-3 h-3" />
            {t("chat.model")}
          </div>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          aria-live="polite"
          aria-label={t("chat.messages")}
          className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 text-white mt-0.5">
                  <Bot className="w-3 h-3" />
                </span>
              )}
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-emerald-500 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-700 rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
              {m.role === "user" && (
                <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-500 mt-0.5">
                  <User className="w-3 h-3" />
                </span>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-400 text-[12px]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {t("chat.searching")}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={t("chat.placeholder")}
              className="flex-1 h-10 px-4 rounded-xl bg-gray-100 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/30"
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label={t("chat.send")}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="mt-1.5 text-[10px] text-gray-300 text-center">{t("chat.footnote")}</p>
        </div>
      </div>
    </div>
  );
}
