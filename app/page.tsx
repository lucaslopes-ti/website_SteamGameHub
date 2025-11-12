"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import GameCarousel from "@/components/GameCarousel";
import GameGrid from "@/components/GameGrid";
import { GameGridSkeleton } from "@/components/SkeletonLoader";
import StatsCards from "@/components/StatsCards";
import PopularGenres from "@/components/PopularGenres";
import AboutSection from "@/components/AboutSection";
import TopRatedGames from "@/components/TopRatedGames";
import { Game } from "@/lib/games";
import { BookOpen, ArrowRight, AlertCircle } from "lucide-react";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalViews: number;
    totalDownloads: number;
    viewsByGame: Record<string, number>;
    downloadsByGame: Record<string, number>;
  } | null>(null);
  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "mostRated">("recent");
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const loaderRef = useRef<HTMLDivElement | null>(null);

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
      const [gamesResponse, statsResponse] = await Promise.all([
        fetch("/api/games?approved=true"),
        fetch("/api/stats"),
      ]);

      if (gamesResponse.ok) {
        const data = await gamesResponse.json();
        setGames(data);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const featuredGames = games.filter((game) => game.featured).slice(0, 3);

  const uniqueGenres = Array.from(new Set(games.flatMap((g) => g.genres))).sort();
  const uniqueTechs = Array.from(new Set(games.flatMap((g) => g.technologies))).sort();

  const filtered = games.filter((g) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = q
      ? g.title.toLowerCase().includes(q) || g.author.toLowerCase().includes(q)
      : true;
    const matchesGenres = selectedGenres.length
      ? selectedGenres.every((gen) => g.genres.includes(gen))
      : true;
    const matchesTechs = selectedTechs.length
      ? selectedTechs.every((t) => g.technologies.includes(t))
      : true;
    return matchesQuery && matchesGenres && matchesTechs;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "mostRated") return b.totalRatings - a.totalRatings;
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  });

  // Resetar página quando filtros/busca/ordenação mudarem
  useEffect(() => {
    setPage(1);
  }, [query, selectedGenres, selectedTechs, sortBy]);

  const visibleGames = sorted.slice(0, page * pageSize);

  // Infinite scroll com IntersectionObserver
  useEffect(() => {
    if (!loaderRef.current) return;
    const el = loaderRef.current;
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        if (visibleGames.length < sorted.length) {
          setPage((p) => p + 1);
        }
      }
    }, { rootMargin: "200px" });
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [visibleGames.length, sorted.length]);

  return (
    <div className="space-y-12 pb-12">
      <Hero />
      
      {/* Seção de Prova de Lógica de Programação */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-yellow-600/20 via-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500 rounded-lg p-6 md:p-8 relative overflow-hidden">
          {/* Efeito de brilho animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent animate-pulse" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Prova de Lógica de Programação
              </h2>
              <p className="text-gray-200 mb-4">
                Avalie seus conhecimentos em C# e descubra se você precisa fazer um curso de Lógica de Programação.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-yellow-200 mb-4">
                <AlertCircle className="w-4 h-4" />
                <span>Sem limite de tempo • Navegação livre entre questões • Respostas salvas automaticamente</span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Link
                href="/prova-logica-programacao"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <span>Fazer Prova</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
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

          {/* Estatísticas */}
          {stats && (
            <section className="container mx-auto px-4">
              <StatsCards games={games} stats={stats} />
            </section>
          )}

          {/* Jogos Melhor Avaliados */}
          <TopRatedGames games={games} />

          {/* Gêneros Populares */}
          <section className="container mx-auto px-4">
            <PopularGenres games={games} />
          </section>

          {/* Seção Sobre */}
          <AboutSection />

          {/* Seção de Filtros e Busca */}
          <section className="container mx-auto px-4">
            <div className="bg-steam-dark border border-steam-blue rounded-lg p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                <div className="flex-1 w-full">
                  <label className="block text-sm text-gray-400 mb-2">Buscar</label>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Busque por título ou autor"
                    className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-steam-blueLight"
                    title="Digite para filtrar por título ou autor"
                  />
                </div>
                <div className="w-full lg:w-64">
                  <label className="block text-sm text-gray-400 mb-2">Ordenar por</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white focus:outline-none focus:border-steam-blueLight"
                    title="Ordene por recentes, nota ou quantidade de avaliações"
                  >
                    <option value="recent">Mais recentes</option>
                    <option value="rating">Melhor avaliados</option>
                    <option value="mostRated">Mais avaliados</option>
                  </select>
                </div>
              </div>

              {uniqueGenres.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Gêneros</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueGenres.map((gen) => {
                      const active = selectedGenres.includes(gen);
                      return (
                        <button
                          key={gen}
                          onClick={() =>
                            setSelectedGenres((prev) =>
                              prev.includes(gen)
                                ? prev.filter((g) => g !== gen)
                                : [...prev, gen]
                            )
                          }
                          className={`px-3 py-1 rounded text-sm border transition ${
                            active
                              ? "bg-steam-blue text-steam-blueLight border-steam-blueLight"
                              : "bg-steam-darker text-gray-300 border-steam-blue hover:border-steam-blueLight"
                          }`}
                          title={active ? "Remover gênero do filtro" : "Adicionar gênero ao filtro"}
                        >
                          {gen}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {uniqueTechs.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Tecnologias</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueTechs.map((tech) => {
                      const active = selectedTechs.includes(tech);
                      return (
                        <button
                          key={tech}
                          onClick={() =>
                            setSelectedTechs((prev) =>
                              prev.includes(tech)
                                ? prev.filter((t) => t !== tech)
                                : [...prev, tech]
                            )
                          }
                          className={`px-3 py-1 rounded text-sm border transition ${
                            active
                              ? "bg-steam-green text-white border-steam-green"
                              : "bg-steam-darker text-gray-300 border-steam-blue hover:border-steam-blueLight"
                          }`}
                          title={active ? "Remover tecnologia do filtro" : "Adicionar tecnologia ao filtro"}
                        >
                          {tech}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-6 text-steam-blueLight">
              Jogos Recentes
            </h2>
            <div className="text-sm text-gray-400 mb-4">
              {visibleGames.length} de {filtered.length} resultados
            </div>
            {visibleGames.length > 0 ? (
              <GameGrid games={visibleGames} />
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>Nenhum jogo encontrado com os filtros atuais.</p>
                {(query || selectedGenres.length || selectedTechs.length) && (
                  <button
                    className="mt-4 px-4 py-2 rounded border border-steam-blue text-steam-blueLight hover:border-steam-blueLight"
                    onClick={() => {
                      setQuery("");
                      setSelectedGenres([]);
                      setSelectedTechs([]);
                      setSortBy("recent");
                    }}
                    title="Limpar filtros"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            )}

            {/* Loader e botão Carregar mais */}
            {visibleGames.length < filtered.length && (
              <div className="flex items-center justify-center mt-6">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded border border-steam-blue text-steam-blueLight hover:border-steam-blueLight"
                  title="Carregar mais jogos"
                >
                  Carregar mais
                </button>
              </div>
            )}
            <div ref={loaderRef} aria-hidden className="h-1" />
          </section>
        </>
      )}
    </div>
  );
}
