"use client";

import { useState } from "react";
import { CheckCircle, Play, Users, CheckSquare } from "lucide-react";
import QuizComponent from "./QuizComponent";

interface BriefingSectionProps {
  onComplete: () => void;
  addXP: (amount: number) => void;
  userId: string;
  userName: string;
}

export default function BriefingSection({
  onComplete,
  addXP,
  userId,
  userName,
}: BriefingSectionProps) {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [teamFormed, setTeamFormed] = useState(false);

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    addXP(50);
  };

  const handleVideoWatch = () => {
    setVideoWatched(true);
    addXP(25);
  };

  const handleFormTeam = async () => {
    try {
      // Simular formação de dupla (implementar lógica real depois)
      setTeamFormed(true);
      addXP(25);
      // Aqui você pode implementar a lógica de matchmaking
    } catch (error) {
      console.error("Erro ao formar dupla:", error);
    }
  };

  const allCompleted = quizCompleted && videoWatched && teamFormed;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-steam-blueLight mb-2">
          Briefing e Treinamento Inicial
        </h2>
        <p className="text-gray-300">
          Entenda a missão, assista ao treinamento e forme sua dupla para começar!
        </p>
      </div>

      {/* Missão */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">📋 Missão</h3>
        <div className="space-y-3 text-gray-300">
          <p>
            Você e seu parceiro devem criar um protótipo codificado em C# seguindo as fases:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Aprender conceitos básicos de C#</li>
            <li>Desenvolver lógica de jogo simples</li>
            <li>Criar capa 3D no Blender</li>
            <li>Publicar e documentar no portfólio</li>
          </ul>
          <div className="mt-4 bg-gradient-to-r from-steam-blue/20 to-steam-green/20 border border-steam-blueLight rounded-lg p-4">
            <p className="font-semibold text-steam-blueLight mb-3">Sistema de Fases e XP:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">📚 Briefing e Treinamento</span>
                <span className="text-yellow-400 font-bold">+50 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">💻 Prática C# Guiada</span>
                <span className="text-yellow-400 font-bold">+100 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">🎨 Modelagem Blender</span>
                <span className="text-yellow-400 font-bold">+150 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">📤 Publicação e Reflexão</span>
                <span className="text-yellow-400 font-bold">+200 XP</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400 border-t border-steam-blue pt-3">
              ⚠️ <strong>Importante:</strong> Cada seção só será liberada quando você completar a anterior. 
              Complete esta fase (Briefing e Treinamento) para desbloquear a Prática C# Guiada!
            </p>
          </div>
          <p className="mt-4 font-semibold text-steam-green">
            Tempo total: 13:30 - 17:20 | XP Total: 500 pontos
          </p>
        </div>
      </div>

      {/* Quiz sobre UC */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-6 h-6 text-steam-blueLight" />
            <h3 className="text-xl font-bold text-white">Quiz: Conhecimento sobre UC</h3>
          </div>
          {quizCompleted && (
            <div className="flex items-center gap-2 text-steam-green">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Completo +50 XP</span>
            </div>
          )}
        </div>
        {!quizCompleted ? (
          <QuizComponent onComplete={handleQuizComplete} />
        ) : (
          <div className="text-center py-4 text-gray-400">
            Quiz completado com sucesso! ✅
          </div>
        )}
      </div>

      {/* Vídeo Tutorial C# */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Play className="w-6 h-6 text-steam-blueLight" />
            <h3 className="text-xl font-bold text-white">Vídeo Tutorial: C# Básico</h3>
          </div>
          {videoWatched && (
            <div className="flex items-center gap-2 text-steam-green">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Assistido +25 XP</span>
            </div>
          )}
        </div>
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/DA-DQsmPItU"
            title="C# para Iniciantes"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        <p className="text-sm text-gray-400 mb-4">
          <strong>Conteúdo:</strong> Tipos de dados, funções, variáveis, estruturas condicionais
        </p>
        {!videoWatched && (
          <button
            onClick={handleVideoWatch}
            className="px-4 py-2 bg-steam-blueLight hover:bg-steam-blue text-white rounded-lg transition-colors"
          >
            Marcar como assistido
          </button>
        )}
      </div>

      {/* Formação de Duplas */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-steam-blueLight" />
            <h3 className="text-xl font-bold text-white">Formar Dupla</h3>
          </div>
          {teamFormed && (
            <div className="flex items-center gap-2 text-steam-green">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Dupla formada +25 XP</span>
            </div>
          )}
        </div>
        <p className="text-gray-300 mb-4">
          Clique no botão abaixo para ser pareado aleatoriamente com outro aluno disponível.
        </p>
        {!teamFormed ? (
          <button
            onClick={handleFormTeam}
            className="px-6 py-3 bg-steam-green hover:bg-steam-green/80 text-white rounded-lg font-semibold transition-colors"
          >
            Formar Dupla Aleatoriamente
          </button>
        ) : (
          <div className="bg-steam-dark rounded-lg p-4 border border-steam-green">
            <p className="text-steam-green font-medium">✓ Dupla formada com sucesso!</p>
            <p className="text-gray-400 text-sm mt-2">
              Você pode começar a trabalhar em conjunto nas próximas fases.
            </p>
          </div>
        )}
      </div>

      {/* Botão de Conclusão */}
      {allCompleted && (
        <div className="flex justify-end">
          <button
            onClick={onComplete}
            className="px-8 py-3 bg-gradient-to-r from-steam-blueLight to-steam-green text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
          >
            Concluir Briefing e Avançar →
          </button>
        </div>
      )}
    </div>
  );
}

