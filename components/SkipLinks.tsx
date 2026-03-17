"use client";

import { useI18n } from "./I18nProvider";

export default function SkipLinks() {
  const { t } = useI18n();

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t("skip.main")}
      </a>
      <a href="#navigation" className="skip-link">
        {t("skip.nav")}
      </a>
      <a href="#footer" className="skip-link">
        {t("skip.footer")}
      </a>
    </>
  );
}
