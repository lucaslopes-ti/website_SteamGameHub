import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth, requireStaff } from "@/lib/server-auth";
import { getDbOrUnavailable } from "@/lib/sql-quest/server/firebase";
import { CLASSES_COLLECTION, createClass, parseClassDoc } from "@/lib/sql-quest/server/classes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Turmas da SQL Quest.
 *
 * - GET: lista as turmas do usuário autenticado (como instrutor ou membro).
 * - POST: cria uma turma — APENAS instrutores/admin (staff). O instrutor é
 *   sempre derivado do token; o código é gerado no servidor.
 */

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const [asInstructor, asMember] = await Promise.all([
      db!.collection(CLASSES_COLLECTION)
        .where("instructorUids", "array-contains", user!.uid)
        .get(),
      db!.collection(CLASSES_COLLECTION)
        .where("memberUids", "array-contains", user!.uid)
        .get(),
    ]);

    const seen = new Set<string>();
    const classes = [];
    for (const snap of [...asInstructor.docs, ...asMember.docs]) {
      if (seen.has(snap.id)) continue;
      seen.add(snap.id);
      const doc = parseClassDoc(snap.id, snap.data());
      classes.push({
        id: doc.id,
        name: doc.name,
        code: doc.code,
        instructorUids: doc.instructorUids,
        memberCount: doc.memberUids.length,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      });
    }

    return NextResponse.json({ classes });
  } catch (error) {
    console.error("[sql-quest] Erro ao listar turmas:", error);
    return NextResponse.json({ error: "Erro ao listar as turmas." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  // Apenas instrutores/admin podem criar turmas.
  const staffError = requireStaff(user);
  if (staffError) return staffError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const record = (body ?? {}) as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  if (!name || name.length < 3) {
    return NextResponse.json(
      { error: "Informe um nome de turma com pelo menos 3 caracteres." },
      { status: 400 }
    );
  }

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const classDoc = await createClass(db!, {
      name,
      instructorUid: user!.uid,
      now: new Date(),
    });
    return NextResponse.json(
      {
        id: classDoc.id,
        name: classDoc.name,
        code: classDoc.code,
        instructorUids: classDoc.instructorUids,
        memberCount: classDoc.memberUids.length,
        createdAt: classDoc.createdAt,
        updatedAt: classDoc.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[sql-quest] Erro ao criar turma:", error);
    return NextResponse.json({ error: "Erro ao criar a turma." }, { status: 500 });
  }
}