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
    <section aria-labelledby="top-rated-title" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-12 h-12 shrink-0 rounded-xl bg-senai-orange/10 border border-senai-orange/30 items-center justify-center">
            <Star className="w-6 h-6 fill-senai-orange text-senai-orange" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--secondary)]">Escolha da comunidade</p>
            <h2 id="top-rated-title" className="mt-2 font-display font-bold text-2xl md:text-3xl text-gradient-orange">
              {t("topRated.title")}
            </h2>
            <p className="mt-2 text-sm md:text-base text-[var(--on-surface-variant)]">
              Os jogos mais bem cotados pela comunidade
            </p>
          </div>
        </div>
        <Link
          href="/games?sort=rating"
          className="group inline-flex min-h-[44px] items-center gap-1.5 self-start sm:self-auto text-sm text-senai-orange hover:text-senai-blueLight transition-colors font-semibold"
        >
          {t("common.seeAll")}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
      {/* Celular: faixa com rolagem lateral; a partir de sm: grade */}
      <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:!grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:!grid-cols-4 md:gap-6">
        {topRated.map((game) => (
          <li key={game.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
            <GameCard game={game} />
          </li>
        ))}
      </ul>
    </section>
  );
}
