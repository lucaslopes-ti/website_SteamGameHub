import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { getDbOrUnavailable } from "@/lib/sql-quest/server/firebase";
import {
  PROGRESS_COLLECTION,
  computeEarnedXpFromDoc,
} from "@/lib/sql-quest/server/progress";
import {
  JOGO_POR_ID,
  aplicarResultadoFase,
  computeGameXp,
  estrelasPremiadas,
  xpMaximoDoJogo,
} from "@/lib/jogos/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * XP dos jogos das aulas (Montador de Cabo etc.) para alunos cadastrados.
 *
 * - Exige Bearer token (Firebase ID token); o UID vem SEMPRE do token.
 * - Guarda as missões em `gameMissionIds` no MESMO documento da SQL Quest
 *   (`sql_quest_progress/{uid}`): o XP entra no total, no ranking e no saldo
 *   da loja de recompensas.
 * - O XP sai do catálogo do servidor (lib/jogos/catalog.ts). O cliente só
 *   informa jogo, fase e estrelas. Repetir o mesmo resultado não soma XP.
 * - Integridade honesta: o jogo roda no navegador, então o servidor não prova
 *   que a fase foi jogada (mesma limitação da SQL Quest). Os limites são: XP
 *   fixo por estrela, uma vez só, e teto por jogo.
 *
 * GET  /api/jogos/xp?jogo=montador-cabo  → estrelas premiadas e XP
 * POST /api/jogos/xp { jogo, fase, estrelas } → premia e devolve o XP ganho
 */

function resumo(jogoId: string, data: Record<string, unknown>) {
  const jogo = JOGO_POR_ID.get(jogoId)!;
  const prefixo = `${jogo.id}:`;
  const missoesDoJogo = Array.isArray(data.gameMissionIds)
    ? data.gameMissionIds.filter(
        (m): m is string => typeof m === "string" && m.startsWith(prefixo)
      )
    : [];
  return {
    jogo: jogo.id,
    estrelas: estrelasPremiadas(missoesDoJogo, jogo),
    xpNoJogo: computeGameXp(missoesDoJogo),
    xpMaximo: xpMaximoDoJogo(jogo),
    xpPorEstrela: jogo.xpPorEstrela,
    bonusCompleto: jogo.bonusCompleto,
    totalXp: computeEarnedXpFromDoc(data),
  };
}

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  const jogoId = request.nextUrl.searchParams.get("jogo") ?? "";
  if (!JOGO_POR_ID.has(jogoId)) {
    return NextResponse.json({ error: "Jogo desconhecido." }, { status: 400 });
  }

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const snap = await db!.collection(PROGRESS_COLLECTION).doc(user!.uid).get();
    const data = snap.exists ? (snap.data() ?? {}) : {};
    return NextResponse.json({ uid: user!.uid, nome: user!.name, ...resumo(jogoId, data) });
  } catch (error) {
    console.error("[jogos] Erro ao ler XP:", error);
    return NextResponse.json({ error: "Erro ao ler o XP." }, { status: 500 });
  }
}

class PremioInvalido extends Error {}

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  let body: Record<string, unknown>;
  try {
    body = ((await request.json()) ?? {}) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }
  const { jogo, fase, estrelas } = body;

  // Valida antes de abrir a transação (resposta 400 clara).
  const teste = aplicarResultadoFase([], jogo, fase, estrelas);
  if (!teste.ok) {
    return NextResponse.json({ error: teste.erro }, { status: 400 });
  }

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const ref = db!.collection(PROGRESS_COLLECTION).doc(user!.uid);
    let xpGanho = 0;
    let novas: string[] = [];
    let depois: Record<string, unknown> = {};

    await db!.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const existente = snap.exists ? (snap.data() ?? {}) : {};
      const r = aplicarResultadoFase(existente.gameMissionIds, jogo, fase, estrelas);
      if (!r.ok) throw new PremioInvalido(r.erro);
      xpGanho = r.xpGanho;
      novas = r.novas;
      depois = { ...existente, gameMissionIds: r.missoes };
      if (r.novas.length === 0) return;
      const totalXp = computeEarnedXpFromDoc(depois);
      tx.set(
        ref,
        {
          uid: ref.id,
          gameMissionIds: r.missoes,
          totalXp,
          updatedAt: new Date().toISOString(),
          displayName:
            user!.name ??
            (typeof existente.displayName === "string" ? existente.displayName : null),
        },
        { merge: true }
      );
    });

    return NextResponse.json({
      uid: user!.uid,
      nome: user!.name,
      xpGanho,
      novasMissoes: novas,
      ...resumo(jogo as string, depois),
    });
  } catch (error) {
    if (error instanceof PremioInvalido) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[jogos] Erro ao salvar XP:", error);
    return NextResponse.json({ error: "Erro ao salvar o XP." }, { status: 500 });
  }
}
