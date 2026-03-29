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

  const genreCounts: Record<string, number> = {};
  approvedGames.forEach((game) => {
    game.genres?.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  const popularGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([genre, count]) => ({ genre, count }));

  if (popularGenres.length === 0) return null;

  return (
    <section className="bg-senai-blueDark border border-senai-blue rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Tag className="w-6 h-6 text-senai-orange" />
          <h3 className="text-2xl font-bold text-white">{t("genres.popular")}</h3>
        </div>
        <Link
          href="/games"
          className="text-senai-orange hover:text-senai-blueLight text-sm font-medium flex items-center gap-1 transition-colors"
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
            className="bg-senai-dark border border-senai-blue rounded-lg p-4 text-center hover:border-senai-orange transition-all duration-300 hover:bg-senai-blueDark group"
          >
            <div className="text-2xl font-bold text-senai-orange mb-1 group-hover:text-senai-blueLight transition-colors">
              {count}
            </div>
            <div className="text-sm text-gray-300 group-hover:text-white transition-colors">{genre}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

