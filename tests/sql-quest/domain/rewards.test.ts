/**
 * Testes da lógica pura de recompensas físicas da SQL Quest.
 *
 * Cobre: validação da descrição (3–500 chars), saldo derivado, ações de staff
 * e transições de estado (incluindo idempotência).
 *
 * @jest-environment node
 */
import {
  REQUEST_DETAILS_MAX_LENGTH,
  REQUEST_DETAILS_MIN_LENGTH,
  canTransition,
  computeXpBalance,
  isRewardAction,
  isRewardRequestStatus,
  targetStatusFor,
  validateRequestDetails,
} from "@/lib/sql-quest/domain/rewards";

describe("validateRequestDetails", () => {
  it("aceita descrição válida e normaliza com trim", () => {
    const result = validateRequestDetails("  Peça do meu personagem  ");
    expect(result).toEqual({ ok: true, value: "Peça do meu personagem" });
  });

  it("rejeita valor não-string", () => {
    const result = validateRequestDetails(42);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("requestDetails");
  });

  it("rejeita descrição curta demais", () => {
    const result = validateRequestDetails("ab");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain(String(REQUEST_DETAILS_MIN_LENGTH));
  });

  it("rejeita descrição longa demais", () => {
    const result = validateRequestDetails("a".repeat(REQUEST_DETAILS_MAX_LENGTH + 1));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain(String(REQUEST_DETAILS_MAX_LENGTH));
  });

  it("aceita exatamente o limite máximo", () => {
    const result = validateRequestDetails("a".repeat(REQUEST_DETAILS_MAX_LENGTH));
    expect(result.ok).toBe(true);
  });
});

describe("computeXpBalance", () => {
  it("calcula saldo = totalXp ganho − spentXp", () => {
    expect(computeXpBalance(1500, 500)).toBe(1000);
  });

  it("nunca devolve saldo negativo", () => {
    expect(computeXpBalance(300, 500)).toBe(0);
  });

  it("trata valores inválidos como 0", () => {
    expect(computeXpBalance(Number.NaN, 10)).toBe(0);
    expect(computeXpBalance(100, -5)).toBe(100);
    expect(computeXpBalance(-100, 0)).toBe(0);
  });
});

describe("isRewardAction / isRewardRequestStatus", () => {
  it("reconhece apenas ações válidas", () => {
    expect(isRewardAction("approve")).toBe(true);
    expect(isRewardAction("reject")).toBe(true);
    expect(isRewardAction("fulfill")).toBe(true);
    expect(isRewardAction("delete")).toBe(false);
    expect(isRewardAction(undefined)).toBe(false);
  });

  it("reconhece apenas status válidos", () => {
    expect(isRewardRequestStatus("requested")).toBe(true);
    expect(isRewardRequestStatus("approved")).toBe(true);
    expect(isRewardRequestStatus("rejected")).toBe(true);
    expect(isRewardRequestStatus("fulfilled")).toBe(true);
    expect(isRewardRequestStatus("pending")).toBe(false);
  });
});

describe("targetStatusFor / canTransition", () => {
  it("mapeia cada ação ao estado final", () => {
    expect(targetStatusFor("approve")).toBe("approved");
    expect(targetStatusFor("reject")).toBe("rejected");
    expect(targetStatusFor("fulfill")).toBe("fulfilled");
  });

  it("permite approve/reject apenas de requested", () => {
    expect(canTransition("requested", "approve")).toBe(true);
    expect(canTransition("requested", "reject")).toBe(true);
    expect(canTransition("approved", "approve")).toBe(false);
    expect(canTransition("rejected", "approve")).toBe(false);
    expect(canTransition("fulfilled", "approve")).toBe(false);
  });

  it("permite fulfill apenas de approved", () => {
    expect(canTransition("approved", "fulfill")).toBe(true);
    expect(canTransition("requested", "fulfill")).toBe(false);
    expect(canTransition("rejected", "fulfill")).toBe(false);
    expect(canTransition("fulfilled", "fulfill")).toBe(false);
  });
});