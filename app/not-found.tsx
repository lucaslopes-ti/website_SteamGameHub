"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold mb-4 text-senai-orange">404</h1>
      <h2 className="text-3xl font-bold mb-4 text-white">{t("notFound.title")}</h2>
      <p className="text-gray-400 mb-8">
        {t("notFound.description")}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-senai-orange hover:bg-senai-blue text-slate-950 hover:text-white px-6 py-3 rounded font-semibold transition"
      >
        <Home className="w-5 h-5" />
        {t("notFound.backHome")}
      </Link>
    </div>
  );
}

