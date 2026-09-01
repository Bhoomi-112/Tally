import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// ────────────────────────────────────────────────────────────
// i18n — English (en) + Hindi (hi) locales for the shared UI.
// Add more language objects to `resources` to extend.
// ────────────────────────────────────────────────────────────

const en = {
  nav: {
    dates: "Dates",
    wizard: "Wizard",
    chat: "Chat",
    census: "Census",
    privacy: "Privacy",
    data: "Data",
    search: "Search states, data…",
    searchShort: "Quick search",
    official: "Official Portal",
    role: "Switch role",
    roleCitizen: "Citizen View",
    rolePolicy: "Policy Maker",
    roleResearch: "Researcher",
    pinDistrict: "Pin District",
    pinMenu: "My Home District",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    verified: "National Census Registry — Verified Data Stream",
    verifiedLabel: "Verified Data Stream",
  },
  footer: {
    mark: "🗳️ Tally",
    text1: "An assistive layer for Census 2027 — ",
    text2: "not",
    text3: " affiliated with or endorsed by the Registrar General of India.",
    officialNote: " is the official portal.",
  },
  a11y: {
    skipToContent: "Skip to content",
  },
  home: {
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    tracking: "Tracking demographic shifts across Maharashtra & {{count}} States",
    active: "Active",
    modules: "Modules",
    kpiActive: "Active",
    kpiUpcoming: "Upcoming",
    kpiCompleted: "Completed",
    kpiStates: "States",
    privacyTitle: "🛡️ Privacy Guarantee",
    privacyText:
      "Tally is an assistive layer only. It never stores, transmits, or persists Aadhaar numbers, voter IDs, or any census responses. Identifiers you type are validated in-browser using a local checksum and immediately cleared from memory. The official RGI Census portal is the sole system of record.",
    moduleDates: "Census Dates",
    moduleDatesDesc: "State-wise Phase I & II schedule for all 36 states & UTs.",
    moduleWizard: "Enumeration Wizard",
    moduleWizardDesc: "Step-by-step guide through all official census questions.",
    moduleChat: "AI Explainer",
    moduleChatDesc:
      "RAG chatbot grounded in official PIB/RGI documents — no hallucinated facts.",
    modulePrivacy: "Privacy Guide",
    modulePrivacyDesc: "What's collected, what's protected, and how to spot scams.",
    moduleData: "Data Explorer",
    moduleDataDesc: "Visualize public 2011/2021 census data with natural language.",
    badgeLive: "Live",
    badgeSoon: "Soon",
  },
  search: {
    label: "Quick search",
    placeholder: "Search states, modules, data…",
    quickAccess: "Quick access",
    resultsFor: 'Results for "{{query}}"',
    noResults: "No results found",
    select: "Select",
    close: "Close",
    home: "Home",
    dashboard: "Dashboard Overview",
    allDates: "Census Dates — All States",
    wizardModule: "Enumeration Wizard",
  },
  comingSoon: {
    comingSoon: "This module is coming soon. The",
    and: "and",
    availableNow: "modules are available now.",
    viewDates: "📅 View Dates",
    tryWizard: "🧭 Try Wizard",
  },
  chat: {
    title: "Tally Chat",
    subtitle: "Census-grounded · RAG",
    model: "Gemini 3.6",
    welcome:
      "Hello, I'm Tally — your Census intelligence assistant. Ask me anything about India's population data (Census 2011).",
    placeholder: "Ask about population, literacy, sex ratio…",
    searching: "Tally is searching census data…",
    send: "Send",
    footnote: "Answers are grounded in Census 2011 data · PII-scan enabled",
    connectionError: "Connection error: {{msg}}",
    errorPrefix: "Error: ",
  },
  census: {
    title: "Census Data Explorer",
    subtitle: "Live pull from censusindia.gov.in with mock fallback",
    refresh: "Refresh",
    api: "API:",
    livePull: "Live pull enabled",
    fallback: "Fallback mode",
    nationalTitle: "National Overview — Census {{year}}",
    totalPopulation: "Total Population",
    males: "Males",
    females: "Females",
    sexRatio: "Sex Ratio",
    literacy: "Literacy Rate",
    stateTitle: "State-Level Data",
    colState: "State",
    colPopulation: "Population",
    colSexRatio: "Sex Ratio",
    colLiteracy: "Literacy",
    colCensus: "Census",
  },
  auth: {
    user: "User",
    openChat: "Open Chat",
    signOut: "Sign out",
    notConfiguredTitle: "Firebase not configured",
    notConfiguredText: "Set VITE_FIREBASE_API_KEY and other Firebase keys in .env.local.",
    backHome: "Back to home",
    signIn: "Sign in",
    register: "Register",
    displayName: "Display name",
    email: "Email",
    password: "Password",
    createAccount: "Create account",
  },
  language: {
    select: "Language",
    en: "English",
    hi: "हिन्दी",
  },
};

const hi = {
  nav: {
    dates: "तिथियाँ",
    wizard: "जादूगर",
    chat: "चैट",
    census: "जनगणना",
    privacy: "गोपनीयता",
    data: "डेटा",
    search: "राज्य, डेटा खोजें…",
    searchShort: "त्वरित खोज",
    official: "आधिकारिक पोर्टल",
    role: "भूमिका बदलें",
    roleCitizen: "नागरिक दृश्य",
    rolePolicy: "नीति निर्माता",
    roleResearch: "शोधकर्ता",
    pinDistrict: "जिला पिन करें",
    pinMenu: "मेरा गृह जिला",
    menuOpen: "मेनू खोलें",
    menuClose: "मेनू बंद करें",
    verified: "राष्ट्रीय जनगणना रजिस्ट्री — सत्यापित डेटा स्रोत",
    verifiedLabel: "सत्यापित डेटा स्रोत",
  },
  footer: {
    mark: "🗳️ टैली",
    text1: "जनगणना 2027 के लिए सहायक परत — ",
    text2: "संबद्ध नहीं",
    text3:
      " है और भारत के महापंजीयक द्वारा समर्थित नहीं है।",
    officialNote: " आधिकारिक पोर्टल है।",
  },
  home: {
    goodMorning: "सुप्रभात",
    goodAfternoon: "नमस्ते",
    goodEvening: "शुभ संध्या",
    tracking: "महाराष्ट्र और {{count}} राज्यों में जनसंख्या परिवर्तन की निगरानी",
    active: "सक्रिय",
    modules: "मॉड्यूल",
    kpiActive: "सक्रिय",
    kpiUpcoming: "आगामी",
    kpiCompleted: "पूर्ण",
    kpiStates: "राज्य",
    privacyTitle: "🛡️ गोपनीयता की गारंटी",
    privacyText:
      "टैली केवल एक सहायक परत है। यह आधार संख्या, मतदाता आईडी या कोई जनगणना प्रतिक्रिया कभी संग्रहीत, प्रसारित या स्थायी नहीं करता। आपके द्वारा टाइप किए गए पहचानकर्ताओं को ब्राउज़र में स्थानीय चेकसम के साथ सत्यापित किया जाता है और स्मृति से तुरंत साफ़ किया जाता है। आधिकारिक RGI जनगणना पोर्टल ही एकमात्र रिकॉर्ड प्रणाली है।",
    moduleDates: "जनगणना तिथियाँ",
    moduleDatesDesc: "सभी 36 राज्यों और केंद्रशासित प्रदेशों का चरण I और II कार्यक्रम।",
    moduleWizard: "गणना जादूगर",
    moduleWizardDesc: "सभी आधिकारिक जनगणना प्रश्नों के लिए चरण-दर-चरण मार्गदर्शिका।",
    moduleChat: "AI व्याख्याकार",
    moduleChatDesc: "आधिकारिक PIB/RGI दस्तावेज़ों पर आधारित RAG चैटबॉट।",
    modulePrivacy: "गोपनीयता मार्गदर्शिका",
    modulePrivacyDesc: "क्या एकत्र किया जाता है, क्या सुरक्षित है और घोटालों को कैसे पहचानें।",
    moduleData: "डेटा एक्सप्लोरर",
    moduleDataDesc: "प्राकृतिक भाषा के साथ सार्वजनिक 2011/2021 जनगणना डेटा देखें।",
    badgeLive: "लाइव",
    badgeSoon: "जल्द आ रहा है",
  },
  search: {
    label: "त्वरित खोज",
    placeholder: "राज्य, मॉड्यूल, डेटा खोजें…",
    quickAccess: "त्वरित पहुँच",
    resultsFor: 'परिणाम "{{query}}" के लिए',
    noResults: "कोई परिणाम नहीं मिला",
    select: "चुनें",
    close: "बंद करें",
    home: "होम",
    dashboard: "डैशबोर्ड अवलोकन",
    allDates: "जनगणना तिथियाँ — सभी राज्य",
    wizardModule: "गणना जादूगर",
  },
  comingSoon: {
    comingSoon: "यह मॉड्यूल जल्द आ रहा है।",
    and: "और",
    availableNow: "मॉड्यूल अभी उपलब्ध हैं।",
    viewDates: "📅 तिथियाँ देखें",
    tryWizard: "🧭 जादूगर आज़माएँ",
  },
  chat: {
    title: "टैली चैट",
    subtitle: "जनगणना-आधारित · RAG",
    model: "जेमिनी 3.6",
    welcome:
      "नमस्ते, मैं टैली हूँ — आपका जनगणना खुफिया सहायक। भारत की जनसंख्या डेटा (जनगणना 2011) के बारे में कुछ भी पूछें।",
    placeholder: "जनसंख्या, साक्षरता, लिंगानुपात… पूछें",
    searching: "टैली जनगणना डेटा खोज रहा है…",
    send: "भेजें",
    footnote: "उत्तर जनगणना 2011 डेटा पर आधारित हैं · PII-स्कैन सक्षम",
    connectionError: "कनेक्शन त्रुटि: {{msg}}",
    errorPrefix: "त्रुटि: ",
  },
  census: {
    title: "जनगणना डेटा एक्सप्लोरर",
    subtitle: "censusindia.gov.in से लाइव डेटा (मॉक फ़ॉलबैक के साथ)",
    refresh: "रीफ़्रेश",
    api: "API:",
    livePull: "लाइव डेटा सक्षम",
    fallback: "फ़ॉलबैक मोड",
    nationalTitle: "राष्ट्रीय अवलोकन — जनगणना {{year}}",
    totalPopulation: "कुल जनसंख्या",
    males: "पुरुष",
    females: "महिलाएँ",
    sexRatio: "लिंगानुपात",
    literacy: "साक्षरता दर",
    stateTitle: "राज्य-स्तरीय डेटा",
    colState: "राज्य",
    colPopulation: "जनसंख्या",
    colSexRatio: "लिंगानुपात",
    colLiteracy: "साक्षरता",
    colCensus: "जनगणना",
  },
  auth: {
    user: "उपयोगकर्ता",
    openChat: "चैट खोलें",
    signOut: "साइन आउट",
    notConfiguredTitle: "Firebase कॉन्फ़िगर नहीं है",
    notConfiguredText: ".env.local में VITE_FIREBASE_API_KEY और अन्य Firebase कुंजियाँ सेट करें।",
    backHome: "होम पर वापस",
    signIn: "साइन इन",
    register: "पंजीकरण",
    displayName: "प्रदर्शन नाम",
    email: "ईमेल",
    password: "पासवर्ड",
    createAccount: "खाता बनाएँ",
  },
  language: {
    select: "भाषा",
    en: "English",
    hi: "हिन्दी",
  },
};

function getInitialLang() {
  try {
    if (typeof localStorage !== "undefined" && localStorage.getItem) {
      return localStorage.getItem("tally-lang") || "en";
    }
  } catch {
    /* localStorage unavailable (SSR/tests) — fall through */
  }
  return "en";
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, hi: { translation: hi } },
  lng: getInitialLang(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnNull: false,
});

i18n.on("languageChanged", (lng) => {
  try {
    if (typeof localStorage !== "undefined" && localStorage.setItem) {
      localStorage.setItem("tally-lang", lng);
    }
  } catch {
    /* ignore — persistence is best-effort */
  }
  if (typeof document !== "undefined") document.documentElement.lang = lng;
});

export default i18n;