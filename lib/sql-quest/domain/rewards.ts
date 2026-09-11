/**
 * Recompensas físicas da SQL Quest — lógica pura.
 *
 * Camada 100% serializável e sem dependência de Firebase/runtime: validação da
 * descrição do pedido, ações de staff e transições de estado. Preços e estoque
 * NÃO ficam aqui — são constantes server-side em
 * `lib/sql-quest/server/rewards.ts`.
 */

/** Estados possíveis de um pedido de recompensa. */
export type RewardRequestStatus = "requested" | "approved" | "rejected" | "fulfilled";

/** Ações que o staff pode executar sobre um pedido. */
export type RewardAction = "approve" | "reject" | "fulfill";

/** Tamanho mínimo da descrição livre do pedido. */
export const REQUEST_DETAILS_MIN_LENGTH = 3;

/** Tamanho máximo da descrição livre do pedido. */
export const REQUEST_DETAILS_MAX_LENGTH = 500;

/**
 * Valida a descrição livre do pedido (obrigatória, 3–500 caracteres após
 * trim). Devolve o valor normalizado (trim) ou a mensagem de erro.
 */
export function validateRequestDetails(
  value: unknown
): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof value !== "string") {
    return { ok: false, error: "Envie o campo requestDetails como texto." };
  }
  const trimmed = value.trim();
  if (trimmed.length < REQUEST_DETAILS_MIN_LENGTH) {
    return {
      ok: false,
      error: `A descrição do pedido precisa ter pelo menos ${REQUEST_DETAILS_MIN_LENGTH} caracteres.`,
    };
  }
  if (trimmed.length > REQUEST_DETAILS_MAX_LENGTH) {
    return {
      ok: false,
      error: `A descrição do pedido pode ter no máximo ${REQUEST_DETAILS_MAX_LENGTH} caracteres.`,
    };
  }
  return { ok: true, value: trimmed };
}

/** `value` é uma ação válida de staff? */
export function isRewardAction(value: unknown): value is RewardAction {
  return value === "approve" || value === "reject" || value === "fulfill";
}

/** `value` é um status válido de pedido? */
export function isRewardRequestStatus(value: unknown): value is RewardRequestStatus {
  return (
    value === "requested" ||
    value === "approved" ||
    value === "rejected" ||
    value === "fulfilled"
  );
}

/**
 * Saldo da loja = XP total conquistado − XP gasto. Nunca negativo (valores
 * inválidos são tratados como 0).
 */
export function computeXpBalance(earnedXp: number, spentXp: number): number {
  const earned = Number.isFinite(earnedXp) && earnedXp > 0 ? earnedXp : 0;
  const spent = Number.isFinite(spentXp) && spentXp > 0 ? spentXp : 0;
  return Math.max(0, earned - spent);
}

/** Estado final esperado para cada ação. */
export function targetStatusFor(action: RewardAction): RewardRequestStatus {
  switch (action) {
    case "approve":
      return "approved";
    case "reject":
      return "rejected";
    case "fulfill":
      return "fulfilled";
  }
}

/**
 * Uma transição é válida quando o pedido está no estado de origem da ação.
 * A idempotência (ação repetida no estado final) é tratada à parte pelo
 * servidor: `status === targetStatusFor(action)`.
 */
export function canTransition(
  status: RewardRequestStatus,
  action: RewardAction
): boolean {
  switch (action) {
    case "approve":
      return status === "requested";
    case "reject":
      return status === "requested";
    case "fulfill":
      return status === "approved";
  }
}