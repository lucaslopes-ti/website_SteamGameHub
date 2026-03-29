"use client";

import { Info, Users, Target, Award } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-senai-orange">
        {t("aboutPage.title")}
      </h1>

      <div className="space-y-8">
        <div className="bg-senai-blueDark rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Info className="w-8 h-8 text-senai-orange flex-shrink-0 mt-1" />
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

        <div className="bg-senai-blueDark rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Target className="w-8 h-8 text-senai-orange flex-shrink-0 mt-1" />
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

        <div className="bg-senai-blueDark rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Users className="w-8 h-8 text-senai-orange flex-shrink-0 mt-1" />
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

        <div className="bg-senai-blueDark rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Award className="w-8 h-8 text-senai-orange flex-shrink-0 mt-1" />
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

        <div className="bg-senai-blueLight bg-opacity-20 border border-senai-blueLight rounded-lg p-6">
          <p className="text-white text-center mb-4">
            {t("aboutPage.educationalNotice")}
          </p>
          <div className="border-t border-senai-blueLight pt-4 mt-4 text-center">
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

