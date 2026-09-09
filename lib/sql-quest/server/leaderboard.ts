/**
 * Leaderboard da SQL Quest (camada server).
 *
 * Privacidade: apenas membros da turma que optaram por ranking
 * (`rankingOptIn === true`) aparecem. A leitura usa `getAll` dos documentos
 * de progresso dos membros (sem índice composto) e ordena por XP, depois por
 * número de lições, com desempate estável por UID.
 */
import type { Firestore } from "firebase-admin/firestore";
import { PROGRESS_COLLECTION } from "./progress";
import { levelFromXp } from "../domain/levels";

export interface LeaderboardEntry {
  uid: string;
  displayName: string | null;
  xp: number;
  level: number;
  lessonCount: number;
  rank: number;
}

/**
 * Computa o ranking da turma a partir dos UIDs dos membros. Apenas membros
 * com `rankingOptIn === true` entram; os demais são omitidos (privacidade).
 */
export async function computeLeaderboard(
  db: Firestore,
  memberUids: string[]
): Promise<LeaderboardEntry[]> {
  if (memberUids.length === 0) return [];

  const refs = memberUids.map((uid) =>
    db.collection(PROGRESS_COLLECTION).doc(uid)
  );
  const snaps = await db.getAll(...refs);

  const entries = snaps
    .filter((snap) => snap.exists)
    .map((snap) => snap.data() ?? {})
    .filter((data) => data.rankingOptIn === true)
    .map((data) => {
      const xp =
        typeof data.totalXp === "number" && Number.isFinite(data.totalXp)
          ? data.totalXp
          : 0;
      const lessonCount = Array.isArray(data.completedLessonIds)
        ? data.completedLessonIds.length
        : 0;
      return {
        uid: typeof data.uid === "string" ? data.uid : "",
        displayName: typeof data.displayName === "string" ? data.displayName : null,
        xp,
        level: levelFromXp(xp),
        lessonCount,
      };
    })
    .filter((entry) => entry.uid !== "")
    .sort(
      (a, b) =>
        b.xp - a.xp ||
        b.lessonCount - a.lessonCount ||
        a.uid.localeCompare(b.uid)
    );

  return entries.map((entry, index) => ({ ...entry, rank: index + 1 }));
}