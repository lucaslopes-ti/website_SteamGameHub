"use client";

import { useState } from "react";
import { Code, CheckCircle, Download, Play, XCircle } from "lucide-react";
import CodeEditor from "./CodeEditor";

interface CSharpPracticeSectionProps {
  onComplete: () => void;
  addXP: (amount: number) => void;
  unlocked: boolean;
}

const exercises = [
  {
    id: "1",
    title: "Variáveis e Tipos",
    description: "Crie variáveis para armazenar a pontuação do jogador e o nome do jogador.",
    template: `// Exercício 1: Criar variáveis
// Tarefa: Crie uma variável 'score' do tipo int com valor 0
// Crie uma variável 'playerName' do tipo string com valor "Jogador"

`,
    tests: (code: string) => {
      return code.includes("int") && code.includes("score") && code.includes("string");
    },
    xp: 20,
  },
  {
    id: "2",
    title: "Estrutura Condicional",
    description: "Crie uma estrutura if para verificar se o jogador ganhou (score >= 100).",
    template: `// Exercício 2: Estrutura condicional
// Tarefa: Crie um if que verifica se score >= 100
// Se verdadeiro, imprima "Você ganhou!"

int score = 100;

`,
    tests: (code: string) => {
      return code.includes("if") && code.includes("score") && code.includes(">=");
    },
    xp: 30,
  },
  {
    id: "3",
    title: "Funções",
    description: "Crie uma função chamada 'AddScore' que adiciona pontos à pontuação.",
    template: `// Exercício 3: Criar função
// Tarefa: Crie uma função AddScore que recebe um int 'points' e retorna void
// Dentro da função, adicione 'points' ao 'score'

int score = 0;

`,
    tests: (code: string) => {
      return (
        code.includes("void") && code.includes("AddScore") && code.includes("int")
      );
    },
    xp: 50,
  },
];

export default function CSharpPracticeSection({
  onComplete,
  addXP,
  unlocked,
}: CSharpPracticeSectionProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [code, setCode] = useState(exercises[0].template);
  const [testResult, setTestResult] = useState<{
    passed: boolean;
    message: string;
  } | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [earnedXP, setEarnedXP] = useState(0);

  const handleTest = async () => {
    const exercise = exercises[currentExercise];
    const passed = exercise.tests(code);

    if (passed) {
      setTestResult({
        passed: true,
        message: "Parabéns! Código válido!",
      });

      if (!completedExercises.includes(exercise.id)) {
        setCompletedExercises((prev) => [...prev, exercise.id]);
        setEarnedXP((prev) => prev + exercise.xp);
        addXP(exercise.xp);
      }

      // Avançar automaticamente se não for o último
      setTimeout(() => {
        if (currentExercise < exercises.length - 1) {
          setCurrentExercise((prev) => prev + 1);
          setCode(exercises[currentExercise + 1].template);
          setTestResult(null);
        }
      }, 2000);
    } else {
      setTestResult({
        passed: false,
        message: "Código não atende aos requisitos. Revise e tente novamente.",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Program_${currentExercise + 1}.cs`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allCompleted = completedExercises.length === exercises.length;

  if (!unlocked) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Complete a fase anterior para desbloquear esta seção.</p>
      </div>
    );
  }

  const exercise = exercises[currentExercise];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-steam-blueLight mb-2 flex items-center gap-3">
          <Code className="w-8 h-8" />
          Prática C# Guiada
        </h2>
        <p className="text-gray-300">
          Complete os exercícios sequenciais para aprender C# passo a passo.
        </p>
      </div>

      {/* Progresso */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400">
            Exercício {currentExercise + 1} de {exercises.length}
          </span>
          <span className="text-steam-green font-semibold">
            XP Ganho: {earnedXP} pontos
          </span>
        </div>
        <div className="w-full bg-steam-dark rounded-full h-2">
          <div
            className="bg-steam-blueLight h-2 rounded-full transition-all"
            style={{
              width: `${(completedExercises.length / exercises.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Exercício Atual */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-2">{exercise.title}</h3>
        <p className="text-gray-300 mb-4">{exercise.description}</p>

        {/* Editor de Código */}
        <div className="mb-4">
          <CodeEditor value={code} onChange={setCode} language="csharp" />
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleTest}
            className="flex items-center gap-2 px-6 py-3 bg-steam-green hover:bg-steam-green/80 text-white rounded-lg font-semibold transition-colors"
          >
            <Play className="w-5 h-5" />
            Testar Código
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-steam-blue hover:bg-steam-blue/80 text-white rounded-lg font-semibold transition-colors"
          >
            <Download className="w-5 h-5" />
            Baixar .cs
          </button>
        </div>

        {/* Resultado do Teste */}
        {testResult && (
          <div
            className={`rounded-lg p-4 border ${
              testResult.passed
                ? "bg-steam-green/20 border-steam-green text-steam-green"
                : "bg-red-500/20 border-red-500 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {testResult.passed ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{testResult.message}</span>
            </div>
            {testResult.passed && !completedExercises.includes(exercise.id) && (
              <p className="mt-2 text-sm">+{exercise.xp} XP!</p>
            )}
          </div>
        )}

        {/* Navegação entre Exercícios */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => {
              if (currentExercise > 0) {
                setCurrentExercise((prev) => prev - 1);
                setCode(exercises[currentExercise - 1].template);
                setTestResult(null);
              }
            }}
            disabled={currentExercise === 0}
            className="px-4 py-2 bg-steam-dark border border-steam-blue text-gray-300 rounded-lg hover:bg-steam-darker disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <button
            onClick={() => {
              if (currentExercise < exercises.length - 1) {
                setCurrentExercise((prev) => prev + 1);
                setCode(exercises[currentExercise + 1].template);
                setTestResult(null);
              }
            }}
            disabled={currentExercise === exercises.length - 1}
            className="px-4 py-2 bg-steam-dark border border-steam-blue text-gray-300 rounded-lg hover:bg-steam-darker disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Próximo →
          </button>
        </div>
      </div>

      {/* Exercícios Completos */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-4">
        <h4 className="text-lg font-semibold text-white mb-3">Exercícios Completados</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {exercises.map((ex) => {
            const isCompleted = completedExercises.includes(ex.id);
            return (
              <div
                key={ex.id}
                className={`p-3 rounded-lg border ${
                  isCompleted
                    ? "bg-steam-green/10 border-steam-green"
                    : "bg-steam-dark border-steam-blue opacity-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-medium ${
                      isCompleted ? "text-steam-green" : "text-gray-400"
                    }`}
                  >
                    {ex.title}
                  </span>
                  {isCompleted && <CheckCircle className="w-5 h-5 text-steam-green" />}
                </div>
                {isCompleted && (
                  <span className="text-sm text-yellow-400">+{ex.xp} XP</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Conclusão */}
      {allCompleted && (
        <div className="flex justify-end">
          <button
            onClick={onComplete}
            className="px-8 py-3 bg-gradient-to-r from-steam-blueLight to-steam-green text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
          >
            Concluir Prática C# e Avançar →
          </button>
        </div>
      )}
    </div>
  );
}

