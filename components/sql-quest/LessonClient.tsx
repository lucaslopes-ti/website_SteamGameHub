"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { marked } from "marked";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Database,
  Lightbulb,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Table2,
  XCircle,
} from "lucide-react";
import { SQLLesson, SQLValue } from "@/lib/sql-quest/types";
import { executeLessonQuery, initEngine } from "@/lib/sql-quest/sql-engine";
import SqlEditor from "./SqlEditor";
import { useSqlProgress } from "./useSqlProgress";

function ResultTable({ columns, rows }: { columns: string[]; rows: SQLValue[][] }) {
  if (columns.length === 0) return null;
  return (
    <div className="overflow-auto rounded-lg border border-[var(--outline-variant)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--surface-container-high)] text-xs uppercase tracking-wide text-[var(--on-surface-variant)]">
          <tr>
            {columns.map((col) => (
              <th key={col} className="whitespace-nowrap px-4 py-2 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--outline-variant)]/30">
          {rows.map((row, i) => (
            <tr key={i} className="bg-[var(--surface-container-lowest)]">
              {row.map((cell, j) => (
                <td key={j} className="whitespace-nowrap px-4 py-2 text-[var(--on-surface)]">
                  {cell === null ? (
                    <span className="text-[var(--outline)]">NULL</span>
                  ) : (
                    String(cell)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SchemaViewer({ tables }: { tables: { name: string; columns: { name: string; type: string }[] }[] }) {
  if (tables.length === 0) return null;
  return (
    <div className="space-y-3">
      {tables.map((table) => (
        <div
          key={table.name}
          className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3"
        >
          <p className="mb-2 font-mono text-sm font-bold text-[var(--primary-text)]">{table.name}</p>
          <ul className="space-y-1">
            {table.columns.map((col) => (
              <li key={col.name} className="flex items-center justify-between text-xs">
                <span className="font-mono text-[var(--on-surface)]">{col.name}</span>
                <span className="text-[var(--on-surface-variant)]">{col.type}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function HintCard({ hint, index }: { hint: string; index: number }) {
  return (
    <div className="flex gap-3 rounded-lg border border-[var(--secondary-20)] bg-[var(--secondary-10)]/30 p-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--secondary-container)] text-xs font-bold text-[var(--on-secondary-container)]">
        {index + 1}
      </div>
      <p className="text-sm text-[var(--on-surface)]">{hint}</p>
    </div>
  );
}

/**
 * Scaffold NEUTRO de partida para o editor: um comentário SQL com a instrução,
 * sem revelar a solução. Nunca usa `exampleSql` (que costuma satisfazer o
 * desafio). A solução continua disponível apenas como última dica progressiva
 * (já presente no array `hints` dos dados).
 */
function neutralScaffold(lesson: SQLLesson): string {
  // Lições "corrija o código" trazem o starterSql (código quebrado) pronto no
  // editor; as demais partem de um comentário neutro com a instrução.
  if (lesson.starterSql && lesson.starterSql.trim().length > 0) {
    return lesson.starterSql;
  }
  const instruction =
    lesson.challenge.kind === "exact" || lesson.challenge.kind === "schema" || lesson.challenge.kind === "data"
      ? lesson.challenge.instruction
      : lesson.summary;
  return `-- ${instruction}\n-- Escreva sua consulta SQL abaixo.\n\n`;
}

function formatTheory(markdown: string): string {
  const html = marked.parse(markdown);
  const formatted = typeof html === "string" ? html : "";
  const practiceHeadingClass =
    "border-l-4 border-[var(--secondary)] bg-[var(--secondary-10)] px-4 py-3 text-[var(--secondary)] shadow-sm shadow-[var(--secondary)]/10";
  const highlighted = formatted.replace(
    /<h2>\s*Sua vez\s*<\/h2>/g,
    `<h2 class="${practiceHeadingClass}">Sua vez</h2>`
  );
  return DOMPurify.sanitize(highlighted);
}

/** Classes compartilhadas dos botões da barra de contexto (Anterior/Próxima). */
const NAV_BUTTON_CLASS =
  "inline-flex items-center gap-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 py-2 text-sm font-medium text-[var(--on-surface)] transition-[background-color,border-color,transform] duration-[160ms] ease-out active:scale-[0.98] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--surface-container-high)]";

/**
 * Ajustes de "app shell" para a lição em desktop, escopados à presença do
 * workspace (`data-sql-lesson-shell`) e sem tocar em outras telas:
 *
 * - Zera o `min-h-screen` global do `<main>` nesta rota para que a altura da
 *   lição (`100dvh - cabeçalho`) não sofra um "fantasma" de rolagem.
 * - Esconde o rodapé global apenas no desktop desta lição: como o rodapé é um
 *   elemento posicionado posterior no DOM, ele poderia pintar sobre o
 *   workspace; ocultá-lo é o comportamento esperado de uma tela de foco
 *   (equivalente ao bootdev). No mobile o rodapé continua normal.
 *
 * É CSS puro (`:has`), sem `position: fixed` no workspace e sem travar o
 * scroll global — o cabeçalho global permanece visível e sticky.
 *
 * A altura do workspace desconta o cabeçalho global (`6.125rem` = 4rem da
 * barra + 2rem da faixa de novidades + 2px de bordas). O valor em `rem`
 * acompanha o tamanho de fonte do usuário, como o próprio cabeçalho.
 */
const SQL_LESSON_SHELL_CSS = `
  @media (min-width: 1024px) {
    #main-content:has([data-sql-lesson-shell]) { min-height: 0; }
    body:has([data-sql-lesson-shell]) #footer { display: none; }
  }
`;

interface LessonClientProps {
  lesson: SQLLesson;
  previous: SQLLesson | null;
  next: SQLLesson | null;
}

export default function LessonClient({ lesson, previous, next }: LessonClientProps) {
  const router = useRouter();
  const {
    isCompleted,
    isUnlocked,
    complete,
    completedCount,
    totalLessons,
    progressPercent,
  } = useSqlProgress();
  const [code, setCode] = useState(() => neutralScaffold(lesson));
  const [engineLoading, setEngineLoading] = useState(true);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<{
    columns: string[];
    rows: SQLValue[][];
    error?: string | null;
  } | null>(null);
  const [validation, setValidation] = useState<{
    passed: boolean;
    message: string;
    details: string[];
  } | null>(null);
  const [revealedHints, setRevealedHints] = useState(0);
  const [justSolved, setJustSolved] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const completed = isCompleted(lesson.chapter, lesson.lesson);
  const unlocked = isUnlocked(lesson.chapter, lesson.lesson);

  const startEngine = useCallback(() => {
    setEngineLoading(true);
    setEngineError(null);
    initEngine()
      .then(() => setEngineLoading(false))
      .catch(() => {
        setEngineLoading(false);
        setEngineError(
          "Não foi possível iniciar o motor SQL. Verifique sua conexão e tente novamente."
        );
      });
  }, []);

  useEffect(() => {
    setCode(neutralScaffold(lesson));
    setResult(null);
    setValidation(null);
    setRevealedHints(0);
    setJustSolved(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    startEngine();
  }, [lesson, startEngine]);

  const handleRun = async () => {
    if (!unlocked || engineLoading || engineError || executing) return;
    setExecuting(true);
    setResult(null);
    setValidation(null);
    try {
      const { result: res, validation: val } = await executeLessonQuery(lesson, code);
      setResult({ columns: res.columns, rows: res.rows, error: res.error });
      setValidation(val);
      if (val.passed && !completed) {
        await complete(lesson.chapter, lesson.lesson);
        setJustSolved(true);
      }
    } catch {
      // Nunca deixa a tela presa caso a execução rejeite inesperadamente.
      setResult({
        columns: [],
        rows: [],
        error:
          "Ocorreu um erro inesperado ao executar sua consulta. Tente novamente.",
      });
      setValidation(null);
    } finally {
      setExecuting(false);
    }
  };

  const handleReset = () => {
    setCode(neutralScaffold(lesson));
    setResult(null);
    setValidation(null);
    setJustSolved(false);
  };

  const revealHint = () => {
    if (revealedHints < lesson.hints.length) {
      setRevealedHints((n) => n + 1);
    }
  };

  const goToNext = () => {
    if (next) {
      router.push(`/sql-quest/learn/${next.chapter}/${next.lesson}`);
    }
  };

  const instruction =
    "instruction" in lesson.challenge ? lesson.challenge.instruction : lesson.summary;

  const isSqlChallenge = lesson.challenge.kind === "exact" || lesson.challenge.kind === "schema" || lesson.challenge.kind === "data";
  const isQuiz = lesson.challenge.kind === "quiz";
  const isTheory = lesson.challenge.kind === "theory";
  const quizQuestions = lesson.challenge.kind === "quiz" ? lesson.challenge.questions : [];
  const quizComplete = isQuiz && quizQuestions.length > 0 && quizQuestions.every((_, index) => quizAnswers[index] !== undefined);
  const quizPassed = isQuiz && quizComplete && quizQuestions.every((question, index) => quizAnswers[index] === question.answer);
  const theoryHtml = formatTheory(lesson.explanation);

  const completeNonSqlLesson = async () => {
    if (!unlocked || completed) return;
    if (isQuiz && !quizPassed) return;
    await complete(lesson.chapter, lesson.lesson);
    setJustSolved(true);
  };

  /** Há algo a mostrar no console do editor (acerto, erro, resultado ou conclusão). */
  const hasFeedback = Boolean(validation || result || justSolved);

  /** Feedback de execução/conclusão — reaproveitado nos dois formatos de painel. */
  const feedback = (
    <>
      {validation && (
        <div
          className={`rounded-2xl border p-4 ${
            validation.passed
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-red-500/30 bg-red-500/10"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            {validation.passed ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            )}
            <div className="flex-1">
              <p className={`font-semibold ${validation.passed ? "text-emerald-400" : "text-red-400"}`}>
                {validation.passed ? "Resposta correta!" : "Ops, algo deu errado"}
              </p>
              <p className="mt-1 text-sm text-[var(--on-surface-variant)]">{validation.message}</p>
              {validation.details.length > 0 && (
                <ul className="mt-2 list-inside list-disc text-sm text-[var(--on-surface-variant)]">
                  {validation.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}
              {validation.passed && (
                <p className="mt-2 text-sm font-bold text-emerald-400">+{lesson.xpReward} XP</p>
              )}
            </div>
          </div>
        </div>
      )}

      {justSolved && next && (
        <div className="rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary-10)] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-[var(--primary-text)]">
              Lição concluída! Pronto para a próxima?
            </p>
            <button
              type="button"
              onClick={goToNext}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--secondary-container)] px-4 py-2 text-sm font-bold text-[var(--on-secondary-container)]"
            >
              Próxima lição
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {result && !result.error && result.columns.length > 0 && (
        <section className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/40 p-4">
          <h3 className="mb-3 text-sm font-semibold text-[var(--on-surface-variant)]">
            Resultado ({result.rows.length} {result.rows.length === 1 ? "linha" : "linhas"})
          </h3>
          <ResultTable columns={result.columns} rows={result.rows} />
        </section>
      )}

      {result?.error && (
        <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
          <h3 className="mb-2 text-sm font-semibold text-red-400">Erro na execução</h3>
          <pre className="whitespace-pre-wrap rounded-lg bg-[var(--surface-container-lowest)] p-3 font-mono text-xs text-red-300">
            {result.error}
          </pre>
        </section>
      )}
    </>
  );

  return (
    <div
      data-sql-lesson-shell=""
      className="flex min-h-screen flex-col bg-[var(--surface)] text-[var(--on-surface)] lg:h-[calc(100dvh-6.125rem)] lg:min-h-0 lg:overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: SQL_LESSON_SHELL_CSS }} />
      {/* Contexto compacto do módulo: navegação, título e progresso */}
      <header className="shrink-0 border-b border-[var(--outline-variant)]/25 bg-[var(--surface-container-low)]/55">
        <div className="flex flex-col gap-3 px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-6">
          <div className="min-w-0 flex-1">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--on-surface-variant)]">
              <Link
                href="/sql-quest"
                className="shrink-0 transition-colors [@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--primary-text)]"
              >
                SQL SenaiUdi
              </Link>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--outline)]" />
              <Link
                href={`/sql-quest/learn/${lesson.chapter}`}
                className="shrink-0 transition-colors [@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--primary-text)]"
              >
                Capítulo {lesson.chapter}
              </Link>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--outline)]" />
              <span className="truncate font-medium text-[var(--on-surface)]" aria-current="page">
                Lição {lesson.chapter}.{lesson.lesson}
              </span>
            </nav>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <h1 className="font-display text-lg font-bold tracking-tight sm:text-xl">{lesson.title}</h1>
              <span className="rounded-full bg-[var(--secondary)]/10 px-2 py-0.5 text-[11px] font-bold text-[var(--secondary)]">
                +{lesson.xpReward} XP
              </span>
              {completed && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Concluída
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4">
            <div className="hidden w-36 shrink-0 sm:block">
              <div className="flex items-center justify-between text-[11px] text-[var(--on-surface-variant)]">
                <span className="font-medium">
                  {completedCount}/{totalLessons} lições
                </span>
                <span className="font-bold text-[var(--secondary)]">{progressPercent}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--surface-container-high)]">
                <div
                  className="h-full rounded-full bg-[var(--secondary)] transition-[width] duration-500 ease-out motion-reduce:transition-none"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {previous && (
                <Link
                  href={`/sql-quest/learn/${previous.chapter}/${previous.lesson}`}
                  aria-label={`Lição anterior: ${previous.title}`}
                  className={NAV_BUTTON_CLASS}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </Link>
              )}
              {next && (
                <Link
                  href={`/sql-quest/learn/${next.chapter}/${next.lesson}`}
                  aria-label={`Próxima lição: ${next.title}`}
                  className={NAV_BUTTON_CLASS}
                >
                  <span className="hidden sm:inline">Próxima</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="h-0.5 bg-gradient-to-r from-[var(--primary)] via-[var(--primary-fixed-dim)] to-[var(--secondary)] opacity-80"
        />
      </header>

      {/* Workspace: instruções à esquerda, prática à direita (empilhado no mobile) */}
      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
        {/* Painel esquerdo: teoria */}
        <section
          aria-label="Conteúdo da lição"
          className="min-w-0 space-y-4 border-b border-[var(--outline-variant)]/25 px-4 py-4 sm:px-6 sm:py-5 lg:min-h-0 lg:space-y-5 lg:overflow-y-auto lg:overscroll-contain lg:border-b-0 lg:py-5"
          style={{
            backgroundImage:
              "radial-gradient(130% 90% at 0% 0%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 60%)",
          }}
        >
          <section className="rounded-2xl border border-[var(--primary)]/25 bg-[var(--primary-10)]/35 p-5 shadow-lg shadow-[var(--primary)]/5">
            <h2 className="mb-2 flex items-center gap-2 text-base font-bold">
              <Sparkles className="h-5 w-5 text-[var(--secondary)]" />
              Objetivo
            </h2>
            <p className="text-sm leading-6 text-[var(--on-surface-variant)]">{instruction}</p>
          </section>

          {lesson.id === "select-01" && (
            <figure className="overflow-hidden rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/40 p-3 shadow-lg shadow-black/10">
              <img
                src="/uploads/images/sql_logos.png"
                alt="Logotipos relacionados à linguagem SQL e bancos de dados"
                className="h-auto w-full rounded-xl object-cover"
              />
              <figcaption className="px-1 pt-3 text-center text-xs leading-5 text-[var(--on-surface-variant)]">
                SQL conecta dados, consultas e decisões em um único idioma.
              </figcaption>
            </figure>
          )}

          <section className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/40 p-5">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold">
              <BookOpen className="h-5 w-5 text-[var(--primary-text)]" />
              Teoria
            </h2>
            <div
              className="max-w-none text-sm leading-7 text-[var(--on-surface-variant)] [&>*:first-child]:mt-0 [&_a]:font-semibold [&_a]:text-[var(--primary-text)] [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--secondary)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-[var(--surface-container-high)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-[var(--primary-text)] [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:leading-tight [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:leading-tight [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:font-bold [&_h3]:text-lg [&_li]:pl-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:my-3 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[var(--outline-variant)]/40 [&_pre]:bg-[var(--surface-container-lowest)] [&_pre]:p-4 [&_pre_code]:block [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm [&_pre_code]:leading-6 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: theoryHtml }}
            />
          </section>

          <section className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/40 p-5">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold">
              <Table2 className="h-5 w-5 text-[var(--primary-text)]" />
              Esquema
            </h2>
            <SchemaViewer
              tables={lesson.tables.map((t) => ({
                name: t.name,
                columns: t.columns.map((c) => ({ name: c.name, type: c.type ?? "UNKNOWN" })),
              }))}
            />
          </section>

          <section className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/40 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <Lightbulb className="h-5 w-5 text-[var(--secondary)]" />
                Dicas
              </h2>
              <span className="text-xs font-medium text-[var(--on-surface-variant)]">
                {revealedHints} de {lesson.hints.length}
              </span>
            </div>

            <div className="space-y-3">
              {lesson.hints.slice(0, revealedHints).map((hint, i) => (
                <HintCard key={i} hint={hint} index={i} />
              ))}
              {revealedHints === 0 && (
                <p className="text-sm text-[var(--on-surface-variant)]">
                  As dicas são liberadas uma a cada clique. Use-as com moderação para não perder o desafio.
                </p>
              )}
            </div>

            {revealedHints < lesson.hints.length && (
              <button
                type="button"
                onClick={revealHint}
                disabled={!unlocked}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--secondary-20)] bg-[var(--secondary-10)] px-4 py-2 text-sm font-semibold text-[var(--secondary)] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.98] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--secondary-20)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Lightbulb className="h-4 w-4" />
                Mostrar próxima dica
              </button>
            )}
          </section>
        </section>

        {/* Painel direito: prática */}
        <section
          aria-label="Área de prática"
          className={
            isSqlChallenge
              ? "relative flex min-h-0 flex-1 flex-col gap-3 border-t border-[var(--outline-variant)]/25 bg-[var(--surface-container-lowest)]/30 p-3 sm:p-4 lg:gap-4 lg:overflow-hidden lg:border-l lg:border-t-0 lg:p-5"
              : "relative min-h-0 flex-1 space-y-4 border-t border-[var(--outline-variant)]/25 bg-[var(--surface-container-lowest)]/30 p-4 sm:p-5 lg:overflow-y-auto lg:overscroll-contain lg:border-l lg:border-t-0"
          }
          style={{
            backgroundImage:
              "radial-gradient(120% 80% at 100% 100%, color-mix(in srgb, var(--secondary) 12%, transparent), transparent 58%)",
          }}
        >
          {!unlocked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--outline-variant)]/40 bg-[var(--surface)]/90 p-6 text-center backdrop-blur-sm">
              <Lock className="h-12 w-12 text-[var(--outline)]" />
              <h3 className="text-xl font-bold">Lição bloqueada</h3>
              <p className="max-w-xs text-sm text-[var(--on-surface-variant)]">
                Complete a lição anterior para desbloquear esta prática.
              </p>
              {previous && (
                <Link
                  href={`/sql-quest/learn/${previous.chapter}/${previous.lesson}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--secondary-container)] px-5 py-2.5 text-sm font-bold text-[var(--on-secondary-container)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para a lição anterior
                </Link>
              )}
            </div>
          )}

          {lesson.setupSql.trim() && (
            <details className="shrink-0 rounded-xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/60 px-4 py-2.5">
              <summary className="cursor-pointer text-xs font-semibold text-[var(--on-surface-variant)]">
                Código de setup
              </summary>
              <pre className="mt-2 max-h-56 overflow-auto rounded-lg bg-[var(--surface-container-high)] p-3 font-mono text-xs leading-6 text-[var(--on-surface)]">
                <code>{lesson.setupSql}</code>
              </pre>
            </details>
          )}

          {isSqlChallenge && (
            <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-[var(--primary)]/30 bg-[var(--surface-container-low)]/60 shadow-xl shadow-black/20 lg:overflow-hidden">
              <div className="flex shrink-0 items-center justify-between gap-3 rounded-t-2xl border-b border-[var(--outline-variant)]/25 bg-[var(--surface-container-high)]/40 px-4 py-2.5">
                <span className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                  <Database className="h-4 w-4 text-[var(--primary-text)]" />
                  Editor SQL
                </span>
                {engineLoading && (
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--primary-text)]">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary-text)] motion-reduce:animate-none" />
                    Inicializando motor
                  </span>
                )}
                {completed && !engineLoading && !engineError && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Concluído
                  </span>
                )}
              </div>

              <div className="shrink-0 border-b border-[var(--outline-variant)]/25 bg-[var(--secondary-10)]/40 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--secondary)]">Tarefa</p>
                <p className="mt-1 text-sm leading-6 text-[var(--on-surface)]">{instruction}</p>
              </div>

              {engineError && (
                <div role="alert" className="flex shrink-0 flex-col items-start gap-3 border-b border-[var(--outline-variant)]/25 p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                    <div>
                      <p className="font-semibold text-red-400">
                        Não foi possível iniciar o editor
                      </p>
                      <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                        {engineError}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={startEngine}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--secondary-container)] px-4 py-2 text-sm font-bold text-[var(--on-secondary-container)]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Tentar novamente
                  </button>
                </div>
              )}

              {/* O editor preenche todo o espaço vertical disponível no desktop;
                  a altura fixa fica só no mobile, onde o painel não é limitado
                  pela viewport. `overflow-hidden` impede que o editor vaze sobre
                  a barra de ações em telas baixas. */}
              <div className="h-[clamp(18rem,42vh,26rem)] min-h-0 overflow-hidden p-3 sm:p-4 lg:h-auto lg:flex-1">
                <SqlEditor
                  value={code}
                  onChange={setCode}
                  disabled={!unlocked || executing}
                  height="100%"
                />
              </div>

              {/* Console de resultados: rolagem própria, sem empurrar as ações. */}
              {hasFeedback && (
                <div className="shrink-0 space-y-3 overflow-y-auto overscroll-contain border-t border-[var(--outline-variant)]/25 bg-[var(--surface-container-low)]/40 p-3 sm:p-4 lg:max-h-[45%]">
                  {feedback}
                </div>
              )}

              {/* Rodapé do painel: ações sempre visíveis. No desktop o painel tem
                  altura própria (fica fixo no fim); no mobile a página rola e o
                  rodapé acompanha a viewport para nunca esconder o Executar. */}
              <div className="sticky bottom-0 z-20 flex shrink-0 flex-wrap items-center gap-2 rounded-b-2xl border-t border-[var(--outline-variant)]/25 bg-[var(--surface-container-low)]/95 px-3 py-2.5 backdrop-blur-sm sm:gap-3 sm:px-4 sm:py-3">
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={!unlocked || engineLoading || !!engineError || executing || !code.trim()}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--secondary-container)] px-5 py-2.5 text-sm font-bold text-[var(--on-secondary-container)] shadow-md transition-transform duration-[160ms] ease-out active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                >
                  {executing ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--on-secondary-container)] border-t-transparent motion-reduce:animate-none" />
                      Executando...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Executar
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={executing}
                  aria-label="Reiniciar código"
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 py-2.5 text-sm font-semibold text-[var(--on-surface)] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.98] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--surface-container-high)] disabled:opacity-50 sm:px-4"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Reiniciar</span>
                </button>

                <div className="ml-auto hidden text-xs font-medium text-[var(--on-surface-variant)] sm:block">
                  {lesson.xpReward} XP nesta lição
                </div>
              </div>
            </section>
          )}

          {isQuiz && (
            <section className="rounded-3xl border border-[var(--secondary)]/30 bg-[var(--surface-container-low)]/60 p-5 shadow-xl shadow-black/20 sm:p-6" aria-labelledby="quiz-heading">
              <div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--secondary)]">Quiz de revisão</p><h2 id="quiz-heading" className="mt-2 text-xl font-bold">Escolha a melhor resposta</h2></div><span className="rounded-full bg-[var(--secondary)]/10 px-3 py-1 text-xs font-bold text-[var(--secondary)]">{Object.keys(quizAnswers).length}/{quizQuestions.length}</span></div>
              <div className="space-y-6">{quizQuestions.map((question, questionIndex) => <fieldset key={`${lesson.id}-question-${questionIndex}`} className="space-y-3"><legend className="text-sm font-semibold leading-6">{questionIndex + 1}. {question.prompt}</legend><div className="grid gap-2">{question.options.map((option, optionIndex) => { const selected = quizAnswers[questionIndex] === optionIndex; const correct = quizSubmitted && optionIndex === question.answer; const wrong = quizSubmitted && selected && !correct; return <label key={`${lesson.id}-question-${questionIndex}-option-${optionIndex}`} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-[border-color,background-color,transform] duration-[160ms] ease-out active:scale-[0.99] ${correct ? "border-emerald-400/50 bg-emerald-500/10" : wrong ? "border-red-400/50 bg-red-500/10" : selected ? "border-[var(--primary)]/60 bg-[var(--primary-10)]" : "border-[var(--outline-variant)]/30 bg-[var(--surface-container-lowest)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--primary)]/50"}`}><input type="radio" name={`${lesson.id}-question-${questionIndex}`} checked={selected} onChange={() => !quizSubmitted && setQuizAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))} disabled={quizSubmitted} className="mt-0.5 accent-[var(--primary)]" />{option}</label>; })}</div>{quizSubmitted && question.explanation && <p className="text-sm leading-6 text-[var(--on-surface-variant)]">{question.explanation}</p>}</fieldset>)}</div>
              {!quizSubmitted ? <button type="button" onClick={() => { setQuizSubmitted(true); if (quizPassed) void completeNonSqlLesson(); }} disabled={!quizComplete || !unlocked} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--secondary-container)] px-5 py-3 text-sm font-bold text-[var(--on-secondary-container)] transition-[transform,opacity] duration-[160ms] ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">Verificar respostas</button> : <div className={`mt-7 rounded-2xl border p-4 ${quizPassed ? "border-emerald-400/30 bg-emerald-500/10" : "border-red-400/30 bg-red-500/10"}`} role="status" aria-live="polite"><p className="font-bold">{quizPassed ? "Tudo certo!" : "Quase lá."}</p><p className="mt-1 text-sm text-[var(--on-surface-variant)]">{quizPassed ? `+${lesson.xpReward} XP conquistados.` : "Revise as respostas e tente novamente."}</p>{!quizPassed && <button type="button" onClick={() => setQuizSubmitted(false)} className="mt-3 text-sm font-bold text-[var(--primary-text)]">Tentar novamente</button>}</div>}
            </section>
          )}

          {isTheory && <section className="rounded-3xl border border-[var(--primary)]/30 bg-[var(--surface-container-low)]/60 p-6 shadow-xl shadow-black/20"><div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-10)]"><Sparkles className="h-5 w-5 text-[var(--primary-text)]" /></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary-text)]">Leitura concluída?</p><h2 className="mt-1 text-xl font-bold">Marque esta teoria como vista</h2><p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">Não há editor nesta unidade. Quando estiver pronto, confirme para liberar a próxima lição.</p></div></div><button type="button" onClick={completeNonSqlLesson} disabled={!unlocked || completed} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--secondary-container)] px-5 py-3 text-sm font-bold text-[var(--on-secondary-container)] transition-[transform,opacity] duration-[160ms] ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">{completed ? "Teoria concluída" : "Concluir teoria"}<CheckCircle2 className="h-4 w-4" /></button></section>}

          {/* Nos desafios de SQL o feedback vive dentro do console do editor;
              nos demais fluxos (quiz/teoria) corre junto do card. */}
          {!isSqlChallenge && <div className="space-y-4">{feedback}</div>}
        </section>
      </div>
    </div>
  );
}
