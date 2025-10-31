"use client";

import { Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import GameCard from "./GameCard";
import { Game } from "@/lib/games";

interface TopRatedGamesProps {
  games: Game[];
}

export default function TopRatedGames({ games }: TopRatedGamesProps) {
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
          <div className="p-2 bg-yellow-400/10 rounded-lg">
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold text-steam-blueLight">Melhor Avaliados</h2>
        </div>
        <Link
          href="/games?sort=rating"
          className="text-steam-blueLight hover:text-steam-green text-sm font-medium flex items-center gap-1 transition-colors"
        >
          Ver todos
          <TrendingUp className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topRated.map((game) => (
          <div key={game.id} className="relative">
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-steam-dark/90 backdrop-blur-sm px-2 py-1 rounded-full border border-yellow-400/30">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">
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

