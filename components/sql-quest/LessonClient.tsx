"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  Lightbulb,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
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
  const instruction =
    lesson.challenge.kind === "exact" || lesson.challenge.kind === "schema"
      ? lesson.challenge.instruction
      : lesson.summary;
  return `-- ${instruction}\n-- Escreva sua consulta SQL abaixo.\n\n`;
}

interface LessonClientProps {
  lesson: SQLLesson;
  previous: SQLLesson | null;
  next: SQLLesson | null;
}

export default function LessonClient({ lesson, previous, next }: LessonClientProps) {
  const router = useRouter();
  const { isCompleted, isUnlocked, complete } = useSqlProgress();
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
    lesson.challenge.kind === "exact" || lesson.challenge.kind === "schema"
      ? lesson.challenge.instruction
      : lesson.summary;

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)]">
      <div className="border-b border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)]/40">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--on-surface-variant)]">
              <li>
                <Link href="/sql-quest" className="transition-colors hover:text-[var(--primary-text)]">
                  SQL SenaiUdi
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/sql-quest/learn/${lesson.chapter}`}
                  className="transition-colors hover:text-[var(--primary-text)]"
                >
                  Capítulo {lesson.chapter}
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-[var(--on-surface)]" aria-current="page">
                Lição {lesson.lesson}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold md:text-3xl">{lesson.title}</h1>
              <p className="mt-1 text-[var(--on-surface-variant)]">{lesson.summary}</p>
            </div>
            <div className="flex items-center gap-2">
              {previous && (
                <Link
                  href={`/sql-quest/learn/${previous.chapter}/${previous.lesson}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-2 text-sm font-medium text-[var(--on-surface)] transition-colors hover:bg-[var(--surface-container-high)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Anterior
                </Link>
              )}
              {next && (
                <Link
                  href={`/sql-quest/learn/${next.chapter}/${next.lesson}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-2 text-sm font-medium text-[var(--on-surface)] transition-colors hover:bg-[var(--surface-container-high)]"
                >
                  Próxima
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          {/* Painel esquerdo: teoria */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/40 p-6">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Sparkles className="h-5 w-5 text-[var(--secondary)]" />
                Objetivo
              </h2>
              <p className="text-[var(--on-surface-variant)]">{instruction}</p>
            </section>

            <section className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/40 p-6">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Database className="h-5 w-5 text-[var(--primary-text)]" />
                Teoria
              </h2>
              <div className="prose prose-invert prose-sm max-w-none text-[var(--on-surface-variant)]">
                {lesson.explanation.split("\n\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-3">
                    {paragraph.split("`").map((part, pidx) =>
                      pidx % 2 === 1 ? (
                        <code key={pidx} className="rounded bg-[var(--surface-container-high)] px-1 py-0.5 font-mono text-xs text-[var(--primary-text)]">
                          {part}
                        </code>
                      ) : (
                        part
                      )
                    )}
                  </p>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/40 p-6">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Database className="h-5 w-5 text-[var(--primary-text)]" />
                Esquema
              </h2>
              <SchemaViewer
                tables={lesson.tables.map((t) => ({
                  name: t.name,
                  columns: t.columns.map((c) => ({ name: c.name, type: c.type ?? "UNKNOWN" })),
                }))}
              />
            </section>

            <section className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/40 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold">
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
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--secondary-20)] bg-[var(--secondary-10)] px-4 py-2 text-sm font-semibold text-[var(--secondary)] transition-colors hover:bg-[var(--secondary-20)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Lightbulb className="h-4 w-4" />
                  Mostrar próxima dica
                </button>
              )}
            </section>
          </div>

          {/* Painel direito: prática */}
          <div className="relative flex flex-col gap-4">
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

            <section className="flex flex-col rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/40">
              <div className="flex items-center justify-between border-b border-[var(--outline-variant)]/20 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-[var(--on-surface-variant)]">
                  <Database className="h-4 w-4" />
                  Editor SQL
                </span>
                {engineLoading && (
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--primary-text)]">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary-text)]" />
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

              {engineError ? (
                <div
                  role="alert"
                  className="flex flex-col items-start gap-4 p-6"
                >
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
              ) : (
                <div className="p-4">
                  <SqlEditor
                    value={code}
                    onChange={setCode}
                    disabled={!unlocked || engineLoading || executing}
                    height="300px"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 border-t border-[var(--outline-variant)]/20 px-4 py-3">
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={!unlocked || engineLoading || !!engineError || executing || !code.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--secondary-container)] px-5 py-2.5 text-sm font-bold text-[var(--on-secondary-container)] shadow-md transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {executing ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--on-secondary-container)] border-t-transparent" />
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
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm font-semibold text-[var(--on-surface)] transition-colors hover:bg-[var(--surface-container-high)] disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reiniciar
                </button>

                <div className="ml-auto text-xs font-medium text-[var(--on-surface-variant)]">
                  {lesson.xpReward} XP disponíveis
                </div>
              </div>
            </section>

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
          </div>
        </div>
      </main>
    </div>
  );
}
