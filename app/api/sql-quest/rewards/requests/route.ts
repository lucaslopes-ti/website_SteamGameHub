import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth, requireStaff } from "@/lib/server-auth";
import { getDbOrUnavailable } from "@/lib/sql-quest/server/firebase";
import {
  RewardRequestError,
  createRewardRequest,
  listOwnRequests,
  listStaffVisibleRequests,
} from "@/lib/sql-quest/server/rewards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Pedidos de recompensas da SQL Quest.
 *
 * - GET (sem scope): pedidos do próprio aluno autenticado.
 * - GET ?scope=staff: pedidos visíveis ao staff — admin vê todos; instrutor vê
 *   apenas pedidos cujo `classId` pertence a uma turma que ele instrui.
 * - POST: cria um pedido `requested` — exige saldo atual suficiente (derivado
 *   das conclusões reais), mas NÃO desconta nem reserva nada. No máximo UM
 *   pedido por produto por aluno. O UID é sempre derivado do token; a
 *   descrição é obrigatória (3–500 chars).
 */

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  const scope = request.nextUrl.searchParams.get("scope");

  try {
    if (scope === "staff") {
      const staffError = requireStaff(user);
      if (staffError) return staffError;
      const requests = await listStaffVisibleRequests(db!, user!);
      return NextResponse.json({ requests });
    }

    const requests = await listOwnRequests(db!, user!.uid);
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("[sql-quest] Erro ao listar pedidos:", error);
    return NextResponse.json({ error: "Erro ao listar os pedidos." }, { status: 500 });
  }
}

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
  const itemId = typeof record.itemId === "string" ? record.itemId : "";
  const requestDetails = record.requestDetails;

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const created = await createRewardRequest(db!, user!, itemId, requestDetails);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof RewardRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[sql-quest] Erro ao criar pedido de recompensa:", error);
    return NextResponse.json({ error: "Erro ao criar o pedido." }, { status: 500 });
  }
}