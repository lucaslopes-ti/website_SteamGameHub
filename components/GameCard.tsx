"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, User } from "lucide-react";
import { Game } from "@/lib/games";
import FavoriteButton from "@/components/FavoriteButton";
import type { MouseEvent } from "react";
import { useI18n } from "./I18nProvider";

function isNewGame(releaseDate: string): boolean {
  const release = new Date(releaseDate);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return release >= thirtyDaysAgo;
}

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: Readonly<GameCardProps>) {
  const { t } = useI18n();
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(game.image || "");

  // Atualizar imagem quando o game mudar
  useEffect(() => {
    setImageSrc(game.image || "");
    setImageError(false);
  }, [game.image]);

  // Se a imagem for uma URL do Firebase ou externa, garantir que está acessível
  const isValidImageUrl = imageSrc && imageSrc.trim() !== "" && (imageSrc.startsWith("http") || imageSrc.startsWith("/"));
  const shouldRenderNextImage = isValidImageUrl && !imageError;
  const shouldRenderFallbackImage = isValidImageUrl && imageError;

  let mediaContent: React.ReactNode;
  if (shouldRenderNextImage) {
    mediaContent = (
      <Image
        src={imageSrc}
        alt={t("game.coverAlt", { title: game.title })}
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
    );
  } else if (shouldRenderFallbackImage) {
    mediaContent = (
      <img
        src={imageSrc}
        alt={t("game.coverAlt", { title: game.title })}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        onError={() => setImageError(true)}
      />
    );
  } else {
    mediaContent = (
      <div className="w-full h-full flex items-center justify-center text-gray-400" role="img" aria-label={`${game.title} - ${t("game.noCoverImageAvailable")}`}>
        <span className="sr-only">{t("game.noCoverImageAvailable")}</span>
        <span aria-hidden="true">{t("game.noImage")}</span>
      </div>
    );
  }

  return (
    <article className="animate-fadeIn stagger-item">
      <Link 
        href={`/games/${game.id}`}
        className="block bg-senai-blueDark rounded-lg overflow-hidden hover-lift-modern cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 card-shine"
        aria-label={t("game.detailsAria", {
          title: game.title,
          featured: game.featured ? ` (${t("game.featured")})` : "",
        })}
      >
        <div className="relative h-48 bg-senai-blue overflow-hidden">
          {mediaContent}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            {game.featured && (
              <span className="bg-senai-blueLight text-white px-2 py-1 rounded text-xs font-bold" aria-label={t("game.featuredAria")}>
                {t("game.featured")}
              </span>
            )}
            {!game.featured && isNewGame(game.releaseDate) && (
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold" aria-label={t("game.newAria")}>
                {t("game.new")}
              </span>
            )}
          </div>
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
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-senai-orange transition">
            {game.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {game.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-yellow-400" aria-label={t("game.ratingAria", { rating: game.rating.toFixed(1), totalRatings: game.totalRatings })}>
              <Star className="w-4 h-4 fill-current" aria-hidden="true" />
              <span className="font-semibold">{game.rating.toFixed(1)}</span>
              {game.totalRatings > 0 && (
                <span className="text-gray-500 text-xs">({game.totalRatings})</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-400 max-w-[45%]" aria-label={t("game.authorAria", { author: game.author })}>
              <User className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{game.author}</span>
            </div>
          </div>
          <ul className="flex flex-wrap gap-2 mt-3" aria-label={t("game.genresAria")}>
            {game.genres.slice(0, 2).map((genre) => (
              <li
                key={genre}
                className="bg-senai-blue text-senai-orange text-xs px-2 py-1 rounded list-none"
              >
                {genre}
              </li>
            ))}
            {game.genres.length > 2 && (
              <li className="sr-only list-none">{t("game.andMoreGenres", { count: game.genres.length - 2, plural: game.genres.length - 2 > 1 ? "s" : "" })}</li>
            )}
          </ul>
        </div>
      </Link>
    </article>
  );
}