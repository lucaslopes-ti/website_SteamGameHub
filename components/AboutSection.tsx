"use client";

import { GraduationCap, Code, Users, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useI18n } from "./I18nProvider";

const features = [
  {
    icon: GraduationCap,
    titleKey: "about.feature.courseTitle",
    descriptionKey: "about.feature.courseDescription",
    iconBg: "bg-sky-500/10 group-hover:bg-sky-500/20",
    iconColor: "text-sky-400",
  },
  {
    icon: Code,
    titleKey: "about.feature.techTitle",
    descriptionKey: "about.feature.techDescription",
    iconBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Users,
    titleKey: "about.feature.communityTitle",
    descriptionKey: "about.feature.communityDescription",
    iconBg: "bg-yellow-400/10 group-hover:bg-yellow-400/20",
    iconColor: "text-yellow-400",
  },
  {
    icon: Award,
    titleKey: "about.feature.qualityTitle",
    descriptionKey: "about.feature.qualityDescription",
    iconBg: "bg-purple-500/10 group-hover:bg-purple-500/20",
    iconColor: "text-purple-400",
  },
];

export default function AboutSection() {
  const { t } = useI18n();

  return (
    <section className="bg-gradient-to-b from-steam-dark via-steam-darker to-steam-dark border-t border-b border-steam-blue py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
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
            className="inline-flex items-center gap-2 bg-steam-blueLight hover:bg-steam-blue text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-steam-blueLight/30"
          >
            {t("about.learnMore")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.titleKey}
                className="bg-steam-dark border border-steam-blue rounded-lg p-6 hover:border-steam-blueLight transition-all duration-300 hover:shadow-lg hover:shadow-steam-blue/20 group"
              >
                <div className={`inline-flex p-3 rounded-lg mb-4 transition-all ${feature.iconBg}`}>
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} />
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

