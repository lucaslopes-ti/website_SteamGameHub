"use client";

import { Game } from "@/lib/games";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { useI18n } from "./I18nProvider";

interface PopularGenresProps {
  games: Game[];
}

export default function PopularGenres({ games }: Readonly<PopularGenresProps>) {
  const { t } = useI18n();
  const approvedGames = games.filter((g) => g.approved);
  
  // Contar jogos por gênero
  const genreCounts: Record<string, number> = {};
  approvedGames.forEach((game) => {
    game.genres?.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  // Ordenar por quantidade e pegar os top 6
  const popularGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([genre, count]) => ({ genre, count }));

  if (popularGenres.length === 0) return null;

  return (
    <section className="bg-steam-dark border border-steam-blue rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Tag className="w-6 h-6 text-steam-blueLight" />
          <h3 className="text-2xl font-bold text-white">{t("genres.popular")}</h3>
        </div>
        <Link
          href="/games"
          className="text-steam-blueLight hover:text-steam-green text-sm font-medium flex items-center gap-1 transition-colors"
        >
          {t("common.seeAll")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {popularGenres.map(({ genre, count }) => (
          <Link
            key={genre}
            href={`/games?genre=${encodeURIComponent(genre)}`}
            className="bg-steam-darker border border-steam-blue rounded-lg p-4 text-center hover:border-steam-blueLight transition-all duration-300 hover:bg-steam-dark group"
          >
            <div className="text-2xl font-bold text-steam-blueLight mb-1 group-hover:text-steam-green transition-colors">
              {count}
            </div>
            <div className="text-sm text-gray-300 group-hover:text-white transition-colors">{genre}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

