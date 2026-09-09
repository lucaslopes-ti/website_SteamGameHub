/**
 * Perfil da SQL Quest (camada server).
 *
 * Monta o perfil público do aluno autenticado a partir do documento de
 * progresso, da turma (se houver) e do ranking (apenas se optou por ranking).
 * O UID é sempre derivado do token — nunca do corpo da requisição.
 */
import type { Firestore } from "firebase-admin/firestore";
import type { AuthUser } from "@/lib/server-auth";
import { PROGRESS_COLLECTION, parseProgressDoc, type ProgressDoc } from "./progress";
import { getClassById } from "./classes";
import { computeLeaderboard } from "./leaderboard";
import { levelInfo } from "../domain/levels";
import { lessons } from "../catalog";

export interface SqlQuestProfile {
  uid: string;
  displayName: string | null;
  xp: number;
  level: number;
  levelInfo: { level: number; currentXp: number; xpForNext: number; progress: number };
  streak: number;
  lastActivityDate: string | null;
  achievements: string[];
  lessonCount: number;
  totalLessons: number;
  classId: string | null;
  className: string | null;
  rankingOptIn: boolean;
  rank: number | null;
  updatedAt: string;
}

/** Lê o documento de progresso do usuário (ou o estado vazio padrão). */
export async function readProgressDoc(
  db: Firestore,
  uid: string
): Promise<ProgressDoc> {
  const snap = await db.collection(PROGRESS_COLLECTION).doc(uid).get();
  return parseProgressDoc(uid, snap.exists ? (snap.data() ?? {}) : {});
}

/**
 * Monta o perfil completo. `totalLessons` vem do catálogo (importado aqui
 * apenas para o shape do perfil).
 */
export async function loadProfile(
  db: Firestore,
  user: AuthUser
): Promise<SqlQuestProfile> {
  const progress = await readProgressDoc(db, user.uid);

  let className: string | null = null;
  let rank: number | null = null;

  if (progress.classId) {
    const classDoc = await getClassById(db, progress.classId);
    className = classDoc?.name ?? null;
    if (progress.rankingOptIn && classDoc) {
      const board = await computeLeaderboard(db, classDoc.memberUids);
      rank = board.find((entry) => entry.uid === user.uid)?.rank ?? null;
    }
  }

  const info = levelInfo(progress.totalXp);
  return {
    uid: user.uid,
    displayName: progress.displayName ?? user.name,
    xp: progress.totalXp,
    level: info.level,
    levelInfo: info,
    streak: progress.streak,
    lastActivityDate: progress.lastActivityDate,
    achievements: progress.achievements,
    lessonCount: progress.completedLessonIds.length,
    totalLessons: lessons.length,
    classId: progress.classId,
    className,
    rankingOptIn: progress.rankingOptIn,
    rank,
    updatedAt: progress.updatedAt,
  };
}