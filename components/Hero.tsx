"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Gamepad2,
  Play,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Game } from "@/lib/games";
import GameCoverFallback from "@/components/GameCoverFallback";

function useAnimatedCounter(target: number, duration = 2000, decimals = 0) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target <= 0) return;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Number.parseFloat((eased * target).toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, decimals]);

  return count;
}

interface HeroProps {
  games: Game[];
  totalViews: number;
  totalDownloads: number;
}

export default function Hero({ games, totalViews, totalDownloads }: Readonly<HeroProps>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Pausa a rotação automática enquanto o usuário interage (WCAG 2.2.2)
  const [isPaused, setIsPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const approved = useMemo(() => games.filter((g) => g.approved), [games]);
  const totalAuthors = useMemo(() => new Set(approved.map((g) => g.authorEmail)).size, [approved]);

  // Destaques: média bayesiana (evita que 1 voto 5★ passe na frente de jogos bem avaliados por muitos)
  const topGames = useMemo(() => {
    if (approved.length === 0) return [];
    const m = 3;
    const C = approved.reduce((sum, g) => sum + (g.rating || 0), 0) / approved.length;
    const getScore = (g: Game) => {
      const v = g.totalRatings || 0;
      const R = g.rating || 0;
      if (v === 0) return 0;
      return (v * R + m * C) / (v + m);
    };
    return [...approved].sort((a, b) => getScore(b) - getScore(a)).slice(0, 5);
  }, [approved]);

  const animatedGames = useAnimatedCounter(approved.length, 1500);
  const animatedAuthors = useAnimatedCounter(totalAuthors, 1800);
  const animatedViews = useAnimatedCounter(totalViews, 2200);
  const animatedDownloads = useAnimatedCounter(totalDownloads, 2000);

  // Troca com transição suave (fade out → troca → fade in)
  const goToIndex = useCallback(
    (newIndex: number) => {
      if (isTransitioning || topGames.length <= 1) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(newIndex % topGames.length);
        setIsTransitioning(false);
      }, 400);
    },
    [isTransitioning, topGames.length]
  );

  const goNext = useCallback(() => {
    goToIndex((currentIndex + 1) % topGames.length);
  }, [currentIndex, goToIndex, topGames.length]);

  const goPrev = useCallback(() => {
    goToIndex((currentIndex - 1 + topGames.length) % topGames.length);
  }, [currentIndex, goToIndex, topGames.length]);

  // Reset do timer automático ao navegar manualmente
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      goNext();
    }, 5000);
  }, [goNext, isPaused]);

  // Auto-rotação a cada 5 segundos (desligada com movimento reduzido ou em pausa)
  useEffect(() => {
    if (topGames.length <= 1 || isPaused) return;
    if (globalThis.window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    timerRef.current = setInterval(() => {
      goNext();
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [topGames.length, goNext, isPaused]);

  const handleDotClick = (index: number) => {
    goToIndex(index);
    resetTimer();
  };

  const handlePrev = () => {
    goPrev();
    resetTimer();
  };

  const handleNext = () => {
    goNext();
    resetTimer();
  };

  const topGame = topGames[currentIndex] || null;

  const locale = "pt-BR";

  // Único lugar da home com os números do Hub
  const statsItems = [
    { icon: Gamepad2, value: animatedGames, label: "Jogos publicados", iconColor: "text-senai-blueLight" },
    { icon: Users, value: animatedAuthors, label: "Desenvolvedores", iconColor: "text-senai-orange" },
    { icon: Eye, value: animatedViews, label: "Visualizações", iconColor: "text-senai-blueLight" },
    { icon: Download, value: animatedDownloads, label: "Downloads", iconColor: "text-senai-orange" },
  ];

  return (
    <section ref={heroRef} className="relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute inset-0 bg-gradient-glow" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-senai-blueLight/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-senai-orange/20 rounded-full blur-[140px]" />

      <div className="container mx-auto px-6 sm:px-8 pt-12 pb-16 md:pt-20 md:pb-24 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono uppercase tracking-[0.2em] text-senai-orange">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.2} />
              Aberto a todos os alunos SENAI
            </div>

            <div className="space-y-3">
              <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tighter">
                <span className="block text-gradient-blue">SENAI</span>
                <span className="block text-gradient-orange">Game Hub</span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
              A vitrine oficial dos jogos e projetos criados por alunos do SENAI, de todos os cursos.
              Descubra, jogue, avalie e publique as suas criações.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/games"
                className="group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-senai-orange px-6 py-3 text-base font-bold text-slate-950 shadow-glow-orange transition hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4" strokeWidth={2.2} aria-hidden="true" />
                Explorar jogos
              </Link>
              <Link
                href="/upload"
                className="group inline-flex min-h-[48px] items-center gap-2 rounded-full glass px-6 py-3 text-base font-semibold text-white/90 transition hover:border-senai-orange/60 hover:text-white"
              >
                Enviar meu jogo
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} aria-hidden="true" />
              </Link>
            </div>

            <dl className="grid !grid-cols-2 gap-x-6 gap-y-5 pt-6 border-t border-senai-blue/40">
              {statsItems.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 shrink-0 rounded-xl bg-senai-blueDark/70 border border-senai-blue/40 flex items-center justify-center shadow-[0_12px_30px_rgba(0,39,118,0.25)]"
                    >
                      <Icon className={`w-5 h-5 ${stat.iconColor}`} strokeWidth={2.1} aria-hidden="true" />
                    </div>
                    <div className="flex flex-col">
                      <dt className="order-2 text-sm text-gray-400">{stat.label}</dt>
                      <dd className="order-1 text-white font-bold text-xl md:text-2xl tabular-nums">
                        {Math.round(stat.value).toLocaleString(locale)}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>

          {/* ===== CARD DO JOGO EM DESTAQUE COM TRANSIÇÃO ===== */}
          <div className="lg:col-span-5 relative">
            <div className="relative animate-float">
              <div className="absolute -inset-8 bg-gradient-to-br from-senai-orange/30 via-senai-blueLight/20 to-transparent blur-3xl rounded-full" />

              <div
                className="relative rounded-2xl overflow-hidden glass-strong shadow-hero"
                role="region"
                aria-roledescription="carrossel"
                aria-label="Jogos em destaque"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsPaused(false);
                }}
              >
                <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[3/4] overflow-hidden">
                  {/* Imagem com transição fade */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                    style={{ opacity: isTransitioning ? 0 : 1 }}
                  >
                    {topGame?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={topGame.image}
                        alt={topGame.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <GameCoverFallback title={topGame?.title ?? "SENAI Game Hub"} size="lg" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-senai-dark via-senai-dark/40 to-transparent" />

                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-senai-orange text-slate-950 text-[10px] font-bold uppercase tracking-wider shadow-glow-orange">
                    <TrendingUp className="w-3 h-3" strokeWidth={2.3} />
                    Em destaque
                  </div>

                  <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full glass text-xs font-bold">
                    <Star className="w-3.5 h-3.5 text-senai-orange fill-senai-orange" strokeWidth={1.5} />
                    {topGame ? topGame.rating?.toFixed(1) || "-" : "-"}
                  </div>

                  {/* Setas de navegação */}
                  {topGames.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-senai-dark/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-senai-dark/80 transition-all z-10"
                        aria-label="Jogo anterior"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-senai-dark/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-senai-dark/80 transition-all z-10"
                        aria-label="Próximo jogo"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Informações do jogo com fade */}
                <div
                  className="p-6 space-y-4 transition-opacity duration-500 ease-in-out"
                  style={{ opacity: isTransitioning ? 0 : 1 }}
                >
                  <div>
                    <h3 className="font-gaming font-bold text-2xl leading-tight mb-1 text-white line-clamp-2" aria-live={isPaused ? "polite" : "off"}>
                      {topGame ? topGame.title : "Projeto em destaque"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      por <span className="text-senai-orange font-semibold">{topGame ? topGame.author : "Equipe SENAI"}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Star className="w-3.5 h-3.5 text-senai-orange" strokeWidth={2.2} />
                      {topGame ? (topGame.totalRatings || 0).toLocaleString(locale) : "0"} avaliações
                    </div>
                    {topGame ? (
                      <Link
                        href={`/games/${topGame.id}`}
                        className="inline-flex items-center gap-1 text-senai-orange hover:text-senai-blueLight transition-colors"
                      >
                        Ver detalhes
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </Link>
                    ) : (
                      <span className="text-gray-500">Em breve</span>
                    )}
                  </div>
                </div>

                {/* Dots de navegação */}
                {topGames.length > 1 && (
                  <div className="absolute bottom-[112px] left-0 right-0 flex justify-center z-10">
                    {topGames.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleDotClick(idx)}
                        className="group/dot flex h-6 items-center justify-center px-1"
                        aria-label={`Ir para jogo ${idx + 1} de ${topGames.length}`}
                        aria-current={idx === currentIndex ? "true" : undefined}
                      >
                        <span
                          className={`block rounded-full transition-all duration-300 ${
                            idx === currentIndex
                              ? "w-6 h-2 bg-senai-orange shadow-glow-orange"
                              : "w-2 h-2 bg-white/40 group-hover/dot:bg-white/70"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
