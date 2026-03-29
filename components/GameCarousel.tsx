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
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {games.map((game) => (
            <div key={game.id} className="min-w-full">
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>
      {games.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-senai-blueDark bg-opacity-80 hover:bg-opacity-100 text-white p-2 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-senai-blueDark bg-opacity-80 hover:bg-opacity-100 text-white p-2 rounded-full transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
      <div className="flex justify-center gap-2 mt-4">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition ${
              index === currentIndex ? "bg-senai-orange" : "bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

