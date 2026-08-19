"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Game } from "@/lib/games";
import { Search, SearchX, SlidersHorizontal, Star } from "lucide-react";
import { GameGridSkeleton } from "@/components/SkeletonLoader";
import { useI18n } from "@/components/I18nProvider";
import Hero from "@/components/Hero";
import TopRatedGames from "@/components/TopRatedGames";

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
  const [heroGame, setHeroGame] = useState<Game | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadGames();

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
        
        const featured = data.filter((g: Game) => g.featured);
        const pool = featured.length > 0 ? featured : data;
        if (pool.length > 0) {
          const randomIndex = Math.floor(Math.random() * pool.length);
          setHeroGame(pool[randomIndex]);
        }
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

  const topRated = [...games]
    .filter((g) => g.totalRatings > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const recentGames = sorted.slice(0, page * pageSize);

  const totalViews = stats?.totalViews ?? 0;
  const totalDownloads = stats?.totalDownloads ?? 0;
  const totalRatings = games.reduce((acc, g) => acc + g.totalRatings, 0);

  useEffect(() => {
    setPage(1);
  }, [query, selectedGenres, selectedTechs, sortBy]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const el = loaderRef.current;
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        if (recentGames.length < sorted.length) {
          setPage((p) => p + 1);
        }
      }
    }, { rootMargin: "200px" });
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [recentGames.length, sorted.length]);

  return (
    <div className="bg-[var(--surface)] text-[var(--on-surface)]">
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>

      <Hero />

      <div className="bg-[var(--primary)] text-white py-3 overflow-hidden whitespace-nowrap flex border-y border-[var(--primary-container)]">
        <div className="animate-marquee flex gap-12 font-semibold text-sm">
          <span>HUB Atualizado: Novos jogos adicionados!</span>
          <span>HUB Atualizado: Veja as novas estatisticas!</span>
          <span>HUB Atualizado: Novos materiais de estudo disponiveis!</span>
          <span>HUB Atualizado: Novos jogos adicionados!</span>
          <span>HUB Atualizado: Veja as novas estatisticas!</span>
          <span>HUB Atualizado: Novos materiais de estudo disponiveis!</span>
        </div>
      </div>

      {loading ? (
        <section className="max-w-[1280px] mx-auto px-8 py-16">
          <GameGridSkeleton count={4} />
        </section>
      ) : (
        <>
          <section className="max-w-[1280px] mx-auto px-8 py-16 flex flex-col gap-6">
            <h2 className="text-3xl font-semibold text-[var(--on-surface)] text-center">Impacto do Hub</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-[var(--surface-container-low)] rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-[var(--outline-variant)]/20">
                <span className="text-3xl font-bold text-[var(--primary-text)]">{games.length}</span>
                <span className="text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wider">Jogos</span>
              </div>
              <div className="bg-[var(--surface-container-low)] rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-[var(--outline-variant)]/20">
                <span className="text-3xl font-bold text-[var(--secondary)]">{totalViews}</span>
                <span className="text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wider">Visualizacoes</span>
              </div>
              <div className="bg-[var(--surface-container-low)] rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-[var(--outline-variant)]/20">
                <span className="text-3xl font-bold text-[var(--primary-container-text)]">{totalDownloads}</span>
                <span className="text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wider">Downloads</span>
              </div>
              <div className="bg-[var(--surface-container-low)] rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-[var(--outline-variant)]/20">
                <span className="text-3xl font-bold text-[var(--secondary-container)]">{totalRatings}</span>
                <span className="text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wider">Avaliacoes</span>
              </div>
            </div>
          </section>

          <TopRatedGames games={games} />

          <section className="max-w-[1280px] mx-auto px-8 py-16">
            <h2 className="text-3xl font-semibold text-[var(--on-surface)] mb-8 text-center">Generos Populares</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {uniqueGenres.map((gen) => {
                const count = games.filter((g) => g.genres.includes(gen)).length;
                return (
                  <button
                    key={gen}
                    onClick={() => toggleGenre(gen)}
                    className={`border rounded-full px-6 py-2 flex items-center gap-3 transition-colors ${
                      selectedGenres.includes(gen)
                        ? "bg-[#00437b]/10 border-[var(--primary)]/40"
                        : "bg-[#00437b]/5 border-[var(--primary)]/20 hover:bg-[#00437b]/10"
                    }`}
                  >
                    <span className="font-semibold text-[var(--primary-text)]">{gen}</span>
                    <span className="bg-[var(--primary)] text-white text-xs rounded-full px-2 py-0.5">{count}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="bg-[var(--primary)] text-white py-16">
            <div className="max-w-[1280px] mx-auto px-8 flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 flex flex-col gap-6">
                <h2 className="text-3xl font-semibold">Sobre o Projeto</h2>
                <p className="text-white text-lg">
                  O SENAI Game Hub nasceu da necessidade de centralizar e dar visibilidade aos projetos desenvolvidos pelos alunos.
                  Mais do que um repositorio, e uma comunidade ativa onde conhecimento e talento se encontram.
                </p>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <h4 className="text-base font-semibold mb-2">Curso Tecnico</h4>
                  <p className="text-sm text-white">Focado em Programacao de Jogos Digitais com excelencia SENAI.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <h4 className="text-base font-semibold mb-2">Tecnologia Diversa</h4>
                  <p className="text-sm text-white">Projetos em Unity, Unreal, Godot e linguagens nativas.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <h4 className="text-base font-semibold mb-2">Comunidade Ativa</h4>
                  <p className="text-sm text-white">Alunos e professores colaborando para criar os melhores jogos.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <h4 className="text-base font-semibold mb-2">Qualidade Garantida</h4>
                  <p className="text-sm text-white">Todos os jogos passam por avaliacao docente antes de publicar.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-[1280px] mx-auto px-8 py-16 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-[var(--outline-variant)]/20 pb-6">
              <div>
                <h2 className="text-3xl font-semibold text-[var(--on-surface)]">
                  {(query || selectedGenres.length > 0 || selectedTechs.length > 0) ? t("home.results") : t("home.recentGames")}
                </h2>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  {filtered.length === 1 ? `1 ${t("home.game")}` : `${filtered.length} ${t("home.games")}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--outline)]" />
                  <input
                    className="w-full md:w-64 pl-9 pr-4 py-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    placeholder={t("home.searchBy")}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    title={t("home.searchTitle")}
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] focus:outline-none focus:border-[var(--primary)]"
                  title={t("home.sortTitle")}
                >
                  <option value="recent">{t("home.sortRecent")}</option>
                  <option value="rating">{t("home.sortRating")}</option>
                  <option value="mostRated">{t("home.sortMostRated")}</option>
                </select>
                <button
                  className="bg-[var(--surface-container-high)] px-4 py-2 rounded-lg border border-[var(--outline-variant)] text-[var(--on-surface)] hover:bg-[var(--surface-container-highest)] transition-colors flex items-center gap-2"
                  type="button"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros
                </button>
              </div>
            </div>

            {(uniqueGenres.length > 0 || uniqueTechs.length > 0) && (
              <div className="bg-[var(--surface-container-lowest)] rounded-xl border border-[var(--outline-variant)]/30 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[var(--primary-text)] font-semibold">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>{t("home.filters")}</span>
                    {(query || selectedGenres.length > 0 || selectedTechs.length > 0) && (
                      <span className="bg-[var(--secondary-container)] text-[var(--on-secondary-container)] text-xs font-bold px-2 py-0.5 rounded-full">
                        {[query ? 1 : 0, selectedGenres.length, selectedTechs.length].reduce((a, b) => a + b, 0)} {t("home.active")}
                      </span>
                    )}
                  </div>
                  {(query || selectedGenres.length > 0 || selectedTechs.length > 0) && (
                    <button
                      onClick={() => { setQuery(""); setSelectedGenres([]); setSelectedTechs([]); setSortBy("recent"); }}
                      className="text-xs text-[var(--outline)] hover:text-[var(--error)] transition-colors"
                    >
                      {t("home.clearAll")}
                    </button>
                  )}
                </div>
                {uniqueGenres.length > 0 && (
                  <div>
                    <p className="text-sm text-[var(--on-surface-variant)] mb-2">{t("home.genres")}</p>
                    <div className="flex flex-wrap gap-2">
                      {uniqueGenres.map((gen) => {
                        const active = selectedGenres.includes(gen);
                        return (
                          <button
                            key={gen}
                            onClick={() => toggleGenre(gen)}
                            className={`px-3 py-1 rounded-full text-sm border transition ${
                              active
                                ? "bg-[#00437b]/10 text-[var(--primary-text)] border-[var(--primary)]/40"
                                : "bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--primary-text)]"
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
                  <div>
                    <p className="text-sm text-[var(--on-surface-variant)] mb-2">{t("home.technologies")}</p>
                    <div className="flex flex-wrap gap-2">
                      {uniqueTechs.map((tech) => {
                        const active = selectedTechs.includes(tech);
                        return (
                          <button
                            key={tech}
                            onClick={() => toggleTech(tech)}
                            className={`px-3 py-1 rounded-full text-sm border transition ${
                              active
                                ? "bg-[var(--primary-fixed-dim)] text-[#001c39] border-[var(--primary-fixed-dim)]"
                                : "bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--primary)]"
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
            )}

            {recentGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recentGames.map((game) => (
                  <div
                    key={game.id}
                    className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden shadow-sm border border-[var(--outline-variant)]/20 flex flex-col group cursor-pointer"
                  >
                    <div className="w-full aspect-video bg-[var(--surface-dim)] flex flex-col items-center justify-center text-[var(--outline)] relative overflow-hidden">
                      {game.image ? (
                        <img src={game.image} alt={game.title} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-semibold uppercase">Sem imagem</span>
                      )}
                      <div className="absolute inset-0 bg-[#00437b]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link
                          href={`/games/${game.id}`}
                          className="bg-[var(--primary)] text-white px-3 py-1 rounded-md font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all"
                        >
                          Jogar
                        </Link>
                      </div>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--on-surface)]">{game.title}</h4>
                        <p className="text-xs text-[var(--on-surface-variant)]">{game.genres[0] ?? "-"}</p>
                      </div>
                      <span className="text-xs text-[var(--outline)]">
                        {new Date(game.releaseDate).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-16 text-[var(--outline)] gap-4">
                <SearchX className="w-14 h-14 text-[var(--primary-container)] opacity-60" />
                <p className="text-lg font-medium">{t("home.noneFound")}</p>
                <p className="text-sm text-[var(--outline)]">{t("home.adjustFilters")}</p>
              </div>
            )}

            {recentGames.length < filtered.length && (
              <div className="flex items-center justify-center mt-6">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded border border-[var(--outline-variant)] text-[var(--primary-text)] hover:border-[var(--primary-text)]"
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
