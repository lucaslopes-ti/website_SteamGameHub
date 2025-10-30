"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, User } from "lucide-react";
import { Game } from "@/lib/games";
import FavoriteButton from "@/components/FavoriteButton";
import type { MouseEvent } from "react";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(game.image || "");

  // Atualizar imagem quando o game mudar
  useEffect(() => {
    setImageSrc(game.image || "");
    setImageError(false);
  }, [game.image]);

  // Se a imagem for uma URL do Firebase ou externa, garantir que está acessível
  const isValidImageUrl = imageSrc && imageSrc.trim() !== "" && (imageSrc.startsWith("http") || imageSrc.startsWith("/"));

  return (
    <article className="animate-fadeIn stagger-item">
      <Link 
        href={`/games/${game.id}`}
        className="block bg-steam-dark rounded-lg overflow-hidden hover-lift-modern cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 card-shine"
        aria-label={`Ver detalhes do jogo ${game.title}${game.featured ? " (Destaque)" : ""}`}
      >
        <div className="relative h-48 bg-steam-blue overflow-hidden">
          {isValidImageUrl && !imageError ? (
            <Image
              src={imageSrc}
              alt={`Capa do jogo ${game.title}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => {
                console.error("Erro ao carregar imagem:", imageSrc);
                setImageError(true);
              }}
              unoptimized={imageSrc.startsWith("http")}
              loading="lazy"
              quality={85}
            />
          ) : isValidImageUrl && imageError ? (
            // Fallback: usar img tag normal se Next.js Image falhar
            <img
              src={imageSrc}
              alt={`Capa do jogo ${game.title}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400" role="img" aria-label={`${game.title} - Sem imagem de capa disponível`}>
              <span className="sr-only">Sem imagem de capa</span>
              <span aria-hidden="true">Sem imagem</span>
            </div>
          )}
          {game.featured && (
            <div className="absolute top-2 right-2 bg-steam-green text-white px-2 py-1 rounded text-xs font-bold" aria-label="Jogo em destaque">
              DESTAQUE
            </div>
          )}
          <div
            className="absolute top-2 left-2"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            role="none"
          >
            <FavoriteButton gameId={game.id} size="sm" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-steam-blueLight transition">
            {game.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {game.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-yellow-400" aria-label={`Avaliação: ${game.rating.toFixed(1)} de 5 estrelas`}>
              <Star className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>{game.rating.toFixed(1)}</span>
              <span className="sr-only">de 5 estrelas</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400" aria-label={`Autor: ${game.author}`}>
              <User className="w-4 h-4" aria-hidden="true" />
              <span>{game.author}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3" role="list" aria-label="Gêneros do jogo">
            {game.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="bg-steam-blue text-steam-blueLight text-xs px-2 py-1 rounded"
                role="listitem"
              >
                {genre}
              </span>
            ))}
            {game.genres.length > 2 && (
              <span className="sr-only">e mais {game.genres.length - 2} gênero{game.genres.length - 2 > 1 ? "s" : ""}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}