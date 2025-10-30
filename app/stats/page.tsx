"use client";

// Garantir que a página não use conteúdo estático antigo
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Game } from "@/lib/games";
import { 
  Gamepad2, 
  Users, 
  Star, 
  Download, 
  TrendingUp, 
  Calendar,
  Award,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalGames: number;
  approvedGames: number;
  pendingGames: number;
  totalRatings: number;
  averageRating: number;
  totalAuthors: number;
  topRatedGames: Game[];
  mostRatedGames: Game[];
  recentGames: Game[];
  gamesByGenre: Record<string, number>;
  gamesByTechnology: Record<string, number>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/games");
      if (response.ok) {
        const games: Game[] = await response.json();
        
        // Calcular estatísticas
        const approved = games.filter((g) => g.approved);
        const pending = games.filter((g) => g.pending && !g.approved);
        const totalRatings = games.reduce((sum, g) => sum + g.totalRatings, 0);
        const avgRating = approved.length > 0
          ? approved.reduce((sum, g) => sum + g.rating, 0) / approved.length
          : 0;
        
        // Autores únicos
        const uniqueAuthors = new Set(games.map((g) => g.authorEmail));
        
        // Top jogos
        const topRated = [...approved]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);
        
        const mostRated = [...approved]
          .sort((a, b) => b.totalRatings - a.totalRatings)
          .slice(0, 5);
        
        const recent = [...approved]
          .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
          .slice(0, 5);
        
        // Estatísticas por gênero
        const gamesByGenre: Record<string, number> = {};
        approved.forEach((game) => {
          game.genres.forEach((genre) => {
            gamesByGenre[genre] = (gamesByGenre[genre] || 0) + 1;
          });
        });
        
        // Estatísticas por tecnologia
        const gamesByTechnology: Record<string, number> = {};
        approved.forEach((game) => {
          game.technologies.forEach((tech) => {
            gamesByTechnology[tech] = (gamesByTechnology[tech] || 0) + 1;
          });
        });
        
        setStats({
          totalGames: games.length,
          approvedGames: approved.length,
          pendingGames: pending.length,
          totalRatings,
          averageRating: avgRating,
          totalAuthors: uniqueAuthors.size,
          topRatedGames: topRated,
          mostRatedGames: mostRated,
          recentGames: recent,
          gamesByGenre,
          gamesByTechnology,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-steam-blueLight mx-auto" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  const topGenres = Object.entries(stats.gamesByGenre)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  
  const topTechnologies = Object.entries(stats.gamesByTechnology)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-steam-blueLight">
        Estatísticas Gerais
      </h1>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-steam-dark rounded-lg p-6 border border-steam-blue">
          <div className="flex items-center justify-between mb-4">
            <Gamepad2 className="w-8 h-8 text-steam-blueLight" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total de Jogos</h3>
          <p className="text-3xl font-bold text-white">{stats.totalGames}</p>
          <p className="text-xs text-gray-400 mt-2">
            {stats.approvedGames} aprovados
          </p>
        </div>

        <div className="bg-steam-dark rounded-lg p-6 border border-steam-blue">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-steam-green" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Autores</h3>
          <p className="text-3xl font-bold text-white">{stats.totalAuthors}</p>
          <p className="text-xs text-gray-400 mt-2">
            Desenvolvedores únicos
          </p>
        </div>

        <div className="bg-steam-dark rounded-lg p-6 border border-steam-blue">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Avaliação Média</h3>
          <p className="text-3xl font-bold text-white">
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "-"}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {stats.totalRatings} avaliações
          </p>
        </div>

        <div className="bg-steam-dark rounded-lg p-6 border border-steam-blue">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-400" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Aguardando</h3>
          <p className="text-3xl font-bold text-white">{stats.pendingGames}</p>
          <p className="text-xs text-gray-400 mt-2">
            Jogos pendentes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Jogos por Avaliação */}
        <div className="bg-steam-dark rounded-lg p-6 border border-steam-blue">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Melhor Avaliados</h2>
          </div>
          <div className="space-y-4">
            {stats.topRatedGames.length > 0 ? (
              stats.topRatedGames.map((game, index) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="block bg-steam-darker rounded p-4 hover:bg-steam-blue transition group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-steam-blue rounded flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold group-hover:text-steam-blueLight transition">
                          {game.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{game.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-bold">{game.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Nenhum jogo ainda</p>
            )}
          </div>
        </div>

        {/* Jogos Mais Avaliados */}
        <div className="bg-steam-dark rounded-lg p-6 border border-steam-blue">
          <div className="flex items-center gap-2 mb-6">
            <Download className="w-6 h-6 text-steam-blueLight" />
            <h2 className="text-2xl font-bold text-white">Mais Avaliados</h2>
          </div>
          <div className="space-y-4">
            {stats.mostRatedGames.length > 0 ? (
              stats.mostRatedGames.map((game, index) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="block bg-steam-darker rounded p-4 hover:bg-steam-blue transition group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-steam-green rounded flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold group-hover:text-steam-blueLight transition">
                          {game.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{game.author}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-steam-blueLight font-bold">
                        {game.totalRatings}
                      </p>
                      <p className="text-gray-400 text-xs">avaliações</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Nenhum jogo ainda</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gêneros Mais Populares */}
        <div className="bg-steam-dark rounded-lg p-6 border border-steam-blue">
          <h2 className="text-2xl font-bold text-white mb-6">Gêneros Mais Populares</h2>
          <div className="space-y-3">
            {topGenres.length > 0 ? (
              topGenres.map(([genre, count], index) => (
                <div key={genre} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-steam-blue rounded flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-white">{genre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-steam-darker rounded-full h-2">
                      <div
                        className="bg-steam-blueLight h-2 rounded-full"
                        style={{
                          width: `${(count / stats.approvedGames) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-steam-blueLight font-semibold w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Nenhum dado disponível</p>
            )}
          </div>
        </div>

        {/* Tecnologias Mais Usadas */}
        <div className="bg-steam-dark rounded-lg p-6 border border-steam-blue">
          <h2 className="text-2xl font-bold text-white mb-6">Tecnologias Mais Usadas</h2>
          <div className="space-y-3">
            {topTechnologies.length > 0 ? (
              topTechnologies.map(([tech, count], index) => (
                <div key={tech} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-steam-green rounded flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-white">{tech}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-steam-darker rounded-full h-2">
                      <div
                        className="bg-steam-green h-2 rounded-full"
                        style={{
                          width: `${(count / stats.approvedGames) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-steam-green font-semibold w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Nenhum dado disponível</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

