"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { authedFetch } from "@/lib/client-auth";
import { lessons } from "@/lib/sql-quest/catalog";

/**
 * Chave base para o localStorage. O progresso é separado POR CONTA:
 * - visitante anônimo → chave fixa `sql-quest-progress-v1`;
 * - usuário autenticado → chave `sql-quest-progress-v1:<uid>`.
 *
 * Isso evita contaminação entre contas e garante que o progresso anônimo NÃO
 * seja migrado automaticamente para uma conta ao fazer login.
 */
const ANON_STORAGE_KEY = "sql-quest-progress-v1";

function storageKeyFor(uid: string | null): string {
  return uid ? `${ANON_STORAGE_KEY}:${uid}` : ANON_STORAGE_KEY;
}

/** Mapa oficial de XP por lição (fonte única de verdade). */
const XP_BY_LESSON: Record<string, number> = Object.fromEntries(
  lessons.map((l) => [l.id, l.xpReward])
);

/**
 * Deriva o total de XP EXCLUSIVAMENTE dos ids de lição do catálogo.
 * Nunca confia em um valor de XP armazenado ou enviado pelo cliente.
 */
export function computeTotalXp(lessonIds: string[]): number {
  let total = 0;
  for (const id of lessonIds) {
    total += XP_BY_LESSON[id] ?? 0;
  }
  return total;
}

interface ProgressState {
  /** Ids de lição concluídos (formato oficial da API: "chapter-lesson"). */
  completedLessonIds: string[];
  /** XP total derivado do catálogo (mantido como `totalXP` para compatibilidade local). */
  totalXP: number;
}

function lessonId(chapter: number, lesson: number) {
  return `${chapter}-${lesson}`;
}

function normalizeLessonIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function loadFromStorage(key: string): ProgressState {
  if (typeof window === "undefined") return { completedLessonIds: [], totalXP: 0 };
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return { completedLessonIds: [], totalXP: 0 };
    const parsed = JSON.parse(raw) as Partial<ProgressState & { completedLessons?: unknown }>;
    // Oficial: `completedLessonIds`. Fallback tolerante a chaves anteriores.
    const ids = normalizeLessonIds(
      Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds
        : parsed.completedLessons
    );
    return {
      completedLessonIds: ids,
      // XP derivado do catálogo (ignora qualquer totalXP salvo).
      totalXP: computeTotalXp(ids),
    };
  } catch {
    return { completedLessonIds: [], totalXP: 0 };
  }
}

function saveToStorage(key: string, state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // localStorage pode estar indisponível em modo privado; ignoramos.
  }
}

interface RemoteProgressResponse {
  completedLessonIds?: unknown;
  completedLessons?: unknown;
  totalXp?: unknown;
  totalXP?: unknown;
}

function resolveLessonIdsFromRemote(remote: RemoteProgressResponse): string[] {
  if (Array.isArray(remote.completedLessonIds)) {
    return normalizeLessonIds(remote.completedLessonIds);
  }
  if (Array.isArray(remote.completedLessons)) {
    return normalizeLessonIds(remote.completedLessons);
  }
  return [];
}

export function useSqlProgress() {
  const { user, isAuthenticated } = useAuth();
  // uid da conta autenticada (ou null para visitante anônimo).
  const uid = isAuthenticated && user ? user.id : null;
  const storageKey = storageKeyFor(uid);

  const [state, setState] = useState<ProgressState>({
    completedLessonIds: [],
    totalXP: 0,
  });
  const [loaded, setLoaded] = useState(false);

  // Mantém o estado mais recente disponível para callbacks assíncronos.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Carrega o progresso local da conta correspondente (UID ou anônimo).
  useEffect(() => {
    setLoaded(false);
    const local = loadFromStorage(storageKey);
    setState(local);
    setLoaded(true);
  }, [storageKey]);

  // Sincronização opcional quando autenticado: mescla o local (da conta) com o
  // remoto, derivando XP do catálogo. O progresso anônimo NUNCA entra aqui.
  useEffect(() => {
    if (!uid) return;
    authedFetch("/api/sql-quest/progress")
      .then(async (res) => {
        if (!res.ok) return;
        const remote = (await res.json()) as RemoteProgressResponse;
        const remoteIds = resolveLessonIdsFromRemote(remote);
        setState((prev) => {
          const mergedIds = Array.from(new Set([...prev.completedLessonIds, ...remoteIds]));
          const next = { completedLessonIds: mergedIds, totalXP: computeTotalXp(mergedIds) };
          saveToStorage(storageKey, next);
          return next;
        });
      })
      .catch(() => {
        // Falha silenciosa: o localStorage mantém a experiência funcionando.
      });
  }, [uid, storageKey]);

  const isCompleted = useCallback(
    (chapter: number, lesson: number) =>
      state.completedLessonIds.includes(lessonId(chapter, lesson)),
    [state.completedLessonIds]
  );

  const isUnlocked = useCallback(
    (chapter: number, lesson: number) => {
      const flatIndex = lessons.findIndex(
        (l) => l.chapter === chapter && l.lesson === lesson
      );
      if (flatIndex <= 0) return true;
      const previous = lessons[flatIndex - 1];
      return isCompleted(previous.chapter, previous.lesson);
    },
    [isCompleted]
  );

  const completedCount = state.completedLessonIds.length;
  const totalLessons = lessons.length;
  const progressPercent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const complete = useCallback(
    async (chapter: number, lesson: number) => {
      const id = lessonId(chapter, lesson);

      // Atualização local otimista (funciona sem login e offline).
      setState((prev) => {
        if (prev.completedLessonIds.includes(id)) return prev;
        const nextIds = [...prev.completedLessonIds, id];
        const next = { completedLessonIds: nextIds, totalXP: computeTotalXp(nextIds) };
        saveToStorage(storageKey, next);
        return next;
      });

      // Visitante anônimo: apenas local (sem sincronização).
      if (!uid) return;

      try {
        const latest = stateRef.current;
        const nextIds = latest.completedLessonIds.includes(id)
          ? latest.completedLessonIds
          : [...latest.completedLessonIds, id];

        const res = await authedFetch("/api/sql-quest/progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completedLessonIds: nextIds }),
        });

        // Aplica a resposta AUTORITATIVA do servidor ao estado e ao
        // localStorage (o servidor valida a progressão e o XP).
        if (res.ok) {
          const authoritative = (await res.json()) as RemoteProgressResponse;
          const authoritativeIds = resolveLessonIdsFromRemote(authoritative);
          const ids = authoritativeIds.length ? authoritativeIds : nextIds;
          const next = { completedLessonIds: ids, totalXP: computeTotalXp(ids) };
          setState(next);
          saveToStorage(storageKey, next);
        }
      } catch {
        // Falha silenciosa; a próxima navegação/sincronização tenta de novo.
      }
    },
    [uid, storageKey]
  );

  return {
    ...state,
    loaded,
    isCompleted,
    isUnlocked,
    complete,
    completedCount,
    totalLessons,
    progressPercent,
  };
}
