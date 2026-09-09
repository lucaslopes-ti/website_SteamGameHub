/**
 * Persistência de turmas da SQL Quest (camada server).
 *
 * Documento `sql_quest_classes/{id}`:
 *   { name, code, instructorUids: string[], memberUids: string[],
 *     createdAt, updatedAt }
 *
 * A autorização (instrutor/membro) usa as funções puras de
 * `lib/sql-quest/domain/classes`.
 */
import type { Firestore } from "firebase-admin/firestore";
import { generateClassCode, normalizeClassCode } from "../domain/classes";

export const CLASSES_COLLECTION = "sql_quest_classes";

export interface ClassDoc {
  id: string;
  name: string;
  code: string;
  instructorUids: string[];
  memberUids: string[];
  createdAt: string;
  updatedAt: string;
}

export function parseClassDoc(
  id: string,
  data: Record<string, unknown>
): ClassDoc {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    code: typeof data.code === "string" ? data.code : "",
    instructorUids: Array.isArray(data.instructorUids)
      ? data.instructorUids.filter((u): u is string => typeof u === "string")
      : [],
    memberUids: Array.isArray(data.memberUids)
      ? data.memberUids.filter((u): u is string => typeof u === "string")
      : [],
    createdAt: typeof data.createdAt === "string" ? data.createdAt : "",
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
  };
}

export async function getClassById(
  db: Firestore,
  id: string
): Promise<ClassDoc | null> {
  const snap = await db.collection(CLASSES_COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  return parseClassDoc(snap.id, snap.data() ?? {});
}

export async function findClassByCode(
  db: Firestore,
  code: string
): Promise<ClassDoc | null> {
  const normalized = normalizeClassCode(code);
  const snap = await db
    .collection(CLASSES_COLLECTION)
    .where("code", "==", normalized)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return parseClassDoc(doc.id, doc.data());
}

export interface CreateClassInput {
  name: string;
  instructorUid: string;
  now: Date;
}

/**
 * Cria uma turma com código único (tenta até 5 códigos antes de falhar).
 * O instrutor é SEMPRE derivado do token autenticado.
 */
export async function createClass(
  db: Firestore,
  input: CreateClassInput
): Promise<ClassDoc> {
  const name = input.name.trim();
  const createdAt = input.now.toISOString();

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateClassCode();
    const existing = await findClassByCode(db, code);
    if (existing) continue;

    const ref = db.collection(CLASSES_COLLECTION).doc();
    const doc = {
      name,
      code,
      instructorUids: [input.instructorUid],
      memberUids: [] as string[],
      createdAt,
      updatedAt: createdAt,
    };
    await ref.set(doc);
    return { id: ref.id, ...doc };
  }

  throw new Error("Não foi possível gerar um código único de turma.");
}