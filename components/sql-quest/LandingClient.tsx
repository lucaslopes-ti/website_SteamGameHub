"use client";

import Link from "next/link";
import { Database, Code2, Trophy, ArrowRight, CheckCircle2, Lock, PlayCircle, Star } from "lucide-react";
import { chapters, lessons } from "@/lib/sql-quest/catalog";
import { useSqlProgress } from "./useSqlProgress";

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--surface-container-high)] border border-[var(--outline-variant)]/30">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-fixed-dim)] transition-all duration-700 ease-out"
        style={{ width: `${percent}%` }}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  );
}

export default function LandingClient() {
  const { completedCount, totalLessons, progressPercent, totalXP, isCompleted } = useSqlProgress();

  const lessonsByChapter = new Map<number, typeof lessons>();
  for (const lesson of lessons) {
    if (!lessonsByChapter.has(lesson.chapter)) lessonsByChapter.set(lesson.chapter, []);
    lessonsByChapter.get(lesson.chapter)!.push(lesson);
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)]">
      <section className="relative overflow-hidden border-b border-[var(--outline-variant)]/20">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[var(--primary)]/20 blur-[100px]" />
        <div className="absolute top-1/2 -left-24 h-64 w-64 rounded-full bg-[var(--secondary-container)]/20 blur-[90px]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--secondary-20)] bg-[var(--secondary-10)] px-4 py-1.5 text-sm font-semibold text-[var(--secondary)]">
                <Database className="h-4 w-4" />
                <span>Novo módulo de estudos</span>
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                SQL <span className="text-gradient-orange">SenaiUdi</span>
              </h1>
              <p className="text-lg text-[var(--on-surface-variant)] md:text-xl">
                Aprenda SQL na prática com desafios curtos, feedback imediato e recompensas em XP.
                Ideal para quem quer dominar consultas sem sair do universo SENAI Game Hub.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/sql-quest/learn"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--secondary-container)] px-6 py-3 text-sm font-bold text-[var(--on-secondary-container)] shadow-lg shadow-[var(--secondary-container)]/20 transition-transform hover:scale-[1.02]"
                >
                  <PlayCircle className="h-5 w-5" />
                  Começar jornada
                </Link>
                <Link
                  href="/sql-quest/learn"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-6 py-3 text-sm font-semibold text-[var(--on-surface)] transition-colors hover:bg-[var(--surface-container-high)]"
                >
                  <Code2 className="h-5 w-5" />
                  Ver catálogo
                </Link>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/60 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--on-surface-variant)]">Seu progresso</span>
                <span className="text-sm font-bold text-[var(--secondary)]">{progressPercent}%</span>
              </div>
              <ProgressBar percent={progressPercent} />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-[var(--surface-container-high)] p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--primary-text)]">{completedCount}</div>
                  <div className="text-xs uppercase tracking-wide text-[var(--on-surface-variant)]">lições feitas</div>
                </div>
                <div className="rounded-xl bg-[var(--surface-container-high)] p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--secondary)]">{totalXP}</div>
                  <div className="text-xs uppercase tracking-wide text-[var(--on-surface-variant)]">XP acumulado</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Três capítulos para evoluir</h2>
            <p className="mt-2 text-[var(--on-surface-variant)]">
              Desbloqueie lições em ordem. Complete uma para abrir a próxima.
            </p>
          </div>
          <div className="hidden items-center gap-2 text-sm font-medium text-[var(--on-surface-variant)] md:flex">
            <Trophy className="h-4 w-4 text-[var(--secondary)]" />
            {totalLessons} lições no total
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter, idx) => {
            const chapterLessons = lessonsByChapter.get(chapter.number) ?? [];
            const completedInChapter = chapterLessons.filter((l) =>
              isCompleted(l.chapter, l.lesson)
            ).length;
            const chapterPercent = chapterLessons.length
              ? Math.round((completedInChapter / chapterLessons.length) * 100)
              : 0;
            const previousChapter = chapters[idx - 1];
            const previousLastLesson = previousChapter
              ? lessonsByChapter.get(previousChapter.number)?.slice(-1)[0]
              : null;
            const isLocked = Boolean(
              previousLastLesson && !isCompleted(previousLastLesson.chapter, previousLastLesson.lesson)
            );

            return (
              <article
                key={chapter.number}
                className={`group relative overflow-hidden rounded-2xl border bg-[var(--surface-container-low)] p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${
                  isLocked
                    ? "border-[var(--outline-variant)]/30 opacity-70"
                    : "border-[var(--outline-variant)]/40 hover:border-[var(--primary)]/40"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-10)] text-[var(--primary-text)]">
                    <span className="font-display text-xl font-bold">{chapter.number}</span>
                  </div>
                  {isLocked ? (
                    <Lock className="h-5 w-5 text-[var(--outline)]" />
                  ) : completedInChapter === chapterLessons.length && chapterLessons.length > 0 ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Star className="h-5 w-5 text-[var(--secondary)]" />
                  )}
                </div>

                <h3 className="mb-2 text-xl font-bold">{chapter.title}</h3>
                <p className="mb-6 text-sm text-[var(--on-surface-variant)]">{chapter.description}</p>

                <div className="mb-4">
                  <div className="mb-2 flex justify-between text-xs font-medium">
                    <span className="text-[var(--on-surface-variant)]">
                      {completedInChapter} de {chapterLessons.length} lições
                    </span>
                    <span className="text-[var(--primary-text)]">{chapterPercent}%</span>
                  </div>
                  <ProgressBar percent={chapterPercent} />
                </div>

                <Link
                  href={isLocked ? "#" : `/sql-quest/learn/${chapter.number}`}
                  aria-disabled={isLocked}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    isLocked
                      ? "cursor-not-allowed bg-[var(--surface-container-high)] text-[var(--outline)]"
                      : "bg-[var(--primary-10)] text-[var(--primary-text)] hover:bg-[var(--primary-20)]"
                  }`}
                  onClick={(e) => isLocked && e.preventDefault()}
                >
                  {isLocked ? "Bloqueado" : "Acessar capítulo"}
                  {!isLocked && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
