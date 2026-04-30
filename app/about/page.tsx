"use client";

import { Info, Users, Target, Award } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-gradient-orange">
        {t("aboutPage.title")}
      </h1>

      <div className="space-y-8">
        <div className="rounded-2xl border border-senai-blue/50 bg-senai-blueDark/80 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="mt-1 inline-flex items-center justify-center rounded-2xl p-3 bg-gradient-to-br from-senai-orange/35 via-senai-orange/10 to-transparent ring-1 ring-senai-orange/40 shadow-[0_12px_30px_rgba(243,112,33,0.25)]">
              <Info className="w-6 h-6 text-senai-orange" strokeWidth={2.1} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">
                {t("aboutPage.whatIsTitle")}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {t("aboutPage.whatIsText")}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-senai-blue/50 bg-senai-blueDark/80 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="mt-1 inline-flex items-center justify-center rounded-2xl p-3 bg-gradient-to-br from-senai-blueLight/35 via-senai-blueLight/10 to-transparent ring-1 ring-senai-blueLight/40 shadow-[0_12px_30px_rgba(0,165,226,0.25)]">
              <Target className="w-6 h-6 text-senai-blueLight" strokeWidth={2.1} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">{t("aboutPage.objectivesTitle")}</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>{t("aboutPage.objective1")}</li>
                <li>{t("aboutPage.objective2")}</li>
                <li>{t("aboutPage.objective3")}</li>
                <li>{t("aboutPage.objective4")}</li>
                <li>{t("aboutPage.objective5")}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-senai-blue/50 bg-senai-blueDark/80 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="mt-1 inline-flex items-center justify-center rounded-2xl p-3 bg-gradient-to-br from-emerald-500/35 via-emerald-500/10 to-transparent ring-1 ring-emerald-400/40 shadow-[0_12px_30px_rgba(16,185,129,0.25)]">
              <Users className="w-6 h-6 text-emerald-300" strokeWidth={2.1} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">
                {t("aboutPage.howItWorksTitle")}
              </h2>
              <ol className="text-gray-300 space-y-3 list-decimal list-inside">
                <li>
                  <strong className="text-white">{t("aboutPage.step1Title")}</strong>{" "}
                  {t("aboutPage.step1Text")}
                </li>
                <li>
                  <strong className="text-white">{t("aboutPage.step2Title")}</strong>{" "}
                  {t("aboutPage.step2Text")}
                </li>
                <li>
                  <strong className="text-white">{t("aboutPage.step3Title")}</strong>{" "}
                  {t("aboutPage.step3Text")}
                </li>
                <li>
                  <strong className="text-white">{t("aboutPage.step4Title")}</strong>{" "}
                  {t("aboutPage.step4Text")}
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-senai-blue/50 bg-senai-blueDark/80 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="mt-1 inline-flex items-center justify-center rounded-2xl p-3 bg-gradient-to-br from-purple-500/35 via-purple-500/10 to-transparent ring-1 ring-purple-400/40 shadow-[0_12px_30px_rgba(168,85,247,0.25)]">
              <Award className="w-6 h-6 text-purple-300" strokeWidth={2.1} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">
                {t("aboutPage.techTitle")}
              </h2>
              <p className="text-gray-300 mb-3">
                {t("aboutPage.techIntro")}
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>
                  <strong className="text-white">{t("aboutPage.techFrontend")}</strong> {t("aboutPage.techFrontendValue")}
                </li>
                <li>
                  <strong className="text-white">{t("aboutPage.techDesign")}</strong> {t("aboutPage.techDesignValue")}
                </li>
                <li>
                  <strong className="text-white">{t("aboutPage.techIcons")}</strong> {t("aboutPage.techIconsValue")}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-senai-blueLight/40 bg-senai-blueLight/15 p-6">
          <p className="text-white text-center mb-4">
            {t("aboutPage.educationalNotice")}
          </p>
          <div className="border-t border-senai-blueLight/40 pt-4 mt-4 text-center">
            <p className="text-gray-300">
              <strong className="text-senai-orange">{t("aboutPage.developedBy")}</strong> Lucas Lopes
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {t("aboutPage.rights", { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

