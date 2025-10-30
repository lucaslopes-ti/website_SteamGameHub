"use client";

import React, { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useToast } from "./ToastProvider";

interface FavoriteButtonProps {
  gameId: string;
  size?: "sm" | "md" | "lg";
}

export default function FavoriteButton({ gameId, size = "md" }: FavoriteButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
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
      const response = await fetch(`/api/favorites?userId=${user.email}`);
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
      showToast("Faça login para adicionar aos favoritos", "info");
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        const response = await fetch(
          `/api/favorites?gameId=${gameId}&userId=${user.email}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          setIsFavorite(false);
          showToast("Removido dos favoritos", "success");
        } else {
          showToast("Erro ao remover dos favoritos", "error");
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId, userId: user.email }),
        });
        if (response.ok) {
          setIsFavorite(true);
          showToast("Adicionado aos favoritos!", "success");
        } else {
          showToast("Erro ao adicionar aos favoritos", "error");
        }
      }
    } catch (error) {
      showToast("Erro ao atualizar favoritos", "error");
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
        title="Faça login para favoritar"
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
      title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart className="w-full h-full" />
    </button>
  );
}

