"use client";

import { Star, ArrowRight } from "lucide-react";
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
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-end justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-senai-orange/10 border border-senai-orange/30 flex items-center justify-center shadow-glow-orange">
            <Star className="w-5 h-5 fill-senai-orange text-senai-orange" />
          </div>
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gradient-orange">
              {t("topRated.title")}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Os jogos mais bem cotados pela comunidade
            </p>
          </div>
        </div>
        <Link
          href="/games?sort=rating"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm text-senai-orange hover:text-senai-orange/80 transition-colors font-medium"
        >
          {t("common.seeAll")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {topRated.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
