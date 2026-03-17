"use client";

import { Globe } from "lucide-react";
import { Language } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";

interface LanguageSelectorProps {
  compact?: boolean;
}

export default function LanguageSelector({ compact = false }: Readonly<LanguageSelectorProps>) {
  const { language, setLanguage, t, languageLabels } = useI18n();

  return (
    <label
      className={`flex items-center gap-2 ${compact ? "text-xs" : "text-sm"} text-gray-300`}
      aria-label={t("language.label")}
    >
      <Globe className="w-4 h-4 text-steam-blueLight" aria-hidden="true" />
      {!compact && <span className="hidden xl:inline">{t("language.label")}</span>}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-steam-dark/80 border border-steam-blue/50 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-steam-blueLight"
        aria-label={t("language.label")}
      >
        {Object.entries(languageLabels).map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
