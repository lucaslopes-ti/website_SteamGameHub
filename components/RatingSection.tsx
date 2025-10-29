"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

interface RatingSectionProps {
  gameId: string;
  currentRating: number;
}

export default function RatingSection({
  gameId,
  currentRating,
}: RatingSectionProps) {
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating > 0 && !submitted) {
      setLoading(true);
      try {
        const response = await fetch(`/api/games/${gameId}/rate`, {
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
    <div className="bg-steam-dark rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-steam-blueLight">
        Avaliar este jogo
      </h2>
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleRating(value)}
            disabled={submitted || loading}
            className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Star
              className={`w-8 h-8 ${
                value <= (hoveredRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-600"
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-4 text-gray-300">
            {rating} {rating === 1 ? "estrela" : "estrelas"}
          </span>
        )}
      </div>
      {rating > 0 && !submitted && !loading && (
        <button
          onClick={handleSubmit}
          className="bg-steam-blueLight hover:bg-steam-blue text-white px-6 py-2 rounded transition"
        >
          Enviar Avaliação
        </button>
      )}
      {loading && (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Enviando...</span>
        </div>
      )}
      {submitted && (
        <p className="text-steam-green">Obrigado pela sua avaliação!</p>
      )}
    </div>
  );
}
