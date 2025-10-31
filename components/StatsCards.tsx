"use client";

import { Trophy, Eye, Download, Star } from "lucide-react";
import { Game } from "@/lib/games";

interface StatsCardsProps {
  games: Game[];
  stats?: {
    totalViews: number;
    totalDownloads: number;
    viewsByGame: Record<string, number>;
    downloadsByGame: Record<string, number>;
  };
}

export default function StatsCards({ games, stats }: StatsCardsProps) {
  const approvedGames = games.filter((g) => g.approved);
  const totalRatings = approvedGames.reduce((sum, g) => sum + (g.totalRatings || 0), 0);
  const totalViews = stats?.totalViews || 0;
  const totalDownloads = stats?.totalDownloads || 0;

  const statsItems = [
    {
      icon: Trophy,
      label: "Jogos Publicados",
      value: approvedGames.length,
      color: "steam-blueLight",
      bgColor: "steam-blue",
    },
    {
      icon: Eye,
      label: "Total de Visualizações",
      value: totalViews.toLocaleString("pt-BR"),
      color: "steam-green",
      bgColor: "steam-green",
    },
    {
      icon: Download,
      label: "Total de Downloads",
      value: totalDownloads.toLocaleString("pt-BR"),
      color: "yellow-400",
      bgColor: "yellow-400",
    },
    {
      icon: Star,
      label: "Total de Avaliações",
      value: totalRatings.toLocaleString("pt-BR"),
      color: "purple-400",
      bgColor: "purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-steam-dark border border-steam-blue rounded-lg p-6 hover:border-steam-blueLight transition-all duration-300 hover:shadow-lg hover:shadow-steam-blue/20 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.bgColor}/10 group-hover:bg-${stat.bgColor}/20 transition-all`}>
                <Icon className={`w-6 h-6 text-${stat.color}`} />
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

