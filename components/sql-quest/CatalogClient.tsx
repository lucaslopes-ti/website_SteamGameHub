"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock, PlayCircle, Star } from "lucide-react";
import { chapters, lessons } from "@/lib/sql-quest/catalog";
import { useSqlProgress } from "./useSqlProgress";

export default function CatalogClient() {
  const { completedCount, totalLessons, totalXP, progressPercent, isCompleted, isUnlocked } = useSqlProgress();

  const lessonsByChapter = new Map<number, typeof lessons>();
  for (const lesson of lessons) {
    if (!lessonsByChapter.has(lesson.chapter)) lessonsByChapter.set(lesson.chapter, []);
    lessonsByChapter.get(lesson.chapter)!.push(lesson);
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)]">
      <div className="border-b border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)]/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/sql-quest"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--on-surface-variant)] transition-colors hover:text-[var(--primary-text)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para SQL SenaiUdi
            </Link>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Catálogo de lições</h1>
            <p className="mt-2 text-[var(--on-surface-variant)]">
              Siga a ordem sugerida. Cada lição desbloqueia a próxima.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] p-4">
            <div className="text-center">
              <div className="text-xl font-bold text-[var(--primary-text)]">{completedCount}</div>
              <div className="text-[10px] uppercase tracking-wide text-[var(--on-surface-variant)]">feitas</div>
            </div>
            <div className="h-8 w-px bg-[var(--outline-variant)]" />
            <div className="text-center">
              <div className="text-xl font-bold text-[var(--secondary)]">{totalXP}</div>
              <div className="text-[10px] uppercase tracking-wide text-[var(--on-surface-variant)]">XP</div>
            </div>
            <div className="h-8 w-px bg-[var(--outline-variant)]" />
            <div className="text-center">
              <div className="text-xl font-bold text-[var(--primary-container-text)]">{progressPercent}%</div>
              <div className="text-[10px] uppercase tracking-wide text-[var(--on-surface-variant)]">progresso</div>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-10">
          {chapters.map((chapter) => {
            const chapterLessons = lessonsByChapter.get(chapter.number) ?? [];
            return (
              <div
                key={chapter.number}
                className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/40 p-6"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-10)] font-display text-xl font-bold text-[var(--primary-text)]">
                    {chapter.number}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{chapter.title}</h2>
                    <p className="text-sm text-[var(--on-surface-variant)]">{chapter.description}</p>
                  </div>
                </div>

                <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {chapterLessons.map((lesson) => {
                    const completed = isCompleted(lesson.chapter, lesson.lesson);
                    const unlocked = isUnlocked(lesson.chapter, lesson.lesson);

                    return (
                      <li key={lesson.id}>
                        <Link
                          href={
                            unlocked
                              ? `/sql-quest/learn/${lesson.chapter}/${lesson.lesson}`
                              : "#"
                          }
                          aria-disabled={!unlocked}
                          onClick={(e) => !unlocked && e.preventDefault()}
                          className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                            completed
                              ? "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
                              : unlocked
                              ? "border-[var(--outline-variant)]/40 bg-[var(--surface-container-lowest)] hover:border-[var(--primary)]/40 hover:bg-[var(--surface-container)]"
                              : "cursor-not-allowed border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)]/40 opacity-60"
                          }`}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-container-high)]">
                            {completed ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            ) : unlocked ? (
                              <PlayCircle className="h-5 w-5 text-[var(--primary-text)]" />
                            ) : (
                              <Lock className="h-5 w-5 text-[var(--outline)]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{lesson.title}</p>
                            <p className="truncate text-xs text-[var(--on-surface-variant)]">
                              {completed ? "Concluído" : unlocked ? `${lesson.xpReward} XP` : "Bloqueado"}
                            </p>
                          </div>
                          {!completed && unlocked && (
                            <Star className="ml-auto h-4 w-4 shrink-0 text-[var(--secondary)]" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
