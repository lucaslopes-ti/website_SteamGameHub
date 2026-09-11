import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { getDbOrUnavailable } from "@/lib/sql-quest/server/firebase";
import {
  REWARD_PRODUCTS,
  ensureRewardInventory,
  listOwnRequests,
  readRewardBalance,
  readRewardStock,
} from "@/lib/sql-quest/server/rewards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Loja de recompensas físicas da SQL Quest.
 *
 * - GET: catálogo fixo + saldo derivado do aluno autenticado:
 *   `{ earnedXp, spentXp, xpBalance, items }`, com cada item
 *   `{ id, name, description, costXp, initialStock, remainingStock,
 *     requestStatus }`.
 *   O XP ganho é SEMPRE derivado de `completedLessonIds` via catálogo (nunca
 *   do `totalXp` persistido). O estoque inicial é inicializado uma única vez
 *   (create-only); docs de estoque ausentes/corrompidos aparecem como 0.
 *
 * A criação de pedidos vive em `POST /api/sql-quest/rewards/requests`.
 */

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    await ensureRewardInventory(db!);

    const balance = await readRewardBalance(db!, user!.uid);
    const own = await listOwnRequests(db!, user!.uid);
    const statusByItem = new Map(own.map((r) => [r.itemId, r.status]));

    const items = [];
    for (const product of REWARD_PRODUCTS) {
      const stock = await readRewardStock(db!, product.id);
      items.push({
        id: product.id,
        name: product.name,
        description: product.description,
        costXp: product.costXp,
        initialStock: stock.initialStock,
        remainingStock: stock.remainingStock,
        requestStatus: statusByItem.get(product.id) ?? null,
      });
    }

    return NextResponse.json({
      earnedXp: balance.earnedXp,
      spentXp: balance.spentXp,
      xpBalance: balance.xpBalance,
      items,
    });
  } catch (error) {
    console.error("[sql-quest] Erro ao listar recompensas:", error);
    return NextResponse.json({ error: "Erro ao listar as recompensas." }, { status: 500 });
  }
}