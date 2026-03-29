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
  {
    id: "11",
    question: "No vídeo, qual é a sintaxe correta para declarar uma variável do tipo inteiro em C#?",
    options: [
      "variavel int = 10;",
      "int variavel = 10;",
      "int = 10;",
      "variavel = 10 int;",
    ],
    correct: 1,
    explanation: "Em C#, a sintaxe correta é: tipo nomeDaVariavel = valor; Exemplo: int variavel = 10;",
    xp: 10,
  },
  {
    id: "12",
    question: "Quais são os tipos de dados básicos apresentados no vídeo?",
    options: [
      "Apenas int e string",
      "int, string, bool e float",
      "Apenas números",
      "Apenas texto",
    ],
    correct: 1,
    explanation: "Os tipos básicos em C# incluem: int (números inteiros), string (texto), bool (verdadeiro/falso) e float (números decimais).",
    xp: 10,
  },
  {
    id: "13",
    question: "No vídeo, como é declarada uma função que não retorna valor em C#?",
    options: [
      "function NomeFuncao()",
      "void NomeFuncao()",
      "return NomeFuncao()",
      "var NomeFuncao()",
    ],
    correct: 1,
    explanation: "Em C#, funções que não retornam valor usam a palavra-chave 'void' antes do nome da função: void NomeFuncao()",
    xp: 10,
  },
  {
    id: "14",
    question: "Qual é a sintaxe correta de uma estrutura condicional if em C#?",
    options: [
      "if condição { código }",
      "if (condição) { código }",
      "if condição: código",
      "if [condição] { código }",
    ],
    correct: 1,
    explanation: "Em C#, a sintaxe do if é: if (condição) { código }. A condição sempre fica entre parênteses.",
    xp: 10,
  },
  {
    id: "15",
    question: "No vídeo, qual operador é usado para comparar igualdade em C#?",
    options: [
      "=",
      "==",
      "===",
      "igual",
    ],
    correct: 1,
    explanation: "Em C#, o operador == é usado para comparar igualdade. O operador = é usado apenas para atribuição.",
    xp: 10,
  },
  {
    id: "16",
    question: "Como é declarado um array de inteiros em C# conforme mostrado no vídeo?",
    options: [
      "array int[] numeros;",
      "int[] numeros = new int[5];",
      "int numeros[];",
      "array numeros;",
    ],
    correct: 1,
    explanation: "Em C#, arrays são declarados com: tipo[] nome = new tipo[tamanho]; Exemplo: int[] numeros = new int[5];",
    xp: 10,
  },
  {
    id: "17",
    question: "No vídeo, qual é a sintaxe de um loop for em C#?",
    options: [
      "for i in range(10)",
      "for (int i = 0; i < 10; i++)",
      "for i = 0 to 10",
      "loop for i < 10",
    ],
    correct: 1,
    explanation: "Em C#, o loop for tem a sintaxe: for (inicialização; condição; incremento). Exemplo: for (int i = 0; i < 10; i++)",
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
        <div className="w-full bg-senai-dark rounded-full h-2">
          <div
            className="bg-senai-orange h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Pergunta */}
      <div className="bg-senai-blueDark rounded-lg p-6 border border-senai-blue">
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
                    ? "bg-senai-blueLight/20 border-senai-blueLight text-senai-blueLight"
                    : showWrong
                    ? "bg-red-500/20 border-red-500 text-red-400"
                    : isSelected
                    ? "bg-senai-blue/20 border-senai-orange text-senai-orange"
                    : "bg-senai-dark border-senai-blue text-gray-300 hover:border-senai-orange"
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
        <div className="bg-senai-blue/10 border border-senai-blue rounded-lg p-4">
          <p className="text-senai-orange font-medium mb-2">Explicação:</p>
          <p className="text-gray-300 text-sm">{question.explanation}</p>
          {selectedAnswer === question.correct && (
            <p className="text-senai-blueLight mt-2 font-medium">+{question.xp} XP!</p>
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
            className="px-4 py-2 bg-senai-dark border border-senai-blue text-gray-300 rounded-lg hover:bg-senai-blueDark transition-colors"
          >
            ← Anterior
          </button>
        )}
        <div className="ml-auto">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="px-6 py-2 bg-senai-orange hover:bg-senai-blue text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Verificar Resposta
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-senai-blueLight hover:bg-senai-blueLight/80 text-white rounded-lg font-semibold transition-colors"
            >
              {currentQuestion < questions.length - 1 ? "Próxima →" : "Concluir Quiz"}
            </button>
          )}
        </div>
      </div>

      {/* XP Total */}
      {earnedXP > 0 && (
        <div className="text-center text-senai-blueLight font-semibold">
          XP Total Ganho: {earnedXP} pontos
        </div>
      )}
    </div>
  );
}

