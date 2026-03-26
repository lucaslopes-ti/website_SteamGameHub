"use client";

import GameCard from "./GameCard";
import { Game } from "@/lib/games";
import { useI18n } from "./I18nProvider";

interface GameGridProps {
  games: Game[];
}

export default function GameGrid({ games }: Readonly<GameGridProps>) {
  const { t } = useI18n();

  if (games.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>{t("games.noneFound")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

