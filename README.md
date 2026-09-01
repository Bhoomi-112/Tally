<div align="center">

# 🗳️ Tally

### A GenAI companion for India's Census 2027 — the first fully digital census

[![Live Demo](https://img.shields.io/badge/live%20demo-tally--nine--pi.vercel.app-FF6B00?style=for-the-badge)](https://tally-nine-pi.vercel.app/)
[![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Gemini](https://img.shields.io/badge/Gemini%20API-RAG-4285F4?style=flat-square&logo=googlegemini&logoColor=white)](https://aistudio.google.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vitest](https://img.shields.io/badge/tested%20with-Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev)

Built by **[Code](https://github.com/Bhoomi-112)** & **Shivansh Phadtare** for **#promptwarsxadypu**

</div>

---

## Why Tally exists

Census 2027 will be collected entirely online for the first time — 34 questions in Phase I (Houselisting, Apr–Sept 2026), 40 more in Phase II (Population Enumeration, Feb 2027), across 22+ languages, from a population where a meaningful share has never filled out a government form on a screen before.

**Tally doesn't replace the census. It sits beside it** — explaining what's being asked, when, and why, in plain language, before handing the user off to the *official* enumeration portal. It never collects, stores, or transmits an Aadhaar number, voter ID, or completed census answer. It's a translator between a government form and the people it's meant to count.

---

## ✨ What it does

| Route | What's there |
|---|---|
| 🏠 `/` | Home dashboard — live rollout stats (states active / upcoming / completed), map, and an insights panel |
| 📅 `/dates` | State-wise Phase I & Phase II enumeration windows, pulled from a structured dataset — not left to an LLM to recall |
| 🧭 `/wizard` | A guided walkthrough of the real 34 + 40 official questions, sourced from Census documentation, with a role-aware view (Citizen / Policy Maker / Researcher) |
| 💬 `/chat` | A RAG chatbot, grounded strictly in a census knowledge corpus via Gemini. It answers *only* from that corpus and points to `censusindia.gov.in` when it doesn't know — no improvised facts |
| 📊 `/census-data`, `/intel`, `/viz` | Geospatial + KPI dashboards for exploring public census data |
| 🔑 `/auth` | Firebase-authenticated accounts, for saving a language preference or a pinned home district |
| 🔒 `/privacy` | Privacy & misinformation guide — *in progress* |

---

## 🔐 Privacy & security, by design

This is the part that matters most given what's at stake:

- **Client-side PII detection** (`pii-guard.js`) — Aadhaar numbers (validated via the real Verhoeff checksum algorithm), Voter ID, Passport, and PAN patterns are detected *in the browser only*. Nothing is ever logged, transmitted, or persisted.
- **Grounded RAG, not open recall** — the chat system prompt restricts Gemini to the retrieved census corpus and instructs it to say "I don't know" rather than invent a figure.
- **Hardened API surface** — the Express backend runs behind `helmet` and per-route rate limiting (60 requests / IP / 15 min on the chat endpoint), with strict request-body validation.
- **No shadow census** — Tally never submits enumeration answers anywhere. Every real-data flow ends in a handoff to the official portal.

---

## 🛠️ Tech stack

**Frontend** — React 19 · Vite 8 · React Router 7 · Tailwind CSS 4 · Recharts · i18next (English + Hindi live, extensible)
**Backend** — Express 5 · Helmet · express-rate-limit
**AI** — Google Gemini API (`@google/generative-ai`) for retrieval-augmented generation
**Auth** — Firebase (client SDK + Admin SDK)
**Testing** — Vitest + Testing Library
**Code quality** — ESLint + Oxlint, Prettier

---

## 🚀 Getting started

```bash
# 1. Clone
git clone https://github.com/Bhoomi-112/Tally.git
cd Tally

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# then fill in:
#   VITE_GEMINI_API_KEY        — free key from https://aistudio.google.com
#   VITE_FIREBASE_*             — from Firebase console → Project settings

# 4. Run frontend + API together
npm run dev:all
```

| Script | What it does |
|---|---|
| `npm run dev` | Frontend only (Vite) |
| `npm run dev:server` | Backend only (Express) |
| `npm run dev:all` | Both, concurrently |
| `npm run build` | Production build |
| `npm test` | Run the Vitest suite |
| `npm run lint` | ESLint + Oxlint |
| `npm run format` | Prettier write |

---

## ♿ Accessibility

Semantic markup, keyboard-navigable flows, and color choices checked against contrast requirements throughout — because the target user for a *digital-first* census is disproportionately someone for whom digital interfaces are least native. An accessible UI here isn't a checkbox, it's the actual problem statement.

---

## 🗺️ Roadmap

- [ ] Ship the `/privacy` misinformation & privacy-explainer guide (currently a placeholder)
- [ ] Extend `i18next` locales beyond English/Hindi toward the 22 scheduled languages
- [ ] Move the RAG corpus from template retrieval to a proper vector store as the knowledge base grows
- [ ] Voice interface (speech-to-text / text-to-speech) for low-literacy users

---

<div align="center">

**[Live demo →](https://tally-nine-pi.vercel.app/)**

Made for #promptwarsxadypu

</div>
