"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { Language, htmlLangMap, languageLabels, translations } from "@/lib/i18n";

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  languageLabels: Record<Language, string>;
}

const resolveTemplate = (key: string) => translations.pt[key] ?? key;

const I18nContext = createContext<I18nContextValue>({
  language: "pt",
  setLanguage: () => {},
  t: (key: string) => key,
  languageLabels,
});

export function I18nProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const language: Language = "pt";

  useEffect(() => {
    document.documentElement.lang = htmlLangMap[language];
  }, [language]);

  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage: () => {},
    t: (key: string, params?: Record<string, string | number>) => {
      const template = resolveTemplate(key);
      if (!params) return template;

      return Object.entries(params).reduce((acc, [paramKey, value]) => {
        return acc.replaceAll(`{${paramKey}}`, String(value));
      }, template);
    },
    languageLabels,
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
