"use client";

import React, { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useToast } from "./ToastProvider";
import { useI18n } from "./I18nProvider";
import { authedFetch } from "@/lib/client-auth";

interface FavoriteButtonProps {
  gameId: string;
  size?: "sm" | "md" | "lg";
}

export default function FavoriteButton({ gameId, size = "md" }: Readonly<FavoriteButtonProps>) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { t } = useI18n();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkFavorite();
    }
  }, [isAuthenticated, user, gameId]);

  const checkFavorite = async () => {
    if (!user) return;
    try {
      const response = await authedFetch(`/api/favorites`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.gameIds.includes(gameId));
      }
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated || !user) {
      showToast(t("favorites.loginRequired"), "info");
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        const response = await authedFetch(
          `/api/favorites?gameId=${encodeURIComponent(gameId)}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          setIsFavorite(false);
          showToast(t("favorites.removed"), "success");
        } else {
          showToast(t("favorites.removeError"), "error");
        }
      } else {
        const response = await authedFetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId }),
        });
        if (response.ok) {
          setIsFavorite(true);
          showToast(t("favorites.added"), "success");
        } else {
          showToast(t("favorites.addError"), "error");
        }
      }
    } catch {
      showToast(t("favorites.updateError"), "error");
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  if (!isAuthenticated) {
    return (
      <button
        onClick={(e: MouseEvent<HTMLButtonElement>) => e.preventDefault()}
        disabled
        aria-disabled="true"
        className={`${sizeClasses[size]} transition-all disabled:opacity-50 text-gray-400`}
        title={t("favorites.loginToFavorite")}
      >
        <Heart className="w-full h-full" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`${sizeClasses[size]} transition-all hover:scale-110 disabled:opacity-50 ${
        isFavorite
          ? "text-red-500 fill-red-500"
          : "text-gray-400 hover:text-red-400"
      }`}
      title={isFavorite ? t("favorites.removeTitle") : t("favorites.addTitle")}
    >
      <Heart className="w-full h-full" />
    </button>
  );
}

