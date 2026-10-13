"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import Link from "next/link";
import { Game } from "@/lib/games";
import {
  ArrowRight,
  Award,
  Cpu,
  Download,
  Eye,
  Gamepad2,
  GraduationCap,
  Search,
  SearchX,
  SlidersHorizontal,
  Tags,
  Upload,
  Users,
  X,
} from "lucide-react";
import { GameGridSkeleton } from "@/components/SkeletonLoader";
import { useI18n } from "@/components/I18nProvider";
import Hero from "@/components/Hero";
import TopRatedGames from "@/components/TopRatedGames";
import GameCard from "@/components/GameCard";

// Container e ritmo vertical únicos para todas as seções da home
const CONTAINER = "max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8";
const SECTION_Y = "py-14 md:py-20";

function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  action,
}: Readonly<{
  id: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--secondary)]">{eyebrow}</p>
        <h2 id={id} className="mt-2 font-display text-2xl md:text-3xl font-bold text-[var(--on-surface)] text-balance">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm md:text-base text-[var(--on-surface-variant)] leading-relaxed">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

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
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const catalogRef = useRef<HTMLElement | null>(null);

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

  // Gêneros populares: ordenados pela quantidade de jogos (mais populares primeiro)
  const popularGenres = uniqueGenres
    .map((gen) => ({ gen, count: games.filter((g) => g.genres.includes(gen)).length }))
    .sort((a, b) => b.count - a.count || a.gen.localeCompare(b.gen, undefined, { sensitivity: "base" }));

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

  // Clique num gênero popular filtra o catálogo e leva o usuário até o resultado
  const handlePopularGenre = (gen: string) => {
    toggleGenre(gen);
    const reduceMotion = globalThis.window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    catalogRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedGenres([]);
    setSelectedTechs([]);
    setSortBy("recent");
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

  const recentGames = sorted.slice(0, page * pageSize);

  const locale = "pt-BR";
  const totalViews = stats?.totalViews ?? 0;
  const totalDownloads = stats?.totalDownloads ?? 0;
  const activeFilterCount = (query.trim() ? 1 : 0) + selectedGenres.length + selectedTechs.length;
  const hasActiveFilters = activeFilterCount > 0;

  const impactItems = [
    { icon: Gamepad2, value: games.length, label: "Jogos publicados", color: "text-[var(--primary-text)]" },
    { icon: Eye, value: totalViews, label: "Visualizações", color: "text-[var(--secondary)]" },
    { icon: Download, value: totalDownloads, label: "Downloads", color: "text-[var(--primary-container-text)]" },
    { icon: Tags, value: uniqueGenres.length, label: "Gêneros", color: "text-[var(--secondary)]" },
  ];

  const aboutItems = [
    { icon: GraduationCap, title: "Curso Técnico", text: "Focado em Programação de Jogos Digitais com a excelência SENAI." },
    { icon: Cpu, title: "Tecnologia diversa", text: "Projetos em Unity, Unreal, Godot e linguagens nativas." },
    { icon: Users, title: "Comunidade ativa", text: "Alunos e professores colaborando para criar os melhores jogos." },
    { icon: Award, title: "Qualidade garantida", text: "Todos os jogos passam por avaliação docente antes de serem publicados." },
  ];

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

  const chipBase =
    "inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200";
  const chipIdle =
    "bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--primary-text)] hover:text-[var(--on-surface)]";
  const chipActive = "bg-[var(--primary)] text-white border-[var(--primary-text)]";

  return (
    <div className="bg-[var(--surface)] text-[var(--on-surface)]">
      <Hero />

      {loading ? (
        <section className={`${CONTAINER} ${SECTION_Y}`} aria-busy="true" aria-label="Carregando jogos">
          <GameGridSkeleton count={4} />
        </section>
      ) : (
        <>
          <section aria-labelledby="impacto-title" className={`${CONTAINER} ${SECTION_Y} flex flex-col gap-8`}>
            <SectionHeader
              id="impacto-title"
              eyebrow="Em números"
              title="Impacto do Hub"
              description="O alcance dos projetos criados pelos alunos SENAI."
            />
            {/* "!" vence a regra global de .grid no mobile (globals.css), mantendo 2 colunas */}
            <dl className="grid !grid-cols-2 lg:!grid-cols-4 gap-4 md:gap-6">
              {impactItems.map(({ icon: Icon, value, label, color }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[var(--outline-variant)]/60 bg-[var(--surface-container)] p-5 md:p-6 flex flex-col gap-3 transition-colors hover:border-[var(--primary-text)]/40"
                >
                  <Icon className={`w-6 h-6 ${color}`} strokeWidth={2} aria-hidden="true" />
                  <dt className="order-3 text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)]">
                    {label}
                  </dt>
                  <dd className={`order-2 text-3xl md:text-4xl font-bold tabular-nums ${color}`}>
                    {value.toLocaleString(locale)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <TopRatedGames games={games} />

          {popularGenres.length > 0 && (
            <section aria-labelledby="generos-title" className={`${CONTAINER} ${SECTION_Y} flex flex-col gap-8`}>
              <SectionHeader
                id="generos-title"
                eyebrow="Explore por estilo"
                title="Gêneros populares"
                description="Escolha um ou mais gêneros para filtrar o catálogo abaixo."
              />
              <div className="flex flex-wrap gap-3" role="group" aria-label="Filtrar por gênero">
                {popularGenres.map(({ gen, count }) => {
                  const active = selectedGenres.includes(gen);
                  return (
                    <button
                      key={gen}
                      type="button"
                      onClick={() => handlePopularGenre(gen)}
                      aria-pressed={active}
                      className={`${chipBase} pl-5 pr-2 ${active ? chipActive : chipIdle}`}
                    >
                      <span>{gen}</span>
                      <span
                        className={`min-w-[1.75rem] rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
                          active ? "bg-white/20 text-white" : "bg-[var(--surface-container-high)] text-[var(--on-surface)]"
                        }`}
                        aria-label={`${count} ${count === 1 ? t("home.game") : t("home.games")}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <section aria-labelledby="sobre-title" className="bg-[var(--primary-container)] text-white">
            <div className={`${CONTAINER} ${SECTION_Y} grid gap-10 lg:grid-cols-2 lg:gap-16 items-center`}>
              <div className="flex flex-col gap-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--secondary)]">Sobre o projeto</p>
                <h2 id="sobre-title" className="font-display text-2xl md:text-3xl font-bold text-balance">
                  Uma vitrine para o talento dos alunos SENAI
                </h2>
                <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-xl">
                  O SENAI Game Hub nasceu da necessidade de centralizar e dar visibilidade aos projetos desenvolvidos
                  pelos alunos. Mais do que um repositório, é uma comunidade ativa onde conhecimento e talento se encontram.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/upload"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--secondary-container)] px-6 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:brightness-110"
                  >
                    <Upload className="w-4 h-4" strokeWidth={2.2} aria-hidden="true" />
                    Publicar meu jogo
                  </Link>
                  <Link
                    href="/games"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/40 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Ver todos os jogos
                    <ArrowRight className="w-4 h-4" strokeWidth={2.2} aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aboutItems.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="rounded-2xl border border-white/15 bg-white/5 p-5 md:p-6">
                    <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
                      <Icon className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold mb-1.5">{title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            ref={catalogRef}
            id="catalogo"
            aria-labelledby="catalogo-title"
            className={`${CONTAINER} ${SECTION_Y} flex flex-col gap-6 scroll-mt-24`}
          >
            <SectionHeader
              id="catalogo-title"
              eyebrow="Catálogo"
              title={hasActiveFilters ? t("home.results") : t("home.recentGames")}
              description={
                <span aria-live="polite">
                  {filtered.length === 1 ? `1 ${t("home.game")}` : `${filtered.length.toLocaleString(locale)} ${t("home.games")}`}
                </span>
              }
            />

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <label htmlFor="home-search" className="sr-only">{t("home.searchBy")}</label>
                <Search className="pointer-events-none w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" aria-hidden="true" />
                <input
                  id="home-search"
                  className="w-full min-h-[44px] pl-10 pr-10 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)] transition-colors hover:border-[var(--outline)] focus:outline-none focus:border-[var(--primary-text)] focus:ring-2 focus:ring-[var(--primary-text)]/30"
                  placeholder={t("home.searchBy")}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  title={t("home.searchTitle")}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)] hover:text-[var(--on-surface)]"
                    aria-label="Limpar busca"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <label htmlFor="home-sort" className="sr-only">{t("home.sortBy")}</label>
                <select
                  id="home-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="flex-1 md:flex-none min-h-[44px] px-4 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] transition-colors hover:border-[var(--outline)] focus:outline-none focus:border-[var(--primary-text)] focus:ring-2 focus:ring-[var(--primary-text)]/30"
                  title={t("home.sortTitle")}
                >
                  <option value="recent">{t("home.sortRecent")}</option>
                  <option value="rating">{t("home.sortRating")}</option>
                  <option value="mostRated">{t("home.sortMostRated")}</option>
                </select>
                {(uniqueGenres.length > 0 || uniqueTechs.length > 0) && (
                  <button
                    type="button"
                    onClick={() => setShowFilters((v) => !v)}
                    aria-expanded={showFilters}
                    aria-controls="home-filters"
                    className={`min-h-[44px] px-4 rounded-xl border flex items-center gap-2 font-medium transition-colors ${
                      showFilters
                        ? "border-[var(--primary-text)] bg-[var(--surface-container-high)] text-[var(--on-surface)]"
                        : "border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] hover:border-[var(--outline)]"
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                    {t("home.filters")}
                    {hasActiveFilters && (
                      <span className="rounded-full bg-[var(--secondary-container)] px-2 py-0.5 text-xs font-bold text-[var(--on-secondary-container)] tabular-nums">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2" aria-label="Filtros ativos">
                {[...selectedGenres.map((v) => ({ v, remove: () => toggleGenre(v) })),
                  ...selectedTechs.map((v) => ({ v, remove: () => toggleTech(v) }))].map(({ v, remove }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={remove}
                    className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full bg-[var(--primary)] pl-3 pr-2 text-xs font-semibold text-white hover:brightness-110"
                    aria-label={`Remover filtro ${v}`}
                  >
                    {v}
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="min-h-[32px] px-2 text-xs font-semibold text-[var(--on-surface-variant)] underline-offset-4 hover:text-[var(--secondary)] hover:underline"
                >
                  {t("home.clearAll")}
                </button>
              </div>
            )}

            {showFilters && (uniqueGenres.length > 0 || uniqueTechs.length > 0) && (
              <div
                id="home-filters"
                className="rounded-2xl border border-[var(--outline-variant)]/60 bg-[var(--surface-container-lowest)] p-5 md:p-6 flex flex-col gap-5 animate-fadeIn"
              >
                {uniqueGenres.length > 0 && (
                  <fieldset>
                    <legend className="text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-3">
                      {t("home.genres")}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {uniqueGenres.map((gen) => {
                        const active = selectedGenres.includes(gen);
                        return (
                          <button
                            key={gen}
                            type="button"
                            onClick={() => toggleGenre(gen)}
                            aria-pressed={active}
                            className={`${chipBase} ${active ? chipActive : chipIdle}`}
                            title={active ? t("home.removeGenre") : t("home.addGenre")}
                          >
                            {gen}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}
                {uniqueTechs.length > 0 && (
                  <fieldset>
                    <legend className="text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-3">
                      {t("home.technologies")}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {uniqueTechs.map((tech) => {
                        const active = selectedTechs.includes(tech);
                        return (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => toggleTech(tech)}
                            aria-pressed={active}
                            className={`${chipBase} ${active ? chipActive : chipIdle}`}
                            title={active ? t("home.removeTech") : t("home.addTech")}
                          >
                            {tech}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}
              </div>
            )}

            {recentGames.length > 0 ? (
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {recentGames.map((game) => (
                  <GameCard key={game.id} game={game} variant="compact" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[var(--outline-variant)] py-16 px-6 text-center">
                <SearchX className="w-12 h-12 text-[var(--primary-container-text)]" aria-hidden="true" />
                <p className="text-lg font-semibold text-[var(--on-surface)]">{t("home.noneFound")}</p>
                <p className="text-sm text-[var(--on-surface-variant)]">{t("home.adjustFilters")}</p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-2 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--primary-text)] px-5 text-sm font-semibold text-[var(--primary-text)] transition-colors hover:bg-[var(--primary-text)]/10"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                    {t("home.clearAll")}
                  </button>
                )}
              </div>
            )}

            {recentGames.length < filtered.length && (
              <div className="flex items-center justify-center mt-4">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--outline-variant)] px-6 text-sm font-semibold text-[var(--primary-text)] transition-colors hover:border-[var(--primary-text)] hover:bg-[var(--primary-text)]/10"
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
