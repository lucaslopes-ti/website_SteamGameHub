"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  ArrowLeft,
  BookOpen,
} from "lucide-react";

const QUESTIONS_PER_QUIZ = 20;

// CSS Injection para a Página de Play
const playLumenStyles = `
/* ─── TOKENS & BASE ─── */
.lumen-theme {
	--bg: #060608;
	--bg2: #0d0d12;
	--bg3: #12121a;
	--border: rgba(255, 255, 255, 0.06);
	--text: #d4cfc8;
	--text-dim: #6b6870;
	--amber: #f5c97a;
	--amber-dim: #a8823a;
	--amber-glow: rgba(245, 201, 122, 0.15);
	--radius: 8px;
  --success: #7ecfa0;
  --success-glow: rgba(126, 207, 160, 0.15);
  --error-color: #e57373;
  --error-glow: rgba(229, 115, 115, 0.15);
  --warm: #f0e8d8;

	background: var(--bg);
	color: var(--text);
	font-family: "DM Mono", monospace;
	font-weight: 300;
	overflow-x: hidden;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.lumen-theme *, .lumen-theme *::before, .lumen-theme *::after {
	box-sizing: border-box;
}

/* ─── NOISE GRAIN ─── */
.lumen-theme::after {
	content: "";
	position: fixed;
	inset: 0;
	background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
	pointer-events: none;
	z-index: 9999;
	opacity: 0.5;
}

/* ─── CUSTOM CURSOR ─── */
.lumen-theme { cursor: none; }
.lumen-theme a, .lumen-theme button { cursor: none; }
.lumen-theme .cur {
	position: fixed;
	width: 6px; height: 6px;
	background: var(--amber);
	border-radius: 50%;
	pointer-events: none;
	z-index: 10000;
	transform: translate(-50%, -50%);
	transition: width 0.15s, height 0.15s, background 0.15s;
}
.lumen-theme .cur-ring {
	position: fixed;
	width: 28px; height: 28px;
	border: 1px solid var(--amber);
	border-radius: 50%;
	pointer-events: none;
	z-index: 9999;
	transform: translate(-50%, -50%);
	transition: width 0.25s, height 0.25s, opacity 0.25s, border-color 0.25s;
	opacity: 0.35;
}
.lumen-theme:has(a:hover, button:hover) .cur {
	width: 10px; height: 10px; background: var(--amber);
}
.lumen-theme:has(a:hover, button:hover) .cur-ring {
	width: 44px; height: 44px; opacity: 0.6;
}

/* COMPONENTES DA PROVA */
.play-topbar {
  position: sticky;
  top: 64px; /* below header */
  z-index: 40;
  background: rgba(6, 6, 8, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 16px 24px;
}
.play-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
@media (min-width: 1024px) {
  .play-container { padding: 0 40px; }
}

/* Typography */
.play-title { font-family: "Cormorant Garamond", serif; font-weight: 300; color: var(--warm); }
.play-mono { font-family: "DM Mono", monospace; }

/* Buttons */
.btn-amber {
  background: var(--amber);
  color: var(--bg);
  border: 1px solid var(--amber);
  padding: 12px 24px;
  font-family: "DM Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: var(--radius);
  transition: all 0.2s;
}
.btn-amber:hover { background: #ffd98a; border-color: #ffd98a; }

.btn-outline {
  background: transparent;
  color: var(--amber);
  border: 1px solid var(--border);
  padding: 12px 24px;
  font-family: "DM Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: var(--radius);
  transition: all 0.2s;
}
.btn-outline:hover { background: var(--border); border-color: var(--amber-dim); }

.btn-success {
  background: transparent;
  color: var(--success);
  border: 1px solid var(--success);
  padding: 12px 24px;
  font-family: "DM Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: var(--radius);
  transition: all 0.2s;
}
.btn-success:hover { background: var(--success); color: var(--bg); }

/* Option Cards */
.option-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.option-card:hover { border-color: rgba(245, 201, 122, 0.4); background: rgba(245, 201, 122, 0.02); }
.option-card.selected {
  background: var(--amber-glow);
  border-color: var(--amber);
}
.option-card.correct {
  background: var(--success-glow);
  border-color: var(--success);
}
.option-card.wrong {
  background: var(--error-glow);
  border-color: var(--error);
}
.option-letter {
  width: 32px; height: 32px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-dim);
  font-family: "DM Mono", monospace;
  font-size: 14px;
}
.option-card.selected .option-letter {
  background: var(--amber);
  color: var(--bg);
}
.option-card.correct .option-letter {
  background: var(--success);
  color: var(--bg);
}
.option-card.wrong .option-letter {
  background: var(--error);
  color: var(--bg);
}

/* Sidebar Navigator */
.nav-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
.nav-dot {
  aspect-ratio: 1;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  font-family: "DM Mono", monospace;
  border: 1px solid var(--border);
  background: var(--bg3);
  color: var(--text-dim);
  transition: all 0.2s;
}
.nav-dot:hover { background: rgba(255, 255, 255, 0.05); }
.nav-dot.correct { background: var(--success-glow); border-color: rgba(126, 207, 160, 0.3); color: var(--success); }
.nav-dot.wrong { background: var(--error-glow); border-color: rgba(230, 100, 100, 0.3); color: var(--error); }
.nav-dot.current { border-color: var(--amber); color: var(--amber); box-shadow: 0 0 10px var(--amber-glow); }
.nav-dot.current.answered { background: var(--amber); color: var(--bg); border-color: var(--amber); box-shadow: none;}

/* Result Card */
.result-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.result-card::before {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(ellipse at center top, var(--amber-glow), transparent 60%);
  opacity: 0.5; pointer-events: none;
}
.result-card.success-glow::before { background: radial-gradient(ellipse at center top, var(--success-glow), transparent 60%); }
.result-card.error-glow::before { background: radial-gradient(ellipse at center top, var(--error-glow), transparent 60%); }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(6, 6, 8, 0.9);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
}
.modal-content {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
`;

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
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SAEPAttemptAnswer[]>([]);
  const [score, setScore] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Custom Cursor
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = cursorRef.current;
    const ring = ringRef.current;
    if (!cur || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + "px";
      cur.style.top = my + "px";
    };

    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

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
          setError("Nenhuma questão cadastrada no banco de dados.");
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

  const handleSelectAnswer = (optionIdx: number) => {
    if (showResults) return;
    const q = questions[currentIndex];
    if (selectedAnswers[q.id] !== undefined) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [q.id]: optionIdx
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
      setShowResults(true);
    } catch (err) {
      console.error("Erro ao submeter simulado:", err);
      alert("Erro ao salvar resultado. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');` }} />
      <style dangerouslySetInnerHTML={{ __html: playLumenStyles }} />

      <div className="lumen-theme">
        <div ref={cursorRef} className="cur" />
        <div ref={ringRef} className="cur-ring" />

        {loading ? (
          <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
            <div className="w-12 h-12 rounded-full border-2 border-[var(--border)] border-t-[var(--amber)] animate-spin" />
            <h2 className="play-title text-3xl">Preparando Avaliação</h2>
            <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase">Sorteando {QUESTIONS_PER_QUIZ} Questões</p>
          </div>
        ) : error ? (
          <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 px-4 text-center">
            <AlertTriangle className="w-12 h-12 text-[var(--error-color)] opacity-80" />
            <h2 className="play-title text-4xl">Sistema Indisponível</h2>
            <p className="text-[var(--text-dim)]">{error}</p>
            <button onClick={() => router.push("/simulado-saep")} className="btn-outline mt-4">
              Voltar ao Início
            </button>
          </div>
        ) : finished ? (
          /* =================== RESULTADOS =================== */
          <div className="play-container max-w-3xl pt-24">
            <div className={`result-card ${score / questions.length >= 0.7 ? "success-glow" : score / questions.length >= 0.5 ? "" : "error-glow"} mb-12`}>
              <h1 className="play-title text-5xl mb-4">
                {score / questions.length >= 0.7 ? "Excelente Desempenho." : score / questions.length >= 0.5 ? "Bom Trabalho." : "Continue Estudando."}
              </h1>
              <p className="text-[var(--text-dim)] mb-12">Avaliação processada. Seus pontos foram registrados no leaderboard.</p>

              <div className="grid grid-cols-3 gap-4 mb-12 divide-x divide-[var(--border)]">
                <div>
                  <div className="play-title text-6xl" style={{ color: score / questions.length >= 0.7 ? "var(--success)" : "var(--amber)" }}>
                    {score}<span className="text-2xl text-[var(--text-dim)]">/{questions.length}</span>
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-[var(--text-dim)] mt-2">Acertos</div>
                </div>
                <div>
                  <div className="play-title text-6xl" style={{ color: "var(--warm)" }}>
                    {((score / questions.length) * 100).toFixed(0)}%
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-[var(--text-dim)] mt-2">Aproveitamento</div>
                </div>
                <div>
                  <div className="play-title text-6xl" style={{ color: "var(--text-dim)" }}>
                    {formatTime(elapsedTime)}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-[var(--text-dim)] mt-2">Tempo</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button onClick={() => router.push("/simulado-saep")} className="btn-outline">
                  Leaderboard
                </button>
                <button onClick={() => window.location.reload()} className="btn-amber">
                  Nova Tentativa
                </button>
              </div>
            </div>

            {/* Revisão */}
            <h3 className="text-xs uppercase tracking-widest text-[var(--text-dim)] mb-6 flex items-center gap-2">
              <span style={{ width: "20px", height: "1px", background: "var(--border)" }} />
              Revisão Analítica
            </h3>
            <div className="space-y-4">
              {results.map((result, idx) => {
                const q = questions[idx];
                return (
                  <div key={q.id} className="p-6 rounded-xl bg-[var(--bg3)] border border-[var(--border)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ background: result.isCorrect ? "var(--success)" : "var(--error-color)" }} />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-[10px] font-mono text-[var(--text-dim)] tracking-widest">Q{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</div>
                      {q.subject && (
                        <div className="text-[9px] px-2 py-0.5 rounded border border-[var(--border)] text-[var(--amber-dim)] uppercase tracking-wider">
                          {q.subject}
                        </div>
                      )}
                    </div>
                    <p className="text-[15px] leading-relaxed mb-6">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = result.selected === optIdx;
                        const isCorrect = q.correctAnswer === optIdx;
                        let optStyle = "text-[var(--text-dim)]";
                        let optBg = "transparent";

                        if (isCorrect) {
                          optStyle = "text-[var(--success)]";
                          optBg = "var(--success-glow)";
                        } else if (isSelected && !result.isCorrect) {
                          optStyle = "text-[var(--error-color)]";
                          optBg = "var(--error-glow)";
                        }

                        return (
                          <div key={optIdx} className={`text-[13px] px-3 py-2 rounded ${optStyle}`} style={{ background: optBg }}>
                            <span className="font-bold mr-2 opacity-50">{String.fromCharCode(65 + optIdx)}.</span>
                            {opt}
                            {isCorrect && <span className="ml-2">✓</span>}
                            {isSelected && !isCorrect && <span className="ml-2">✗</span>}
                          </div>
                        );
                      })}
                      {result.selected === -1 && (
                        <p className="text-xs text-[var(--text-dim)] italic mt-2">Sem resposta registrada.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* =================== TELA DA PROVA =================== */
          <>
            <div className="play-topbar flex items-center justify-between gap-6">
              <button onClick={() => router.push("/simulado-saep")} className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--amber)] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Sair
              </button>
              
              <div className="flex-1 max-w-md flex items-center gap-4">
                <span className="text-[10px] font-mono text-[var(--text-dim)]">{answeredCount}/{questions.length}</span>
                <div className="flex-1 h-1 bg-[var(--border)] overflow-hidden rounded-full">
                  <div className="h-full bg-[var(--amber)] transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-[10px] font-mono text-[var(--text-dim)]">{progress.toFixed(0)}%</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[var(--amber-dim)]">
                <Clock className="w-4 h-4" />
                {formatTime(elapsedTime)}
              </div>
            </div>

            <div className="play-container grid lg:grid-cols-[1fr_240px] gap-12 mt-12">
              {/* Question Area */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="play-title text-5xl text-[var(--amber)]">
                    {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1}.
                  </div>
                  {currentQuestion?.subject && (
                    <div className="text-[10px] px-2 py-1 rounded border border-[var(--amber-dim)] text-[var(--amber)] uppercase tracking-wider">
                      {currentQuestion.subject}
                    </div>
                  )}
                </div>

                <p className="text-[17px] leading-relaxed mb-10 whitespace-pre-wrap text-[var(--warm)]">
                  {currentQuestion?.question}
                </p>

                <div className="space-y-3 mb-12">
                  {currentQuestion?.options.map((option, idx) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === idx;
                    const isAnswered = selectedAnswers[currentQuestion.id] !== undefined;
                    const isCorrectOption = currentQuestion.correctAnswer === idx;

                    let cardClass = "option-card";
                    let textClass = "text-[var(--text)]";

                    if (isAnswered) {
                      if (isCorrectOption) {
                        cardClass += " correct";
                        textClass = "text-[var(--success)]";
                      } else if (isSelected) {
                        cardClass += " wrong";
                        textClass = "text-[var(--error-color)]";
                      } else {
                        cardClass += " opacity-50";
                      }
                    } else if (isSelected) {
                      cardClass += " selected";
                      textClass = "text-[var(--warm)]";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left flex items-start gap-4 ${cardClass}`}
                      >
                        <div className="option-letter">{String.fromCharCode(65 + idx)}</div>
                        <div className={`pt-1.5 text-[14px] leading-relaxed ${textClass}`}>
                          {option}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t border-[var(--border)] pt-8">
                  <button
                    onClick={() => goToQuestion(currentIndex - 1)}
                    disabled={currentIndex === 0}
                    className="btn-outline flex items-center gap-2 disabled:opacity-30 disabled:hover:bg-transparent disabled:border-[var(--border)] disabled:text-[var(--text-dim)]"
                  >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>

                  {currentIndex === questions.length - 1 ? (
                    <button onClick={() => setShowConfirmModal(true)} disabled={submitting} className="btn-success flex items-center gap-2">
                      <Send className="w-4 h-4" /> Finalizar Avaliação
                    </button>
                  ) : (
                    <button onClick={() => goToQuestion(currentIndex + 1)} className="btn-outline flex items-center gap-2" style={{ borderColor: "var(--amber-dim)" }}>
                      Próxima <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="hidden lg:block">
                <div className="sticky top-32 p-6 rounded-xl bg-[var(--bg2)] border border-[var(--border)]">
                  <h3 className="text-[10px] uppercase tracking-widest text-[var(--text-dim)] mb-4">Navegação</h3>
                  <div className="nav-grid">
                    {questions.map((q, idx) => {
                      const isAnswered = selectedAnswers[q.id] !== undefined;
                      const isCurrent = idx === currentIndex;
                      const isCorrect = isAnswered && selectedAnswers[q.id] === q.correctAnswer;
                      let classes = "nav-dot";
                      if (isAnswered) {
                        classes += isCorrect ? " correct" : " wrong";
                      }
                      if (isCurrent) classes += " current";
                      
                      return (
                        <button key={q.id} onClick={() => goToQuestion(idx)} className={classes}>
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded bg-[var(--success-glow)] border border-[rgba(126,207,160,0.3)]" />
                      <span className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider">Respondida</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded border border-[var(--amber)] bg-[var(--amber)]" />
                      <span className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider">Atual</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded bg-[var(--bg3)] border border-[var(--border)]" />
                      <span className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider">Pendente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Modal */}
            {showConfirmModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="w-16 h-16 rounded-full bg-[var(--amber-glow)] mx-auto flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8 text-[var(--amber)]" />
                  </div>
                  <h3 className="play-title text-3xl mb-4">Concluir Simulado?</h3>
                  <p className="text-[13px] text-[var(--text-dim)] leading-relaxed mb-8">
                    Você respondeu <strong className="text-[var(--warm)]">{answeredCount}</strong> de <strong className="text-[var(--warm)]">{questions.length}</strong> questões.
                    {answeredCount < questions.length && (
                      <span className="block mt-2 text-[var(--error-color)]">
                        Restam {questions.length - answeredCount} pendentes. Elas serão contabilizadas como incorretas.
                      </span>
                    )}
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => setShowConfirmModal(false)} className="flex-1 btn-outline" style={{ color: "var(--text)", borderColor: "var(--border)" }}>
                      Retornar
                    </button>
                    <button onClick={handleSubmit} disabled={submitting} className="flex-1 btn-amber">
                      {submitting ? "Processando..." : "Confirmar"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
