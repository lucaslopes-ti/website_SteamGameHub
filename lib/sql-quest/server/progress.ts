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
import { migrateLessonIds } from "../content/migrate";
import { computeStreak, dateKeyInSaoPaulo } from "../domain/streak";
import { evaluateAchievements, newlyEarned } from "../domain/achievements";

export const PROGRESS_COLLECTION = "sql_quest_progress";

/** Ordem oficial da trilha (ids semânticos na ordem de conclusão). */
const officialOrder = lessons.map((l) => l.id);

export interface ProgressDoc {
  uid: string;
  /**
   * Ids de lição concluídas no formato SEMÂNTICO do catálogo (ex.:
   * "select-01"). O armazenamento e a API operam com ids semânticos; ids
   * legados/posicionais ("1-1") são aceitos na entrada e migrados para o
   * formato canônico (ver `sanitizeLessonIds`).
   */
  completedLessonIds: string[];
  totalXp: number;
  /**
   * XP já gasto na loja de recompensas (débito apenas na aprovação de pedidos).
   * Inicializado em 0 para documentos novos e preservado nas atualizações de
   * progresso. Mantém-se separado de `totalXp` (XP/leaderboard não mudam).
   */
  spentXp: number;
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
    spentXp: 0,
    updatedAt: "",
    streak: 0,
    lastActivityDate: null,
    achievements: [],
    classId: null,
    rankingOptIn: false,
    displayName: null,
  };
}

/**
 * Normaliza um valor bruto do Firestore em um ProgressDoc seguro.
 *
 * O armazenamento e o `ProgressDoc` exposto usam ids SEMÂNTICOS canônicos;
 * ids legados/posicionais armazenados são migrados na leitura (nunca zerados).
 */
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
    spentXp:
      typeof data.spentXp === "number" &&
      Number.isFinite(data.spentXp) &&
      data.spentXp >= 0
        ? data.spentXp
        : 0,
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

/**
 * Mantém apenas ids de lições conhecidas no catálogo, na ordem oficial da
 * trilha. Aceita ids semânticos, legados ("1-1") e posicionais; devolve SEMPRE
 * ids semânticos canônicos (formato de armazenamento). Não trunca o conjunto:
 * progresso migrado pode ter lacunas, preenchidas em ordem pela validação
 * baseada em delta.
 */
export function sanitizeLessonIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const ids = value.filter((item): item is string => typeof item === "string");
  return migrateLessonIds(ids, lessons);
}

/** Erro de validação de progresso que aborta a transação com 400. */
export class ProgressValidationError extends Error {}

/**
 * Valida a atualização como progressão linear estrita (baseada em delta):
 * - preserva conclusões existentes (proíbe remoção);
 * - permite no máximo UMA nova lição por requisição — sempre a primeira não
 *   concluída na ordem do catálogo (o cliente envia a lista completa; o
 *   servidor decide o delta e preenche lacunas de progresso migrado em ordem).
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

  // Preserva o XP gasto na loja (ou inicializa 0 em documentos novos).
  const spentXp =
    typeof existing.spentXp === "number" &&
    Number.isFinite(existing.spentXp) &&
    existing.spentXp >= 0
      ? existing.spentXp
      : 0;

  tx.set(
    ref,
    {
      uid: ref.id,
      completedLessonIds: merged,
      totalXp,
      spentXp,
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