"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Lock, PlayCircle, Sparkles, Trophy } from "lucide-react";
import { chapters, lessons } from "@/lib/sql-quest/catalog";
import { useSqlProgress } from "./useSqlProgress";

function LessonRail({ chapterLessons, isCompleted, isUnlocked }: { chapterLessons: typeof lessons; isCompleted: (chapter: number, lesson: number) => boolean; isUnlocked: (chapter: number, lesson: number) => boolean }) {
  return (
    <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" aria-label="Progresso das lições do capítulo">
      {chapterLessons.map((lesson) => {
        const completed = isCompleted(lesson.chapter, lesson.lesson);
        const unlocked = isUnlocked(lesson.chapter, lesson.lesson);
        const state = completed ? "concluída" : unlocked ? "disponível" : "bloqueada";
        return (
          <li key={lesson.id}>
            <Link
              href={unlocked ? `/sql-quest/learn/${lesson.chapter}/${lesson.lesson}` : "#"}
              aria-disabled={!unlocked}
              aria-label={`Lição ${lesson.lesson}: ${lesson.title}, ${state}`}
              title={lesson.title}
              onClick={(event) => !unlocked && event.preventDefault()}
              className={`group flex min-h-[64px] sm:min-h-[70px] flex-col justify-between rounded-xl border p-2.5 sm:p-3 transition-[transform,border-color,background-color] duration-[180ms] ease-out active:scale-[0.98] motion-reduce:transition-none ${
                completed
                  ? "border-emerald-400/35 bg-emerald-500/10"
                  : unlocked
                  ? "border-[var(--primary)]/35 bg-[var(--surface-container-lowest)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--primary)]"
                  : "cursor-not-allowed border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)]/50 opacity-60"
              }`}
            >
              <span className="flex items-center justify-between text-xs font-bold text-[var(--on-surface-variant)]">
                <span>{String(lesson.lesson).padStart(2, "0")}</span>
                {completed ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : unlocked ? <Circle className="h-4 w-4 text-[var(--primary-text)]" /> : <Lock className="h-3.5 w-3.5" />}
              </span>
              <span className="mt-1.5 truncate text-xs font-semibold leading-tight">{lesson.title}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export default function CatalogClient() {
  const { completedCount, totalLessons, totalXP, progressPercent, isCompleted, isUnlocked } = useSqlProgress();
  const nextLesson = lessons.find((lesson) => isUnlocked(lesson.chapter, lesson.lesson) && !isCompleted(lesson.chapter, lesson.lesson)) ?? lessons[0];
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)]">
      <header className="border-b border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)]/60">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Link href="/sql-quest" className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--on-surface-variant)] [@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--primary-text)]">
            <ArrowLeft className="h-4 w-4" /> SENAI Quest
          </Link>
          <div className="mt-5 sm:mt-6 flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary-text)]">Central de estudos</p>
              <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Sua próxima conquista começa aqui.</h1>
              <p className="mt-2.5 max-w-xl text-sm sm:text-base leading-6 sm:leading-7 text-[var(--on-surface-variant)]">
                Uma trilha guiada para praticar SQL sem perder o fio. Siga a ordem, teste suas ideias e desbloqueie o próximo desafio.
              </p>
            </div>
            <Link
              href={`/sql-quest/learn/${nextLesson.chapter}/${nextLesson.lesson}`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--secondary-container)] px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-[var(--on-secondary-container)] transition-[transform,box-shadow] duration-[160ms] ease-out active:scale-[0.98] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5"
            >
              <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              {completedCount ? "Continuar estudando" : "Começar agora"}
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 sm:mb-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-lowest)] p-3.5 sm:p-4">
            <p className="text-xl sm:text-2xl font-bold text-[var(--primary-text)]">{completedCount}<span className="text-xs sm:text-sm font-normal text-[var(--on-surface-variant)]">/{totalLessons}</span></p>
            <p className="text-xs text-[var(--on-surface-variant)]">lições concluídas</p>
          </div>
          <div className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-lowest)] p-3.5 sm:p-4">
            <p className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-[var(--secondary)]">{totalXP} <Trophy className="h-4 w-4 sm:h-5 sm:w-5" /></p>
            <p className="text-xs text-[var(--on-surface-variant)]">XP acumulado</p>
          </div>
          <div className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-lowest)] p-3.5 sm:p-4">
            <p className="text-xl sm:text-2xl font-bold">{progressPercent}%</p>
            <p className="text-xs text-[var(--on-surface-variant)]">da trilha explorada</p>
          </div>
        </div>
        <div className="space-y-6 sm:space-y-8">
          {chapters.map((chapter) => {
            const chapterLessons = lessons.filter((lesson) => lesson.chapter === chapter.number);
            const done = chapterLessons.filter((lesson) => isCompleted(lesson.chapter, lesson.lesson)).length;
            const percent = chapterLessons.length ? Math.round((done / chapterLessons.length) * 100) : 0;
            return (
              <section key={chapter.slug} className="rounded-2xl sm:rounded-3xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/50 p-4 sm:p-6 lg:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3 sm:gap-4">
                    <span className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--primary-10)] font-display text-lg sm:text-xl font-bold text-[var(--primary-text)]">
                      {chapter.number}
                    </span>
                    <div>
                      <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Capítulo {chapter.number}</p>
                      <h2 className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-bold">{chapter.title}</h2>
                      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-[var(--on-surface-variant)]">{chapter.description}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-[var(--secondary)]">
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {done}/{chapterLessons.length} · {percent}%
                  </span>
                </div>
                <div className="mt-4 sm:mt-6 h-2 overflow-hidden rounded-full bg-[var(--surface-container-high)]">
                  <div className="h-full rounded-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] transition-[width] duration-500 ease-linear motion-reduce:transition-none" style={{ width: `${percent}%` }} />
                </div>
                <LessonRail chapterLessons={chapterLessons} isCompleted={isCompleted} isUnlocked={isUnlocked} />
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
