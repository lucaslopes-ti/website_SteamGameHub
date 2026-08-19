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
    <section className="bg-senai-blueDark rounded-lg p-6" aria-labelledby="rating-heading">
      <h2 id="rating-heading" className="text-2xl font-bold mb-4 text-senai-orange">
        Avaliar este jogo
      </h2>
      {!isAuthenticated && (
        <div className="mb-4 bg-senai-dark border border-senai-blue rounded p-4 text-gray-300">
          <p className="mb-2">Faça login para avaliar este jogo.</p>
          <Link
            href="/login"
            className="inline-block bg-senai-orange hover:bg-senai-blue text-slate-950 hover:text-white px-4 py-2 rounded transition"
          >
            Entrar
          </Link>
        </div>
      )}
      <div className="flex items-center gap-2 mb-4" role="radiogroup" aria-label="Selecione uma avaliação de 1 a 5 estrelas">
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
            className="transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400 focus-visible:outline-offset-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Star
              className={`w-8 h-8 ${
                value <= (hoveredRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-600"
              }`}
              aria-hidden="true"
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-4 text-gray-300" aria-live="polite">
            {rating} {rating === 1 ? "estrela" : "estrelas"} selecionada{rating === 1 ? "" : "s"}
          </span>
        )}
      </div>
      {rating > 0 && !submitted && !loading && (
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-senai-orange hover:bg-senai-blue text-slate-950 hover:text-white px-6 py-2 rounded transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          aria-label={`Enviar avaliação de ${rating} ${rating === 1 ? "estrela" : "estrelas"}`}
        >
          Enviar Avaliação
        </button>
      )}
      {loading && (
        <div className="flex items-center gap-2 text-gray-400" role="status" aria-live="polite" aria-label="Enviando avaliação">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span>Enviando avaliação...</span>
        </div>
      )}
      {submitted && (
        <p className="text-senai-blueLight" role="status" aria-live="polite" aria-atomic="true">
          Obrigado pela sua avaliação!
        </p>
      )}
    </section>
  );
}
