"use client";

import Link from "next/link";
import { Play, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-steam-dark via-steam-blue to-steam-dark py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Bem-vindo ao{" "}
            <span className="text-steam-blueLight">SENAI Dr. Celso Charuri Game HUB</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Explore jogos incríveis desenvolvidos pelos alunos do curso Técnico
            em Programação de Jogos Digitais do SENAI Dr. Celso Charuri. Uma vitrine de talentos e
            criatividade.
          </p>
          <div className="flex gap-4">
            <Link
              href="/games"
              className="flex items-center gap-2 bg-steam-blueLight hover:bg-steam-blue text-white px-6 py-3 rounded font-semibold transition"
            >
              <Play className="w-5 h-5" />
              Explorar Jogos
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-2 bg-steam-green hover:bg-steam-blueLight text-white px-6 py-3 rounded font-semibold transition"
            >
              <TrendingUp className="w-5 h-5" />
              Enviar Seu Jogo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

