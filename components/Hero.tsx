"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

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
  });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [topGame, setTopGame] = useState<any>(null);
  const heroRef = useRef<HTMLElement>(null);

  const animatedGames = useAnimatedCounter(stats.totalGames, 1500);
  const animatedAuthors = useAnimatedCounter(stats.totalAuthors, 1800);
  const animatedRating = useAnimatedCounter(stats.avgRating, 2200, 1);

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

        setStats({
          totalGames: approved.length,
          totalAuthors: uniqueAuthors.size,
          avgRating: avgRating,
        });

        if (approved.length > 0) {
          // Evita que um jogo com 1 avaliação nota 5 ultrapasse jogos populares
          // Usando uma variação de Média Bayesiana para calcular a relevância
          const m = 3; // Peso mínimo de votos para relevância
          const C = avgRating || 0; // Média global do hub
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const getScore = (g: any) => {
            const v = g.totalRatings || 0;
            const R = g.rating || 0;
            if (v === 0) return 0;
            return ((v * R) + (m * C)) / (v + m);
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sorted = [...approved].sort((a: any, b: any) => getScore(b) - getScore(a));
          setTopGame(sorted[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      ref={heroRef}
      className={`relative min-h-screen flex items-center justify-center pt-24 overflow-hidden transition-colors duration-500`}
    >
      {/* Background Dynamics SENAI */}
      <div className="blob" style={{ left: '20%', top: '20%', pointerEvents: 'none' }}></div>
      <div className="scanlines" style={{ mixBlendMode: 'overlay', opacity: 0.5 }}></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full grid lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-20 pb-20">
        
        {/* Left Text Content */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center gap-4">
            <span className="h-[2px] w-12 bg-senai-orange"></span>
            <span className="uppercase tracking-[0.2em] sm:tracking-[0.4em] text-senai-orange font-bold text-xs sm:text-sm">
              Técnico em Programação de Jogos
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-gaming font-black leading-[0.85] tracking-tighter">
            <span className="block mb-2 text-senai-blueDark dark:text-senai-blueLight drop-shadow-md">SENAI</span>
            <span 
              className="glitch text-transparent bg-clip-text bg-gradient-to-r from-senai-orange via-senai-blueLight to-senai-blue" 
              data-text="Game Hub"
            >
              Game Hub
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed font-light font-sans">
            Não somos apenas um repositório. Somos o <span className="text-senai-blue dark:text-senai-blueLight font-bold italic">SENAI Hub</span>. 
            Acesse jogos inovadores, protótipos e experiências desenvolvidas pelos criativos estudantes do SENAI Dr. Celso Charuri.
          </p>

          <div className="flex flex-wrap gap-6 items-center pt-4">
            <Link href="/games">
              <button className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-senai-blue font-black uppercase tracking-widest text-xs sm:text-sm overflow-hidden skew-x-[-15deg] transition-all hover:bg-senai-orange text-white shadow-xl shadow-senai-blue/20 hover:shadow-senai-orange/40">
                <span className="relative z-10 block skew-x-[15deg] font-sans">Explorar Jogos</span>
                <div className="absolute top-0 left-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </button>
            </Link>
            
            <div className="flex flex-col border-l-2 border-senai-blue/30 pl-6">
              <span className="text-senai-orange font-bold text-2xl font-gaming">{stats.avgRating > 0 ? animatedRating : "-"} / 5</span>
              <span className="text-gray-500 text-[10px] uppercase tracking-widest font-sans">Avaliação Média Global</span>
            </div>
          </div>
          
          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-10 border-t border-senai-grayLight dark:border-white/10">
            <div>
              <div className="text-2xl sm:text-3xl font-gaming font-bold text-senai-blue dark:text-senai-blueLight drop-shadow-sm">{animatedGames}</div>
              <div className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-widest mt-1 font-sans">Jogos Publicados</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-gaming font-bold text-senai-orange drop-shadow-sm">{animatedAuthors}</div>
              <div className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-widest mt-1 font-sans">Desenvolvedores</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-gaming font-bold text-yellow-500 drop-shadow-sm">99%</div>
              <div className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-widest mt-1 font-sans">Projetos Ativos</div>
            </div>
          </div>
        </div>

        {/* 3D Visual Right (Hidden on mobile for better flow) */}
        <div className="lg:col-span-5 relative perspective-container hidden lg:block">
          <div className="card-3d relative bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-senai-blue/20 dark:border-white/10 p-8 rounded-3xl">
            {/* UI Overlay Corners */}
            <div className="absolute -top-6 -right-6 w-32 h-32 border-t-4 border-r-4 border-senai-orange rounded-tr-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-b-4 border-l-4 border-senai-blue rounded-bl-3xl opacity-50 pointer-events-none"></div>
            
            <div className="space-y-6 card-3d-content">
              <div className="aspect-[4/5] rounded-2xl bg-senai-blueDark relative overflow-hidden group shadow-2xl border border-white/10">
                {/* Game Image */}
                {topGame?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={topGame.image} 
                    alt={topGame.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-senai-blueDark to-senai-blue opacity-50"></div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#001a4d] via-black/40 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-80"></div>
                
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <span className="px-3 py-1 bg-senai-orange text-white text-[10px] font-bold rounded-full uppercase mb-3 inline-block shadow-lg font-sans">
                    Destaque do Mês
                  </span>
                  <h4 className="text-3xl font-gaming font-black text-white leading-tight line-clamp-2 drop-shadow-lg">
                    {topGame ? topGame.title : "PROJETO ALPHA"}
                  </h4>
                  {topGame && (
                    <p className="text-gray-200 text-sm mt-2 font-medium line-clamp-1 font-sans drop-shadow-md">por {topGame.author}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-bold font-sans">Avaliação do Jogo</p>
                  <div className="flex gap-1 items-end">
                    <div className="w-1.5 h-3 bg-senai-blueLight rounded-t-sm"></div>
                    <div className="w-1.5 h-4 bg-senai-blueLight rounded-t-sm"></div>
                    <div className="w-1.5 h-5 bg-senai-blueLight rounded-t-sm"></div>
                    <div className="w-1.5 h-6 bg-senai-blue rounded-t-sm"></div>
                    <span className="ml-2 text-sm font-black font-gaming text-senai-blueDark dark:text-white">
                      {topGame ? topGame.rating?.toFixed(1) || "5.0" : "5.0"}
                    </span>
                  </div>
                </div>
                {topGame ? (
                  <Link href={`/games/${topGame.id}`}>
                    <button className="bg-senai-blueDark text-white px-6 py-2 rounded-full font-bold text-xs uppercase hover:bg-senai-orange transition-colors shadow-lg font-sans btn-neon border border-transparent">
                      Ver Detalhes
                    </button>
                  </Link>
                ) : (
                  <button className="bg-senai-blueDark text-white px-6 py-2 rounded-full font-bold text-xs uppercase hover:bg-senai-orange transition-colors shadow-lg font-sans cursor-not-allowed">
                    Em Breve
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-senai-orange/20 blur-2xl rounded-full animate-pulse pointer-events-none"></div>
          <div className="absolute top-1/2 -right-20 w-40 h-1 bg-gradient-to-r from-transparent via-senai-blueLight to-transparent rotate-45 pointer-events-none"></div>
        </div>

      </div>

      {/* Marquee Ticker */}
      <div className="absolute bottom-0 w-full bg-senai-blueDark text-white py-2 overflow-hidden z-30 shadow-lg">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest text-senai-orange font-sans">HUB Atualizado: Novos jogos adicionados</span>
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest opacity-50 font-sans">•</span>
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest text-senai-blueLight font-sans">Acesse agora e deixe sua avaliação</span>
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest opacity-50 font-sans">•</span>
          {/* Duplicate for infinite effect */}
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest text-senai-orange font-sans">HUB Atualizado: Novos jogos adicionados</span>
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest opacity-50 font-sans">•</span>
          <span className="mx-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest text-senai-blueLight font-sans">Acesse agora e deixe sua avaliação</span>
        </div>
      </div>
    </section>
  );
}
