"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { authedFetch } from "@/lib/client-auth";
import { useAuth } from "./AuthProvider";
import Link from "next/link";

interface RatingSectionProps {
  gameId: string;
  currentRating: number;
}

export default function RatingSection({
  gameId,
  currentRating,
}: RatingSectionProps) {
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating > 0 && !submitted) {
      if (!isAuthenticated) {
        showToast("Faça login para avaliar", "info");
        return;
      }
      setLoading(true);
      try {
        const response = await authedFetch(`/api/games/${gameId}/rate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating }),
        });

        if (response.ok) {
          setSubmitted(true);
          showToast("Avaliação enviada com sucesso!", "success");
          setTimeout(() => {
            setSubmitted(false);
            setRating(0);
            // Recarregar a página para atualizar a avaliação
            window.location.reload();
          }, 2000);
        } else if (response.status === 401 || response.status === 403) {
          showToast("Faça login para avaliar", "info");
        } else {
          showToast("Erro ao enviar avaliação", "error");
        }
      } catch (error) {
        showToast("Erro ao enviar avaliação", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl relative overflow-hidden" aria-labelledby="rating-heading">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-senai-orange/10 border border-senai-orange/30 flex items-center justify-center text-senai-orange shadow-[0_0_15px_rgba(243,112,33,0.15)] shrink-0">
          <Star className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h2 id="rating-heading" className="text-xl md:text-2xl font-display font-bold text-white">
            Avaliar este jogo
          </h2>
          <p className="text-xs text-slate-400">Dê sua nota de 1 a 5 estrelas para apoiar o desenvolvedor</p>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="mb-5 bg-slate-950/60 border border-white/10 rounded-xl p-3.5 sm:p-4 text-slate-300 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs sm:text-sm text-slate-300">Faça login para registrar sua avaliação.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-senai-orange to-amber-500 hover:brightness-110 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition shadow-glow-orange active:scale-95"
          >
            Entrar
          </Link>
        </div>
      )}

      <div className="flex items-center gap-1.5 sm:gap-2 mb-4 flex-wrap" role="radiogroup" aria-label="Selecione uma avaliação de 1 a 5 estrelas">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} ${value === 1 ? "estrela" : "estrelas"}`}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              onFocus={() => setHoveredRating(value)}
              onBlur={() => setHoveredRating(0)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRating(value);
                }
              }}
              onClick={() => handleRating(value)}
              disabled={submitted || loading}
              className="p-1 sm:p-1.5 transition-transform hover:scale-125 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Star
                className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                  value <= (hoveredRating || rating)
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                    : "text-slate-600 hover:text-slate-400"
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <span className="text-xs sm:text-sm font-medium text-slate-200" aria-live="polite">
            {rating} {rating === 1 ? "estrela" : "estrelas"} selecionada{rating === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {rating > 0 && !submitted && !loading && (
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-gradient-to-r from-senai-orange to-amber-500 hover:brightness-110 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition shadow-glow-orange active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 text-sm sm:text-base w-full sm:w-auto"
          aria-label={`Enviar avaliação de ${rating} ${rating === 1 ? "estrela" : "estrelas"}`}
        >
          Enviar Avaliação
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-slate-400 text-sm" role="status" aria-live="polite" aria-label="Enviando avaliação">
          <Loader2 className="w-4 h-4 animate-spin text-senai-orange" aria-hidden="true" />
          <span>Enviando avaliação...</span>
        </div>
      )}

      {submitted && (
        <p className="text-emerald-400 text-sm font-semibold flex items-center gap-2" role="status" aria-live="polite" aria-atomic="true">
          ✓ Obrigado pela sua avaliação!
        </p>
      )}
    </section>
  );
}
