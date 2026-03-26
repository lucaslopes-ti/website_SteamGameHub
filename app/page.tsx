"use client";

import { useEffect, useState, useRef } from "react";
import Hero from "@/components/Hero";
import GameCarousel from "@/components/GameCarousel";
import GameGrid from "@/components/GameGrid";
import { GameGridSkeleton } from "@/components/SkeletonLoader";
import StatsCards from "@/components/StatsCards";
import PopularGenres from "@/components/PopularGenres";
import AboutSection from "@/components/AboutSection";
import TopRatedGames from "@/components/TopRatedGames";
import { Game } from "@/lib/games";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function Home() {
  const { t } = useI18n();
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
    globalThis.window.addEventListener("gamesUpdated", handleGamesUpdate);
    
    return () => {
      globalThis.window.removeEventListener("gamesUpdated", handleGamesUpdate);
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

  const uniqueGenres = Array.from(new Set(games.flatMap((g) => g.genres))).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
  const uniqueTechs = Array.from(new Set(games.flatMap((g) => g.technologies))).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  const toggleGenre = (gen: string) => {
    setSelectedGenres((prev) =>
      prev.includes(gen) ? prev.filter((g) => g !== gen) : [...prev, gen]
    );
  };

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

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
      
      {loading ? (
        <section className="container mx-auto px-4">
          <GameGridSkeleton count={4} />
        </section>
      ) : (
        <>
          {featuredGames.length > 0 && (
            <section className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-6 text-steam-blueLight">
                {t("home.highlights")}
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-steam-blueLight font-semibold">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{t("home.filters")}</span>
                  {(query || selectedGenres.length > 0 || selectedTechs.length > 0) && (
                    <span className="bg-steam-blueLight text-steam-darker text-xs font-bold px-2 py-0.5 rounded-full">
                      {[query ? 1 : 0, selectedGenres.length, selectedTechs.length].reduce((a, b) => a + b, 0)} {t("home.active")}
                    </span>
                  )}
                </div>
                {(query || selectedGenres.length > 0 || selectedTechs.length > 0) && (
                  <button
                    onClick={() => { setQuery(""); setSelectedGenres([]); setSelectedTechs([]); setSortBy("recent"); }}
                    className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {t("home.clearAll")}
                  </button>
                )}
              </div>
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                <div className="flex-1 w-full">
                  <label className="block text-sm text-gray-400 mb-2">{t("home.search")}</label>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("home.searchBy")}
                    className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-steam-blueLight"
                    title={t("home.searchTitle")}
                  />
                </div>
                <div className="w-full lg:w-64">
                  <label className="block text-sm text-gray-400 mb-2">{t("home.sortBy")}</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white focus:outline-none focus:border-steam-blueLight"
                    title={t("home.sortTitle")}
                  >
                    <option value="recent">{t("home.sortRecent")}</option>
                    <option value="rating">{t("home.sortRating")}</option>
                    <option value="mostRated">{t("home.sortMostRated")}</option>
                  </select>
                </div>
              </div>

              {uniqueGenres.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">{t("home.genres")}</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueGenres.map((gen) => {
                      const active = selectedGenres.includes(gen);
                      return (
                        <button
                          key={gen}
                          onClick={() => toggleGenre(gen)}
                          className={`px-3 py-1 rounded text-sm border transition ${
                            active
                              ? "bg-steam-blue text-steam-blueLight border-steam-blueLight"
                              : "bg-steam-darker text-gray-300 border-steam-blue hover:border-steam-blueLight"
                          }`}
                          title={active ? t("home.removeGenre") : t("home.addGenre")}
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
                  <p className="text-sm text-gray-400 mb-2">{t("home.technologies")}</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueTechs.map((tech) => {
                      const active = selectedTechs.includes(tech);
                      return (
                        <button
                          key={tech}
                          onClick={() => toggleTech(tech)}
                          className={`px-3 py-1 rounded text-sm border transition ${
                            active
                              ? "bg-steam-green text-white border-steam-green"
                              : "bg-steam-darker text-gray-300 border-steam-blue hover:border-steam-blueLight"
                          }`}
                          title={active ? t("home.removeTech") : t("home.addTech")}
                        >
                          {tech}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-3xl font-bold text-steam-blueLight">
                {(query || selectedGenres.length > 0 || selectedTechs.length > 0) ? t("home.results") : t("home.recentGames")}
              </h2>
              <span className="text-sm text-gray-400">
                {filtered.length === 1 ? `1 ${t("home.game")}` : `${filtered.length} ${t("home.games")}`}
              </span>
            </div>
            {visibleGames.length > 0 ? (
              <GameGrid games={visibleGames} />
            ) : (
              <div className="flex flex-col items-center py-16 text-gray-400 gap-4">
                <SearchX className="w-14 h-14 text-steam-blue opacity-60" />
                <p className="text-lg font-medium">{t("home.noneFound")}</p>
                <p className="text-sm text-gray-500">{t("home.adjustFilters")}</p>
              </div>
            )}

            {/* Loader e botão Carregar mais */}
            {visibleGames.length < filtered.length && (
              <div className="flex items-center justify-center mt-6">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded border border-steam-blue text-steam-blueLight hover:border-steam-blueLight"
                  title={t("home.loadMoreTitle")}
                >
                  {t("home.loadMore")}
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
