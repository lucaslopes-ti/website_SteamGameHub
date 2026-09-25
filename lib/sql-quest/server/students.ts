import type { Firestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";
import { levelFromXp } from "../domain/levels";
import { parseProgressDoc, PROGRESS_COLLECTION } from "./progress";

export interface InstructorStudent {
  uid: string;
  displayName: string | null;
  xp: number;
  level: number;
  lessonCount: number;
  lastSignInAt: string | null;
}

export async function listInstructorStudents(
  db: Firestore,
  auth: Pick<Auth, "getUsers">
): Promise<InstructorStudent[]> {
  const snapshot = await db.collection(PROGRESS_COLLECTION).get();
  const progress = snapshot.docs
    .map((doc) => parseProgressDoc(doc.id, doc.data() ?? {}))
    .filter((doc) => doc.completedLessonIds.length > 0);
  const users = new Map<string, string | null>();

  for (let offset = 0; offset < progress.length; offset += 1000) {
    const batch = progress.slice(offset, offset + 1000);
    const result = await auth.getUsers(batch.map(({ uid }) => ({ uid })));
    for (const user of result.users) {
      users.set(user.uid, user.metadata.lastSignInTime || null);
    }
  }

  return progress
    .map((doc) => ({
      uid: doc.uid,
      displayName: doc.displayName,
      xp: doc.totalXp,
      level: levelFromXp(doc.totalXp),
      lessonCount: doc.completedLessonIds.length,
      lastSignInAt: users.get(doc.uid) ?? null,
    }))
    .sort((a, b) => b.xp - a.xp || a.uid.localeCompare(b.uid));
}
