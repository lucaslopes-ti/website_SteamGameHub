"use client";

import { Info, Users, Target, Award } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function AboutPage() {
  const { t } = useI18n();

  const objectives = [
    t("aboutPage.objective1"),
    t("aboutPage.objective2"),
    t("aboutPage.objective3"),
    t("aboutPage.objective4"),
    t("aboutPage.objective5"),
  ];

  const steps = [
    {
      title: t("aboutPage.step1Title"),
      text: t("aboutPage.step1Text"),
    },
    {
      title: t("aboutPage.step2Title"),
      text: t("aboutPage.step2Text"),
    },
    {
      title: t("aboutPage.step3Title"),
      text: t("aboutPage.step3Text"),
    },
    {
      title: t("aboutPage.step4Title"),
      text: t("aboutPage.step4Text"),
    },
  ];

  const techItems = [
    {
      label: t("aboutPage.techFrontend"),
      value: t("aboutPage.techFrontendValue"),
    },
    {
      label: t("aboutPage.techDesign"),
      value: t("aboutPage.techDesignValue"),
    },
    {
      label: t("aboutPage.techIcons"),
      value: t("aboutPage.techIconsValue"),
    },
  ];

  const indicators = [
    {
      value: objectives.length,
      label: t("aboutPage.objectivesTitle"),
    },
    {
      value: steps.length,
      label: t("aboutPage.howItWorksTitle"),
    },
    {
      value: techItems.length,
      label: t("aboutPage.techTitle"),
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-glow" />
      <div className="absolute -top-32 -left-40 w-[420px] h-[420px] bg-senai-blueLight/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] bg-senai-orange/20 rounded-full blur-[140px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-[0.2em] text-senai-orange/90">
              SENAI Game Hub
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-orange">
                {t("aboutPage.title")}
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {t("aboutPage.whatIsTitle")}
              </h2>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed">
              {t("aboutPage.whatIsText")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-senai-blue/30">
              {indicators.map((item) => (
                <div key={item.label} className="glass rounded-xl p-4 text-center">
                  <div className="text-gray-300 font-bold text-2xl">
                    {item.value}
                  </div>
                  <div className="text-[11px] uppercase tracking-widest text-gray-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6 transition-all hover:border-senai-orange/50">
                <div className="flex items-start gap-4">
                  <div className="mt-1 inline-flex items-center justify-center rounded-2xl p-3 bg-gradient-to-br from-senai-blueLight/35 via-senai-blueLight/10 to-transparent ring-1 ring-senai-blueLight/40 shadow-[0_12px_30px_rgba(0,165,226,0.25)]">
                    <Target className="w-6 h-6 text-senai-blueLight" strokeWidth={2.1} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{t("aboutPage.objectivesTitle")}</h3>
                    <ul className="text-gray-300 space-y-2 list-disc list-inside">
                      {objectives.map((objective) => (
                        <li key={objective}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 transition-all hover:border-emerald-400/50">
                <div className="flex items-start gap-4">
                  <div className="mt-1 inline-flex items-center justify-center rounded-2xl p-3 bg-gradient-to-br from-emerald-500/35 via-emerald-500/10 to-transparent ring-1 ring-emerald-400/40 shadow-[0_12px_30px_rgba(16,185,129,0.25)]">
                    <Users className="w-6 h-6 text-emerald-300" strokeWidth={2.1} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{t("aboutPage.howItWorksTitle")}</h3>
                    <ol className="text-gray-300 space-y-3 list-decimal list-inside">
                      {steps.map((step) => (
                        <li key={step.title}>
                          <strong className="text-white">{step.title}</strong> {step.text}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 sm:col-span-2 transition-all hover:border-purple-400/50">
                <div className="flex items-start gap-4">
                  <div className="mt-1 inline-flex items-center justify-center rounded-2xl p-3 bg-gradient-to-br from-purple-500/35 via-purple-500/10 to-transparent ring-1 ring-purple-400/40 shadow-[0_12px_30px_rgba(168,85,247,0.25)]">
                    <Award className="w-6 h-6 text-purple-300" strokeWidth={2.1} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{t("aboutPage.techTitle")}</h3>
                    <p className="text-gray-300 mb-3">
                      {t("aboutPage.techIntro")}
                    </p>
                    <ul className="text-gray-300 space-y-2">
                      {techItems.map((item) => (
                        <li key={item.label}>
                          <strong className="text-white">{item.label}</strong> {item.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="glass rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="inline-flex items-center justify-center rounded-2xl p-3 bg-gradient-to-br from-senai-orange/35 via-senai-orange/10 to-transparent ring-1 ring-senai-orange/40 shadow-[0_12px_30px_rgba(243,112,33,0.25)]">
                <Info className="w-6 h-6 text-senai-orange" strokeWidth={2.1} />
              </div>
              <p className="text-gray-300 text-center sm:text-left">
                {t("aboutPage.educationalNotice")}
              </p>
            </div>
            <div className="border-t border-senai-blue/30 pt-4 mt-4 text-center">
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
    </section>
  );
}

