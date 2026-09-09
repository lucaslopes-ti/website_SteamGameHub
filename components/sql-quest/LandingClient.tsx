"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2, Database, Lock, PlayCircle, Sparkles, Trophy } from "lucide-react";
import { chapters, lessons } from "@/lib/sql-quest/catalog";
import { useSqlProgress } from "./useSqlProgress";

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-container-high)]" role="progressbar" aria-label="Progresso da jornada" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] transition-[width] duration-700 ease-linear motion-reduce:transition-none" style={{ width: `${percent}%` }} />
    </div>
  );
}

export default function LandingClient() {
  const { completedCount, totalLessons, progressPercent, totalXP, isCompleted, isUnlocked } = useSqlProgress();
  const nextLesson = lessons.find((lesson) => isUnlocked(lesson.chapter, lesson.lesson) && !isCompleted(lesson.chapter, lesson.lesson)) ?? lessons[lessons.length - 1];
  const lessonsByChapter = new Map<number, typeof lessons>();
  for (const lesson of lessons) {
    if (!lessonsByChapter.has(lesson.chapter)) lessonsByChapter.set(lesson.chapter, []);
    lessonsByChapter.get(lesson.chapter)!.push(lesson);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--surface)] text-[var(--on-surface)]">
      <section className="relative border-b border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)]/50">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[var(--primary)]/20 blur-[110px]" />
        <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-[var(--secondary)]/10 blur-[90px]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_360px] lg:items-center lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--secondary)]/30 bg-[var(--secondary)]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--secondary)]">
              <Sparkles className="h-4 w-4" /> trilha prática de SQL
            </div>
            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">SQL <span className="text-gradient-orange">Quest</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--on-surface-variant)]">Transforme curiosidade em consultas que funcionam. Avance por desafios curtos, experimente no laboratório e receba feedback na hora.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/sql-quest/learn/${nextLesson.chapter}/${nextLesson.lesson}`} className="inline-flex items-center gap-2 rounded-xl bg-[var(--secondary-container)] px-5 py-3.5 text-sm font-bold text-[var(--on-secondary-container)] shadow-lg shadow-[var(--secondary-container)]/20 transition-[transform,box-shadow] duration-[160ms] ease-out active:scale-[0.98] [@media([@media(hover:hover)_and_(pointer:fine)]:hover:hover)_and_(pointer:fine)]:[@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5">
                {completedCount ? "Continuar jornada" : "Começar jornada"}<ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/sql-quest/learn" className="inline-flex items-center gap-2 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-5 py-3.5 text-sm font-semibold transition [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--primary)]/50 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--surface-container-high)]"><Code2 className="h-4 w-4" /> Ver a trilha</Link>
            </div>
          </div>

          <aside className="relative rounded-3xl border border-[var(--outline-variant)]/40 bg-[var(--surface-container-lowest)]/85 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="mb-5 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">Seu painel</p><p className="mt-1 text-2xl font-bold">{progressPercent}% explorado</p></div><Trophy className="h-6 w-6 text-[var(--secondary)]" /></div>
            <ProgressBar percent={progressPercent} />
            <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[var(--surface-container-high)] p-4"><p className="text-2xl font-bold text-[var(--primary-text)]">{completedCount}<span className="text-sm font-normal text-[var(--on-surface-variant)]">/{totalLessons}</span></p><p className="mt-1 text-xs text-[var(--on-surface-variant)]">lições concluídas</p></div><div className="rounded-2xl bg-[var(--surface-container-high)] p-4"><p className="text-2xl font-bold text-[var(--secondary)]">{totalXP}</p><p className="mt-1 text-xs text-[var(--on-surface-variant)]">XP acumulado</p></div></div>
            <p className="mt-5 flex items-center gap-2 text-xs text-[var(--on-surface-variant)]"><Database className="h-4 w-4 text-[var(--primary-text)]" /> Consultas reais, progresso no seu ritmo.</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary-text)]">Mapa da jornada</p><h2 className="mt-2 font-display text-3xl font-bold">Do primeiro SELECT ao domínio</h2></div><span className="text-sm text-[var(--on-surface-variant)]">{chapters.length} capítulos · {totalLessons} lições</span></div>
        <div className="grid gap-5 lg:grid-cols-3">
          {chapters.map((chapter, idx) => {
            const chapterLessons = lessonsByChapter.get(chapter.number) ?? [];
            const completed = chapterLessons.filter((l) => isCompleted(l.chapter, l.lesson)).length;
            const percent = chapterLessons.length ? Math.round((completed / chapterLessons.length) * 100) : 0;
            const locked = idx > 0 && !isCompleted(chapters[idx - 1].number, (lessonsByChapter.get(chapters[idx - 1].number) ?? []).slice(-1)[0]?.lesson ?? 0);
            return <article key={chapter.number} className={`relative rounded-3xl border p-6 transition-[transform,border-color,box-shadow] duration-[180ms] ease-out [@media([@media(hover:hover)_and_(pointer:fine)]:hover:hover)_and_(pointer:fine)]:[@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 ${locked ? "border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)]/40 opacity-70" : "border-[var(--outline-variant)]/40 bg-[var(--surface-container-lowest)] [@media([@media(hover:hover)_and_(pointer:fine)]:hover:hover)_and_(pointer:fine)]:[@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--primary)]/50"}`}>
              <div className="mb-7 flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-10)] font-display text-xl font-bold text-[var(--primary-text)]">0{chapter.number}</span>{locked ? <Lock className="h-5 w-5 text-[var(--outline)]" /> : completed === chapterLessons.length ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <span className="rounded-full bg-[var(--secondary)]/10 px-2.5 py-1 text-xs font-bold text-[var(--secondary)]">{percent}%</span>}</div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Capítulo {chapter.number}</p><h3 className="mt-2 text-xl font-bold">{chapter.title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-[var(--on-surface-variant)]">{chapter.description}</p>
              <div className="mt-6"><div className="mb-2 flex justify-between text-xs text-[var(--on-surface-variant)]"><span>{completed} de {chapterLessons.length} lições</span><span>{percent}%</span></div><ProgressBar percent={percent} /></div>
              <Link href={locked ? "#" : `/sql-quest/learn/${chapter.number}`} aria-disabled={locked} onClick={(event) => locked && event.preventDefault()} className={`mt-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${locked ? "cursor-not-allowed bg-[var(--surface-container-high)] text-[var(--outline)]" : "text-[var(--primary-text)] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--primary-10)]"}`}>{locked ? "Complete o anterior" : "Explorar capítulo"}{!locked && <ArrowRight className="h-4 w-4" />}</Link>
            </article>;
          })}
        </div>
      </section>
    </div>
  );
}
