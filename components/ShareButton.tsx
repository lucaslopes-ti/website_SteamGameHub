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
    <div className="flex gap-2">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-steam-dark hover:bg-steam-blue text-white px-4 py-2 rounded transition"
        title="Compartilhar jogo"
      >
        <Share2 className="w-4 h-4" />
        Compartilhar
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 bg-steam-dark hover:bg-steam-blue text-white px-4 py-2 rounded transition"
        title="Copiar link"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            Copiado!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copiar Link
          </>
        )}
      </button>
    </div>
  );
}

