import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { getDbOrUnavailable } from "@/lib/sql-quest/server/firebase";
import { PROGRESS_COLLECTION } from "@/lib/sql-quest/server/progress";
import { loadProfile } from "@/lib/sql-quest/server/profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Perfil da SQL Quest.
 *
 * - GET: devolve o perfil do usuário autenticado (XP, nível derivado, streak,
 *   conquistas, turma e ranking — apenas se optou por ranking).
 * - PATCH: aceita APENAS `{ rankingOptIn: boolean }` (opt-in/opt-out de
 *   ranking). O UID é sempre derivado do token.
 */

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const profile = await loadProfile(db!, user!);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("[sql-quest] Erro ao ler perfil:", error);
    return NextResponse.json({ error: "Erro ao ler o perfil." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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
  if (typeof record.rankingOptIn !== "boolean") {
    return NextResponse.json(
      { error: "Envie o payload explícito { rankingOptIn: boolean }." },
      { status: 400 }
    );
  }

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const ref = db!.collection(PROGRESS_COLLECTION).doc(user!.uid);
    const updatedAt = new Date().toISOString();
    await ref.set(
      { uid: user!.uid, rankingOptIn: record.rankingOptIn, updatedAt },
      { merge: true }
    );

    const profile = await loadProfile(db!, user!);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("[sql-quest] Erro ao atualizar perfil:", error);
    return NextResponse.json({ error: "Erro ao atualizar o perfil." }, { status: 500 });
  }
}