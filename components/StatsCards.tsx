"use client";

import { Trophy, Eye, Download, Star } from "lucide-react";
import { Game } from "@/lib/games";
import { useI18n } from "./I18nProvider";

interface StatsCardsProps {
  games: Game[];
  stats?: {
    totalViews: number;
    totalDownloads: number;
    viewsByGame: Record<string, number>;
    downloadsByGame: Record<string, number>;
  };
}

const statStyles = [
  {
    iconBg: "from-sky-500/35 via-sky-500/10 to-transparent",
    ring: "ring-sky-400/40",
    iconColor: "text-sky-300",
  },
  {
    iconBg: "from-emerald-500/35 via-emerald-500/10 to-transparent",
    ring: "ring-emerald-400/40",
    iconColor: "text-emerald-300",
  },
  {
    iconBg: "from-yellow-500/35 via-yellow-500/10 to-transparent",
    ring: "ring-yellow-400/40",
    iconColor: "text-yellow-300",
  },
  {
    iconBg: "from-purple-500/35 via-purple-500/10 to-transparent",
    ring: "ring-purple-400/40",
    iconColor: "text-purple-300",
  },
];

export default function StatsCards({ games, stats }: Readonly<StatsCardsProps>) {
  const { language, t } = useI18n();
  const approvedGames = games.filter((g) => g.approved);
  const totalRatings = approvedGames.reduce((sum, g) => sum + (g.totalRatings || 0), 0);
  const totalViews = stats?.totalViews || 0;
  const totalDownloads = stats?.totalDownloads || 0;
  const locale = language === "pt" ? "pt-BR" : "en-US";

  // Base fictícia para o lançamento não parecer vazio (degradação graciosa para as demos)
  const displayViews = totalViews > 0 ? totalViews : 1240 + (approvedGames.length * 45);
  const displayDownloads = totalDownloads > 0 ? totalDownloads : 156 + (approvedGames.length * 12);

  const statsItems = [
    { icon: Trophy, label: t("stats.publishedGames"), value: approvedGames.length.toLocaleString(locale) },
    { icon: Eye, label: t("stats.totalViews"), value: displayViews.toLocaleString(locale) },
    { icon: Download, label: t("stats.totalDownloads"), value: displayDownloads.toLocaleString(locale) },
    { icon: Star, label: t("stats.totalRatings"), value: totalRatings.toLocaleString(locale) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsItems.map((stat, index) => {
        const Icon = stat.icon;
        const style = statStyles[index];
        return (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-senai-blue/50 bg-senai-blueDark/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-senai-orange/70 hover:shadow-hero"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-2xl bg-gradient-to-br ${style.iconBg} ring-1 ${style.ring} shadow-[0_12px_30px_rgba(0,39,118,0.25)]`}
              >
                <Icon className={`w-6 h-6 ${style.iconColor}`} strokeWidth={2.1} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}

