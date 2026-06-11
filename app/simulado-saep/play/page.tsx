"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import {
  getQuestions,
  shuffleAndPick,
  calculateScore,
  saveAttempt,
} from "@/lib/firebase/simulado";
import type { SAEPQuestion, SAEPAttemptAnswer } from "@/lib/firebase/simulado";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Send,
  Trophy,
  Target,
  Clock,
  AlertTriangle,
  RotateCcw,
  Home,
  ArrowLeft,
  Sparkles,
  BookOpen,
} from "lucide-react";

const QUESTIONS_PER_QUIZ = 20;

export default function SimuladoPlayPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // States
  const [questions, setQuestions] = useState<SAEPQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<SAEPAttemptAnswer[]>([]);
  const [score, setScore] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/simulado-saep/play");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load & shuffle questions
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadQuestions() {
      try {
        const allQuestions = await getQuestions();
        if (allQuestions.length === 0) {
          setError("Nenhuma questão cadastrada no banco de dados. Contate o professor.");
          setLoading(false);
          return;
        }
        const selected = shuffleAndPick(allQuestions, QUESTIONS_PER_QUIZ);
        setQuestions(selected);
      } catch (err) {
        console.error("Erro ao carregar questões:", err);
        setError("Erro ao carregar as questões. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [isAuthenticated]);

  // Timer
  useEffect(() => {
    if (finished || loading) return;
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [finished, loading, startTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const handleSelectAnswer = (optionIndex: number) => {
    if (finished) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentIndex(index);
      }
    },
    [questions.length]
  );

  const handleSubmit = async () => {
    if (!user) return;
    setShowConfirmModal(false);
    setSubmitting(true);

    try {
      const attemptAnswers: SAEPAttemptAnswer[] = questions.map((q) => ({
        questionId: q.id,
        selected: selectedAnswers[q.id] ?? -1,
        correct: q.correctAnswer,
        isCorrect: selectedAnswers[q.id] === q.correctAnswer,
      }));

      const finalScore = calculateScore(attemptAnswers);

      await saveAttempt(
        user.id,
        user.name,
        user.email,
        finalScore,
        questions.length,
        attemptAnswers
      );

      setResults(attemptAnswers);
      setScore(finalScore);
      setFinished(true);
    } catch (err) {
      console.error("Erro ao submeter simulado:", err);
      alert("Erro ao salvar resultado. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-senai-dark to-senai-blueDark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-senai-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Loading questions
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-senai-dark to-senai-blueDark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-senai-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl font-bold text-white">Preparando seu simulado...</p>
          <p className="text-gray-400">Sorteando {QUESTIONS_PER_QUIZ} questões do banco</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-senai-dark to-senai-blueDark flex items-center justify-center">
        <div className="max-w-md text-center space-y-4 p-8">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Ops!</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => router.push("/simulado-saep")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-senai-orange text-white font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // TELA DE RESULTADO FINAL
  // ==========================================
  if (finished) {
    const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
    const isGood = percentage >= 70;
    const isOk = percentage >= 50;

    return (
      <div className="min-h-screen bg-gradient-to-b from-senai-dark via-senai-blueDark to-senai-dark">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          {/* Result Card */}
          <div className={`rounded-3xl p-8 mb-8 text-center space-y-6 border ${
            isGood
              ? "bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/30"
              : isOk
              ? "bg-gradient-to-b from-yellow-500/10 to-transparent border-yellow-500/30"
              : "bg-gradient-to-b from-red-500/10 to-transparent border-red-500/30"
          }`}>
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
              isGood ? "bg-emerald-500/20" : isOk ? "bg-yellow-500/20" : "bg-red-500/20"
            }`}>
              {isGood ? (
                <Trophy className="w-10 h-10 text-emerald-400" />
              ) : isOk ? (
                <Target className="w-10 h-10 text-yellow-400" />
              ) : (
                <BookOpen className="w-10 h-10 text-red-400" />
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {isGood ? "Excelente! 🎉" : isOk ? "Bom trabalho! 👍" : "Continue estudando! 📚"}
              </h1>
              <p className="text-gray-400">Sua pontuação foi adicionada ao ranking</p>
            </div>

            <div className="flex items-center justify-center gap-8">
              <div>
                <div className={`text-5xl font-bold ${
                  isGood ? "text-emerald-400" : isOk ? "text-yellow-400" : "text-red-400"
                }`}>
                  {score}/{questions.length}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Acertos</div>
              </div>
              <div className="w-px h-16 bg-white/10" />
              <div>
                <div className={`text-5xl font-bold ${
                  isGood ? "text-emerald-400" : isOk ? "text-yellow-400" : "text-red-400"
                }`}>
                  {percentage.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Aproveitamento</div>
              </div>
              <div className="w-px h-16 bg-white/10" />
              <div>
                <div className="text-5xl font-bold text-senai-blueLight">
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Tempo</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => router.push("/simulado-saep")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors"
              >
                <Trophy className="w-4 h-4" />
                Ver Ranking
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-senai-orange text-white font-bold hover:bg-senai-orange/90 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Novo Simulado
              </button>
            </div>
          </div>

          {/* Review */}
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">Revisão das Questões</h2>
            </div>
            <div className="divide-y divide-white/5">
              {results.map((result, idx) => {
                const q = questions[idx];
                return (
                  <div key={q.id} className={`p-5 ${result.isCorrect ? "bg-emerald-500/5" : "bg-red-500/5"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        result.isCorrect ? "bg-emerald-500/20" : "bg-red-500/20"
                      }`}>
                        {result.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500 font-mono">Q{idx + 1}</span>
                          {q.subject && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-senai-blue/20 text-senai-blueLight uppercase tracking-wider">
                              {q.subject}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white mb-2">{q.question}</p>
                        <div className="space-y-1">
                          {q.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className={`text-xs px-3 py-1.5 rounded-lg ${
                                optIdx === q.correctAnswer
                                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                  : optIdx === result.selected && !result.isCorrect
                                  ? "bg-red-500/15 text-red-300 border border-red-500/30"
                                  : "text-gray-500"
                              }`}
                            >
                              <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                              {opt}
                              {optIdx === q.correctAnswer && (
                                <span className="ml-2 text-emerald-400">✓ Correta</span>
                              )}
                              {optIdx === result.selected && !result.isCorrect && (
                                <span className="ml-2 text-red-400">✗ Sua resposta</span>
                              )}
                            </div>
                          ))}
                          {result.selected === -1 && (
                            <p className="text-xs text-gray-500 italic">Não respondida</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TELA DO SIMULADO (QUESTÕES)
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-senai-dark to-senai-blueDark">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-senai-dark/90 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => router.push("/simulado-saep")}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>

            {/* Progress */}
            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {answeredCount}/{questions.length}
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-senai-orange to-yellow-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {progress.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-[1fr_200px] gap-6">
          {/* Question Area */}
          <div className="space-y-6">
            {/* Question Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-senai-orange/20 flex items-center justify-center">
                <span className="text-senai-orange font-bold text-sm">{currentIndex + 1}</span>
              </div>
              <div>
                <h2 className="text-sm text-gray-400 font-mono uppercase tracking-wider">
                  Questão {currentIndex + 1} de {questions.length}
                </h2>
                {currentQuestion?.subject && (
                  <span className="text-[10px] text-senai-blueLight uppercase tracking-widest">
                    {currentQuestion.subject}
                    {currentQuestion.difficulty && ` • ${
                      currentQuestion.difficulty === "easy" ? "Fácil" :
                      currentQuestion.difficulty === "medium" ? "Médio" : "Difícil"
                    }`}
                  </span>
                )}
              </div>
            </div>

            {/* Question Content */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8">
              <p className="text-lg md:text-xl text-white leading-relaxed whitespace-pre-wrap">
                {currentQuestion?.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion?.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === idx;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full text-left rounded-xl p-4 md:p-5 flex items-start gap-4 transition-all duration-200 border-2 ${
                      isSelected
                        ? "bg-senai-orange/15 border-senai-orange/60 ring-1 ring-senai-orange/30"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors ${
                      isSelected
                        ? "bg-senai-orange text-white"
                        : "bg-white/10 text-gray-400"
                    }`}>
                      {letter}
                    </div>
                    <span className={`text-base leading-relaxed pt-0.5 ${
                      isSelected ? "text-white" : "text-gray-300"
                    }`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => goToQuestion(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-semibold text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all"
                >
                  <Send className="w-4 h-4" />
                  Finalizar Simulado
                </button>
              ) : (
                <button
                  onClick={() => goToQuestion(currentIndex + 1)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-senai-orange/20 border border-senai-orange/40 text-senai-orange font-semibold text-sm hover:bg-senai-orange/30 transition-colors"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Question Navigator (sidebar) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl bg-white/5 border border-white/10 p-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Questões</h3>
              <div className="grid grid-cols-4 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => goToQuestion(idx)}
                      className={`w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                        isCurrent
                          ? "bg-senai-orange text-white ring-2 ring-senai-orange/50"
                          : isAnswered
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2 text-[10px] text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
                  Respondida
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-senai-orange" />
                  Atual
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-white/5 border border-white/10" />
                  Não respondida
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="rounded-2xl bg-senai-dark border border-white/10 p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-senai-orange/20 mx-auto flex items-center justify-center">
                <Send className="w-8 h-8 text-senai-orange" />
              </div>
              <h3 className="text-xl font-bold text-white">Finalizar Simulado?</h3>
              <p className="text-gray-400 text-sm">
                Você respondeu <span className="text-white font-bold">{answeredCount}</span> de{" "}
                <span className="text-white font-bold">{questions.length}</span> questões.
                {answeredCount < questions.length && (
                  <span className="block mt-1 text-yellow-400">
                    ⚠️ Há {questions.length - answeredCount} questão(ões) sem resposta.
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50"
              >
                {submitting ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
