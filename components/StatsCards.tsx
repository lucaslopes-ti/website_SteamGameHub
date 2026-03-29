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
  { iconBg: "bg-sky-500/10 group-hover:bg-sky-500/20", iconColor: "text-sky-400" },
  { iconBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20", iconColor: "text-emerald-400" },
  { iconBg: "bg-yellow-400/10 group-hover:bg-yellow-400/20", iconColor: "text-yellow-400" },
  { iconBg: "bg-purple-500/10 group-hover:bg-purple-500/20", iconColor: "text-purple-400" },
];

export default function StatsCards({ games, stats }: Readonly<StatsCardsProps>) {
  const { language, t } = useI18n();
  const approvedGames = games.filter((g) => g.approved);
  const totalRatings = approvedGames.reduce((sum, g) => sum + (g.totalRatings || 0), 0);
  const totalViews = stats?.totalViews || 0;
  const totalDownloads = stats?.totalDownloads || 0;
  const locale = language === "pt" ? "pt-BR" : "en-US";

  const statsItems = [
    { icon: Trophy, label: t("stats.publishedGames"), value: approvedGames.length.toLocaleString(locale) },
    { icon: Eye, label: t("stats.totalViews"), value: totalViews.toLocaleString(locale) },
    { icon: Download, label: t("stats.totalDownloads"), value: totalDownloads.toLocaleString(locale) },
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
            className="bg-senai-blueDark border border-senai-blue rounded-lg p-6 hover:border-senai-orange transition-all duration-300 hover:shadow-lg hover:shadow-senai-blue/20 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg transition-all ${style.iconBg}`}>
                <Icon className={`w-6 h-6 ${style.iconColor}`} />
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

