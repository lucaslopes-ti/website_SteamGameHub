import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { getDbOrUnavailable } from "@/lib/sql-quest/server/firebase";
import { readProgressDoc } from "@/lib/sql-quest/server/profile";
import { ACHIEVEMENTS } from "@/lib/sql-quest/domain/achievements";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Conquistas da SQL Quest.
 *
 * GET: devolve o catálogo oficial de conquistas com o status de cada uma para
 * o usuário autenticado (`earned: boolean`). As conquistas são avaliadas no
 * servidor a partir do estado persistido — nunca confiadas no cliente.
 */
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const progress = await readProgressDoc(db!, user!.uid);
    const earnedSet = new Set(progress.achievements);

    return NextResponse.json({
      achievements: ACHIEVEMENTS.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        icon: a.icon,
        earned: earnedSet.has(a.id),
      })),
    });
  } catch (error) {
    console.error("[sql-quest] Erro ao ler conquistas:", error);
    return NextResponse.json({ error: "Erro ao ler as conquistas." }, { status: 500 });
  }
}