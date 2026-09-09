import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { getDbOrUnavailable } from "@/lib/sql-quest/server/firebase";
import {
  CLASSES_COLLECTION,
  findClassByCode,
  getClassById,
} from "@/lib/sql-quest/server/classes";
import { computeLeaderboard } from "@/lib/sql-quest/server/leaderboard";
import {
  canViewClass,
  isInstructorOfClass,
} from "@/lib/sql-quest/domain/classes";
import { generateClassCode } from "@/lib/sql-quest/domain/classes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Detalhe de uma turma da SQL Quest.
 *
 * - GET: visível apenas para instrutores/membros. Instrutores recebem a lista
 *   de membros (com XP/nível); alunos recebem apenas contagem (privacidade).
 * - PATCH: apenas o instrutor da turma (ou staff) pode atualizar nome e/ou
 *   regenerar o código de acesso.
 */

interface RouteContext {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const classDoc = await getClassById(db!, params.id);
    if (!classDoc) {
      return NextResponse.json({ error: "Turma não encontrada." }, { status: 404 });
    }

    if (!canViewClass(user!, classDoc)) {
      return NextResponse.json(
        { error: "Você não faz parte desta turma." },
        { status: 403 }
      );
    }

    const base = {
      id: classDoc.id,
      name: classDoc.name,
      code: classDoc.code,
      memberCount: classDoc.memberUids.length,
      createdAt: classDoc.createdAt,
      updatedAt: classDoc.updatedAt,
    };

    if (!isInstructorOfClass(user!, classDoc)) {
      // Aluno: apenas dados básicos (sem lista de membros — privacidade).
      return NextResponse.json(base);
    }

    const entries = await computeLeaderboard(db!, classDoc.memberUids);
    return NextResponse.json({
      ...base,
      instructorUids: classDoc.instructorUids,
      members: entries,
    });
  } catch (error) {
    console.error("[sql-quest] Erro ao ler turma:", error);
    return NextResponse.json({ error: "Erro ao ler a turma." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
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
  const name = typeof record.name === "string" ? record.name.trim() : undefined;
  const regenerateCode = record.regenerateCode === true;

  if (name !== undefined && name.length < 3) {
    return NextResponse.json(
      { error: "O nome da turma precisa ter pelo menos 3 caracteres." },
      { status: 400 }
    );
  }
  if (name === undefined && !regenerateCode) {
    return NextResponse.json(
      { error: "Envie { name?: string, regenerateCode?: boolean }." },
      { status: 400 }
    );
  }

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const classDoc = await getClassById(db!, params.id);
    if (!classDoc) {
      return NextResponse.json({ error: "Turma não encontrada." }, { status: 404 });
    }

    // Apenas o instrutor da turma (ou staff) pode alterá-la.
    if (!isInstructorOfClass(user!, classDoc)) {
      return NextResponse.json(
        { error: "Apenas o instrutor da turma pode alterá-la." },
        { status: 403 }
      );
    }

    const updatedAt = new Date().toISOString();
    const updates: Record<string, unknown> = { updatedAt };
    if (name !== undefined) updates.name = name;

    if (regenerateCode) {
      let newCode: string | null = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = generateClassCode();
        const existing = await findClassByCode(db!, candidate);
        if (!existing) {
          newCode = candidate;
          break;
        }
      }
      if (!newCode) {
        return NextResponse.json(
          { error: "Não foi possível gerar um código único de turma." },
          { status: 500 }
        );
      }
      updates.code = newCode;
    }

    await db!.collection(CLASSES_COLLECTION).doc(params.id).update(updates);
    const updated = await getClassById(db!, params.id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[sql-quest] Erro ao atualizar turma:", error);
    return NextResponse.json({ error: "Erro ao atualizar a turma." }, { status: 500 });
  }
}