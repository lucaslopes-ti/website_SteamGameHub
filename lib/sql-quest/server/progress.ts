/**
 * Persistência de progresso da SQL Quest (camada server).
 *
 * Lê e atualiza o documento `sql_quest_progress/{uid}` via Firebase Admin.
 * A atualização de conclusão roda em transação e, além da progressão linear
 * validada, atualiza streak (America/Sao_Paulo) e conquistas — tudo derivado
 * no servidor, nunca confiado no cliente.
 */
import type { DocumentReference, Transaction } from "firebase-admin/firestore";
import { getLessonById, lessons } from "../catalog";
import { computeTotalXp, validateCompletions } from "../progress";
import { computeStreak, dateKeyInSaoPaulo } from "../domain/streak";
import { evaluateAchievements, newlyEarned } from "../domain/achievements";

export const PROGRESS_COLLECTION = "sql_quest_progress";

/** Ordem oficial da trilha (ids na ordem de conclusão). */
const officialOrder = lessons.map((l) => l.id);

export interface ProgressDoc {
  uid: string;
  completedLessonIds: string[];
  totalXp: number;
  updatedAt: string;
  streak: number;
  lastActivityDate: string | null;
  achievements: string[];
  classId: string | null;
  rankingOptIn: boolean;
  displayName: string | null;
}

/** Estado padrão de um aluno sem documento de progresso. */
export function emptyProgressDoc(uid: string): ProgressDoc {
  return {
    uid,
    completedLessonIds: [],
    totalXp: 0,
    updatedAt: "",
    streak: 0,
    lastActivityDate: null,
    achievements: [],
    classId: null,
    rankingOptIn: false,
    displayName: null,
  };
}

/** Normaliza um valor bruto do Firestore em um ProgressDoc seguro. */
export function parseProgressDoc(uid: string, data: Record<string, unknown>): ProgressDoc {
  const base = emptyProgressDoc(uid);
  const completedLessonIds = sanitizeLessonIds(data.completedLessonIds);
  return {
    ...base,
    completedLessonIds,
    totalXp:
      typeof data.totalXp === "number" && Number.isFinite(data.totalXp)
        ? data.totalXp
        : computeTotalXp(completedLessonIds),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
    streak: typeof data.streak === "number" && data.streak >= 0 ? data.streak : 0,
    lastActivityDate:
      typeof data.lastActivityDate === "string" ? data.lastActivityDate : null,
    achievements: Array.isArray(data.achievements)
      ? data.achievements.filter((a): a is string => typeof a === "string")
      : [],
    classId: typeof data.classId === "string" ? data.classId : null,
    rankingOptIn: data.rankingOptIn === true,
    displayName: typeof data.displayName === "string" ? data.displayName : null,
  };
}

/** Mantém apenas ids de lições conhecidas no catálogo, na ordem oficial. */
export function sanitizeLessonIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const known = new Set<string>();
  for (const item of value) {
    if (typeof item === "string" && getLessonById(item)) known.add(item);
  }
  return officialOrder.filter((id) => known.has(id));
}

/** Erro de validação de progresso que aborta a transação com 400. */
export class ProgressValidationError extends Error {}

/**
 * Valida a atualização como progressão linear estrita:
 * - preserva conclusões existentes (proíbe remoção);
 * - o conjunto final precisa ser um prefixo contíguo da trilha (proíbe saltos);
 * - permite no máximo UMA nova lição por requisição — a próxima na ordem do
 *   catálogo (o cliente envia a lista completa; o servidor decide o delta).
 */
export function validateProgressUpdate(
  previous: string[],
  incoming: string[]
): { ok: true; final: string[] } | { ok: false; error: string } {
  const base = validateCompletions(previous, incoming);
  if (!base.ok) return base;

  const newIds = base.final.filter((id) => !previous.includes(id));
  if (newIds.length > 1) {
    return {
      ok: false,
      error:
        "Conclua uma lição por vez: envie apenas a próxima lição da trilha nesta requisição.",
    };
  }

  return base;
}

export interface CompletionResult {
  completedLessonIds: string[];
  totalXp: number;
  updatedAt: string;
  streak: number;
  lastActivityDate: string;
  achievements: string[];
  newAchievements: string[];
  isNewCompletion: boolean;
  xpEarned: number;
}

/**
 * Aplica uma conclusão dentro de uma transação Firestore:
 * valida a progressão, deriva XP, atualiza streak e conquistas e grava o
 * documento. Idempotente: repetir a mesma lição não acumula XP nem streak.
 */
export async function applyCompletion(
  tx: Transaction,
  ref: DocumentReference,
  incomingIds: string[],
  now: Date,
  displayName: string | null
): Promise<CompletionResult> {
  const snap = await tx.get(ref);
  const existing = snap.exists ? (snap.data() ?? {}) : {};
  const previous = sanitizeLessonIds(existing.completedLessonIds);

  const validated = validateProgressUpdate(previous, incomingIds);
  if (!validated.ok) {
    throw new ProgressValidationError(validated.error);
  }

  const merged = validated.final;
  const isNewCompletion = merged.length > previous.length;
  const xpEarned = merged
    .slice(previous.length)
    .reduce((acc, id) => acc + (getLessonById(id)?.xpReward ?? 0), 0);
  const totalXp = computeTotalXp(merged);
  const updatedAt = now.toISOString();

  const today = dateKeyInSaoPaulo(now);
  const streakState = computeStreak(
    {
      streak: typeof existing.streak === "number" ? existing.streak : 0,
      lastActivityDate:
        typeof existing.lastActivityDate === "string"
          ? existing.lastActivityDate
          : null,
    },
    today
  );

  const achievements = evaluateAchievements({
    completedLessonIds: merged,
    totalXp,
    streak: streakState.streak,
  });
  const newAchievements = newlyEarned(
    Array.isArray(existing.achievements)
      ? existing.achievements.filter((a): a is string => typeof a === "string")
      : [],
    achievements
  );

  tx.set(
    ref,
    {
      uid: ref.id,
      completedLessonIds: merged,
      totalXp,
      updatedAt,
      streak: streakState.streak,
      lastActivityDate: streakState.lastActivityDate,
      achievements,
      displayName:
        displayName ?? (typeof existing.displayName === "string" ? existing.displayName : null),
    },
    { merge: true }
  );

  return {
    completedLessonIds: merged,
    totalXp,
    updatedAt,
    streak: streakState.streak,
    lastActivityDate: streakState.lastActivityDate ?? today,
    achievements,
    newAchievements,
    isNewCompletion,
    xpEarned,
  };
}