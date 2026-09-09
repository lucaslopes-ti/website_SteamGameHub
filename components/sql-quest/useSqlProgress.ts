"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { authedFetch } from "@/lib/client-auth";
import { lessons } from "@/lib/sql-quest/catalog";
import { resolveLessonId, resolveLessonIds } from "@/lib/sql-quest/content/migrate";

/**
 * Progresso da SQL Quest — persistência 100% server-side.
 *
 * - O progresso NÃO depende de localStorage (nem anônimo, nem por conta).
 * - A única fonte de verdade é a API `/api/sql-quest/progress`, que persiste
 *   um documento por UID autenticado via Firebase Admin (Firestore).
 * - Sem UID autenticado o hook devolve estado vazio e `complete()` é um no-op:
 *   o guard do módulo (`SqlQuestGuard`) bloqueia o acesso às missões.
 *
 * IDs: o hook opera INTERNAMENTE com ids SEMÂNTICOS do catálogo (ex.:
 * "select-01"). A API responde ids semânticos; respostas legadas/posicionais
 * ("1-1") são aceitas e migradas para o formato canônico na leitura. A
 * interface pública (`isCompleted`/`isUnlocked`/`complete` por capítulo+lição)
 * é preservada para os consumidores existentes.
 */

/** Mapa oficial de XP por lição (fonte única de verdade). */
const XP_BY_LESSON: Record<string, number> = Object.fromEntries(
  lessons.map((l) => [l.id, l.xpReward])
);

/**
 * Deriva o total de XP EXCLUSIVAMENTE dos ids de lição do catálogo.
 * Aceita ids semânticos, legados e posicionais (resolve antes de somar).
 * Nunca confia em um valor de XP armazenado ou enviado pelo cliente.
 */
export function computeTotalXp(lessonIds: string[]): number {
  let total = 0;
  for (const id of lessonIds) {
    const resolved = resolveLessonId(id, lessons);
    total += resolved ? (XP_BY_LESSON[resolved] ?? 0) : 0;
  }
  return total;
}

interface ProgressState {
  /** Ids de lição concluídos (ids SEMÂNTICOS do catálogo, ex.: "select-01"). */
  completedLessonIds: string[];
  /** XP total derivado do catálogo (mantido como `totalXP` para compatibilidade local). */
  totalXP: number;
}

/** Resolve capítulo+lição para o id semântico canônico do catálogo. */
function lessonId(chapter: number, lesson: number): string | null {
  const found = lessons.find(
    (l) => l.chapter === chapter && l.lesson === lesson
  );
  return found ? found.id : null;
}

function normalizeLessonIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

interface RemoteProgressResponse {
  uid?: unknown;
  completedLessonIds?: unknown;
  completedLessons?: unknown;
}

/**
 * Extrai os ids da resposta da API e resolve para ids semânticos canônicos
 * (aceita respostas legadas/posicionais por compatibilidade).
 */
function resolveLessonIdsFromRemote(remote: RemoteProgressResponse): string[] {
  const raw = Array.isArray(remote.completedLessonIds)
    ? normalizeLessonIds(remote.completedLessonIds)
    : Array.isArray(remote.completedLessons)
    ? normalizeLessonIds(remote.completedLessons)
    : [];
  return resolveLessonIds(raw, lessons);
}

const EMPTY_STATE: ProgressState = { completedLessonIds: [], totalXP: 0 };

export function useSqlProgress() {
  const { user, isAuthenticated } = useAuth();
  // uid da conta autenticada (ou null para visitante anônimo).
  const uid = isAuthenticated && user ? user.id : null;

  const [state, setState] = useState<ProgressState>(EMPTY_STATE);
  const [loaded, setLoaded] = useState(false);

  // Mantém o estado mais recente disponível de forma síncrona para callbacks
  // assíncronos (evita leituras obsoletas em `complete`).
  const stateRef = useRef(state);
  const applyState = useCallback((next: ProgressState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  // Carrega o progresso do servidor (única fonte de verdade) para o UID
  // autenticado. Visitante anônimo: estado vazio, sem qualquer persistência.
  useEffect(() => {
    if (!uid) {
      applyState(EMPTY_STATE);
      setLoaded(true);
      return;
    }

    let cancelled = false;
    setLoaded(false);
    authedFetch("/api/sql-quest/progress")
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          applyState(EMPTY_STATE);
          setLoaded(true);
          return;
        }
        const remote = (await res.json()) as RemoteProgressResponse;
        // Defesa: ignora resposta que não pertença ao UID atual (evita
        // contaminação entre contas mesmo em caso de bug no servidor).
        if (remote.uid && remote.uid !== uid) {
          applyState(EMPTY_STATE);
          setLoaded(true);
          return;
        }
        const ids = resolveLessonIdsFromRemote(remote);
        applyState({ completedLessonIds: ids, totalXP: computeTotalXp(ids) });
        setLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        applyState(EMPTY_STATE);
        setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [uid, applyState]);

  const isCompleted = useCallback(
    (chapter: number, lesson: number) => {
      const id = lessonId(chapter, lesson);
      return id !== null && state.completedLessonIds.includes(id);
    },
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
  const progressPercent = totalLessons
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;

  const complete = useCallback(
    async (chapter: number, lesson: number) => {
      const id = lessonId(chapter, lesson);

      // Sem UID autenticado não há persistência. O guard do módulo bloqueia o
      // acesso às missões, então este caminho não ocorre em uso normal.
      if (!uid || id === null) return;

      const latest = stateRef.current;
      const nextIds = latest.completedLessonIds.includes(id)
        ? latest.completedLessonIds
        : [...latest.completedLessonIds, id];

      try {
        const res = await authedFetch("/api/sql-quest/progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completedLessonIds: nextIds }),
        });

        // Aplica a resposta AUTORITATIVA do servidor (que valida a progressão
        // linear e deriva o XP do catálogo).
        if (res.ok) {
          const authoritative = (await res.json()) as RemoteProgressResponse;
          if (authoritative.uid && authoritative.uid !== uid) return;
          const authoritativeIds = resolveLessonIdsFromRemote(authoritative);
          const ids = authoritativeIds.length ? authoritativeIds : nextIds;
          applyState({ completedLessonIds: ids, totalXP: computeTotalXp(ids) });
        }
      } catch {
        // Falha silenciosa; a próxima navegação/sincronização tenta de novo.
      }
    },
    [uid, applyState]
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