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
    <section className="relative overflow-hidden rounded-2xl border border-senai-blue/50 bg-senai-blueDark/80 p-6 backdrop-blur-sm">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-gradient-glow" />

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-senai-orange/40 via-senai-orange/10 to-transparent ring-1 ring-senai-orange/40 shadow-[0_10px_24px_rgba(243,112,33,0.25)]">
              <Tag className="w-5 h-5 text-senai-orange" strokeWidth={2.2} />
            </div>
            <h3 className="text-2xl font-bold text-white">{t("genres.popular")}</h3>
          </div>
          <Link
            href="/games"
            className="text-senai-orange hover:text-senai-blueLight text-sm font-medium flex items-center gap-1 transition-colors"
          >
            {t("common.seeAll")}
            <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularGenres.map(({ genre, count }) => (
            <Link
              key={genre}
              href={`/games?genre=${encodeURIComponent(genre)}`}
              className="group rounded-xl border border-senai-blue/50 bg-senai-dark/80 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-senai-orange/70 hover:bg-senai-blueDark"
            >
              <div className="text-2xl font-bold text-senai-orange mb-1 group-hover:text-senai-blueLight transition-colors">
                {count}
              </div>
              <div className="text-sm text-gray-300 group-hover:text-white transition-colors">{genre}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

