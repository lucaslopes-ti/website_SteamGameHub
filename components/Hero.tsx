"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Play, TrendingUp, Gamepad2, Users, Award, Sparkles } from "lucide-react";

export default function Hero() {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalAuthors: 0,
    avgRating: 0,
  });

  useEffect(() => {
    // Carregar estatísticas rápidas
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
      .catch(() => {
        // Ignorar erros silenciosamente
      });
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-steam-darker via-steam-dark to-steam-blue">
      {/* Background decorativo - elementos de jogo */}
      <div className="absolute inset-0 opacity-10">
        {/* Grid pattern estilo pixel */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(102, 192, 244, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(102, 192, 244, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        {/* Círculos decorativos animados */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-steam-blueLight rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-steam-green rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      {/* Elementos decorativos flutuantes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 animate-float text-steam-blueLight opacity-20">
          <Gamepad2 className="w-16 h-16" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delay text-steam-green opacity-20">
          <Award className="w-12 h-12" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float text-steam-blueLight opacity-20">
          <Sparkles className="w-14 h-14" />
        </div>
        <div className="absolute bottom-20 right-1/3 animate-float-delay text-steam-green opacity-20">
          <Play className="w-10 h-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge animado */}
          <div className="inline-flex items-center gap-2 bg-steam-dark/80 backdrop-blur-sm border border-steam-blueLight/30 rounded-full px-4 py-2 mb-8 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-steam-blueLight animate-spin-slow" />
            <span className="text-sm text-steam-blueLight font-semibold">
              Plataforma de Jogos Digitais
            </span>
          </div>

          {/* Título principal com efeito gradiente */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-fadeIn">
            <span className="block text-white mb-2">SENAI Game</span>
            <span className="block bg-gradient-to-r from-steam-blueLight via-steam-green to-steam-blueLight bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              HUB
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed animate-fadeIn">
            Descubra jogos incríveis criados pelos alunos do{" "}
            <span className="text-steam-blueLight font-semibold">
              Técnico em Programação de Jogos Digitais
            </span>
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-xl mx-auto animate-fadeIn">
            Uma vitrine de talentos, criatividade e inovação. Explore, jogue e se inspire!
          </p>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-12 max-w-2xl mx-auto animate-scaleIn">
            <div className="bg-steam-dark/60 backdrop-blur-sm border border-steam-blue/30 rounded-lg p-4 hover:border-steam-blueLight transition-all hover:scale-105">
              <div className="flex flex-col items-center">
                <Gamepad2 className="w-8 h-8 text-steam-blueLight mb-2" />
                <div className="text-3xl font-bold text-white">{stats.totalGames}</div>
                <div className="text-xs text-gray-400">Jogos</div>
              </div>
            </div>
            <div className="bg-steam-dark/60 backdrop-blur-sm border border-steam-blue/30 rounded-lg p-4 hover:border-steam-green transition-all hover:scale-105">
              <div className="flex flex-col items-center">
                <Users className="w-8 h-8 text-steam-green mb-2" />
                <div className="text-3xl font-bold text-white">{stats.totalAuthors}</div>
                <div className="text-xs text-gray-400">Desenvolvedores</div>
              </div>
            </div>
            <div className="bg-steam-dark/60 backdrop-blur-sm border border-steam-blue/30 rounded-lg p-4 hover:border-yellow-400 transition-all hover:scale-105">
              <div className="flex flex-col items-center">
                <Award className="w-8 h-8 text-yellow-400 mb-2" />
                <div className="text-3xl font-bold text-white">
                  {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "-"}
                </div>
                <div className="text-xs text-gray-400">Avaliação Média</div>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fadeIn">
            <Link
              href="/games"
              className="group relative bg-gradient-to-r from-steam-blueLight to-steam-blue hover:from-steam-blue hover:to-steam-blueLight text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-steam-blueLight/50 flex items-center gap-3"
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Explorar Jogos</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-steam-blueLight to-steam-blue opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
            </Link>
            <Link
              href="/upload"
              className="group relative bg-gradient-to-r from-steam-green to-emerald-600 hover:from-emerald-600 hover:to-steam-green text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-steam-green/50 flex items-center gap-3"
            >
              <TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Enviar Seu Jogo</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-steam-green to-emerald-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-steam-blueLight rounded-full flex justify-center">
              <div className="w-1 h-3 bg-steam-blueLight rounded-full mt-2" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delay {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
