import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { getDbOrUnavailable } from "@/lib/sql-quest/server/firebase";
import { getClassById } from "@/lib/sql-quest/server/classes";
import { computeLeaderboard } from "@/lib/sql-quest/server/leaderboard";
import { canViewClass } from "@/lib/sql-quest/domain/classes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Ranking da SQL Quest (por turma, com opt-in de privacidade).
 *
 * GET ?classId=...: devolve o ranking da turma APENAS para membros/instrutores
 * da turma (403 caso contrário). Apenas alunos que optaram por ranking
 * (`rankingOptIn === true`) aparecem; os demais são omitidos.
 */
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  const classId = request.nextUrl.searchParams.get("classId");
  if (!classId) {
    return NextResponse.json(
      { error: "Informe o parâmetro classId." },
      { status: 400 }
    );
  }

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const classDoc = await getClassById(db!, classId);
    if (!classDoc) {
      return NextResponse.json({ error: "Turma não encontrada." }, { status: 404 });
    }

    // Privacidade: apenas membros/instrutores da turma podem ver o ranking.
    if (!canViewClass(user!, classDoc)) {
      return NextResponse.json(
        { error: "Você não faz parte desta turma." },
        { status: 403 }
      );
    }

    const entries = await computeLeaderboard(db!, classDoc.memberUids);
    return NextResponse.json({ classId, entries });
  } catch (error) {
    console.error("[sql-quest] Erro ao ler ranking:", error);
    return NextResponse.json({ error: "Erro ao ler o ranking." }, { status: 500 });
  }
}