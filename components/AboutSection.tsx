"use client";

import { GraduationCap, Code, Users, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useI18n } from "./I18nProvider";

const features = [
  {
    icon: GraduationCap,
    titleKey: "about.feature.courseTitle",
    descriptionKey: "about.feature.courseDescription",
    accent: "from-sky-500/35 via-sky-500/10 to-transparent",
    ring: "ring-sky-400/40",
    iconColor: "text-sky-300",
  },
  {
    icon: Code,
    titleKey: "about.feature.techTitle",
    descriptionKey: "about.feature.techDescription",
    accent: "from-emerald-500/35 via-emerald-500/10 to-transparent",
    ring: "ring-emerald-400/40",
    iconColor: "text-emerald-300",
  },
  {
    icon: Users,
    titleKey: "about.feature.communityTitle",
    descriptionKey: "about.feature.communityDescription",
    accent: "from-yellow-500/35 via-yellow-500/10 to-transparent",
    ring: "ring-yellow-400/40",
    iconColor: "text-yellow-300",
  },
  {
    icon: Award,
    titleKey: "about.feature.qualityTitle",
    descriptionKey: "about.feature.qualityDescription",
    accent: "from-purple-500/35 via-purple-500/10 to-transparent",
    ring: "ring-purple-400/40",
    iconColor: "text-purple-300",
  },
];

export default function AboutSection() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-senai-blueDark via-senai-dark to-senai-blueDark border-t border-b border-senai-blue py-20">
      <div className="absolute inset-0 grid-pattern opacity-25" />
      <div className="absolute inset-0 bg-gradient-glow" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-orange mb-4">
            {t("about.title")}
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-6">
            {t("about.description1")}
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mb-8">
            {t("about.description2")}
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full bg-senai-orange px-6 py-3 font-semibold text-white shadow-glow-orange transition hover:-translate-y-0.5"
          >
            {t("about.learnMore")}
            <ArrowRight className="w-5 h-5" strokeWidth={2.2} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.titleKey}
                className="group relative overflow-hidden rounded-2xl border border-senai-blue/50 bg-senai-blueDark/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-senai-orange/70 hover:shadow-hero"
              >
                <div
                  className={`inline-flex items-center justify-center rounded-2xl p-3 mb-4 bg-gradient-to-br ${feature.accent} ring-1 ${feature.ring} shadow-[0_12px_30px_rgba(0,39,118,0.25)]`}
                >
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} strokeWidth={2.1} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t(feature.titleKey)}</h3>
                <p className="text-gray-400 leading-relaxed">{t(feature.descriptionKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

