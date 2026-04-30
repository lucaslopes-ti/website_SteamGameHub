"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GameCard from "./GameCard";
import { Game } from "@/lib/games";

interface GameCarouselProps {
  games: Game[];
}

export default function GameCarousel({ games }: GameCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % games.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  if (games.length === 0) return null;

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {games.map((game) => (
            <div key={game.id} className="min-w-full px-2">
              <div className="max-w-2xl mx-auto">
                <GameCard game={game} variant="compact" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {games.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-senai-orange hover:border-senai-orange shadow-glow-orange -ml-5 z-10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-senai-orange hover:border-senai-orange shadow-glow-orange -mr-5 z-10"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
      <div className="flex justify-center gap-2 mt-4">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir para slide ${index + 1}`}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-senai-orange w-6" : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
