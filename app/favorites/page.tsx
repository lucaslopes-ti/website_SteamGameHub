"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Game } from "@/lib/games";
import { Heart, Loader2 } from "lucide-react";
import GameGrid from "@/components/GameGrid";
import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadFavorites();
  }, [isAuthenticated, user, router]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      // Buscar IDs dos favoritos
      const favoritesResponse = await fetch(`/api/favorites?userId=${user.email}`);
      if (!favoritesResponse.ok) return;

      const favoritesData = await favoritesResponse.json();
      const gameIds = favoritesData.gameIds;

      if (gameIds.length === 0) {
        setFavoriteGames([]);
        setLoading(false);
        return;
      }

      // Buscar detalhes dos jogos
      const gamesResponse = await fetch("/api/games?approved=true");
      if (gamesResponse.ok) {
        const allGames: Game[] = await gamesResponse.json();
        const favorites = allGames.filter((game) => gameIds.includes(game.id));
        setFavoriteGames(favorites);
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  let content: React.ReactNode;
  if (loading) {
    content = (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-steam-blueLight" />
      </div>
    );
  } else if (favoriteGames.length === 0) {
    content = (
      <div className="bg-steam-dark rounded-lg p-12 text-center">
        <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
        <p className="text-gray-400 text-xl mb-4">
          {t("favorites.emptyTitle")}
        </p>
        <p className="text-gray-500 mb-6">
          {t("favorites.emptyDescription")}
        </p>
        <Link
          href="/games"
          className="inline-block bg-steam-blueLight hover:bg-steam-blue text-white px-6 py-3 rounded font-semibold transition"
        >
          {t("favorites.exploreGames")}
        </Link>
      </div>
    );
  } else {
    content = (
      <>
        <p className="text-gray-400 mb-6">
          {t("favorites.count", {
            count: favoriteGames.length,
            plural: favoriteGames.length === 1 ? "" : "s",
          })}
        </p>
        <GameGrid games={favoriteGames} />
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <h1 className="text-4xl font-bold text-steam-blueLight">{t("favorites.title")}</h1>
        </div>
      </div>

      {content}
    </div>
  );
}

