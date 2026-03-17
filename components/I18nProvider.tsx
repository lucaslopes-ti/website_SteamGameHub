"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Language, htmlLangMap, languageLabels, translations } from "@/lib/i18n";

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  languageLabels: Record<Language, string>;
}

const STORAGE_KEY = "site-language";

const I18nContext = createContext<I18nContextValue>({
  language: "pt",
  setLanguage: () => {},
  t: (key: string) => key,
  languageLabels,
});

export function I18nProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [language, setLanguage] = useState<Language>("pt");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && stored in translations) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = htmlLangMap[language];
  }, [language]);

  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage,
    t: (key: string) => {
      return translations[language][key] ?? translations.pt[key] ?? key;
    },
    languageLabels,
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
