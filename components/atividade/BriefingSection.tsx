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
        <h2 className="text-3xl font-bold text-senai-orange mb-2">
          Briefing e Treinamento Inicial
        </h2>
        <p className="text-gray-300">
          Entenda a missão, assista ao treinamento e forme sua dupla para começar!
        </p>
      </div>

      {/* Missão */}
      <div className="bg-senai-dark border border-senai-blue rounded-lg p-6">
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
          <div className="mt-4 bg-gradient-to-r from-senai-blue/20 to-senai-blueLight/20 border border-senai-orange rounded-lg p-4">
            <p className="font-semibold text-senai-orange mb-3">Sistema de Fases e XP:</p>
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
            <p className="mt-3 text-xs text-gray-400 border-t border-senai-blue pt-3">
              ⚠️ <strong>Importante:</strong> Cada seção só será liberada quando você completar a anterior. 
              Complete esta fase (Briefing e Treinamento) para desbloquear a Prática C# Guiada!
            </p>
          </div>
          <p className="mt-4 font-semibold text-senai-blueLight">
            Tempo total: 13:30 - 17:20 | XP Total: 500 pontos
          </p>
        </div>
      </div>

      {/* Vídeo Tutorial C# */}
      <div className="bg-senai-dark border border-senai-blue rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Play className="w-6 h-6 text-senai-orange" />
            <h3 className="text-xl font-bold text-white">Vídeo Tutorial: C# Básico</h3>
          </div>
          {videoWatched && (
            <div className="flex items-center gap-2 text-senai-blueLight">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Assistido +25 XP</span>
            </div>
          )}
        </div>
        
        {/* Aviso Importante sobre o Vídeo */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-yellow-400 font-bold text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="text-yellow-400 font-bold text-lg mb-2">ATENÇÃO: Assista ao vídeo ANTES do quiz!</p>
              <p className="text-white text-sm mb-2">
                Este vídeo tutorial é <strong className="text-yellow-400">ESSENCIAL</strong> para seu aprendizado. 
                Ele apresenta os conceitos fundamentais de C# que você precisará dominar para completar os exercícios práticos.
              </p>
              <p className="text-white text-sm mb-2">
                <strong className="text-yellow-400">Recomendação:</strong> Se possível, replique os códigos mostrados no vídeo 
                em um editor de código para fixar melhor o aprendizado. Isso ajudará muito na prática guiada!
              </p>
              <p className="text-white text-sm">
                O quiz contém perguntas sobre o conteúdo apresentado neste vídeo. 
                <strong className="text-yellow-400"> Assista completamente antes de responder o quiz!</strong>
              </p>
            </div>
          </div>
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
        <div className="bg-senai-blueDark rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-300 mb-2">
            <strong className="text-senai-orange">Conteúdo do vídeo:</strong>
          </p>
          <ul className="text-sm text-gray-400 list-disc list-inside space-y-1 ml-2">
            <li>Tipos de dados básicos (int, string, bool, float)</li>
            <li>Declaração e uso de variáveis</li>
            <li>Funções e métodos</li>
            <li>Estruturas condicionais (if/else)</li>
            <li>Loops (for, while)</li>
            <li>Arrays e coleções</li>
            <li>Conceitos de programação orientada a objetos</li>
          </ul>
        </div>
        {!videoWatched && (
          <button
            onClick={handleVideoWatch}
            className="px-6 py-3 bg-senai-orange hover:bg-senai-blue text-white rounded-lg font-semibold transition-colors"
          >
            ✓ Marcar como assistido
          </button>
        )}
        {videoWatched && (
          <div className="bg-senai-blueLight/20 border border-senai-blueLight rounded-lg p-3">
            <p className="text-senai-blueLight font-medium text-sm">
              ✅ Vídeo assistido! Agora você pode fazer o quiz com conhecimento do conteúdo.
            </p>
          </div>
        )}
      </div>

      {/* Quiz sobre UC e Conteúdo do Vídeo */}
      <div className="bg-senai-dark border border-senai-blue rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-6 h-6 text-senai-orange" />
            <h3 className="text-xl font-bold text-white">Quiz: Conhecimento sobre UC e C#</h3>
          </div>
          {quizCompleted && (
            <div className="flex items-center gap-2 text-senai-blueLight">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Completo +50 XP</span>
            </div>
          )}
        </div>
        {!videoWatched && (
          <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-4">
            <p className="text-yellow-400 font-medium text-sm">
              ⚠️ <strong>Recomendação:</strong> Assista ao vídeo tutorial acima antes de fazer o quiz. 
              O quiz contém perguntas sobre o conteúdo do vídeo!
            </p>
          </div>
        )}
        {!quizCompleted ? (
          <QuizComponent onComplete={handleQuizComplete} />
        ) : (
          <div className="text-center py-4 text-gray-400">
            Quiz completado com sucesso! ✅
          </div>
        )}
      </div>

      {/* Formação de Duplas */}
      <div className="bg-senai-dark border border-senai-blue rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-senai-orange" />
            <h3 className="text-xl font-bold text-white">Formar Dupla</h3>
          </div>
          {teamFormed && (
            <div className="flex items-center gap-2 text-senai-blueLight">
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
            className="px-6 py-3 bg-senai-blueLight hover:bg-senai-blueLight/80 text-white rounded-lg font-semibold transition-colors"
          >
            Formar Dupla Aleatoriamente
          </button>
        ) : (
          <div className="bg-senai-blueDark rounded-lg p-4 border border-senai-blueLight">
            <p className="text-senai-blueLight font-medium">✓ Dupla formada com sucesso!</p>
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
            className="px-8 py-3 bg-gradient-to-r from-senai-orange to-senai-blueLight text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
          >
            Concluir Briefing e Avançar →
          </button>
        </div>
      )}
    </div>
  );
}

