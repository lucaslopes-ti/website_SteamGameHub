"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { useToast } from "./ToastProvider";

interface ShareButtonProps {
  gameId: string;
  gameTitle: string;
}

export default function ShareButton({ gameId, gameTitle }: ShareButtonProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const gameUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/games/${gameId}`
    : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: gameTitle,
          text: `Confira este jogo: ${gameTitle}`,
          url: gameUrl,
        });
      } catch (error) {
        // Usuário cancelou ou erro
      }
    } else {
      // Fallback: copiar para clipboard
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(gameUrl);
      setCopied(true);
      showToast("Link copiado para a área de transferência!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast("Erro ao copiar link", "error");
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-slate-200 hover:text-white px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition backdrop-blur-md shadow-sm active:scale-95"
        title="Compartilhar jogo"
        aria-label="Compartilhar jogo"
      >
        <Share2 className="w-4 h-4 text-senai-orange shrink-0" />
        <span className="hidden sm:inline">Compartilhar</span>
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-slate-200 hover:text-white px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition backdrop-blur-md shadow-sm active:scale-95"
        title="Copiar link"
        aria-label="Copiar link"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-emerald-400 font-semibold hidden sm:inline">Copiado!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">Copiar Link</span>
          </>
        )}
      </button>
    </div>
  );
}

