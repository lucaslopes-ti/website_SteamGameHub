"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Download, Sparkles, User } from "lucide-react";
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
  variant?: "default" | "compact";
}

export default function GameCard({ game, variant = "default" }: Readonly<GameCardProps>) {
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
        className="object-cover transition-transform duration-700 group-hover:scale-110"
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
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={() => setImageError(true)}
      />
    );
  } else {
    mediaContent = (
      <div className="w-full h-full flex items-center justify-center bg-senai-blueDark text-gray-400" role="img" aria-label={`${game.title} - ${t("game.noCoverImageAvailable")}`}>
        <span className="sr-only">{t("game.noCoverImageAvailable")}</span>
        <span aria-hidden="true" className="text-xs">{t("game.noImage")}</span>
      </div>
    );
  }

  const isNew = isNewGame(game.releaseDate);

  return (
    <article className="game-card group cursor-pointer h-full flex flex-col animate-fadeIn">
      <Link 
        href={`/games/${game.id}`}
        className="flex flex-col h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2"
        aria-label={t("game.detailsAria", {
          title: game.title,
          featured: game.featured ? ` (${t("game.featured")})` : "",
        })}
      >
        {/* Cover */}
        <div className={`relative overflow-hidden ${variant === "compact" ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
          {mediaContent}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/20 to-transparent" />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-senai-blueDark/0 group-hover:bg-senai-blueDark/20 transition-colors" />

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2 z-10 pointer-events-none">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md glass-strong text-[11px] font-bold text-white shadow-sm">
              <Star className="w-3 h-3 fill-senai-orange text-senai-orange" />
              {game.rating.toFixed(1)}
            </div>
            
            <div className="flex flex-col items-end gap-1">
              {game.featured && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-senai-blueLight text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t("game.featured")}
                </div>
              )}
              {!game.featured && isNew && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-senai-orange text-[#1A202C] text-[10px] font-bold uppercase tracking-wider shadow-glow-orange">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t("game.new")}
                </div>
              )}
            </div>
          </div>

          <div
            className="absolute bottom-2 right-2 z-20"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            role="none"
          >
            <FavoriteButton gameId={game.id} size="sm" />
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          <div>
            <h3 className="font-display font-semibold text-base leading-tight line-clamp-1 group-hover:text-senai-orange transition-colors text-white">
              {game.title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 line-clamp-1">
              por <span className="text-gray-200">{game.author}</span>
            </div>
          </div>

          {variant === "default" && (
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed flex-1">
              {game.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 mt-auto border-t border-white/10">
            <div className="flex flex-wrap gap-1">
              {game.genres.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10"
                >
                  {g}
                </span>
              ))}
            </div>
            {game.totalRatings > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400">
                <Star className="w-3 h-3" />
                {game.totalRatings} avaliações
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}