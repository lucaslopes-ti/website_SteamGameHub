"use client";

import { useState, useEffect } from "react";
import { Clock, Pause, Play } from "lucide-react";

export default function ActivityTimer() {
  const [timeRemaining, setTimeRemaining] = useState(4 * 60 * 60); // 4 horas em segundos
  const [isPaused, setIsPaused] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 4 * 60 * 60 - elapsed);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        setIsPaused(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const percentage = ((4 * 60 * 60 - timeRemaining) / (4 * 60 * 60)) * 100;
  const isUrgent = timeRemaining < 30 * 60; // Menos de 30 minutos

  return (
    <div className="bg-steam-dark border border-steam-blue rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Clock className={`w-6 h-6 ${isUrgent ? "text-red-400" : "text-steam-blueLight"}`} />
          <h3 className="text-xl font-bold text-white">Timer da Atividade</h3>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 bg-steam-darker hover:bg-steam-blue rounded-lg transition-colors"
        >
          {isPaused ? (
            <Play className="w-5 h-5 text-steam-green" />
          ) : (
            <Pause className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      <div className="text-center mb-4">
        <div
          className={`text-4xl font-bold mb-2 ${
            isUrgent ? "text-red-400 animate-pulse" : "text-steam-blueLight"
          }`}
        >
          {formatTime(timeRemaining)}
        </div>
        <p className="text-sm text-gray-400">
          {isPaused ? "Timer pausado" : "Tempo restante"}
        </p>
      </div>

      <div className="w-full bg-steam-darker rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${
            isUrgent
              ? "bg-gradient-to-r from-red-500 to-red-400"
              : "bg-gradient-to-r from-steam-blueLight to-steam-green"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isUrgent && (
        <div className="mt-4 bg-red-500/20 border border-red-500 rounded-lg p-3 text-center">
          <p className="text-red-400 font-semibold">⚠️ Menos de 30 minutos restantes!</p>
        </div>
      )}
    </div>
  );
}

