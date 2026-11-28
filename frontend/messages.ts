export type Locale = "bn" | "en";
export const DEFAULT_LOCALE: Locale = "bn";
export const messages = {
  bn: { home: "হোম", alerts: "সতর্কবার্তা", map: "মানচিত্র", shelters: "আশ্রয়কেন্দ্র", flood: "বন্যা", drought: "খরা", coldWave: "শৈত্যপ্রবাহ", sos: "জরুরি সাহায্য", demo: "পরীক্ষামূলক তথ্য — বাস্তব সতর্কবার্তা নয়" },
  en: { home: "Home", alerts: "Alerts", map: "Map", shelters: "Shelters", flood: "Flood", drought: "Drought", coldWave: "Cold wave", sos: "Request assistance", demo: "Simulation — not a live warning" },
} as const;
