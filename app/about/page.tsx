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
    <section className="relative overflow-hidden py-16 sm:py-20 bg-[var(--surface)]">
      <div className="absolute -top-32 -left-40 w-[420px] h-[420px] bg-[var(--primary-10)] rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] bg-[var(--secondary-10)] rounded-full blur-[140px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-container-low)] border border-[var(--outline-10)] text-xs font-semibold uppercase tracking-[0.2em] text-[var(--secondary)]">
              SENAI Game Hub
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--primary-text)]">
                {t("aboutPage.title")}
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--on-surface)]">
                {t("aboutPage.whatIsTitle")}
              </h2>
            </div>

            <p className="text-lg text-[var(--on-surface-variant)] leading-relaxed">
              {t("aboutPage.whatIsText")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[var(--outline-10)]">
              {indicators.map((item) => (
                <div key={item.label} className="bg-[var(--surface-container-lowest)] rounded-xl p-4 text-center border border-[var(--outline-10)]">
                  <div className="text-[var(--primary-text)] font-bold text-2xl">
                    {item.value}
                  </div>
                  <div className="text-[11px] uppercase tracking-widest text-[var(--on-surface-variant)]">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-[var(--surface-container-lowest)] rounded-2xl p-6 border border-[var(--outline-10)] transition-all hover:border-[var(--secondary-container)]">
                <div className="flex items-start gap-4">
                  <div className="mt-1 inline-flex items-center justify-center rounded-2xl p-3 bg-[var(--primary-10)] ring-1 ring-[var(--primary)]/30 shadow-sm">
                    <Target className="w-6 h-6 text-[var(--primary-text)]" strokeWidth={2.1} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--on-surface)] mb-3">{t("aboutPage.objectivesTitle")}</h3>
                    <ul className="text-[var(--on-surface-variant)] space-y-2 list-disc list-inside">
                      {objectives.map((objective) => (
                        <li key={objective}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--surface-container-lowest)] rounded-2xl p-6 border border-[var(--outline-10)] transition-all hover:border-[var(--primary-container)]/60">
                <div className="flex items-start gap-4">
                  <div className="mt-1 inline-flex items-center justify-center rounded-2xl p-3 bg-[var(--primary-10)] ring-1 ring-[var(--primary)]/30 shadow-sm">
                    <Users className="w-6 h-6 text-[var(--primary-container)]" strokeWidth={2.1} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--on-surface)] mb-3">{t("aboutPage.howItWorksTitle")}</h3>
                    <ol className="text-[var(--on-surface-variant)] space-y-3 list-decimal list-inside">
                      {steps.map((step) => (
                        <li key={step.title}>
                          <strong className="text-[var(--on-surface)]">{step.title}</strong> {step.text}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--surface-container-lowest)] rounded-2xl p-6 sm:col-span-2 border border-[var(--outline-10)] transition-all hover:border-[var(--primary)]/60">
                <div className="flex items-start gap-4">
                  <div className="mt-1 inline-flex items-center justify-center rounded-2xl p-3 bg-[var(--primary-10)] ring-1 ring-[var(--primary)]/30 shadow-sm">
                    <Award className="w-6 h-6 text-[var(--secondary)]" strokeWidth={2.1} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--on-surface)] mb-3">{t("aboutPage.techTitle")}</h3>
                    <p className="text-[var(--on-surface-variant)] mb-3">
                      {t("aboutPage.techIntro")}
                    </p>
                    <ul className="text-[var(--on-surface-variant)] space-y-2">
                      {techItems.map((item) => (
                        <li key={item.label}>
                          <strong className="text-[var(--on-surface)]">{item.label}</strong> {item.value}
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
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl p-6 border border-[var(--outline-10)]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="inline-flex items-center justify-center rounded-2xl p-3 bg-[var(--secondary-10)] ring-1 ring-[var(--secondary-container)]/40 shadow-sm">
                <Info className="w-6 h-6 text-[var(--secondary)]" strokeWidth={2.1} />
              </div>
              <p className="text-[var(--on-surface-variant)] text-center sm:text-left">
                {t("aboutPage.educationalNotice")}
              </p>
            </div>
            <div className="border-t border-[var(--outline-10)] pt-4 mt-4 text-center">
              <p className="text-[var(--on-surface-variant)]">
                <strong className="text-[var(--secondary)]">{t("aboutPage.developedBy")}</strong> Lucas Lopes
              </p>
              <p className="text-[var(--outline)] text-sm mt-2">
                {t("aboutPage.rights", { year: new Date().getFullYear() })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

