"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import ActivityProgress from "@/components/gamification/ActivityProgress";
import BriefingSection from "@/components/atividade/BriefingSection";
import CSharpPracticeSection from "@/components/atividade/CSharpPracticeSection";
import BlenderSection from "@/components/atividade/BlenderSection";
import PublicationSection from "@/components/atividade/PublicationSection";
import Leaderboard from "@/components/gamification/Leaderboard";
import ActivityTimer from "@/components/atividade/ActivityTimer";
import { Trophy, BookOpen, Code, Cube, Upload } from "lucide-react";

export interface ActivityPhase {
  id: string;
  title: string;
  icon: typeof Trophy;
  completed: boolean;
  xp: number;
  unlocked: boolean;
}

export default function AtividadePrototipoCSharpPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [currentPhase, setCurrentPhase] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [phases, setPhases] = useState<ActivityPhase[]>([
    {
      id: "briefing",
      title: "Briefing e Treinamento",
      icon: BookOpen,
      completed: false,
      xp: 50,
      unlocked: true,
    },
    {
      id: "csharp",
      title: "Prática C# Guiada",
      icon: Code,
      completed: false,
      xp: 100,
      unlocked: false,
    },
    {
      id: "blender",
      title: "Modelagem Blender",
      icon: Cube,
      completed: false,
      xp: 150,
      unlocked: false,
    },
    {
      id: "publication",
      title: "Publicação e Reflexão",
      icon: Upload,
      completed: false,
      xp: 200,
      unlocked: false,
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      showToast("Faça login para acessar a atividade", "info");
      router.push("/login");
      return;
    }

    // Carregar progresso salvo do Firebase
    loadProgress();
  }, [isAuthenticated, user]);

  const loadProgress = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/atividades/progresso?userId=${user.email}`);
      if (response.ok) {
        const data = await response.json();
        if (data.phases) {
          setPhases(data.phases);
        }
        if (data.totalXP) {
          setTotalXP(data.totalXP);
        }
        if (data.currentPhase !== undefined) {
          setCurrentPhase(data.currentPhase);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    }
  };

  const unlockNextPhase = (phaseId: string) => {
    setPhases((prev) => {
      const updated = prev.map((phase, index) => {
        if (phase.id === phaseId) {
          return { ...phase, completed: true };
        }
        // Desbloquear próxima fase
        if (prev.findIndex((p) => p.id === phaseId) === index - 1) {
          return { ...phase, unlocked: true };
        }
        return phase;
      });
      return updated;
    });

    // Adicionar XP da fase completada
    const completedPhase = phases.find((p) => p.id === phaseId);
    if (completedPhase) {
      const newXP = totalXP + completedPhase.xp;
      setTotalXP(newXP);
      saveProgress(newXP);
      showToast(`Fase completada! +${completedPhase.xp} XP`, "success");
    }
  };

  const addXP = (amount: number) => {
    const newXP = totalXP + amount;
    setTotalXP(newXP);
    saveProgress(newXP);
    showToast(`+${amount} XP!`, "success");
  };

  const saveProgress = async (xp?: number) => {
    if (!user) return;

    try {
      await fetch("/api/atividades/progresso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.email,
          phases,
          totalXP: xp || totalXP,
          currentPhase,
        }),
      });
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const activePhase = phases[currentPhase];

  return (
    <div className="min-h-screen bg-steam-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header da Atividade */}
        <div className="bg-gradient-to-r from-steam-blue via-steam-blueLight to-steam-green rounded-lg p-6 mb-6 text-white">
          <h1 className="text-4xl font-bold mb-2">Missão: Protótipo Codificado</h1>
          <p className="text-lg text-gray-200">
            Atividade gamificada de 4 horas - Planejamento e Publicação de Jogos Digitais
          </p>
        </div>

        {/* Progresso e Gamificação */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ActivityProgress phases={phases} currentPhase={currentPhase} totalXP={totalXP} />
          </div>
          <div>
            <ActivityTimer />
            <Leaderboard activityId="prototipo-csharp" className="mt-4" />
          </div>
        </div>

        {/* Navegação por Fases */}
        <div className="bg-steam-darker border border-steam-blue rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isActive = index === currentPhase;
              const canAccess = phase.unlocked || index === 0;

              return (
                <button
                  key={phase.id}
                  onClick={() => canAccess && setCurrentPhase(index)}
                  disabled={!canAccess}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-steam-blueLight text-white"
                      : phase.completed
                      ? "bg-steam-green/20 text-steam-green border border-steam-green"
                      : canAccess
                      ? "bg-steam-dark text-gray-300 hover:bg-steam-blue border border-steam-blue"
                      : "bg-steam-darker text-gray-500 border border-steam-darker cursor-not-allowed opacity-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{phase.title}</span>
                  {phase.completed && <Trophy className="w-4 h-4" />}
                  {phase.completed && <span className="text-xs">+{phase.xp} XP</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo da Fase Ativa */}
        <div className="bg-steam-dark border border-steam-blue rounded-lg p-6">
          {activePhase.id === "briefing" && (
            <BriefingSection onComplete={() => unlockNextPhase("briefing")} addXP={addXP} />
          )}
          {activePhase.id === "csharp" && (
            <CSharpPracticeSection
              onComplete={() => unlockNextPhase("csharp")}
              addXP={addXP}
              unlocked={activePhase.unlocked}
            />
          )}
          {activePhase.id === "blender" && (
            <BlenderSection
              onComplete={() => unlockNextPhase("blender")}
              addXP={addXP}
              unlocked={activePhase.unlocked}
            />
          )}
          {activePhase.id === "publication" && (
            <PublicationSection
              onComplete={() => unlockNextPhase("publication")}
              addXP={addXP}
              unlocked={activePhase.unlocked}
            />
          )}
        </div>
      </div>
    </div>
  );
}

