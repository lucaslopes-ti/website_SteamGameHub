"use client";

import { Info, Users, Target, Award, Check } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

type Accent = "primary" | "secondary" | "cyan" | "neutral";

const accentStyles: Record<
  Accent,
  { chip: string; icon: string; hover: string }
> = {
  primary: {
    chip: "bg-[var(--primary-10)] ring-1 ring-[var(--primary-container-text)]/30",
    icon: "text-[var(--primary-text)]",
    hover: "hover:border-[var(--primary-container-text)]/50",
  },
  secondary: {
    chip: "bg-[var(--secondary-10)] ring-1 ring-[var(--secondary)]/30",
    icon: "text-[var(--secondary)]",
    hover: "hover:border-[var(--secondary)]/50",
  },
  cyan: {
    chip: "bg-[var(--primary-10)] ring-1 ring-[var(--primary-fixed-dim)]/40",
    icon: "text-[var(--primary-fixed-dim)]",
    hover: "hover:border-[var(--primary-fixed-dim)]/50",
  },
  neutral: {
    chip: "bg-[var(--surface-container-low)] ring-1 ring-[var(--outline-10)]",
    icon: "text-[var(--on-surface-variant)]",
    hover: "hover:border-[var(--outline)]/60",
  },
};

function AboutCard({
  accent,
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  accent: Accent;
  icon: typeof Target;
  eyebrow: string;
  title?: string;
  children: React.ReactNode;
}) {
  const styles = accentStyles[accent];
  return (
    <article
      className={`stagger-item rounded-2xl border border-[var(--outline-10)] bg-[var(--surface-container-lowest)] p-6 transition-colors duration-200 ${styles.hover}`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`mt-0.5 inline-flex shrink-0 items-center justify-center rounded-xl p-2.5 ring-1 ${styles.chip}`}
        >
          <Icon
            aria-hidden="true"
            className={`h-5 w-5 ${styles.icon}`}
            strokeWidth={2.1}
          />
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--outline)]">
            {eyebrow}
          </p>
          {title && (
            <h3 className="mt-1 text-lg font-bold text-[var(--on-surface)]">
              {title}
            </h3>
          )}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </article>
  );
}

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
            <div className="stagger-item inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-container-low)] border border-[var(--outline-10)] text-xs font-semibold uppercase tracking-[0.2em] text-[var(--secondary)]">
              SENAI Game Hub
            </div>

            <div className="stagger-item space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--primary-text)]">
                {t("aboutPage.title")}
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--on-surface)]">
                {t("aboutPage.whatIsTitle")}
              </h2>
            </div>

            <p className="stagger-item text-lg text-[var(--on-surface-variant)] leading-relaxed max-w-prose">
              {t("aboutPage.whatIsText")}
            </p>

            {/* Faixa de indicadores: um único painel com divisores, em vez de
                três mini-cards que repetem a mesma caixa da seção ao lado. */}
            <div className="stagger-item grid grid-cols-3 divide-x divide-[var(--outline-10)] rounded-2xl border border-[var(--outline-10)] bg-[var(--surface-container-lowest)] text-center overflow-hidden">
              {indicators.map((item) => (
                <div key={item.label} className="px-2 py-4">
                  <div className="font-display text-2xl font-bold text-[var(--primary-text)]">
                    {item.value}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-widest text-[var(--on-surface-variant)]">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-6">
              <AboutCard
                accent="primary"
                icon={Target}
                eyebrow={t("aboutPage.kickerObjectives")}
                title={t("aboutPage.objectivesTitle")}
              >
                <ul className="space-y-2.5">
                  {objectives.map((objective) => (
                    <li
                      key={objective}
                      className="flex items-start gap-2.5"
                    >
                      <Check
                        aria-hidden="true"
                        strokeWidth={2.5}
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary-text)]"
                      />
                      <span className="text-sm leading-relaxed text-[var(--on-surface-variant)]">
                        {objective}
                      </span>
                    </li>
                  ))}
                </ul>
              </AboutCard>

              <AboutCard
                accent="secondary"
                icon={Users}
                eyebrow={t("aboutPage.kickerHowItWorks")}
                title={t("aboutPage.howItWorksTitle")}
              >
                <ol className="space-y-4">
                  {steps.map((step, index) => (
                    <li key={step.title} className="flex gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--secondary-10)] ring-1 ring-[var(--secondary)]/30 font-mono text-xs font-bold text-[var(--secondary)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-relaxed text-[var(--on-surface-variant)]">
                        <strong className="font-semibold text-[var(--on-surface)]">
                          {step.title}
                        </strong>{" "}
                        {step.text}
                      </p>
                    </li>
                  ))}
                </ol>
              </AboutCard>

              <AboutCard
                accent="cyan"
                icon={Award}
                eyebrow={t("aboutPage.kickerTech")}
                title={t("aboutPage.techTitle")}
              >
                <p className="mb-4 text-sm text-[var(--on-surface-variant)]">
                  {t("aboutPage.techIntro")}
                </p>
                <div className="space-y-3.5">
                  {techItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"
                    >
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--primary-fixed-dim)]">
                        {item.label}
                      </span>
                      <span className="text-sm text-[var(--on-surface-variant)]">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </AboutCard>

              <AboutCard
                accent="neutral"
                icon={Info}
                eyebrow={t("aboutPage.kickerNotice")}
              >
                <p className="text-sm leading-relaxed text-[var(--on-surface-variant)]">
                  {t("aboutPage.educationalNotice")}
                </p>
                <div className="mt-5 border-t border-[var(--outline-10)] pt-4">
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    <strong className="font-semibold text-[var(--secondary)]">
                      {t("aboutPage.developedBy")}
                    </strong>{" "}
                    Lucas Lopes
                  </p>
                  <p className="mt-1.5 text-xs text-[var(--outline)]">
                    {t("aboutPage.rights", {
                      year: new Date().getFullYear(),
                    })}
                  </p>
                </div>
              </AboutCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}