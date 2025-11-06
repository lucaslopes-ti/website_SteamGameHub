"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";
import ActivityProgress from "@/components/gamification/ActivityProgress";
import BriefingSection from "@/components/atividade/BriefingSection";
import CSharpPracticeSection from "@/components/atividade/CSharpPracticeSection";
import BlenderSection from "@/components/atividade/BlenderSection";
import PublicationSection from "@/components/atividade/PublicationSection";
import ActivityTimer from "@/components/atividade/ActivityTimer";
import { Trophy, BookOpen, Code, Boxes, Upload } from "lucide-react";
import { getLocalUserId, getLocalUserName, setLocalUserName } from "@/lib/local-user";

export interface ActivityPhase {
  id: string;
  title: string;
  icon: typeof Trophy;
  completed: boolean;
  xp: number;
  unlocked: boolean;
}

export default function AtividadePrototipoCSharpPage() {
  const { showToast } = useToast();

  const [userId] = useState(() => getLocalUserId());
  const [userName, setUserNameState] = useState(() => getLocalUserName());
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameInput, setNameInput] = useState("");
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
      icon: Boxes,
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
    // Carregar progresso salvo (localStorage ou Firebase)
    loadProgress();
  }, [userId]);

  const loadProgress = async () => {
    // Primeiro tentar carregar de localStorage (mais rápido e não requer conexão)
    const savedProgress = localStorage.getItem(`activity_progress_${userId}`);
    if (savedProgress) {
      try {
        const data = JSON.parse(savedProgress);
        if (data.phases) setPhases(data.phases);
        if (data.totalXP !== undefined) setTotalXP(data.totalXP);
        if (data.currentPhase !== undefined) setCurrentPhase(data.currentPhase);
      } catch (error) {
        console.error("Erro ao carregar progresso do localStorage:", error);
      }
    }

    // Também tentar carregar do Firebase (sincronização opcional)
    try {
      const response = await fetch(`/api/atividades/progresso?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.phases && data.phases.length > 0) {
          setPhases(data.phases);
        }
        if (data.totalXP !== undefined) {
          setTotalXP(data.totalXP);
        }
        if (data.currentPhase !== undefined) {
          setCurrentPhase(data.currentPhase);
        }
        // Salvar também no localStorage
        localStorage.setItem(`activity_progress_${userId}`, JSON.stringify(data));
      }
    } catch (error) {
      console.error("Erro ao carregar progresso do Firebase:", error);
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
    const progressData = {
      userId,
      userName,
      phases,
      totalXP: xp || totalXP,
      currentPhase,
    };

    // Salvar no localStorage (sempre funciona)
    try {
      localStorage.setItem(`activity_progress_${userId}`, JSON.stringify(progressData));
    } catch (error) {
      console.error("Erro ao salvar progresso no localStorage:", error);
    }

    // Tentar salvar no Firebase também (opcional)
    try {
      await fetch("/api/atividades/progresso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progressData),
      });
    } catch (error) {
      console.error("Erro ao salvar progresso no Firebase:", error);
      // Não é crítico, localStorage já salvou
    }
  };

  const activePhase = phases[currentPhase];

  // Obter data atual formatada
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const activityDate = `Atividade ${day}/${month}`;

  return (
    <div className="min-h-screen bg-steam-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Banner com Data */}
        <div className="mb-4 animate-pulse">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                {activityDate}
              </h2>
            </div>
          </div>
        </div>

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
            <div className="mt-4 bg-steam-dark border border-steam-blue rounded-lg p-4">
              {showNameInput ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full bg-steam-darker border border-steam-blue rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-steam-blueLight text-sm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && nameInput.trim()) {
                        const newName = nameInput.trim();
                        setUserNameState(newName);
                        setLocalUserName(newName);
                        setShowNameInput(false);
                        setNameInput("");
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (nameInput.trim()) {
                          const newName = nameInput.trim();
                          setUserNameState(newName);
                          setLocalUserName(newName);
                          setShowNameInput(false);
                          setNameInput("");
                        }
                      }}
                      className="flex-1 px-3 py-1 bg-steam-green hover:bg-steam-green/80 text-white rounded text-sm transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setShowNameInput(false);
                        setNameInput("");
                      }}
                      className="px-3 py-1 bg-steam-darker border border-steam-blue text-gray-300 rounded text-sm hover:bg-steam-dark transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400">
                      <strong className="text-steam-blueLight">Você:</strong> {userName}
                    </p>
                    <button
                      onClick={() => {
                        setNameInput(userName);
                        setShowNameInput(true);
                      }}
                      className="text-xs text-steam-blueLight hover:text-steam-green transition-colors"
                    >
                      Editar
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    ID: {userId.slice(-12)}
                  </p>
                </>
              )}
            </div>
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
            <BriefingSection
              onComplete={() => unlockNextPhase("briefing")}
              addXP={addXP}
              userId={userId}
              userName={userName}
            />
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

