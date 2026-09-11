import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth, requireStaff } from "@/lib/server-auth";
import { getDbOrUnavailable } from "@/lib/sql-quest/server/firebase";
import { isRewardAction } from "@/lib/sql-quest/domain/rewards";
import {
  REWARD_REQUESTS_COLLECTION,
  RewardRequestError,
  canStaffDecide,
  decideRewardRequest,
  ensureRewardInventory,
  parseRewardRequestStrict,
} from "@/lib/sql-quest/server/rewards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Decisão de um pedido de recompensa (staff).
 *
 * - PATCH aceita `{ action: "approve" | "reject" | "fulfill" }`.
 * - Aprovar atomiza (em UMA transação) o débito de `spentXp` e o decremento do
 *   estoque; é idempotente; saldo/estoque insuficientes bloqueiam sem mutar.
 * - O produto/preço vêm sempre do catálogo server-side; pedido corrompido
 *   falha fechado (409).
 * - Admin decide qualquer pedido; instrutor decide apenas pedidos cujo
 *   `classId` pertence a uma turma que ele instrui.
 */

interface RouteContext {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  const staffError = requireStaff(user);
  if (staffError) return staffError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const record = (body ?? {}) as Record<string, unknown>;
  const action = record.action;
  if (!isRewardAction(action)) {
    return NextResponse.json(
      { error: 'Envie { action: "approve" | "reject" | "fulfill" }.' },
      { status: 400 }
    );
  }

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    await ensureRewardInventory(db!);

    const snap = await db!.collection(REWARD_REQUESTS_COLLECTION).doc(params.id).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
    }
    const { request } = parseRewardRequestStrict(params.id, snap.data() ?? {});

    const allowed = await canStaffDecide(db!, user!, request);
    if (!allowed) {
      return NextResponse.json(
        { error: "Você só pode decidir pedidos de alunos das suas turmas." },
        { status: 403 }
      );
    }

    const result = await decideRewardRequest(db!, user!, params.id, action);
    return NextResponse.json({
      request: result.request,
      idempotent: result.idempotent,
    });
  } catch (error) {
    if (error instanceof RewardRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[sql-quest] Erro ao decidir pedido:", error);
    return NextResponse.json({ error: "Erro ao decidir o pedido." }, { status: 500 });
  }
}