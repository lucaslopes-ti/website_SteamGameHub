import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { getDbOrUnavailable } from "@/lib/sql-quest/server/firebase";
import { PROGRESS_COLLECTION } from "@/lib/sql-quest/server/progress";
import { findClassByCode } from "@/lib/sql-quest/server/classes";
import { isValidClassCode, normalizeClassCode } from "@/lib/sql-quest/domain/classes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Entrada em turma da SQL Quest.
 *
 * POST { code }: adiciona o usuário autenticado como membro da turma com o
 * código informado e vincula `classId` ao documento de progresso do aluno.
 * Idempotente: entrar de novo na mesma turma não duplica o membro.
 */
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const record = (body ?? {}) as Record<string, unknown>;
  const code = typeof record.code === "string" ? record.code : "";
  if (!isValidClassCode(code)) {
    return NextResponse.json(
      { error: "Código de turma inválido." },
      { status: 400 }
    );
  }

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const classDoc = await findClassByCode(db!, normalizeClassCode(code));
    if (!classDoc) {
      return NextResponse.json(
        { error: "Turma não encontrada para este código." },
        { status: 404 }
      );
    }

    const updatedAt = new Date().toISOString();

    await db!.runTransaction(async (tx) => {
      const classRef = db!.collection("sql_quest_classes").doc(classDoc.id);
      const classSnap = await tx.get(classRef);
      const current = classSnap.exists ? (classSnap.data() ?? {}) : {};
      const memberUids = Array.isArray(current.memberUids)
        ? current.memberUids.filter((u): u is string => typeof u === "string")
        : [];

      // Idempotente: se já é membro, não duplica.
      if (!memberUids.includes(user!.uid)) {
        memberUids.push(user!.uid);
        tx.set(
          classRef,
          { memberUids, updatedAt },
          { merge: true }
        );
      }

      // Vincula o aluno à turma no documento de progresso (sem tocar no opt-in).
      tx.set(
        db!.collection(PROGRESS_COLLECTION).doc(user!.uid),
        {
          uid: user!.uid,
          classId: classDoc.id,
          displayName: user!.name,
          updatedAt,
        },
        { merge: true }
      );
    });

    return NextResponse.json(
      {
        id: classDoc.id,
        name: classDoc.name,
        code: classDoc.code,
        memberCount: classDoc.memberUids.length + 1,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[sql-quest] Erro ao entrar na turma:", error);
    return NextResponse.json({ error: "Erro ao entrar na turma." }, { status: 500 });
  }
}