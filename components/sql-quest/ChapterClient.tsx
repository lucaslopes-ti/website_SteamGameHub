"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock, PlayCircle, Star, BookOpen } from "lucide-react";
import { SQLChapter, SQLLesson } from "@/lib/sql-quest/types";
import { useSqlProgress } from "./useSqlProgress";

interface ChapterClientProps {
  chapter: SQLChapter;
  lessons: SQLLesson[];
}

export default function ChapterClient({ chapter, lessons }: ChapterClientProps) {
  const { isCompleted, isUnlocked } = useSqlProgress();
  const completedInChapter = lessons.filter((l) =>
    isCompleted(l.chapter, l.lesson)
  ).length;
  const chapterPercent = lessons.length
    ? Math.round((completedInChapter / lessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)]">
      <div className="border-b border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)]/40">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <Link
            href="/sql-quest/learn"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--on-surface-variant)] transition-colors hover:text-[var(--primary-text)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao catálogo
          </Link>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary-text)]">
                <BookOpen className="h-4 w-4" />
                Capítulo {chapter.number}
              </div>
              <h1 className="font-display text-3xl font-bold md:text-4xl">{chapter.title}</h1>
              <p className="mt-2 max-w-2xl text-[var(--on-surface-variant)]">{chapter.description}</p>
            </div>
            <div className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] p-4 text-center min-w-[140px]">
              <div className="text-2xl font-bold text-[var(--secondary)]">{chapterPercent}%</div>
              <div className="text-xs uppercase tracking-wide text-[var(--on-surface-variant)]">
                {completedInChapter} de {lessons.length} lições
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <ol className="space-y-4">
          {lessons.map((lesson, idx) => {
            const completed = isCompleted(lesson.chapter, lesson.lesson);
            const unlocked = isUnlocked(lesson.chapter, lesson.lesson);

            return (
              <li key={lesson.id}>
                <Link
                  href={unlocked ? `/sql-quest/learn/${lesson.chapter}/${lesson.lesson}` : "#"}
                  aria-disabled={!unlocked}
                  onClick={(e) => !unlocked && e.preventDefault()}
                  className={`group flex items-center gap-5 rounded-2xl border p-5 transition-all ${
                    completed
                      ? "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
                      : unlocked
                      ? "border-[var(--outline-variant)]/40 bg-[var(--surface-container-lowest)] hover:border-[var(--primary)]/40"
                      : "cursor-not-allowed border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)]/40 opacity-60"
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-container-high)] font-display font-bold text-[var(--on-surface-variant)]">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{lesson.title}</h3>
                    <p className="text-sm text-[var(--on-surface-variant)]">{lesson.summary}</p>
                  </div>
                  <div className="hidden flex-col items-end gap-1 sm:flex">
                    <span
                      className={`text-xs font-bold uppercase tracking-wide ${
                        completed ? "text-emerald-400" : unlocked ? "text-[var(--secondary)]" : "text-[var(--outline)]"
                      }`}
                    >
                      {completed ? "Concluído" : unlocked ? `${lesson.xpReward} XP` : "Bloqueado"}
                    </span>
                    {completed && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                    {!completed && unlocked && <PlayCircle className="h-5 w-5 text-[var(--primary-text)]" />}
                    {!unlocked && <Lock className="h-5 w-5 text-[var(--outline)]" />}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
