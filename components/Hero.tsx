"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Play, ArrowRight, Gamepad2, Users, Award } from "lucide-react";

export default function Hero() {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalAuthors: 0,
    avgRating: 0,
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch("/api/games?approved=true")
      .then((res) => res.json())
      .then((games) => {
        const approved = games.filter((g: any) => g.approved);
        const uniqueAuthors = new Set(approved.map((g: any) => g.authorEmail));
        const avgRating =
          approved.length > 0
            ? approved.reduce((sum: number, g: any) => sum + (g.rating || 0), 0) /
              approved.length
            : 0;

        setStats({
          totalGames: approved.length,
          totalAuthors: uniqueAuthors.size,
          avgRating: avgRating,
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(102, 192, 244, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, #0a1428 0%, #1b2838 50%, #2a475e 100%)
        `,
      }}
    >
      {/* Linhas sutis de profundidade */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(102, 192, 244, 0.03) 2px,
            rgba(102, 192, 244, 0.03) 4px
          )`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header section */}
          <div className="mb-16">
            <div className="inline-block mb-6">
              <span className="text-steam-blueLight text-sm font-medium tracking-wider uppercase">
                Dr. Celso Charuri
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight">
              <span className="block mb-2 animate-slideIn">SENAI</span>
              <span className="block bg-gradient-to-r from-steam-blueLight via-steam-green to-steam-blueLight bg-clip-text text-transparent leading-none gradient-text-animated">
                Game HUB
              </span>
            </h1>

            <div className="max-w-2xl">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-4 font-light">
                Repositório de jogos digitais desenvolvidos por estudantes do curso Técnico em Programação de Jogos Digitais.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Uma plataforma onde criatividade e tecnologia se encontram para criar experiências únicas.
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="group stagger-item">
              <div className="glass-card border border-steam-blue/20 rounded-xl p-6 transition-all duration-300 hover:border-steam-blueLight/40 hover:bg-steam-dark/70 hover-lift-modern">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-steam-blue/10 rounded-lg float-animation">
                    <Gamepad2 className="w-6 h-6 text-steam-blueLight" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-white mb-1">
                      {stats.totalGames}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">Jogos</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group stagger-item">
              <div className="glass-card border border-steam-blue/20 rounded-xl p-6 transition-all duration-300 hover:border-steam-green/40 hover:bg-steam-dark/70 hover-lift-modern">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-steam-green/10 rounded-lg float-animation">
                    <Users className="w-6 h-6 text-steam-green" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-white mb-1">
                      {stats.totalAuthors}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">Desenvolvedores</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group stagger-item">
              <div className="glass-card border border-steam-blue/20 rounded-xl p-6 transition-all duration-300 hover:border-yellow-400/40 hover:bg-steam-dark/70 hover-lift-modern">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-yellow-400/10 rounded-lg float-animation">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-white mb-1">
                      {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "-"}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">Avaliação</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/games"
              className="group relative flex items-center justify-center gap-3 bg-steam-blueLight hover:bg-steam-blue text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 overflow-hidden ripple-effect glow-effect"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Play className="w-5 h-5" />
                Explorar Jogos
              </span>
              <ArrowRight className="w-5 h-5 relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 shimmer" />
            </Link>

            <Link
              href="/upload"
              className="group flex items-center justify-center gap-3 bg-transparent border-2 border-steam-green/50 hover:border-steam-green hover:bg-steam-green/10 text-steam-green px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover-lift-modern ripple-effect"
            >
              <span>Enviar Seu Jogo</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative accent - bottom right */}
      <div className="absolute bottom-0 right-0 w-96 h-96 opacity-5 pointer-events-none">
        <div className="absolute inset-0 border-[3px] border-steam-blueLight rounded-full" />
        <div className="absolute inset-8 border-[2px] border-steam-green rounded-full" />
        <div className="absolute inset-16 border-[1px] border-steam-blueLight rounded-full" />
      </div>
    </section>
  );
}
