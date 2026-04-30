"use client";

import { Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import GameCard from "./GameCard";
import { Game } from "@/lib/games";
import { useI18n } from "./I18nProvider";

interface TopRatedGamesProps {
  games: Game[];
}

export default function TopRatedGames({ games }: Readonly<TopRatedGamesProps>) {
  const { t } = useI18n();
  const approvedGames = games.filter((g) => g.approved && (g.rating || 0) > 0);
  
  // Ordenar por rating e pegar top 4
  const topRated = [...approvedGames]
    .sort((a, b) => {
      // Primeiro por rating, depois por totalRatings
      if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0);
      return (b.totalRatings || 0) - (a.totalRatings || 0);
    })
    .slice(0, 4);

  if (topRated.length === 0) return null;

  return (
    <section className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500/35 via-yellow-500/10 to-transparent ring-1 ring-yellow-400/40 shadow-[0_10px_24px_rgba(250,204,21,0.25)]">
            <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" strokeWidth={1.6} />
          </div>
          <h2 className="text-3xl font-bold text-senai-orange">{t("topRated.title")}</h2>
        </div>
        <Link
          href="/games?sort=rating"
          className="text-senai-orange hover:text-senai-blueLight text-sm font-medium flex items-center gap-1 transition-colors"
        >
          {t("common.seeAll")}
          <TrendingUp className="w-4 h-4" strokeWidth={2.2} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topRated.map((game) => (
          <div key={game.id} className="relative">
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-senai-blueDark/90 backdrop-blur-sm px-2 py-1 rounded-full border border-yellow-400/40">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" strokeWidth={1.6} />
              <span className="text-sm font-bold text-yellow-300">
                {game.rating?.toFixed(1)}
              </span>
            </div>
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </section>
  );
}

