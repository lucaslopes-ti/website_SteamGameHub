"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import GameCarousel from "@/components/GameCarousel";
import GameGrid from "@/components/GameGrid";
import { GameGridSkeleton } from "@/components/SkeletonLoader";
import { Game } from "@/lib/games";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
    
    // Listener para atualizar quando jogos forem aprovados
    const handleGamesUpdate = () => {
      loadGames();
    };
    window.addEventListener("gamesUpdated", handleGamesUpdate);
    
    return () => {
      window.removeEventListener("gamesUpdated", handleGamesUpdate);
    };
  }, []);

  const loadGames = async () => {
    try {
      const response = await fetch("/api/games?approved=true");
      if (response.ok) {
        const data = await response.json();
        setGames(data);
      }
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
    } finally {
      setLoading(false);
    }
  };

  const featuredGames = games.filter((game) => game.featured).slice(0, 3);
  const recentGames = games
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 12);

  return (
    <div className="space-y-12 pb-12">
      <Hero />
      {loading ? (
        <section className="container mx-auto px-4">
          <GameGridSkeleton count={4} />
        </section>
      ) : (
        <>
          {featuredGames.length > 0 && (
            <section className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-6 text-steam-blueLight">
                Destaques
              </h2>
              <GameCarousel games={featuredGames} />
            </section>
          )}
          <section className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6 text-steam-blueLight">
              Jogos Recentes
            </h2>
            {recentGames.length > 0 ? (
              <GameGrid games={recentGames} />
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>Nenhum jogo disponível ainda.</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
