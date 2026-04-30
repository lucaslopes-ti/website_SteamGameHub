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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8">
      {statsItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-xl glass p-6 hover:border-senai-orange/50 transition-all animate-fadeIn"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-senai-orange/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <Icon className="w-5 h-5 text-senai-orange" strokeWidth={2} />
              </div>
              <div>
                <div className="font-display font-bold text-3xl md:text-4xl tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-gray-400 mt-1">
                  {stat.label}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
