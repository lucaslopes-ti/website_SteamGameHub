"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Play,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

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

export default function Hero() {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalAuthors: 0,
    avgRating: 0,
    totalRatings: 0,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [topGames, setTopGames] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const animatedGames = useAnimatedCounter(stats.totalGames, 1500);
  const animatedAuthors = useAnimatedCounter(stats.totalAuthors, 1800);
  const animatedRating = useAnimatedCounter(stats.avgRating, 2200, 1);
  const animatedRatings = useAnimatedCounter(stats.totalRatings, 2000);

  useEffect(() => {
    fetch("/api/games?approved=true")
      .then((res) => res.json())
      .then((games) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const approved = games.filter((g: any) => g.approved);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const uniqueAuthors = new Set(approved.map((g: any) => g.authorEmail));
        const avgRating =
          approved.length > 0
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? approved.reduce((sum: number, g: any) => sum + (g.rating || 0), 0) /
              approved.length
            : 0;
        const totalRatings = approved.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sum: number, g: any) => sum + (g.totalRatings || 0),
          0
        );

        setStats({
          totalGames: approved.length,
          totalAuthors: uniqueAuthors.size,
          avgRating: avgRating,
          totalRatings,
        });

        if (approved.length > 0) {
          const m = 3;
          const C = avgRating || 0;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const getScore = (g: any) => {
            const v = g.totalRatings || 0;
            const R = g.rating || 0;
            if (v === 0) return 0;
            return (v * R + m * C) / (v + m);
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sorted = [...approved].sort((a: any, b: any) => getScore(b) - getScore(a));
          setTopGames(sorted.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

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
    timerRef.current = setInterval(() => {
      goNext();
    }, 5000);
  }, [goNext]);

  // Auto-rotação a cada 5 segundos
  useEffect(() => {
    if (topGames.length <= 1) return;
    timerRef.current = setInterval(() => {
      goNext();
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [topGames.length, goNext]);

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

  const ratingValue = stats.avgRating > 0 ? animatedRating.toFixed(1) : "-";
  const ratingSuffix = stats.avgRating > 0 ? "/ 5" : "";
  const locale = "pt-BR";

  const statsItems = [
    {
      icon: Star,
      value: ratingValue,
      suffix: ratingSuffix,
      label: "Avaliação média",
      ring: "ring-senai-orange/40",
      iconColor: "text-senai-orange",
    },
    {
      icon: Gamepad2,
      value: Math.round(animatedGames).toLocaleString(locale),
      label: "Jogos publicados",
      ring: "ring-senai-blueLight/40",
      iconColor: "text-senai-blueLight",
    },
    {
      icon: Users,
      value: Math.round(animatedAuthors).toLocaleString(locale),
      label: "Desenvolvedores",
      ring: "ring-emerald-400/40",
      iconColor: "text-emerald-300",
    },
    {
      icon: BarChart3,
      value: Math.round(animatedRatings).toLocaleString(locale),
      label: "Avaliações",
      ring: "ring-yellow-400/40",
      iconColor: "text-yellow-300",
    },
  ];

  return (
    <section ref={heroRef} className="relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute inset-0 bg-gradient-glow" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-senai-blueLight/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-senai-orange/20 rounded-full blur-[140px]" />

      <div className="container mx-auto px-6 sm:px-8 pt-16 pb-24 md:pt-24 md:pb-32 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono uppercase tracking-[0.2em] text-senai-orange">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.2} />
              Técnico em Programação de Jogos
            </div>

            <div className="space-y-3">
              <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tighter">
                <span className="block text-gradient-blue">SENAI</span>
                <span className="block text-gradient-orange">Game Hub</span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
              A vitrine oficial dos jogos autorais criados pelos alunos do curso Técnico em Programação de Jogos.
              Descubra, jogue e avalie experiências interativas feitas por novos talentos.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/games"
                className="group inline-flex items-center gap-2 rounded-full bg-senai-orange px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-glow-orange transition hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4" strokeWidth={2.2} />
                Explorar jogos
              </Link>
              <Link
                href="/upload"
                className="group inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white/90 transition hover:border-senai-orange/60"
              >
                Enviar meu jogo
                <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-senai-blue/40">
              {statsItems.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl bg-senai-blueDark/70 border border-senai-blue/40 ring-1 ${stat.ring} flex items-center justify-center shadow-[0_12px_30px_rgba(0,39,118,0.25)]`}
                    >
                      <Icon className={`w-5 h-5 ${stat.iconColor}`} strokeWidth={2.1} />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1 text-gray-300 font-bold text-xl md:text-2xl">
                        <span>{stat.value}</span>
                        {stat.suffix && <span className="text-sm text-gray-400">{stat.suffix}</span>}
                      </div>
                      <p className="text-[11px] uppercase tracking-widest text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== CARD DO JOGO EM DESTAQUE COM TRANSIÇÃO ===== */}
          <div className="lg:col-span-5 relative">
            <div className="relative animate-float">
              <div className="absolute -inset-8 bg-gradient-to-br from-senai-orange/30 via-senai-blueLight/20 to-transparent blur-3xl rounded-full" />

              <div className="relative rounded-2xl overflow-hidden glass-strong shadow-hero">
                <div className="relative aspect-[3/4] overflow-hidden">
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
                      <div className="absolute inset-0 bg-gradient-to-br from-senai-blueDark to-senai-blue" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-senai-dark via-senai-dark/40 to-transparent" />

                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-senai-orange text-white text-[10px] font-bold uppercase tracking-wider shadow-glow-orange">
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
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-senai-dark/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-senai-dark/80 transition-all z-10"
                        aria-label="Jogo anterior"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-senai-dark/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-senai-dark/80 transition-all z-10"
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
                    <h3 className="font-gaming font-bold text-2xl leading-tight mb-1 text-white">
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
                  <div className="absolute bottom-[120px] left-0 right-0 flex justify-center gap-2 z-10">
                    {topGames.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDotClick(idx)}
                        className={`rounded-full transition-all duration-300 ${
                          idx === currentIndex
                            ? "w-6 h-2 bg-senai-orange shadow-glow-orange"
                            : "w-2 h-2 bg-white/40 hover:bg-white/70"
                        }`}
                        aria-label={`Ir para jogo ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="absolute -top-3 -right-3 w-16 h-16 border-2 border-senai-orange/40 rounded-tr-2xl" />
              <div className="absolute -bottom-3 -left-3 w-16 h-16 border-2 border-senai-blueLight/40 rounded-bl-2xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full bg-senai-blueDark text-white py-2 overflow-hidden z-30 shadow-lg">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest text-senai-orange font-sans">
            HUB Atualizado: Novos jogos adicionados
          </span>
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest opacity-50 font-sans">•</span>
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest text-senai-blueLight font-sans">
            Acesse agora e deixe sua avaliação
          </span>
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest opacity-50 font-sans">•</span>
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest text-senai-orange font-sans">
            HUB Atualizado: Novos jogos adicionados
          </span>
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest opacity-50 font-sans">•</span>
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest text-senai-blueLight font-sans">
            Acesse agora e deixe sua avaliação
          </span>
        </div>
      </div>
    </section>
  );
}
