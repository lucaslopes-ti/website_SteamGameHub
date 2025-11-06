"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  xp: number;
}

const questions: Question[] = [
  {
    id: "1",
    question: "Qual é o objetivo da UC Planejamento e Publicação de Jogos Digitais?",
    options: [
      "Apenas desenvolver código",
      "Planejar, desenvolver e publicar jogos usando métodos ágeis",
      "Aprender apenas design",
      "Criar apenas arte 3D",
    ],
    correct: 1,
    explanation: "A UC visa planejar, desenvolver e publicar jogos usando métodos ágeis e iterações.",
    xp: 10,
  },
  {
    id: "2",
    question: "Qual plataforma é usada para publicação de portfólios nesta UC?",
    options: ["Steam", "GitHub", "SENAI Game Hub", "Itch.io"],
    correct: 2,
    explanation: "O SENAI Game Hub é a plataforma oficial usada para publicação de portfólios nesta UC.",
    xp: 10,
  },
  {
    id: "3",
    question: "Métodos ágeis incluem:",
    options: [
      "Apenas documentação extensa",
      "Iterações rápidas e feedback constante",
      "Desenvolvimento sequencial longo",
      "Sem testes",
    ],
    correct: 1,
    explanation: "Métodos ágeis valorizam iterações rápidas e feedback constante.",
    xp: 10,
  },
  {
    id: "4",
    question: "O que é um protótipo?",
    options: [
      "Versão final do jogo",
      "Versão inicial testável para validação",
      "Apenas documento de design",
      "Arte final",
    ],
    correct: 1,
    explanation: "Um protótipo é uma versão inicial testável para validar ideias.",
    xp: 10,
  },
  {
    id: "5",
    question: "Por que a gamificação é usada nesta atividade?",
    options: [
      "Apenas diversão",
      "Aumentar engajamento e motivar aprendizado",
      "Competição apenas",
      "Não tem objetivo",
    ],
    correct: 1,
    explanation: "A gamificação aumenta engajamento e motiva o aprendizado através de elementos de jogo.",
    xp: 10,
  },
  {
    id: "6",
    question: "O que é C#?",
    options: [
      "Uma linguagem de marcação",
      "Uma linguagem de programação orientada a objetos desenvolvida pela Microsoft",
      "Um framework de design",
      "Um banco de dados",
    ],
    correct: 1,
    explanation: "C# é uma linguagem de programação orientada a objetos desenvolvida pela Microsoft, amplamente usada no desenvolvimento de jogos com Unity.",
    xp: 10,
  },
  {
    id: "7",
    question: "Qual é a importância de criar um protótipo antes do jogo final?",
    options: [
      "Não tem importância",
      "Validar ideias rapidamente e identificar problemas antes do desenvolvimento completo",
      "Apenas para mostrar ao cliente",
      "Perder tempo",
    ],
    correct: 1,
    explanation: "Protótipos permitem validar ideias rapidamente, testar mecânicas e identificar problemas antes de investir tempo no desenvolvimento completo.",
    xp: 10,
  },
  {
    id: "8",
    question: "O que é um GDD (Game Design Document)?",
    options: [
      "Um documento que descreve apenas a arte do jogo",
      "Um documento que descreve o design, mecânicas, história e visão geral do jogo",
      "Apenas código do jogo",
      "Um documento de marketing",
    ],
    correct: 1,
    explanation: "O GDD é um documento completo que descreve o design, mecânicas, história, personagens e visão geral do jogo.",
    xp: 10,
  },
  {
    id: "9",
    question: "Na atividade, quantas fases principais existem?",
    options: [
      "2 fases",
      "3 fases",
      "4 fases",
      "5 fases",
    ],
    correct: 2,
    explanation: "A atividade possui 4 fases principais: Briefing e Treinamento, Prática C# Guiada, Modelagem Blender, e Publicação e Reflexão.",
    xp: 10,
  },
  {
    id: "10",
    question: "Como funciona o sistema de desbloqueio de fases nesta atividade?",
    options: [
      "Todas as fases estão abertas desde o início",
      "Cada fase só é liberada após completar a anterior",
      "Você pode escolher qualquer fase",
      "Apenas a última fase está bloqueada",
    ],
    correct: 1,
    explanation: "O sistema é sequencial: cada fase só é desbloqueada após completar a fase anterior, garantindo aprendizado progressivo.",
    xp: 10,
  },
];

interface QuizComponentProps {
  onComplete: () => void;
}

export default function QuizComponent({ onComplete }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;
    
    setShowResult(true);
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setEarnedXP((prev) => prev + question.xp);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onComplete();
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-4">
      {/* Progresso */}
      <div>
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
          <span>{correctAnswers} corretas</span>
        </div>
        <div className="w-full bg-steam-darker rounded-full h-2">
          <div
            className="bg-steam-blueLight h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Pergunta */}
      <div className="bg-steam-dark rounded-lg p-6 border border-steam-blue">
        <h4 className="text-lg font-semibold text-white mb-4">{question.question}</h4>
        <div className="space-y-2">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correct;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  showCorrect
                    ? "bg-steam-green/20 border-steam-green text-steam-green"
                    : showWrong
                    ? "bg-red-500/20 border-red-500 text-red-400"
                    : isSelected
                    ? "bg-steam-blue/20 border-steam-blueLight text-steam-blueLight"
                    : "bg-steam-darker border-steam-blue text-gray-300 hover:border-steam-blueLight"
                } ${showResult ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrect && <CheckCircle className="w-5 h-5" />}
                  {showWrong && <XCircle className="w-5 h-5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explicação */}
      {showResult && (
        <div className="bg-steam-blue/10 border border-steam-blue rounded-lg p-4">
          <p className="text-steam-blueLight font-medium mb-2">Explicação:</p>
          <p className="text-gray-300 text-sm">{question.explanation}</p>
          {selectedAnswer === question.correct && (
            <p className="text-steam-green mt-2 font-medium">+{question.xp} XP!</p>
          )}
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-between">
        {currentQuestion > 0 && !showResult && (
          <button
            onClick={() => {
              setCurrentQuestion((prev) => prev - 1);
              setSelectedAnswer(null);
              setShowResult(false);
            }}
            className="px-4 py-2 bg-steam-darker border border-steam-blue text-gray-300 rounded-lg hover:bg-steam-dark transition-colors"
          >
            ← Anterior
          </button>
        )}
        <div className="ml-auto">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="px-6 py-2 bg-steam-blueLight hover:bg-steam-blue text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Verificar Resposta
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-steam-green hover:bg-steam-green/80 text-white rounded-lg font-semibold transition-colors"
            >
              {currentQuestion < questions.length - 1 ? "Próxima →" : "Concluir Quiz"}
            </button>
          )}
        </div>
      </div>

      {/* XP Total */}
      {earnedXP > 0 && (
        <div className="text-center text-steam-green font-semibold">
          XP Total Ganho: {earnedXP} pontos
        </div>
      )}
    </div>
  );
}

