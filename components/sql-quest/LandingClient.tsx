"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Code2, Database, Lock, RefreshCw, ShoppingBag, Sparkles, Trophy, Users, Zap } from "lucide-react";
import { authedFetch } from "@/lib/client-auth";
import { chapters, lessons } from "@/lib/sql-quest/catalog";
import { useSqlProgress } from "./useSqlProgress";

type RankingProfile = { classId: string | null; className: string | null; rankingOptIn: boolean; rank: number | null };
type RankingEntry = { uid: string; displayName: string | null; xp: number; rank: number };

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-container-high)]" role="progressbar" aria-label="Progresso da jornada" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] transition-[width] duration-700 ease-linear motion-reduce:transition-none" style={{ width: `${percent}%` }} />
    </div>
  );
}

function RankingPanel() {
  const [profile, setProfile] = useState<RankingProfile | null>(null);
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadRanking = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const profileResponse = await authedFetch("/api/sql-quest/profile");
      const profileBody = await profileResponse.json();
      if (!profileResponse.ok) throw new Error(profileBody.error || "Não foi possível carregar seu ranking.");
      const nextProfile = profileBody as RankingProfile;
      setProfile(nextProfile);

      if (!nextProfile.classId) {
        setEntries([]);
        return;
      }

      const boardResponse = await authedFetch(`/api/sql-quest/leaderboard?classId=${encodeURIComponent(nextProfile.classId)}`);
      const boardBody = await boardResponse.json();
      if (!boardResponse.ok) throw new Error(boardBody.error || "Não foi possível carregar o ranking da turma.");
      setEntries(Array.isArray(boardBody.entries) ? boardBody.entries : []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível carregar o ranking.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void loadRanking(); }, [loadRanking]);

  const enableRanking = async () => {
    setSaving(true);
    setMessage("");
    try {
      const response = await authedFetch("/api/sql-quest/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rankingOptIn: true }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Não foi possível atualizar sua participação.");
      setMessage("Sua participação foi ativada.");
      await loadRanking(true);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Não foi possível atualizar sua participação.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-labelledby="ranking-title" className="relative overflow-hidden rounded-3xl border border-[var(--outline-variant)]/35 bg-[var(--surface-container-lowest)] p-6 shadow-2xl shadow-black/15 sm:p-8">
      <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[var(--secondary)]/10 blur-[70px]" />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary-text)]"><Trophy className="h-4 w-4" /> Competição saudável</p>
          <h2 id="ranking-title" className="mt-2 font-display text-3xl font-bold">Ranking da turma</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--on-surface-variant)]">Veja quem está avançando com você. Só aparecem estudantes que escolheram participar.</p>
        </div>
        <button type="button" onClick={() => void loadRanking(true)} disabled={loading || refreshing} aria-label="Atualizar ranking" className="rounded-xl border border-[var(--outline-variant)]/50 p-2.5 text-[var(--on-surface-variant)] transition [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--primary)]/50 [@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--primary-text)] disabled:cursor-not-allowed disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin motion-reduce:animate-none" : ""}`} />
        </button>
      </div>

      <div className="relative mt-7">
        {loading ? <div className="rounded-2xl bg-[var(--surface-container-high)]/55 px-5 py-8 text-center" role="status" aria-live="polite"><div className="mx-auto h-6 w-6 animate-spin motion-reduce:animate-none rounded-full border-2 border-[var(--primary)] border-t-transparent" /><p className="mt-3 text-sm text-[var(--on-surface-variant)]">Carregando o ranking...</p></div> : error ? <div className="rounded-2xl border border-red-400/30 bg-red-500/5 p-6 text-center" role="alert"><p className="text-sm font-semibold text-red-300">{error}</p><button type="button" onClick={() => void loadRanking(true)} className="mt-4 rounded-lg border border-[var(--outline-variant)] px-4 py-2 text-sm font-semibold [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--surface-container-high)]">Tentar novamente</button></div> : !profile?.classId ? <div className="rounded-2xl border border-dashed border-[var(--outline-variant)]/40 p-7 text-center"><Users className="mx-auto h-8 w-8 text-[var(--outline)]" /><h3 className="mt-4 font-bold">Você ainda não está em uma turma</h3><p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">Entre em uma turma para acompanhar o ranking com seus colegas.</p><Link href="/sql-quest/classes" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--secondary-container)] px-4 py-2.5 text-sm font-bold text-[var(--on-secondary-container)]">Encontrar uma turma <ArrowRight className="h-4 w-4" /></Link></div> : <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--primary-10)]/45 px-5 py-4"><div><p className="text-xs uppercase tracking-[0.13em] text-[var(--on-surface-variant)]">Sua turma</p><p className="mt-1 font-bold">{profile.className || "Turma SQL Quest"}</p></div>{profile.rankingOptIn && <p className="flex items-center gap-2 text-sm font-bold text-[var(--secondary)]"><Zap className="h-4 w-4" /> {profile.rank ? `${profile.rank}º lugar` : "Participando"}</p>}</div>
          {!profile.rankingOptIn ? <div className="mt-4 rounded-2xl border border-[var(--secondary)]/30 bg-[var(--secondary)]/5 p-5"><h3 className="font-bold">Entre no ranking</h3><p className="mt-1 text-sm leading-6 text-[var(--on-surface-variant)]">Ative sua participação para aparecer com seu nome e XP para a turma. Você pode mudar essa escolha depois no seu perfil.</p><button type="button" onClick={() => void enableRanking()} disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--secondary-container)] px-4 py-2.5 text-sm font-bold text-[var(--on-secondary-container)] disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Atualizando..." : "Participar do ranking"}<ArrowRight className="h-4 w-4" /></button>{message && <p className="mt-3 text-sm text-[var(--on-surface-variant)]" role="status">{message}</p>}</div> : entries.length === 0 ? <div className="mt-4 rounded-2xl border border-dashed border-[var(--outline-variant)]/40 p-7 text-center"><Trophy className="mx-auto h-8 w-8 text-[var(--outline)]" /><h3 className="mt-4 font-bold">O ranking ainda está vazio</h3><p className="mt-2 text-sm text-[var(--on-surface-variant)]">Você será o primeiro participante visível da turma.</p></div> : <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--outline-variant)]/25"><div className="grid grid-cols-[48px_1fr_auto] gap-3 border-b border-[var(--outline-variant)]/25 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--on-surface-variant)] sm:grid-cols-[56px_1fr_auto]"><span>#</span><span>Estudante</span><span>XP</span></div>{entries.map((entry) => <div key={entry.uid} className={`grid grid-cols-[48px_1fr_auto] items-center gap-3 border-b border-[var(--outline-variant)]/15 px-4 py-3 last:border-0 sm:grid-cols-[56px_1fr_auto] ${entry.rank <= 3 ? "bg-[var(--secondary)]/5" : ""}`}><span className="font-bold text-[var(--on-surface-variant)]">{entry.rank}º</span><span className="min-w-0 truncate font-semibold">{entry.displayName || "Aluno"}</span><strong className="text-[var(--secondary)]">{entry.xp} XP</strong></div>)}</div>}
        </>}
      </div>
    </section>
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
              <Link href={`/sql-quest/learn/${nextLesson.chapter}/${nextLesson.lesson}`} className="inline-flex items-center gap-2 rounded-xl bg-[var(--secondary-container)] px-5 py-3.5 text-sm font-bold text-[var(--on-secondary-container)] shadow-lg shadow-[var(--secondary-container)]/20 transition-[transform,box-shadow] duration-[160ms] ease-out active:scale-[0.98] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5">
                {completedCount ? "Continuar jornada" : "Começar jornada"}<ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/sql-quest/learn" className="inline-flex items-center gap-2 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-5 py-3.5 text-sm font-semibold transition [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--primary)]/50 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--surface-container-high)]"><Code2 className="h-4 w-4" /> Ver a trilha</Link>
            </div>
          </div>

          <aside className="relative rounded-3xl border border-[var(--outline-variant)]/40 bg-[var(--surface-container-lowest)]/85 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="mb-5 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">Seu painel</p><p className="mt-1 text-2xl font-bold">{progressPercent}% explorado</p></div><Trophy className="h-6 w-6 text-[var(--secondary)]" /></div>
            <ProgressBar percent={progressPercent} /><Link href="/sql-quest/loja" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--secondary)]/35 bg-[var(--secondary)]/10 px-4 py-3 text-sm font-bold text-[var(--secondary)]"><ShoppingBag className="h-4 w-4" /> Trocar XP por recompensas <ArrowRight className="h-4 w-4" /></Link>
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
            return <article key={chapter.number} className={`relative rounded-3xl border p-6 transition-[transform,border-color,box-shadow] duration-[180ms] ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 ${locked ? "border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)]/40 opacity-70" : "border-[var(--outline-variant)]/40 bg-[var(--surface-container-lowest)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--primary)]/50"}`}>
              <div className="mb-7 flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-10)] font-display text-xl font-bold text-[var(--primary-text)]">0{chapter.number}</span>{locked ? <Lock className="h-5 w-5 text-[var(--outline)]" /> : completed === chapterLessons.length ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <span className="rounded-full bg-[var(--secondary)]/10 px-2.5 py-1 text-xs font-bold text-[var(--secondary)]">{percent}%</span>}</div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Capítulo {chapter.number}</p><h3 className="mt-2 text-xl font-bold">{chapter.title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-[var(--on-surface-variant)]">{chapter.description}</p>
              <div className="mt-6"><div className="mb-2 flex justify-between text-xs text-[var(--on-surface-variant)]"><span>{completed} de {chapterLessons.length} lições</span><span>{percent}%</span></div><ProgressBar percent={percent} /></div>
              <Link href={locked ? "#" : `/sql-quest/learn/${chapter.number}`} aria-disabled={locked} onClick={(event) => locked && event.preventDefault()} className={`mt-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${locked ? "cursor-not-allowed bg-[var(--surface-container-high)] text-[var(--outline)]" : "text-[var(--primary-text)] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--primary-10)]"}`}>{locked ? "Complete o anterior" : "Explorar capítulo"}{!locked && <ArrowRight className="h-4 w-4" />}</Link>
            </article>;
          })}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8"><RankingPanel /></section>
    </div>
  );
}
