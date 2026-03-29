"use client";

import { ActivityPhase } from "@/app/atividade-prototipo-csharp/page";
import { Trophy, Star, BookOpen, Code, Boxes, Upload } from "lucide-react";

const iconMap: Record<string, typeof Trophy> = {
  Trophy,
  BookOpen,
  Code,
  Boxes,
  Upload,
};

interface ActivityProgressProps {
  phases: ActivityPhase[];
  currentPhase: number;
  totalXP: number;
}

export default function ActivityProgress({
  phases,
  currentPhase,
  totalXP,
}: ActivityProgressProps) {
  const totalPossibleXP = phases.reduce((sum, phase) => sum + phase.xp, 0);
  // Limitar progresso a no máximo 100%
  const progressPercentage = Math.min((totalXP / totalPossibleXP) * 100, 100);
  const completedPhases = phases.filter((p) => p.completed).length;

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Trophy;
  };

  return (
    <div className="bg-senai-blueDark border border-senai-blue rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Progresso da Atividade</h2>
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          <span className="text-2xl font-bold text-yellow-400">{totalXP}</span>
          <span className="text-gray-400">/ {totalPossibleXP} XP</span>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="mb-6">
        <div className="w-full bg-senai-dark rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-senai-orange to-senai-blueLight h-4 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>{completedPhases} de {phases.length} fases completas</span>
          <span>{Math.round(progressPercentage)}% concluído</span>
        </div>
      </div>

      {/* Fases */}
      <div className="space-y-3">
        {phases.map((phase, index) => {
          const Icon = getIconComponent(phase.iconName);
          const isCurrent = index === currentPhase;
          const isCompleted = phase.completed;
          const isLocked = !phase.unlocked;

          return (
            <div
              key={phase.id}
              className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                isCurrent
                  ? "bg-senai-blue/20 border-senai-orange"
                  : isCompleted
                  ? "bg-senai-blueLight/10 border-senai-blueLight"
                  : isLocked
                  ? "bg-senai-dark border-senai-dark opacity-50"
                  : "bg-senai-dark border-senai-blue"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isCompleted
                    ? "bg-senai-blueLight/20"
                    : isCurrent
                    ? "bg-senai-orange/20"
                    : "bg-senai-blue/10"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isCompleted
                      ? "text-senai-blueLight"
                      : isCurrent
                      ? "text-senai-orange"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-medium ${
                      isCompleted
                        ? "text-senai-blueLight"
                        : isCurrent
                        ? "text-senai-orange"
                        : "text-gray-400"
                    }`}
                  >
                    {phase.title}
                  </span>
                  {isCompleted && (
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400">+{phase.xp} XP</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

